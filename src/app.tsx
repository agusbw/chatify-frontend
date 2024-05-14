import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./components/auth-provider";
import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import {
  SettingModeProvider,
  useSettingMode,
} from "./components/setting-mode-provider";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    settingMode: undefined!,
  },
});
const queryClient = new QueryClient();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  const settingMode = useSettingMode();
  return (
    <RouterProvider
      router={router}
      context={{ auth, settingMode }}
    />
  );
}

// Render the app
const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthProvider>
        <SettingModeProvider>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<div>Loading...</div>}>
              <InnerApp />
            </Suspense>
          </QueryClientProvider>
        </SettingModeProvider>
      </AuthProvider>
    </StrictMode>
  );
}
