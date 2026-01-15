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
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get current path
  const currentPath = location.pathname;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const performLogout = async () => {
    setShowLogoutConfirm(false); // Close the dialog first
    closeMobileMenu(); // Close mobile menu

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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-(--bg-primary) transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-(--text-primary)" />
          ) : (
            <Menu className="h-6 w-6 text-(--text-primary)" />
          )}
        </button>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={performLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access your tasks."
      />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed top-16 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Slide-in */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-72 bg-(--bg-secondary) border-l border-(--border-color) z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 overflow-y-auto">
          {/* Navigation Links */}
          <div className="flex flex-col gap-2 mb-6">
            <h3 className="text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-2">
              Navigation
            </h3>
            <Link
              to="/tasks"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentPath === "/tasks"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary)"
              }`}
            >
              <ListTodo className="h-5 w-5" />
              <span>Tasks</span>
            </Link>
            <Link
              to="/priorities"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentPath === "/priorities"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary)"
              }`}
            >
              <Star className="h-5 w-5" />
              <span>Priorities</span>
            </Link>
            <Link
              to="/analytics"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentPath === "/analytics"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary)"
              }`}
            >
              <BarChart2 className="h-5 w-5" />
              <span>Analytics</span>
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentPath === "/about"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary)"
              }`}
            >
              <Info className="h-5 w-5" />
              <span>About</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-(--border-color) my-4" />

          {/* Theme Toggle */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-2">
              Appearance
            </h3>
            <button
              onClick={(e) => toggleTheme(e)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary) transition-all"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-5 w-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-(--border-color) my-4" />

          {/* Account Actions */}
          <div className="mt-auto">
            <h3 className="text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-2">
              Account
            </h3>
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    currentPath === "/profile"
                      ? "bg-indigo-600 text-white font-semibold"
                      : "text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary)"
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-(--text-secondary) hover:bg-red-500/10 hover:text-red-500 transition-all w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {currentPath !== "/login" && (
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary) transition-all"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Log in</span>
                  </Link>
                )}
                {currentPath !== "/register" && (
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Register</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
