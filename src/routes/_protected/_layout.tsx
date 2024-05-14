import Header from "@/components/chats/header";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/_layout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <main className="min-h-[100svh] max-h-[100svh] flex flex-col">
      <Header />
      <Outlet />
    </main>
  );
}
