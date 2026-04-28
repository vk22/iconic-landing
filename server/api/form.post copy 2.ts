import { createError, defineEventHandler, readBody } from "h3";
import { Resend } from "resend";
import { connectMongo } from "../utils/mongodb";
import { LeadsRaw } from "../models/leads_raw-model";

type FormBody = {
  full_name?: string;
  email?: string;
  phone?: string;
  apartmentType?: string;
  clientType?: string;
  turnstileToken?: string;
  company?: string;
  formStartedAt?: number | string;
};

type RateEntry = {
  count: number;
  resetAt: number;
};

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const rateStore = new Map<string, RateEntry>();
const recentPayloadStore = new Map<string, number>();

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MIN_FORM_FILL_TIME_MS = 2000;
const PAYLOAD_DUPLICATE_WINDOW_MS = 30 * 60 * 1000;

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

function normalizeName(name?: string) {
  return (name || "").trim().toLowerCase();
}

function getClientIp(event: any) {
  const cfIp = event.node.req.headers["cf-connecting-ip"];
  if (typeof cfIp === "string" && cfIp.trim()) {
    return cfIp.trim();
  }

  const forwardedFor = event.node.req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = event.node.req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }

  return event.node.req.socket?.remoteAddress || "unknown";
}

function isLocalOrUnknownIp(ip: string) {
  return (
    !ip ||
    ip === "unknown" ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "::ffff:127.0.0.1"
  );
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

  if (!body.formStartedAt) {
    throw badRequest("Suspicious request");
  }

  const formStartedAt = Number(body.formStartedAt);
  if (!Number.isFinite(formStartedAt)) {
    throw badRequest("Suspicious request");
  }

  if (Date.now() - formStartedAt < MIN_FORM_FILL_TIME_MS) {
    throw badRequest("Suspicious request");
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
}) {
  const response = await $fetch<TurnstileVerifyResponse>(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body: new URLSearchParams({
      secret: params.secret,
      response: params.token,
      remoteip: params.ip,
    }),
  });

  if (!response.success) {
    console.error("Turnstile failed:", response["error-codes"]);
    throw badRequest("Turnstile verification failed");
  }
}

function buildLeadText(data: {
  full_name: string;
  email: string;
  phone?: string;
  apartmentType?: string;
  clientType?: string;
  ip: string;
  userAgent: string;
  riskScore?: number;
  riskReasons?: string[];
  quarantined?: boolean;
}) {
  return [
    `Full Name: ${data.full_name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || ""}`,
    `Apartment type: ${data.apartmentType || ""}`,
    `Client type: ${data.clientType || ""}`,
    `IP: ${data.ip}`,
    `User-Agent: ${data.userAgent || ""}`,
    `Risk score: ${data.riskScore ?? 0}`,
    `Risk reasons: ${(data.riskReasons || []).join(", ")}`,
    `Quarantined: ${data.quarantined ? "yes" : "no"}`,
  ].join("\n");
}

function buildLeadObj(data: {
  full_name: string;
  email: string;
  phone?: string;
  apartmentType?: string;
  clientType?: string;
  ip: string;
  userAgent: string;
  riskScore?: number;
  riskReasons?: string[];
  quarantined?: boolean;
}) {
  return [
    `Full Name: ${data.full_name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || ""}`,
    `Apartment type: ${data.apartmentType || ""}`,
    `Client type: ${data.clientType || ""}`,
    `IP: ${data.ip}`,
    `User-Agent: ${data.userAgent || ""}`,
    `Risk score: ${data.riskScore ?? 0}`,
    `Risk reasons: ${(data.riskReasons || []).join(", ")}`,
    `Quarantined: ${data.quarantined ? "yes" : "no"}`,
  ].join("\n");
}

function cleanupRecentPayloadStore() {
  const now = Date.now();
  for (const [key, ts] of recentPayloadStore.entries()) {
    if (now - ts > PAYLOAD_DUPLICATE_WINDOW_MS) {
      recentPayloadStore.delete(key);
    }
  }
}

function buildPayloadFingerprint(body: FormBody) {
  return [
    normalizeName(body.full_name),
    normalizeEmail(body.email),
    normalizePhone(body.phone),
    (body.apartmentType || "").trim().toLowerCase(),
    (body.clientType || "").trim().toLowerCase(),
  ].join("|");
}

function scoreLead(params: {
  body: FormBody;
  ip: string;
  userAgent: string;
  ipRate: ReturnType<typeof checkRateLimit>;
  emailRate: ReturnType<typeof checkRateLimit>;
  phoneRate: ReturnType<typeof checkRateLimit>;
}) {
  const { body, ip, userAgent, ipRate, emailRate, phoneRate } = params;

  const riskReasons: string[] = [];
  let riskScore = 0;

  const email = normalizeEmail(body.email);
  const phone = normalizePhone(body.phone);
  const name = normalizeName(body.full_name);

  if (isLocalOrUnknownIp(ip)) {
    riskScore += 2;
    riskReasons.push("local_or_unknown_ip");
  }

  if (!userAgent || userAgent.length < 20) {
    riskScore += 2;
    riskReasons.push("weak_user_agent");
  }

  if (emailRate.count >= 2) {
    riskScore += 3;
    riskReasons.push("email_rate_high");
  }

  if (phone && phoneRate.count >= 2) {
    riskScore += 3;
    riskReasons.push("phone_rate_high");
  }

  if (ipRate.count >= 3) {
    riskScore += 2;
    riskReasons.push("ip_rate_high");
  }

  const emailLocalPart = email.split("@")[0] || "";
  const nameTokens = name
    .replace(/[^a-zа-яё\s-]/gi, " ")
    .split(/\s+/)
    .filter(Boolean);

  const emailLooksRelatedToName =
    nameTokens.length > 0 &&
    nameTokens.some(
      (token) => token.length >= 3 && emailLocalPart.includes(token),
    );

  if (name && email && !emailLooksRelatedToName) {
    riskScore += 2;
    riskReasons.push("name_email_mismatch");
  }

  const suspiciousEmailPatterns = [
    /\d{3,}/,
    /(test|qwerty|asdf|zxczxc|temp|demo|mail|user)/i,
  ];

  if (suspiciousEmailPatterns.some((re) => re.test(emailLocalPart))) {
    riskScore += 2;
    riskReasons.push("suspicious_email_pattern");
  }

  cleanupRecentPayloadStore();
  const fingerprint = buildPayloadFingerprint(body);
  if (recentPayloadStore.has(fingerprint)) {
    riskScore += 4;
    riskReasons.push("duplicate_payload_recently");
  }

  recentPayloadStore.set(fingerprint, Date.now());

  return {
    riskScore,
    riskReasons,
    quarantined: riskScore >= 5,
  };
}

async function sendEmail(params: {
  resend: Resend;
  to: string[];
  subject: string;
  text: string;
}) {
  await params.resend.emails.send({
    from: "iconic@resend.dev",
    to: params.to,
    subject: params.subject,
    text: params.text,
  });
}

async function saveToDB(data: {
  full_name: string;
  email: string;
  phone?: string;
  apartmentType?: string;
  clientType?: string;
  ip: string;
  userAgent: string;
  riskScore?: number;
  riskReasons?: string[];
  quarantined?: boolean;
}) {
  console.log("saveToDB ", data);
  await connectMongo();
  return await LeadsRaw.create(data);
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

  const resend = new Resend(resendApiKey);
  const body = await readBody<FormBody>(event);

  validateBody(body);

  const ip = getClientIp(event);
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

  await verifyTurnstileToken({
    secret: turnstileSecretKey,
    token: body.turnstileToken!,
    ip,
  });

  const risk = scoreLead({
    body,
    ip,
    userAgent,
    ipRate,
    emailRate,
    phoneRate,
  });

  const messageText = buildLeadText({
    full_name: body.full_name!,
    email: body.email!,
    phone: body.phone,
    apartmentType: body.apartmentType,
    clientType: body.clientType,
    ip,
    userAgent,
    riskScore: risk.riskScore,
    riskReasons: risk.riskReasons,
    quarantined: risk.quarantined,
  });

  const messageObj = {
    full_name: body.full_name!,
    email: body.email!,
    phone: body.phone,
    apartmentType: body.apartmentType,
    clientType: body.clientType,
    ip,
    userAgent,
    riskScore: risk.riskScore,
    riskReasons: risk.riskReasons,
    quarantined: risk.quarantined,
  };

  try {
    if (risk.quarantined) {
      // await sendEmail({
      //   resend,
      //   to: ["v.kushnir22@gmail.com"],
      //   subject: `[QUARANTINE] Iconic New Interest`,
      //   text: messageText,
      // });

      const saveRes = await saveToDB(messageObj);
      console.log("saveRes ", saveRes);

      return {
        success: true,
        quarantined: true,
      };
    }

    // await sendEmail({
    //   resend,
    //   to: ["v.kushnir22@gmail.com"],
    //   subject: "Iconic New Interest",
    //   text: messageText,
    // });

    const saveRes = await saveToDB(messageObj);
    console.log("saveRes ", saveRes);

    return {
      success: true,
      quarantined: false,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw internalServerError("Error sending email");
  }
});
