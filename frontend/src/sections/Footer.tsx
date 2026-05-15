import React from "react";
import { motion } from "motion/react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-4 overflow-hidden border-t-2 border-black">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="tech-ticker"
      >
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 bg-brand-red rounded-full"></span> Projects Hunter
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 bg-brand-yellow rounded-full"></span> 24/7
          Tech Support
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 bg-brand-red rounded-full"></span>{" "}
          Specialized in Complex FSM
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 bg-brand-yellow rounded-full"></span> Modern
          Web Frameworks
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 bg-brand-red rounded-full"></span> Python &
          ML Expertise
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 bg-brand-yellow rounded-full"></span> Logic
          Circuit Masters
        </div>
        {/* Duplicate for seamless scroll */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 bg-brand-red rounded-full"></span> Projects Hunter
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 bg-brand-yellow rounded-full"></span> 24/7
          Tech Support
        </div>
      </motion.div>
    </footer>
  );
};
