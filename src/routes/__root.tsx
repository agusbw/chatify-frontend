import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import type {
  AuthContextType,
  SettingModeContextType,
  SocketContextType,
} from "@/lib/types";

interface MyRouterContext {
  // The ReturnType of your useAuth hook or the value of your AuthContext
  auth: AuthContextType;
  settingMode: SettingModeContextType;
  socket: SocketContextType;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{}}
        theme="light"
      />
      <Outlet />
    </>
  ),
});
