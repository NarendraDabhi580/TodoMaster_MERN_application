import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target ?? {};

    setFormData((pre) => ({ ...pre, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = formData;
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      toast.success(response.data.message);
      login(); // Update auth context
      navigate("/tasks");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden selection:bg-indigo-500/30">
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="overflow-hidden rounded-2xl border border-(--border-color) bg-(--bg-secondary) backdrop-blur-xl shadow-2xl">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold tracking-tight text-(--text-primary)">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-(--text-secondary)">
                Log in to access your tasks and priorities.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-(--text-primary)"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-(--text-secondary) group-focus-within:text-indigo-500 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData?.email}
                    className="block w-full rounded-lg border border-(--border-color) bg-(--bg-primary) py-2.5 pl-10 pr-4 text-(--text-primary) placeholder-text-(--text-secondary) shadow-sm transition-all focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="john@example.com"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-(--text-primary)"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-(--text-secondary) group-focus-within:text-indigo-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    value={formData?.password}
                    className="block w-full rounded-lg border border-(--border-color) bg-(--bg-primary) py-2.5 pl-10 pr-4 text-(--text-primary) placeholder-text-(--text-secondary) shadow-sm transition-all focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="••••••••"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] cursor-pointer"
                onClick={handleLogin}
              >
                Log in
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-(--text-secondary)">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
