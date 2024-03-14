import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div className="max-w-screen h-screen flex justify-center items-center mx-5 sm:mx-0">
      <div>
        <Outlet />
      </div>
    </div>
  );
}
