import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ChangePasswordModal from "../components/profile/ChangePasswordModal";
import {
  User,
  Mail,
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  Lock,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosInstance";

import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [preview, setPreview] = useState(user?.profilePicture || null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get("/todo/todos");
        const fetchedTasks = response.data.todo || [];
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleToggleNotification = async (key) => {
    try {
      const newValue = !(user?.[key] ?? true);

      if (key === "webNotifications" && newValue === true) {
        if (!("Notification" in window)) {
          toast.error("This browser does not support desktop notifications");
          return;
        }
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          toast.error("Permission denied for notifications");
          return;
        }
      }

      const response = await axiosInstance.put("/auth/me", { [key]: newValue });
      setUser(response.data.user);
      toast.success("Settings updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings");
    }
  };

  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setPreview(user?.profilePicture || null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setPreview(user?.profilePicture || null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (formData.profilePicture instanceof File) {
        data.append("profilePicture", formData.profilePicture);
      }

      const response = await axiosInstance.put("/auth/me", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(response.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Calculate task statistics
  const totalTasks = tasks.length;

  // Try different status formats (lowercase, with/without hyphen)
  const completedTasks = tasks.filter(
    (task) =>
      task.status?.toLowerCase() === "completed" ||
      task.status?.toLowerCase() === "complete"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) =>
      task.status?.toLowerCase() === "in-progress" ||
      task.status?.toLowerCase() === "in progress" ||
      task.status?.toLowerCase() === "inprogress"
  ).length;

  const pendingTasks = tasks.filter(
    (task) =>
      task.status?.toLowerCase() === "pending" ||
      task.status?.toLowerCase() === "todo"
  ).length;

  const stats = [
    { label: "Total Tasks", value: totalTasks.toString(), color: "indigo" },
    { label: "Completed", value: completedTasks.toString(), color: "green" },
    {
      label: "In Progress",
      value: inProgressTasks.toString(),
      color: "yellow",
    },
    { label: "Pending", value: pendingTasks.toString(), color: "purple" },
  ];

  const colorClasses = {
    indigo: "bg-(--bg-secondary) border-(--border-color) text-indigo-500",
    green: "bg-(--bg-secondary) border-(--border-color) text-green-500",
    yellow: "bg-(--bg-secondary) border-(--border-color) text-yellow-600",
    purple: "bg-(--bg-secondary) border-(--border-color) text-purple-500",
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <div className="relative z-10 flex flex-col gap-6 px-8 py-8 border-b border-light-action/20 dark:border-white/5 bg-(--bg-secondary)/80 backdrop-blur-xl transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30">
              <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-(--text-primary)">
                Profile
              </h1>
              <p className="text-sm text-(--text-secondary)">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-300 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-(--border-color) bg-(--bg-secondary) p-8 backdrop-blur-sm transition-colors duration-300"
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <div className="w-32 h-32 rounded-full bg-linear-to-br from-indigo-500/20 to-purple-600/20 border-2 border-indigo-500/30 flex items-center justify-center overflow-hidden">
                    {preview || user?.profilePicture ? (
                      <img
                        src={preview || user?.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 text-indigo-400" />
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={handleCameraClick}
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-300 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-(--text-primary)">
                    {user?.name || "User"}
                  </h2>
                  <p className="text-sm text-(--text-secondary)">
                    Member
                  </p>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-(--text-secondary) mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-(--bg-secondary) border border-(--border-color) text-(--text-primary) focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--bg-secondary) border border-(--border-color) transition-colors">
                        <User className="h-4 w-4 text-neutral-400" />
                        <span className="text-(--text-primary)">
                          {user?.name || "N/A"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-(--text-secondary) mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-(--bg-secondary) border border-(--border-color) text-(--text-primary) focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--bg-secondary) border border-(--border-color) transition-colors">
                        <Mail className="h-4 w-4 text-neutral-400" />
                        <span className="text-(--text-primary)">
                          {user?.email || "N/A"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-(--text-secondary) mb-2">
                      Member Since
                    </label>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--bg-secondary) border border-(--border-color) transition-colors">
                      <Calendar className="h-4 w-4 text-neutral-400" />
                      <span className="text-(--text-primary)">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-300 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--bg-secondary) border border-(--border-color) text-(--text-secondary) hover:bg-(--bg-primary) transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className={`rounded-xl border p-6 backdrop-blur-sm text-center ${
                  colorClasses[stat.color]
                }`}
              >
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Settings Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-(--border-color) bg-(--bg-secondary) p-6 backdrop-blur-sm transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-(--text-primary)">
                  Security
                </h3>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-(--bg-secondary) border border-(--border-color) text-(--text-primary) hover:bg-(--bg-primary) transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-neutral-400" />
                    <span>Change Password</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-(--bg-secondary) border border-(--border-color) text-(--text-primary) hover:bg-(--bg-primary) transition-colors">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-neutral-400" />
                    <span>Two-Factor Auth</span>
                  </div>
                  <span className="text-xs text-neutral-500">Coming Soon</span>
                </button>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-(--border-color) bg-(--bg-secondary) p-6 backdrop-blur-sm transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                  <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-(--text-primary)">
                  Notifications
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-(--bg-secondary) border border-(--border-color) transition-colors">
                  <span className="text-(--text-primary)">
                    Email Notifications
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={user?.emailNotifications ?? true}
                      onChange={() =>
                        handleToggleNotification("emailNotifications")
                      }
                    />
                    <div className="w-11 h-6 bg-neutral-300 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-600 peer-checked:after:bg-white after:shadow-md after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500/50 dark:after:bg-white"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-(--bg-secondary) border border-(--border-color) transition-colors">
                  <span className="text-(--text-primary)">
                    Task Reminders
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={user?.webNotifications ?? true}
                      onChange={() =>
                        handleToggleNotification("webNotifications")
                      }
                    />
                    <div className="w-11 h-6 bg-neutral-300 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-600 peer-checked:after:bg-white after:shadow-md after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500/50 dark:after:bg-white"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
