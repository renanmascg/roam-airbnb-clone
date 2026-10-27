import { useFonts } from "expo-font";

/**
 * The expo-font config plugin only embeds fonts on native, so web loads them at runtime.
 * Web is server-rendered: never block on loading, or the client's first render
 * differs from the server's and hydration fails. Text swaps to the font once loaded.
 */
export function useBrandFonts() {
  useFonts({
    "PlusJakartaSans-Regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-SemiBold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-ExtraBold": require("@/assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });
  return true;
}
