import crypto from "node:crypto";
import { defineEventHandler } from "h3";
import { connectMongo } from "../utils/mongodb";
import { FormSession } from "../models/form-session-model";

// function randomFieldName() {
//   return `f_${crypto.randomBytes(6).toString("hex")}`;
// }

export default defineEventHandler(async (event) => {
  await connectMongo();

  const sessionId = crypto.randomBytes(24).toString("hex");
  //const honeypots = [randomFieldName(), randomFieldName(), randomFieldName()];
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";
  const userAgent = String(event.node.req.headers["user-agent"] || "");

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000);

  await FormSession.create({
    sessionId,
    createdAt: now,
    expiresAt,
    isUsed: false,
    usedAt: null,
    //honeypots,
    meta: { ip, userAgent },
  });

  return {
    sessionId,
    //honeypots,
    expiresAt,
  };
});