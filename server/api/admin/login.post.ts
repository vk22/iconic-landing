import { defineEventHandler } from "h3";
import { setAdminSession, validateAdminLogin } from "../../utils/adminAuth";

export default defineEventHandler(async (event) => {
  await validateAdminLogin(event);
  setAdminSession(event);

  return {
    success: true,
  };
});
