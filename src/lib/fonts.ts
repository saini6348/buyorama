import localFont from "next/font/local";

// Fonts are bundled locally (woff2) so the build never has to fetch from
// Google at compile time — this avoids Turbopack/Google Fonts resolution
// failures during `vercel build` and keeps the site fully self-contained.

export const baloo2 = localFont({
  src: [
    { path: "../fonts/baloo2-500.woff2", weight: "500" },
    { path: "../fonts/baloo2-600.woff2", weight: "600" },
    { path: "../fonts/baloo2-700.woff2", weight: "700" },
    { path: "../fonts/baloo2-800.woff2", weight: "800" },
  ],
  variable: "--font-baloo",
  display: "swap",
});

export const manrope = localFont({
  src: [
    { path: "../fonts/manrope-300.woff2", weight: "300" },
    { path: "../fonts/manrope-400.woff2", weight: "400" },
    { path: "../fonts/manrope-500.woff2", weight: "500" },
    { path: "../fonts/manrope-600.woff2", weight: "600" },
    { path: "../fonts/manrope-700.woff2", weight: "700" },
    { path: "../fonts/manrope-800.woff2", weight: "800" },
  ],
  variable: "--font-manrope",
  display: "swap",
});

export const jetbrainsMono = localFont({
  src: [
    { path: "../fonts/jetbrainsmono-400.woff2", weight: "400" },
    { path: "../fonts/jetbrainsmono-500.woff2", weight: "500" },
    { path: "../fonts/jetbrainsmono-600.woff2", weight: "600" },
    { path: "../fonts/jetbrainsmono-700.woff2", weight: "700" },
  ],
  variable: "--font-jbmono",
  display: "swap",
});

