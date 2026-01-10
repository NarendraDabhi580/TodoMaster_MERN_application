import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart2,
  Info,
  ListTodo,
  LogIn,
  LogOut,
  Star,
  User,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
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
    <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md w-full z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <ListTodo className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            TaskMaster
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <Link
            to="/tasks"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <ListTodo className="h-4 w-4" />
            Tasks
          </Link>
          <Link
            to="/priorities"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Star className="h-4 w-4" />
            Priorities
          </Link>
          <Link
            to="/analytics"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <BarChart2 className="h-4 w-4" />
            Analytics
          </Link>
          <Link
            to="/about"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Info className="h-4 w-4" />
            About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            // Show Profile and Logout button when authenticated
            <>
              <Link
                to="/profile"
                className="text-sm font-medium text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-neutral-300 hover:text-white transition-colors flex items-center gap-1 group"
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
                  className="text-sm font-medium text-neutral-300 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  Log in
                </Link>
              )}
              {currentPath !== "/register" && (
                <Link
                  to="/register"
                  className="text-sm font-medium text-neutral-300 hover:text-white transition-colors flex items-center gap-1 group"
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
