import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="relative flex-1 flex flex-col h-full w-full overflow-hidden selection:bg-indigo-500/30">
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center max-w-4xl"
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-300 transition-colors hover:bg-indigo-500/20 cursor-pointer">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              New features coming soon
              <ArrowRight className="h-4 w-4" />
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl text-(--text-primary)">
              Master your day <br className="hidden sm:block" />
              with clear tasks
            </h1>

            <p className="mb-10 max-w-2xl text-lg text-(--text-secondary) md:text-xl">
              Stay organized, focused, and efficient. Our simple yet powerful
              todo list helps you get things done faster and with less stress.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-(--accent-color) px-8 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-(--accent-color)/25 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
                Start Planning
              </Link>
              <Link
                to="/about"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-(--border-color) bg-(--bg-secondary) px-8 py-3.5 text-sm font-semibold text-(--text-primary) transition-all hover:bg-(--bg-primary) active:scale-95 cursor-pointer"
              >
                Features
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
