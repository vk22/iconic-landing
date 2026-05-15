import crypto from "node:crypto";
import { createError, defineEventHandler } from "h3";
import { connectMongo } from "../utils/mongodb";
import { FormSession } from "../models/form-session-model";

type RateEntry = {
  count: number;
  resetAt: number;
};

const rateStore = new Map<string, RateEntry>();
const SESSION_WINDOW_MS = 10 * 60 * 1000;
const PROD_SESSION_RATE_LIMIT = 12;
const DEV_SESSION_RATE_LIMIT = 100;
const PROD_MAX_ACTIVE_SESSIONS_PER_IP = 6;
const DEV_MAX_ACTIVE_SESSIONS_PER_IP = 50;

function randomFieldName() {
  return `address_${crypto.randomBytes(6).toString("hex")}`;
}

function tooManyRequests(statusMessage: string) {
  return createError({
    statusCode: 429,
    statusMessage,
  });
}

function checkRateLimit(key: string, limit: number, windowMs: number) {
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

export default defineEventHandler(async (event) => {
  await connectMongo();

  const isDev = process.env.NODE_ENV !== "production";
  console.log('isDev ', isDev)
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";
  const userAgent = String(event.node.req.headers["user-agent"] || "");
  const ipRateKey = `form-session:${ip}`;
  const sessionRateLimit = isDev
    ? DEV_SESSION_RATE_LIMIT
    : PROD_SESSION_RATE_LIMIT;
  const maxActiveSessionsPerIp = isDev
    ? DEV_MAX_ACTIVE_SESSIONS_PER_IP
    : PROD_MAX_ACTIVE_SESSIONS_PER_IP;

  const ipRate = checkRateLimit(
    ipRateKey,
    sessionRateLimit,
    SESSION_WINDOW_MS,
  );

  if (!ipRate.allowed) {
    throw tooManyRequests(
      "Too many form session requests from this IP. Please try again later.",
    );
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000);
  const activeSessionsForIp = await FormSession.countDocuments({
    "meta.ip": ip,
    isUsed: false,
    expiresAt: { $gt: now },
  });

  console.log('activeSessionsForIp ', activeSessionsForIp)
  console.log('maxActiveSessionsPerIp ', maxActiveSessionsPerIp)

  if (activeSessionsForIp >= maxActiveSessionsPerIp) {
    throw tooManyRequests(
      "Too many active form sessions for this IP. Please try again later.",
    );
  }

  const sessionId = crypto.randomBytes(24).toString("hex");
  const honeypots = [randomFieldName(), randomFieldName(), randomFieldName()];

  await FormSession.create({
    sessionId,
    createdAt: now,
    expiresAt,
    isUsed: false,
    usedAt: null,
    honeypots,
    meta: { ip, userAgent },
  });

  return {
    sessionId,
    honeypots,
    expiresAt,
  };
});
