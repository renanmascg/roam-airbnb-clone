import "../global.css";

import { Stack } from "expo-router";

import { useBrandFonts } from "@/lib/fonts";

export default function RootLayout() {
  const fontsReady = useBrandFonts();
  if (!fontsReady) return null;

  return <Stack />;
}
