import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check local storage or system preference on mount
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme;
      }
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "dark"; // Default to dark as per current app state
  });

  // Track if a transition is in progress to prevent stacking
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (event) => {
    // Prevent multiple transitions from stacking
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Get the click position for the circular reveal animation
    const x = event?.clientX ?? window.innerWidth;
    const y = event?.clientY ?? 0;

    // Calculate the maximum radius needed to cover the entire screen
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Create a circular reveal transition

    // Check if browser supports View Transitions API
    if (!document.startViewTransition) {
      // Fallback for browsers that don't support View Transitions
      setTheme((prev) => (prev === "dark" ? "light" : "dark"));
      setIsTransitioning(false);
      return;
    }

    // Use View Transitions API for smooth circular reveal
    const transition = document.startViewTransition(() => {
      setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    });

    // Apply optimized custom animation with circular clip-path
    transition.ready.then(() => {
      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 400, // Reduced for snappier feel
            easing: "cubic-bezier(0.4, 0, 0.2, 1)", // Optimized easing curve
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    });

    // Reset transition flag after animation completes
    transition.finished.finally(() => {
      setIsTransitioning(false);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => useContext(ThemeContext);
