"use client";

import { motion } from "framer-motion";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {children}
    </motion.main>
  );
}
