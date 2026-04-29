import type { NextConfig } from "next";

// frontend/tailwind.config.ts
const config = {
  theme: {
    extend: {
      boxShadow: {
        'neon': '0 0 5px #22c55e, 0 0 20px #22c55e33',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
};