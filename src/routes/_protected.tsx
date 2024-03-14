import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: ({ location, context }) => {
    if (!context.auth.token)
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
  },
});
