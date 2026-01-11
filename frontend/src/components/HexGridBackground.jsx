import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

/* ================= CONFIG ================= */
const HEX_SIZE = 40; // small hexes
const HEX_HEIGHT = HEX_SIZE * 0.866;
const GAP = 6;

/* ================= HEX CELL ================= */
const Hex = ({ mouseX, mouseY, isDark }) => {
  const ref = useRef(null);
  const center = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    center.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, []);

  const distance = useTransform([mouseX, mouseY], ([mx, my]) => {
    const dx = mx - center.current.x;
    const dy = my - center.current.y;
    return Math.sqrt(dx * dx + dy * dy);
  });

  /* Fade + color spread */
  const opacity = useTransform(distance, [0, 100, 300], [1, 0.5, 0.15]);

  const colorRange = isDark
    ? [
        "rgba(99,102,241,0.9)", // indigo-500 near cursor
        "rgba(168,85,247,0.45)", // purple-500 mid
        "rgba(30,27,75,0.15)", // dark indigo far
      ]
    : [
        "rgba(99,102,241,0.9)", // indigo-500 near cursor
        "rgba(168,85,247,0.45)", // purple-500 mid
        "rgba(162, 148, 249, 0.15)", // user primary light purple far
      ];

  const background = useTransform(distance, [0, 150, 400], colorRange);

  return (
    <motion.div
      ref={ref}
      style={{
        width: HEX_SIZE,
        height: HEX_SIZE,
        background,
        opacity,
        clipPath:
          "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
      }}
      className="pointer-events-none absolute will-change-transform"
    />
  );
};

Hex.propTypes = {
  mouseX: PropTypes.object.isRequired,
  mouseY: PropTypes.object.isRequired,
  isDark: PropTypes.bool.isRequired,
};

const HexGridBackground = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const mouseX = useMotionValue(window.innerWidth / 2);
  const mouseY = useMotionValue(window.innerHeight / 2);

  const springConfig = { damping: 25, stiffness: 120 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable cursor effect for these landing/auth pages
    // All other internal pages (Tasks, Profile, 404, etc.) will have static background
    const enableEffectPaths = ["/", "/login", "/register", "/forgot-password"];
    const isResetPassword = location.pathname.startsWith("/reset-password");

    // If NOT in allow-list, disable cursor effect
    if (!enableEffectPaths.includes(location.pathname) && !isResetPassword) {
      mouseX.set(-1000);
      mouseY.set(-1000);
      return;
    }

    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY, location.pathname]);

  const grid = useMemo(() => {
    const cols = Math.ceil(window.innerWidth / (HEX_SIZE + GAP));
    const rows = Math.ceil(window.innerHeight / (HEX_HEIGHT + GAP));

    const cells = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const offsetX = row % 2 === 0 ? 0 : HEX_SIZE / 2;
        cells.push({
          x: col * (HEX_SIZE + GAP) + offsetX,
          y: row * (HEX_HEIGHT + GAP),
        });
      }
    }
    return cells;
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Radial gradient for general atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.15),transparent_50%)]" />

      {/* Hex Grid */}
      {grid.map((cell, i) => (
        <motion.div
          key={i}
          style={{ left: cell.x, top: cell.y }}
          className="absolute"
        >
          <Hex
            mouseX={mouseXSpring}
            mouseY={mouseYSpring}
            isDark={theme === "dark"}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default HexGridBackground;
