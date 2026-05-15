import { defineEventHandler } from "h3";
import { clearAdminSession } from "../../utils/adminAuth";

export default defineEventHandler(async (event) => {
  clearAdminSession(event);

  return {
    success: true,
  };
});
