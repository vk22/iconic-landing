import mongoose from "mongoose";

const FormSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
    honeypots: {
      type: [String],
      default: [],
    },
    meta: {
      ip: { type: String, default: "unknown" },
      userAgent: { type: String, default: "" },
    },
  },
  {
    versionKey: false,
    collection: "form_sessions",
  }
);

FormSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const FormSession =
  mongoose.models.FormSession ||
  mongoose.model("FormSession", FormSessionSchema);