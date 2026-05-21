import { createError, defineEventHandler, readBody } from "h3";
import { Resend } from "resend";
import { connectMongo } from "../utils/mongodb";
import { LeadsRaw } from "../models/leads_raw-model";
import { FormSession } from "../models/form-session-model";
import { validateFormSession } from "../utils/validateFormSession";
import {
  extractLeadFeatures,
  buildTemplateFingerprint,
  getSingleLeadScore,
  getClusterScore,
  getVelocityScore,
  buildTotalScore,
} from "../utils/leadRisk";

type FormBody = {
  full_name?: string;
  email?: string;
  phone?: string;
  apartmentType?: string;
  clientType?: string;
  turnstileToken?: string;
  company?: string;
  formSessionId?: string;
  [key: string]: any;
};

type RateEntry = {
  count: number;
  resetAt: number;
};

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
  hostname?: string;
  action?: string;
  cdata?: string;
};

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const rateStore = new Map<string, RateEntry>();

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function badRequest(statusMessage: string) {
  return createError({
    statusCode: 400,
    statusMessage,
  });
}

function tooManyRequests(statusMessage: string) {
  return createError({
    statusCode: 429,
    statusMessage,
  });
}

function internalServerError(statusMessage: string) {
  return createError({
    statusCode: 500,
    statusMessage,
  });
}

function normalizeEmail(email?: string) {
  return (email || "").trim().toLowerCase();
}

function normalizePhone(phone?: string) {
  return (phone || "").replace(/[^\d+]/g, "").trim();
}

function checkRateLimit(
  key: string,
  limit: number,
  windowMs = RATE_LIMIT_WINDOW_MS,
) {
  const now = Date.now();
  const entry = rateStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      count: 1,
      remaining: limit - 1,
    };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      count: entry.count,
      remaining: 0,
    };
  }

  entry.count += 1;

  return {
    allowed: true,
    count: entry.count,
    remaining: limit - entry.count,
  };
}

function validateBody(body: FormBody) {
  if (body.company) {
    throw badRequest("Bot detected");
  }

  if (!body.full_name || !body.email) {
    throw badRequest("Full Name and Email address are required.");
  }

  if (!body.turnstileToken) {
    throw badRequest("Turnstile token is required.");
  }
}

async function verifyTurnstileToken(params: {
  secret: string;
  token: string;
  ip: string;
  expectedHostnames?: string[];
  expectedAction: string;
  expectedCdata: string;
}) {
  const response = await $fetch<TurnstileVerifyResponse>(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body: new URLSearchParams({
      secret: params.secret,
      response: params.token,
      remoteip: params.ip,
    }),
  });

  console.log('response ', response)

  if (!response.success) {
    console.error("Turnstile failed:", response["error-codes"]);
    throw badRequest("Turnstile verification failed");
  }
  const isDev = process.env.NODE_ENV !== "production";
  const allowedHostnames = (params.expectedHostnames || []).filter(Boolean);

  if (
    !isDev &&
    allowedHostnames.length > 0 &&
    !allowedHostnames.includes(response.hostname || "")
  ) {
    throw badRequest("Turnstile hostname mismatch");
  }

  if (response.action !== params.expectedAction) {
    throw badRequest("Turnstile action mismatch");
  }

  if (response.cdata !== params.expectedCdata) {
    throw badRequest("Turnstile cdata mismatch");
  }

  return response;
}

async function saveToDB(data: any) {
  return await LeadsRaw.create(data);
}

async function consumeFormSession(sessionId: string) {
  return await FormSession.findOneAndUpdate(
    {
      sessionId,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    },
    {
      $set: {
        isUsed: true,
        usedAt: new Date(),
      },
    },
    {
      new: true,
    },
  );
}

export default defineEventHandler(async (event) => {
  
  const config = useRuntimeConfig(event);

  const resendApiKey = config.resendApiKey || process.env.RESEND_API_KEY;
  const turnstileSecretKey = config.turnstileSecretKey;

  if (!resendApiKey) {
    throw internalServerError("RESEND_API_KEY is not configured");
  }

  if (!turnstileSecretKey) {
    throw internalServerError("TURNSTILE_SECRET_KEY is not configured");
  }

  const body = await readBody<FormBody>(event);

  console.log("body ", body);
  validateBody(body);

  await connectMongo();

  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";
  const userAgent = String(event.node.req.headers["user-agent"] || "");

  const email = normalizeEmail(body.email);
  const phone = normalizePhone(body.phone);

  const ipRateKey = `ip:${ip}`;
  const emailRateKey = `email:${email}`;
  const phoneRateKey = `phone:${phone || "empty"}`;

  const ipRate = checkRateLimit(ipRateKey, 5);
  if (!ipRate.allowed) {
    throw tooManyRequests(
      "Too many requests from this IP. Please try again later.",
    );
  }

  const emailRate = checkRateLimit(emailRateKey, 3);
  if (!emailRate.allowed) {
    throw tooManyRequests(
      "Too many requests for this email. Please try again later.",
    );
  }

  const phoneRate = checkRateLimit(phoneRateKey, 3);
  if (phone && !phoneRate.allowed) {
    throw tooManyRequests(
      "Too many requests for this phone. Please try again later.",
    );
  }

  const verifyToken = await verifyTurnstileToken({
    secret: turnstileSecretKey,
    token: body.turnstileToken!,
    ip,
    expectedHostnames: [
      "iconic-residences.mered.ae",
      "iconic-landing.vercel.app",
      "iconic-landing-mered.vercel.app"
    ],
    expectedAction: "lead_form",
    expectedCdata: body.formSessionId!,
  });

  console.log('verifyToken ', verifyToken)

  const features = extractLeadFeatures({
    full_name: body.full_name,
    email: body.email,
    phone: body.phone,
    apartmentType: body.apartmentType,
    clientType: body.clientType,
  });

  const templateFingerprint = buildTemplateFingerprint(features);

  const single = getSingleLeadScore(features);

  const cluster = await getClusterScore({
    LeadsRaw,
    templateFingerprint,
    features,
    windowHours: 12,
  });

  const velocity = await getVelocityScore({
    LeadsRaw,
    minutes: 60,
  });

  const total = buildTotalScore({
    single,
    cluster,
    velocity,
  });

  console.log("buildTotalScore total ", total);

  const leadDoc = {
    createdAt: new Date(),
    source: "landing_form",
    full_name: body.full_name!,
    email: body.email!,
    phone: body.phone || "",
    apartmentType: body.apartmentType || "",
    clientType: body.clientType || "",
    ip,
    userAgent,
    templateFingerprint,
    features,
    scoring: {
      singleLeadScore: single.score,
      clusterScore: cluster.score,
      velocityScore: velocity.score,
      totalScore: total.totalScore,
      reasons: total.reasons,
      status: total.status,
      clusterStats: cluster.stats,
      velocityStats: velocity.stats,
    },
    meta: {
      turnstileVerified: true,
      quarantined: total.status === "quarantine",
      forwardedToCallgear: false,
      forwardedToCrm: false,
    },
  };

  const { session } = await validateFormSession({
    sessionId: body.formSessionId,
    body,
    currentIp: ip,
    currentUserAgent: userAgent,
  });

  console.log("session ", session);



  let sessionConsumed = false;
  try {
    const consumedSession = await consumeFormSession(body.formSessionId!);

    if (!consumedSession) {
      throw badRequest("Form session already used");
    }

    sessionConsumed = true;

    const savedLead = await saveToDB(leadDoc);

    if (total.status === "quarantine") {
      return {
        success: true,
        quarantined: true,
        score: total.totalScore,
        leadId: savedLead._id,
      };
    }

    return {
      success: true,
      quarantined: false,
      score: total.totalScore,
      leadId: savedLead._id,
    };
  } catch (error) {
    if ((error as any)?.statusCode && !sessionConsumed) {
      throw error;
    }

    if (sessionConsumed) {
      await FormSession.updateOne(
        { _id: session._id },
        {
          $set: {
            isUsed: false,
            usedAt: null,
          },
        },
      );
    }

    console.error("Error ", error);

    if ((error as any)?.statusCode) {
      throw error;
    }

  }
});
