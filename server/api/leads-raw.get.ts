import { createError, defineEventHandler, getQuery } from "h3";
import { LeadsRaw } from "../models/leads_raw-model";
import { connectMongo } from "../utils/mongodb";
import { requireAdminAccess } from "../utils/adminAuth";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const ALLOWED_STATUSES = new Set(["normal", "suspicious", "quarantine"]);

function badRequest(statusMessage: string) {
  return createError({
    statusCode: 400,
    statusMessage,
  });
}

function parsePositiveInt(value: unknown, fallback: number) {
  const parsed = Number.parseInt(String(value ?? ""), 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function parseBooleanFlag(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  const normalized = String(value).trim().toLowerCase();

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  throw badRequest("Invalid boolean query parameter");
}

export default defineEventHandler(async (event) => {
  requireAdminAccess(event);

  await connectMongo();

  const query = getQuery(event);
  const page = parsePositiveInt(query.page, DEFAULT_PAGE);
  const limit = Math.min(parsePositiveInt(query.limit, DEFAULT_LIMIT), MAX_LIMIT);
  const skip = (page - 1) * limit;

  const status =
    query.status !== undefined ? String(query.status).trim().toLowerCase() : "";
  const quarantined = parseBooleanFlag(query.quarantined);
  const search =
    query.search !== undefined ? String(query.search).trim() : "";

  if (status && !ALLOWED_STATUSES.has(status)) {
    throw badRequest("Invalid status query parameter");
  }

  const filter: Record<string, any> = {};

  if (status) {
    filter["scoring.status"] = status;
  }

  if (quarantined !== undefined) {
    filter["meta.quarantined"] = quarantined;
  }

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedSearch, "i");

    filter.$or = [
      { full_name: regex },
      { email: regex },
      { phone: regex },
      { apartmentType: regex },
      { clientType: regex },
    ];
  }

  const [items, total] = await Promise.all([
    LeadsRaw.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    LeadsRaw.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
    filters: {
      status: status || null,
      quarantined: quarantined ?? null,
      search: search || null,
    },
  };
});
