"use client";

import { motion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

type HapticButtonProps = {
  children: ReactNode;
} & ComponentProps<typeof motion.button>;

export function HapticButton({ children, ...props }: HapticButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

