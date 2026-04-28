import mongoose from "mongoose";

const LeadFeaturesSchema = new mongoose.Schema(
  {
    nameScript: {
      type: String,
      enum: ["cyrl", "latin", "mixed", "other"],
      default: "other",
    },
    nameWordCount: {
      type: Number,
      default: 0,
    },
    emailDomain: {
      type: String,
      default: "",
      index: true,
    },
    emailLocalPattern: {
      type: String,
      enum: ["letters_only", "letters_digits", "nickname_like", "other"],
      default: "other",
    },
    emailHasDigits: {
      type: Boolean,
      default: false,
    },
    phoneCountry: {
      type: String,
      default: "",
    },
    phonePrefix: {
      type: String,
      default: "",
    },
    hasApartmentType: {
      type: Boolean,
      default: false,
    },
    clientType: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const LeadScoringSchema = new mongoose.Schema(
  {
    singleLeadScore: {
      type: Number,
      default: 0,
    },
    clusterScore: {
      type: Number,
      default: 0,
    },
    velocityScore: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
      index: true,
    },
    reasons: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["normal", "suspicious", "quarantine"],
      default: "normal",
      index: true,
    },
    clusterStats: {
      totalCount: { type: Number, default: 0 },
      templateCount: { type: Number, default: 0 },
      gmailCount: { type: Number, default: 0 },
      cyrOneWordCount: { type: Number, default: 0 },
      localPatternCount: { type: Number, default: 0 },
    },
    velocityStats: {
      recentCount: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

const LeadRawSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    source: {
      type: String,
      default: "landing_form",
      index: true,
    },

    full_name: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    apartmentType: {
      type: String,
      default: "",
      trim: true,
    },
    clientType: {
      type: String,
      default: "",
      trim: true,
    },

    ip: {
      type: String,
      default: "unknown",
      index: true,
    },
    userAgent: {
      type: String,
      default: "",
    },

    templateFingerprint: {
      type: String,
      default: "",
      index: true,
    },

    features: {
      type: LeadFeaturesSchema,
      default: () => ({}),
    },

    scoring: {
      type: LeadScoringSchema,
      default: () => ({}),
    },

    meta: {
      turnstileVerified: {
        type: Boolean,
        default: false,
      },
      quarantined: {
        type: Boolean,
        default: false,
        index: true,
      },
      forwardedToCallgear: {
        type: Boolean,
        default: false,
      },
      forwardedToCrm: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    versionKey: false,
    collection: "leads_raw",
  }
);

LeadRawSchema.index({ templateFingerprint: 1, createdAt: -1 });
LeadRawSchema.index({ "features.emailDomain": 1, createdAt: -1 });
LeadRawSchema.index({ email: 1, createdAt: -1 });
LeadRawSchema.index({ phone: 1, createdAt: -1 });
LeadRawSchema.index({ ip: 1, createdAt: -1 });
LeadRawSchema.index({ "scoring.status": 1, createdAt: -1 });
LeadRawSchema.index({ "meta.quarantined": 1, createdAt: -1 });

export const LeadsRaw =
  mongoose.models.LeadsRaw || mongoose.model("LeadsRaw", LeadRawSchema);