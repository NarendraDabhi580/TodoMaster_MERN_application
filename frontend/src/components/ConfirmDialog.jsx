import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/60"
            onClick={onClose}
          />

          {/* Centered Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, pointerEvents: "none" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md bg-(--bg-secondary) border border-(--border-color) rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-(--border-color) bg-(--bg-primary)">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
                    <LogOut className="h-6 w-6 text-(--text-primary)" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-(--text-primary)">
                      {title || "Confirm Action"}
                    </h2>
                    <p className="text-xs text-(--text-secondary) mt-0.5">
                      This action requires confirmation
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                <p className="text-(--text-primary) text-base leading-relaxed">
                  {message || "Are you sure you want to proceed?"}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-(--border-color) bg-(--bg-primary)">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-(--bg-primary) hover:bg-(--bg-secondary) border border-(--border-color) rounded-lg text-sm font-medium text-(--text-primary) transition active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-sm font-medium text-(--text-primary) shadow-lg shadow-indigo-500/30 transition active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
};

export default ConfirmDialog;
