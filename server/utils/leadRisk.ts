// server/utils/leadRisk.ts

import type { Model } from "mongoose";

export type LeadInput = {
  full_name?: string;
  email?: string;
  phone?: string;
  apartmentType?: string;
  clientType?: string;
};

export type LeadFeatures = {
  nameScript: "cyrl" | "latin" | "mixed" | "other";
  nameWordCount: number;
  emailDomain: string;
  emailLocalPattern: "letters_only" | "letters_digits" | "nickname_like" | "other";
  emailHasDigits: boolean;
  phoneCountry: string;
  phonePrefix: string;
  hasApartmentType: boolean;
  clientType: string;
};

export type SingleLeadScoreResult = {
  score: number;
  reasons: string[];
};

export type ClusterScoreResult = {
  score: number;
  reasons: string[];
  stats: {
    totalCount: number;
    templateCount: number;
    gmailCount: number;
    cyrOneWordCount: number;
    localPatternCount: number;
  };
};

export type VelocityScoreResult = {
  score: number;
  reasons: string[];
  stats: {
    recentCount: number;
  };
};

export type TotalScoreResult = {
  totalScore: number;
  reasons: string[];
  status: "normal" | "suspicious" | "quarantine";
};

function normalizeEmail(email?: string) {
  return (email || "").trim().toLowerCase();
}

function normalizePhone(phone?: string) {
  return (phone || "").replace(/[^\d+]/g, "").trim();
}

function normalizeName(name?: string) {
  return (name || "").trim();
}

function detectNameScript(name: string): LeadFeatures["nameScript"] {
  const hasCyr = /[а-яё]/i.test(name);
  const hasLat = /[a-z]/i.test(name);

  if (hasCyr && hasLat) return "mixed";
  if (hasCyr) return "cyrl";
  if (hasLat) return "latin";
  return "other";
}

function detectEmailLocalPattern(local: string): LeadFeatures["emailLocalPattern"] {
  if (/^[a-z]+$/i.test(local)) return "letters_only";
  if (/^[a-z]+\d+$/i.test(local)) return "letters_digits";
  if (/^[a-z]{4,20}(\d{1,3})?$/i.test(local)) return "nickname_like";
  return "other";
}

export function extractLeadFeatures(input: LeadInput): LeadFeatures {
  const name = normalizeName(input.full_name);
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);

  const [local = "", domain = ""] = email.split("@");
  const phoneDigits = phone.replace(/[^\d]/g, "");

  let phoneCountry = "other";
  let phonePrefix = "";

  if (phoneDigits.startsWith("971")) {
    phoneCountry = "971";
    phonePrefix = phoneDigits.slice(3, 5);
  }

  return {
    nameScript: detectNameScript(name),
    nameWordCount: name ? name.split(/\s+/).filter(Boolean).length : 0,
    emailDomain: domain,
    emailLocalPattern: detectEmailLocalPattern(local),
    emailHasDigits: /\d/.test(local),
    phoneCountry,
    phonePrefix,
    hasApartmentType: !!input.apartmentType,
    clientType: (input.clientType || "").trim().toLowerCase(),
  };
}

export function buildTemplateFingerprint(features: LeadFeatures) {
  return [
    features.nameScript,
    features.nameWordCount,
    features.emailDomain || "nodomain",
    features.emailLocalPattern,
    features.phoneCountry,
    features.phonePrefix || "noprefix",
    features.clientType || "noclienttype",
    features.hasApartmentType ? "apt_yes" : "apt_no",
  ].join("|");
}

export function getSingleLeadScore(features: LeadFeatures): SingleLeadScoreResult {
  let score = 0;
  const reasons: string[] = [];

  if (features.nameScript === "cyrl" && features.nameWordCount === 1) {
    score += 1;
    reasons.push("single_cyrillic_first_name");
  }

  if (features.emailDomain === "gmail.com") {
    score += 1;
    reasons.push("gmail_domain");
  }

  if (
    features.emailLocalPattern === "letters_only" ||
    features.emailLocalPattern === "letters_digits" ||
    features.emailLocalPattern === "nickname_like"
  ) {
    score += 1;
    reasons.push("nickname_like_email");
  }

  if (
    features.phoneCountry === "971" &&
    ["50", "54", "55", "56", "58"].includes(features.phonePrefix)
  ) {
    score += 1;
    reasons.push("uae_mobile_pattern");
  }

  if (features.clientType === "client") {
    score += 0.5;
    reasons.push("default_client_type");
  }

  return { score, reasons };
}

type LeadsRawDocShape = {
  createdAt: Date;
  templateFingerprint: string;
  features: LeadFeatures;
};

type CountableModel = Model<any>;

export async function getClusterScore(params: {
  LeadsRaw: CountableModel;
  templateFingerprint: string;
  features: LeadFeatures;
  windowHours?: number;
}): Promise<ClusterScoreResult> {
  const {
    LeadsRaw,
    templateFingerprint,
    features,
    windowHours = 12,
  } = params;

  const since = new Date(Date.now() - windowHours * 60 * 60 * 1000);

  const [
    totalCount,
    templateCount,
    gmailCount,
    cyrOneWordCount,
    localPatternCount,
  ] = await Promise.all([
    LeadsRaw.countDocuments({
      createdAt: { $gte: since },
    }),
    LeadsRaw.countDocuments({
      createdAt: { $gte: since },
      templateFingerprint,
    }),
    LeadsRaw.countDocuments({
      createdAt: { $gte: since },
      "features.emailDomain": features.emailDomain,
    }),
    LeadsRaw.countDocuments({
      createdAt: { $gte: since },
      "features.nameScript": "cyrl",
      "features.nameWordCount": 1,
    }),
    LeadsRaw.countDocuments({
      createdAt: { $gte: since },
      "features.emailLocalPattern": features.emailLocalPattern,
    }),
  ]);

  let score = 0;
  const reasons: string[] = [];

  if (templateCount >= 5) {
    score += 3;
    reasons.push("template_cluster_5_plus");
  }

  if (templateCount >= 10) {
    score += 4;
    reasons.push("template_cluster_10_plus");
  }

  if (totalCount >= 20) {
    score += 2;
    reasons.push("high_total_volume");
  }

  if (totalCount >= 50) {
    score += 3;
    reasons.push("very_high_total_volume");
  }

  if (features.emailDomain === "gmail.com" && gmailCount >= 10) {
    score += 1;
    reasons.push("gmail_cluster_high");
  }

  if (features.nameScript === "cyrl" && features.nameWordCount === 1 && cyrOneWordCount >= 10) {
    score += 2;
    reasons.push("cyrillic_single_name_cluster");
  }

  if (
    ["letters_only", "letters_digits", "nickname_like"].includes(features.emailLocalPattern) &&
    localPatternCount >= 10
  ) {
    score += 2;
    reasons.push("email_pattern_cluster_high");
  }

  return {
    score,
    reasons,
    stats: {
      totalCount,
      templateCount,
      gmailCount,
      cyrOneWordCount,
      localPatternCount,
    },
  };
}

export async function getVelocityScore(params: {
  LeadsRaw: CountableModel;
  minutes?: number;
}): Promise<VelocityScoreResult> {
  const { LeadsRaw, minutes = 60 } = params;
  const since = new Date(Date.now() - minutes * 60 * 1000);

  const recentCount = await LeadsRaw.countDocuments({
    createdAt: { $gte: since },
  });

  let score = 0;
  const reasons: string[] = [];

  if (recentCount >= 10) {
    score += 2;
    reasons.push("velocity_10_per_hour");
  }

  if (recentCount >= 25) {
    score += 3;
    reasons.push("velocity_25_per_hour");
  }

  if (recentCount >= 50) {
    score += 4;
    reasons.push("velocity_50_per_hour");
  }

  return {
    score,
    reasons,
    stats: {
      recentCount,
    },
  };
}

export function buildTotalScore(params: {
  single: SingleLeadScoreResult;
  cluster: ClusterScoreResult;
  velocity: VelocityScoreResult;
}): TotalScoreResult {
  const totalScore =
    params.single.score +
    params.cluster.score +
    params.velocity.score;

  const reasons = [
    ...params.single.reasons,
    ...params.cluster.reasons,
    ...params.velocity.reasons,
  ];

  let status: "normal" | "suspicious" | "quarantine" = "normal";

  if (totalScore >= 7) {
    status = "quarantine";
  } else if (totalScore >= 4) {
    status = "suspicious";
  }

  return {
    totalScore,
    reasons,
    status,
  };
}