import { defineEventHandler } from "h3";
import { hasValidAdminSession } from "../../utils/adminAuth";

export default defineEventHandler(async (event) => {
  return {
    authenticated: hasValidAdminSession(event),
  };
});
