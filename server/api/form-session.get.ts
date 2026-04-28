import crypto from "node:crypto";
import { defineEventHandler } from "h3";
import { connectMongo } from "../utils/mongodb";
import { FormSession } from "../models/form-session-model";

function getClientIp(event: any) {
  const cfIp = event.node.req.headers["cf-connecting-ip"];
  if (typeof cfIp === "string" && cfIp.trim()) return cfIp.trim();

  const forwardedFor = event.node.req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = event.node.req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) return realIp.trim();

  return event.node.req.socket?.remoteAddress || "unknown";
}

function randomFieldName() {
  return `f_${crypto.randomBytes(6).toString("hex")}`;
}

export default defineEventHandler(async (event) => {
  await connectMongo();

  const sessionId = crypto.randomBytes(24).toString("hex");
  const honeypots = [randomFieldName(), randomFieldName(), randomFieldName()];
  const ip = getClientIp(event);
  const userAgent = String(event.node.req.headers["user-agent"] || "");

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000);

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