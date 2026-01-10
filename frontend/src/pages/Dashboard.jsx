import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

/* ================= MAIN ================= */
const Dashboard = () => {
  return (
    <div className="relative flex-1 flex flex-col h-full w-full overflow-hidden text-white selection:bg-indigo-500/30">
      {/* Content Layer */}
      <div className="flex flex-col h-full w-full">
        {/* Hero Section */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center max-w-4xl"
          >
            <a
              href="#"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 transition-colors hover:bg-indigo-500/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              New features coming soon
              <ArrowRight className="h-4 w-4" />
            </a>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
              Master your day <br className="hidden sm:block" />
              with clear tasks
            </h1>

            <p className="mb-10 max-w-2xl text-lg text-neutral-400 md:text-xl">
              Stay organized, focused, and efficient. Our simple yet powerful
              todo list helps you get things done faster and with less stress.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-neutral-950 transition-all hover:bg-neutral-200 active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-indigo-600 transition-transform group-hover:scale-110" />
                Start Planning
              </Link>
              <a
                href="#"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-neutral-900 active:scale-95"
              >
                Features
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
