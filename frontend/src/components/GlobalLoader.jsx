import { useEffect, useState } from "react";
import loadingEventBus, {
  SHOW_LOADING,
  HIDE_LOADING,
} from "../utils/loadingEventBus";
import { Loader2 } from "lucide-react";

const GlobalLoader = () => {
  const [loadingCount, setLoadingCount] = useState(0);

  useEffect(() => {
    const showLoading = () => setLoadingCount((prev) => prev + 1);
    const hideLoading = () => setLoadingCount((prev) => Math.max(0, prev - 1));

    loadingEventBus.on(SHOW_LOADING, showLoading);
    loadingEventBus.on(HIDE_LOADING, hideLoading);

    return () => {
      loadingEventBus.remove(SHOW_LOADING, showLoading);
      loadingEventBus.remove(HIDE_LOADING, hideLoading);
    };
  }, []);

  if (loadingCount === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative flex flex-col items-center gap-4 p-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-neutral-200 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
