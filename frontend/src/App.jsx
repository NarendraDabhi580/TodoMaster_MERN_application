import "./App.css";
import HexGridBackground from "./components/HexGridBackground";
import AppRoute from "./routes/AppRoute";
import { Toaster, useToasterStore, toast } from "react-hot-toast";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import GlobalLoader from "./components/GlobalLoader";

import NotificationManager from "./components/NotificationManager";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const { toasts } = useToasterStore();
  const TOAST_LIMIT = 3;

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= TOAST_LIMIT) // Find toasts beyond the limit
      .forEach((t) => toast.dismiss(t.id)); // Dismiss them
  }, [toasts]);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationManager />
          <GlobalLoader />
          <div className="relative h-screen w-full overflow-hidden bg-(--bg-primary) text-(--text-primary) transition-colors duration-300 selection:bg-indigo-500/30">
            <Toaster
              position="bottom-left"
              reverseOrder={false}
              toastOptions={{
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }}
            />
            <HexGridBackground />
            <div className="relative z-10 flex flex-col h-full w-full">
              <AppRoute />
            </div>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
