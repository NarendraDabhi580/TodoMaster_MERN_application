import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster, useToasterStore, toast } from "react-hot-toast";

import AppRoute from "./routes/AppRoute";
import HexGridBackground from "./components/HexGridBackground";
import GlobalLoader from "./components/GlobalLoader";
import NotificationManager from "./components/NotificationManager";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./App.css";

const TOAST_LIMIT = 3;

function App() {
  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
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
