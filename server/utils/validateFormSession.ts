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

const MIN_FORM_FILL_TIME_MS = 2000;

function badRequest(statusMessage: string) {
  return createError({
    statusCode: 400,
    statusMessage,
  });
}

function normalizeUa(ua?: string) {
  return (ua || "").trim();
}

function isDynamicHoneypotKey(key: string) {
  return /^address_[a-f0-9]+$/i.test(key);
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

  if (
    session.createdAt &&
    Date.now() - new Date(session.createdAt).getTime() < MIN_FORM_FILL_TIME_MS
  ) {
    throw badRequest("Suspicious request");
  }

  const honeypots = Array.isArray(session.honeypots) ? session.honeypots : [];

  if (honeypots.length === 0) {
    throw badRequest("Form session honeypots are missing");
  }

  const unexpectedHoneypots = Object.keys(params.body).filter((key) => {
    return isDynamicHoneypotKey(key) && !honeypots.includes(key);
  });

  if (unexpectedHoneypots.length > 0) {
    throw badRequest("Unexpected honeypot fields");
  }

  for (const hp of honeypots) {
    if (params.body[hp]) {
      throw badRequest("Bot detected");
    }
  }

  let riskScoreDelta = 0;
  const riskReasons: string[] = [];

  const issuedIp = session.meta?.ip;
  const issuedUserAgent = session.meta?.userAgent;

  if (issuedIp && !isSameIp(issuedIp, params.currentIp)) {
    riskScoreDelta += 1;
    riskReasons.push("session_ip_mismatch");
    throw badRequest("Form session client mismatch");
  }

  if (
    issuedUserAgent &&
    !isSimilarUa(issuedUserAgent, params.currentUserAgent)
  ) {
    riskScoreDelta += 2;
    riskReasons.push("session_user_agent_mismatch");
    throw badRequest("Form session client mismatch");
  }

  return {
    session,
    riskScoreDelta,
    riskReasons,
  };
}
