import {
  defineEventHandler,
  readBody,
  getRequestIP,
  createError,
  setResponseStatus,
} from "h3";
import { Resend } from "resend";

type RateEntry = {
  count: number;
  resetAt: number;
};

const rateStore = new Map<string, RateEntry>();

function checkRateLimit(ip: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const entry = rateStore.get(ip);

  if (!entry || entry.resetAt < now) {
    rateStore.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { ok: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count };
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const resend = new Resend(config.resendApiKey || process.env.RESEND_API_KEY);

  const body = await readBody(event);

  const {
    full_name,
    email,
    phone,
    apartmentType,
    clientType,
    turnstileToken,
    company,
    formStartedAt,
  } = body;

  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";

  if (!config.turnstileSecretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "TURNSTILE_SECRET_KEY is not configured",
    });
  }

  // 1) honeypot
  if (company) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bot detected",
    });
  }

  // 2) anti-fast-submit
  if (!formStartedAt || Date.now() - Number(formStartedAt) < 2000) {
    throw createError({
      statusCode: 400,
      statusMessage: "Suspicious request",
    });
  }

  // 3) required fields
  if (!email || !full_name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Full Name and Email address are required.",
    });
  }

  if (!turnstileToken) {
    throw createError({
      statusCode: 400,
      statusMessage: "Turnstile token is required.",
    });
  }

  // 4) rate limit
  const rate = checkRateLimit(ip, 5, 10 * 60 * 1000);
  if (!rate.ok) {
    setResponseStatus(event, 429);
    return {
      error: "Too many requests. Please try again later.",
    };
  }

  // 5) server-side verify
  const verifyResponse = await $fetch<{
    success: boolean;
    "error-codes"?: string[];
  }>("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: config.turnstileSecretKey,
      response: turnstileToken,
      remoteip: ip,
    }),
  });

  if (!verifyResponse.success) {
    console.error("Turnstile failed:", verifyResponse["error-codes"]);
    throw createError({
      statusCode: 400,
      statusMessage: "Turnstile verification failed",
    });
  }

  try {
    await resend.emails.send({
      from: "iconic@resend.dev",
      to: ["v.kushnir22@gmail.com"],
      subject: "Iconic New Interest",
      text: [
        `Full Name: ${full_name}`,
        `Email: ${email}`,
        `Phone: ${phone || ""}`,
        `Apartment type: ${apartmentType || ""}`,
        `Client type: ${clientType || ""}`,
        `IP: ${ip}`,
      ].join("\n"),
    });

    return { success: true };
  } catch (err) {
    console.error("Error sending email:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Error sending email",
    });
  }
});