import { createError, defineEventHandler, readBody } from "h3";
import { LeadsRaw } from "../../models/leads_raw-model";
import {
  buildTemplateFingerprint,
  buildTotalScore,
  extractLeadFeatures,
  getClusterScore,
  getSingleLeadScore,
  getVelocityScore,
} from "../../utils/leadRisk";
import { connectMongo } from "../../utils/mongodb";
import { requireAdminAccess } from "../../utils/adminAuth";

type LeadRiskDebugBody = {
  full_name?: string;
  email?: string;
  phone?: string;
  apartmentType?: string;
  clientType?: string;
};

function badRequest(statusMessage: string) {
  return createError({
    statusCode: 400,
    statusMessage,
  });
}

export default defineEventHandler(async (event) => {
  requireAdminAccess(event);
  await connectMongo();

  const body = await readBody<LeadRiskDebugBody>(event);

  if (!body.full_name || !body.email) {
    throw badRequest("full_name and email are required");
  }

  const features = extractLeadFeatures(body);
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

  return {
    input: body,
    features,
    templateFingerprint,
    scoring: {
      single,
      cluster,
      velocity,
      total,
    },
  };
});
