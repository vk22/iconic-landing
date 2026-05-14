// server/utils/validateFormSession.ts

import { createError } from "h3";
import { FormSession } from "../models/form-session-model";

type FormBody = {
  [key: string]: any;
};

type SessionValidationResult = {
  session: any;
  riskScoreDelta: number;
  riskReasons: string[];
};

function badRequest(statusMessage: string) {
  return createError({
    statusCode: 400,
    statusMessage,
  });
}

function normalizeUa(ua?: string) {
  return (ua || "").trim();
}

function isSameIp(a?: string, b?: string) {
  return (a || "unknown") === (b || "unknown");
}

function isSimilarUa(a?: string, b?: string) {
  const uaA = normalizeUa(a);
  const uaB = normalizeUa(b);

  if (!uaA || !uaB) return false;
  if (uaA === uaB) return true;

  const aIsMobile = /Mobile|Android|iPhone/i.test(uaA);
  const bIsMobile = /Mobile|Android|iPhone/i.test(uaB);

  const aIsChrome = /Chrome/i.test(uaA);
  const bIsChrome = /Chrome/i.test(uaB);

  const aIsSafari = /Safari/i.test(uaA);
  const bIsSafari = /Safari/i.test(uaB);

  return aIsMobile === bIsMobile && aIsChrome === bIsChrome && aIsSafari === bIsSafari;
}

export async function validateFormSession(params: {
  sessionId?: string;
  body: FormBody;
  currentIp: string;
  currentUserAgent: string;
}): Promise<SessionValidationResult> {
  if (!params.sessionId) {
    throw badRequest("Form session is required");
  }

  const session = await FormSession.findOne({
    sessionId: params.sessionId,
  });

  if (!session) {
    throw badRequest("Invalid form session");
  }

  if (session.isUsed) {
    throw badRequest("Form session already used");
  }

  if (session.expiresAt && session.expiresAt.getTime() < Date.now()) {
    throw badRequest("Form session expired");
  }

  for (const hp of session.honeypots || []) {
    if (params.body[hp]) {
      throw badRequest("Bot detected");
    }
  }

  let riskScoreDelta = 0;
  const riskReasons: string[] = [];

  if (!isSameIp(session.issuedIp, params.currentIp)) {
    riskScoreDelta += 1;
    riskReasons.push("session_ip_mismatch");
  }

  if (!isSimilarUa(session.issuedUserAgent, params.currentUserAgent)) {
    riskScoreDelta += 2;
    riskReasons.push("session_user_agent_mismatch");
  }

  return {
    session,
    riskScoreDelta,
    riskReasons,
  };
}