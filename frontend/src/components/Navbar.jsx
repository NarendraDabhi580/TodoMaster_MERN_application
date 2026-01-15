import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart2,
  Info,
  ListTodo,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Star,
  Sun,
  User,
  UserPlus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/theme-context";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get current path
  const currentPath = location.pathname;

  // Handler to close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const performLogout = async () => {
    setShowLogoutConfirm(false); // Close the dialog first
    setIsMobileMenuOpen(false); // Close mobile menu

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
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-(--bg-primary) transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-(--text-primary)" />
            ) : (
              <Menu className="h-6 w-6 text-(--text-primary)" />
            )}
          </button>

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
                className={`hidden md:flex text-sm font-medium transition-colors items-center gap-1 ${
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
                className="hidden md:flex text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors items-center gap-1 group cursor-pointer"
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
                  className="hidden md:flex text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors items-center gap-1 group"
                >
                  <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  Log in
                </Link>
              )}
              {currentPath !== "/register" && (
                <Link
                  to="/register"
                  className="hidden md:flex text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors items-center gap-1 group"
                >
                  <UserPlus className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  Register
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 space-y-3 border-t border-(--border-color) bg-(--bg-secondary)">
          {/* Navigation Links */}
          <Link
            to="/tasks"
            onClick={closeMobileMenu}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentPath === "/tasks"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary)"
            }`}
          >
            <ListTodo className="h-5 w-5" />
            Tasks
          </Link>
          <Link
            to="/priorities"
            onClick={closeMobileMenu}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentPath === "/priorities"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary)"
            }`}
          >
            <Star className="h-5 w-5" />
            Priorities
          </Link>
          <Link
            to="/analytics"
            onClick={closeMobileMenu}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentPath === "/analytics"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary)"
            }`}
          >
            <BarChart2 className="h-5 w-5" />
            Analytics
          </Link>
          <Link
            to="/about"
            onClick={closeMobileMenu}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentPath === "/about"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary)"
            }`}
          >
            <Info className="h-5 w-5" />
            About
          </Link>

          {/* Divider */}
          <div className="border-t border-(--border-color) my-2"></div>

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPath === "/profile"
                    ? "bg-indigo-600 text-white font-semibold"
                    : "text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary)"
                }`}
              >
                <User className="h-5 w-5" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary) transition-colors cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </>
          ) : (
            <>
              {currentPath !== "/login" && (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary) transition-colors"
                >
                  <LogIn className="h-5 w-5" />
                  Log in
                </Link>
              )}
              {currentPath !== "/register" && (
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary) transition-colors"
                >
                  <UserPlus className="h-5 w-5" />
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
