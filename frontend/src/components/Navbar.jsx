import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart2,
  Info,
  ListTodo,
  LogIn,
  LogOut,
  Moon,
  Star,
  Sun,
  User,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Get current path
  const currentPath = location.pathname;

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const performLogout = async () => {
    setShowLogoutConfirm(false); // Close the dialog first

    try {
      await logout(); // Logout from context handles API call
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };

  return (
    <nav className="border-b border-(--border-color) bg-(--bg-secondary)/80 backdrop-blur-md w-full z-50 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <ListTodo className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-(--text-primary)">
            TaskMaster
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-(--text-secondary)">
          <Link
            to="/tasks"
            className={`flex items-center gap-2 transition-colors ${
              currentPath === "/tasks"
                ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                : "hover:text-(--text-primary)"
            }`}
          >
            <ListTodo className="h-4 w-4" />
            Tasks
          </Link>
          <Link
            to="/priorities"
            className={`flex items-center gap-2 transition-colors ${
              currentPath === "/priorities"
                ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                : "hover:text-(--text-primary)"
            }`}
          >
            <Star className="h-4 w-4" />
            Priorities
          </Link>
          <Link
            to="/analytics"
            className={`flex items-center gap-2 transition-colors ${
              currentPath === "/analytics"
                ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                : "hover:text-(--text-primary)"
            }`}
          >
            <BarChart2 className="h-4 w-4" />
            Analytics
          </Link>
          <Link
            to="/about"
            className={`flex items-center gap-2 transition-colors ${
              currentPath === "/about"
                ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                : "hover:text-(--text-primary)"
            }`}
          >
            <Info className="h-4 w-4" />
            About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={(e) => toggleTheme(e)}
            className="p-2 rounded-full hover:bg-(--bg-primary) transition-colors group cursor-pointer"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-(--text-secondary) group-hover:text-(--text-primary) transition-colors" />
            ) : (
              <Moon className="h-5 w-5 text-(--text-secondary) group-hover:text-(--text-primary) transition-colors" />
            )}
          </button>

          {isAuthenticated ? (
            // Show Profile and Logout button when authenticated
            <>
              <Link
                to="/profile"
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                  currentPath === "/profile"
                    ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-(--text-secondary) hover:text-(--text-primary)"
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors flex items-center gap-1 group cursor-pointer"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                Logout
              </button>
            </>
          ) : (
            // Show Login/Register based on current page
            <>
              {currentPath !== "/login" && (
                <Link
                  to="/login"
                  className="text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors flex items-center gap-1 group"
                >
                  <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  Log in
                </Link>
              )}
              {currentPath !== "/register" && (
                <Link
                  to="/register"
                  className="text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors flex items-center gap-1 group"
                >
                  <UserPlus className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  Register
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={performLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access your tasks."
      />
    </nav>
  );
};

export default Navbar;
