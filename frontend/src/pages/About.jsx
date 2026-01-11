import { motion } from "framer-motion";
import {
  CheckSquare,
  Star,
  BarChart3,
  Zap,
  Shield,
  Sparkles,
  Github,
  Mail,
  Linkedin,
  Briefcase,
} from "lucide-react";
import reactLogo from "../assets/icons/react.svg";
import nodejsLogo from "../assets/icons/nodejs.svg";
import mongodbLogo from "../assets/icons/mongodb.svg";
import tailwindLogo from "../assets/icons/tailwind.svg";

const About = () => {
  const features = [
    {
      icon: CheckSquare,
      title: "Task Management",
      description:
        "Create, organize, and track your tasks with an intuitive interface",
      color: "indigo",
    },
    {
      icon: Star,
      title: "Priority System",
      description:
        "Organize tasks by priority levels to focus on what matters most",
      color: "purple",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Visualize your productivity with interactive charts and insights",
      color: "pink",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Instant synchronization across all your devices",
      color: "yellow",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is encrypted and protected with industry-standard security",
      color: "green",
    },
    {
      icon: Sparkles,
      title: "Modern UI",
      description: "Beautiful, responsive design with smooth animations",
      color: "blue",
    },
  ];

  const stats = [
    { label: "Tasks Managed", value: "10K+", color: "indigo" },
    { label: "Active Users", value: "500+", color: "purple" },
    { label: "Uptime", value: "99.9%", color: "pink" },
    { label: "Countries", value: "25+", color: "blue" },
  ];

  const colorClasses = {
    indigo: {
      bg: "bg-(--bg-secondary)",
      border: "border-(--border-color)",
      text: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-100 dark:bg-indigo-500/20",
    },
    purple: {
      bg: "bg-(--bg-secondary)",
      border: "border-(--border-color)",
      text: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-500/20",
    },
    pink: {
      bg: "bg-(--bg-secondary)",
      border: "border-(--border-color)",
      text: "text-pink-600 dark:text-pink-400",
      iconBg: "bg-pink-100 dark:bg-pink-500/20",
    },
    yellow: {
      bg: "bg-(--bg-secondary)",
      border: "border-(--border-color)",
      text: "text-yellow-700 dark:text-yellow-400",
      iconBg: "bg-yellow-100 dark:bg-yellow-500/20",
    },
    green: {
      bg: "bg-(--bg-secondary)",
      border: "border-(--border-color)",
      text: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-500/20",
    },
    blue: {
      bg: "bg-(--bg-secondary)",
      border: "border-(--border-color)",
      text: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-500/20",
    },
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <div className="relative z-10 flex flex-col gap-6 px-8 py-8 border-b border-(--border-color) bg-(--bg-secondary)/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30">
            <Sparkles className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-(--text-primary)">
              About TaskMaster
            </h1>
            <p className="text-sm text-(--text-secondary)">
              Your productivity companion for modern task management
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-xl border border-(--border-color) bg-(--bg-secondary) p-8 backdrop-blur-sm text-center"
          >
            <h2 className="text-4xl font-bold text-(--text-primary) mb-4">
              Welcome to TaskMaster
            </h2>
            <p className="text-lg text-(--text-secondary) max-w-3xl mx-auto leading-relaxed">
              TaskMaster is a modern, intuitive task management application
              designed to help you stay organized and productive. Built with
              cutting-edge technologies and a focus on user experience, we make
              task management simple and enjoyable.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const colors = colorClasses[stat.color];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className={`rounded-xl border ${colors.border} ${colors.bg} p-6 backdrop-blur-sm text-center`}
                >
                  <div className={`text-3xl font-bold ${colors.text} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-(--text-secondary)">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Features Grid */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-(--text-primary) mb-6"
            >
              Key Features
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const colors = colorClasses[feature.color];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`rounded-xl border ${colors.border} ${colors.bg} p-6 backdrop-blur-sm hover:scale-105 transition-transform`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors.iconBg} mb-4`}
                    >
                      <Icon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <h4 className="text-lg font-semibold text-(--text-primary) mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-(--text-secondary)">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="rounded-xl border border-(--border-color) bg-(--bg-secondary) p-8 backdrop-blur-sm"
          >
            <h3 className="text-2xl font-bold text-(--text-primary) mb-6">
              Built With
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <img src={reactLogo} alt="React" className="w-12 h-12" />
                </div>
                <div className="text-(--text-primary) font-semibold">React</div>
                <div className="text-xs text-(--text-secondary)">Frontend</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <img src={nodejsLogo} alt="Node.js" className="w-12 h-12" />
                </div>
                <div className="text-(--text-primary) font-semibold">
                  Node.js
                </div>
                <div className="text-xs text-(--text-secondary)">Backend</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <img src={mongodbLogo} alt="MongoDB" className="w-12 h-12" />
                </div>
                <div className="text-(--text-primary) font-semibold">
                  MongoDB
                </div>
                <div className="text-xs text-(--text-secondary)">Database</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <img
                    src={tailwindLogo}
                    alt="Tailwind CSS"
                    className="w-12 h-12"
                  />
                </div>
                <div className="text-(--text-primary) font-semibold">
                  Tailwind
                </div>
                <div className="text-xs text-(--text-secondary)">Styling</div>
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="rounded-xl border border-(--border-color) bg-(--bg-secondary) p-8 backdrop-blur-sm"
          >
            <h3 className="text-2xl font-bold text-(--text-primary) mb-6 text-center">
              Get In Touch
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/NarendraDabhi580"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-(--bg-primary) border border-(--border-color) text-(--text-primary) hover:bg-(--bg-secondary) transition-colors cursor-pointer"
              >
                <Github className="h-5 w-5" />
                GitHub
              </a>
              <a
                href="mailto:nandudabhi580@gmail.com"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-(--bg-primary) border border-(--border-color) text-(--text-primary) hover:bg-(--bg-secondary) transition-colors cursor-pointer"
              >
                <Mail className="h-5 w-5" />
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/narendra-dabhi/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-(--bg-primary) border border-(--border-color) text-(--text-primary) hover:bg-(--bg-secondary) transition-colors cursor-pointer"
              >
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
              <a
                href="https://www.naukri.com/mnjuser/profile?id=&altresid"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-(--bg-primary) border border-(--border-color) text-(--text-primary) hover:bg-(--bg-secondary) transition-colors cursor-pointer"
              >
                <Briefcase className="h-5 w-5" />
                Naukri
              </a>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center text-sm text-(--text-secondary) py-8"
          >
            <p>
              © 2026 TaskMaster. Built with ❤️ for productivity enthusiasts.
            </p>
            <p className="mt-2">Version 1.0.0</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
