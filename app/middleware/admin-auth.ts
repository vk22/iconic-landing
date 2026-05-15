export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/admin") || to.path === "/admin/login") {
    return;
  }

  const requestFetch = useRequestFetch();

  try {
    const session = await requestFetch<{ authenticated: boolean }>(
      "/api/admin/session",
    );

    if (!session.authenticated) {
      return navigateTo("/admin/login");
    }
  } catch {
    return navigateTo("/admin/login");
  }
});
