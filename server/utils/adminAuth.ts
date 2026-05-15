import crypto from "node:crypto";
import {
  createError,
  getCookie,
  getHeader,
  readBody,
  setCookie,
  deleteCookie,
} from "h3";

const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

type AdminLoginBody = {
  username?: string;
  password?: string;
};

function unauthorized(statusMessage = "Unauthorized") {
  return createError({
    statusCode: 401,
    statusMessage,
  });
}

function internalServerError(statusMessage: string) {
  return createError({
    statusCode: 500,
    statusMessage,
  });
}

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

function buildSessionToken(username: string, secret: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(username)
    .digest("hex");
}

function getAdminConfig(event: Parameters<typeof useRuntimeConfig>[0]) {
  const config = useRuntimeConfig(event);

  return {
    adminApiToken: config.adminApiToken,
    adminUsername: config.adminUsername,
    adminPassword: config.adminPassword,
    adminSessionSecret: config.adminSessionSecret,
  };
}

function ensureSessionConfig(event: Parameters<typeof useRuntimeConfig>[0]) {
  const { adminUsername, adminPassword, adminSessionSecret } =
    getAdminConfig(event);

  if (!adminUsername || !adminPassword || !adminSessionSecret) {
    throw internalServerError("Admin auth is not configured");
  }

  return {
    adminUsername,
    adminPassword,
    adminSessionSecret,
  };
}

export function hasValidAdminSession(
  event: Parameters<typeof useRuntimeConfig>[0],
) {
  const { adminUsername, adminSessionSecret } = ensureSessionConfig(event);
  const sessionCookie = getCookie(event, ADMIN_SESSION_COOKIE);

  if (!sessionCookie) {
    return false;
  }

  const expectedToken = buildSessionToken(adminUsername, adminSessionSecret);
  return safeCompare(sessionCookie, expectedToken);
}

export function setAdminSession(
  event: Parameters<typeof useRuntimeConfig>[0],
) {
  const { adminUsername, adminSessionSecret } = ensureSessionConfig(event);
  const sessionToken = buildSessionToken(adminUsername, adminSessionSecret);

  setCookie(event, ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
}

export function clearAdminSession(
  event: Parameters<typeof useRuntimeConfig>[0],
) {
  deleteCookie(event, ADMIN_SESSION_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function validateAdminLogin(
  event: Parameters<typeof useRuntimeConfig>[0],
) {
  const { adminUsername, adminPassword } = ensureSessionConfig(event);
  const body = await readBody<AdminLoginBody>(event);
  const username = String(body.username || "").trim();
  const password = String(body.password || "");

  if (
    !safeCompare(username, adminUsername) ||
    !safeCompare(password, adminPassword)
  ) {
    throw unauthorized("Invalid credentials");
  }
}

export function requireAdminAccess(
  event: Parameters<typeof useRuntimeConfig>[0],
) {
  const { adminApiToken } = getAdminConfig(event);
  const requestToken = getHeader(event, "x-admin-token");

  if (adminApiToken && requestToken && safeCompare(requestToken, adminApiToken)) {
    return;
  }

  if (hasValidAdminSession(event)) {
    return;
  }

  throw unauthorized();
}
