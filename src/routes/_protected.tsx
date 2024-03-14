import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ location, context }) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/verify-token`,
      {
        headers: {
          Authorization: `Bearer ${context.auth.token}`,
        },
      }
    );
    if (!context.auth.token || !res.ok) {
      context.auth.logout();
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
