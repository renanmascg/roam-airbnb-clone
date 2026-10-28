import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRight } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  ScrollView,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from "react-native";

import { OnboardingSlide } from "@/components/onboarding/onboarding-slide";
import { slides } from "@/components/onboarding/slides";
import { Button, GoogleMark, Icon, Logo } from "@/components/ui";
import { useAuth } from "@/lib/auth/auth-context";

export default function OnboardingScreen() {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const [googleBusy, setGoogleBusy] = useState(false);
  // Measured, not read from the window: on web the server renders with no window,
  // and both first renders must agree for hydration.
  const [width, setWidth] = useState(0);
  const scroller = useRef<ScrollViewInstance>(null);
  const [index, setIndex] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const isLast = index === slides.length - 1;

  // onScroll rather than momentum end: web has no momentum events.
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width > 0) setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const next = () => {
    if (isLast) {
      router.push("/sign-up");
      return;
    }
    scroller.current?.scrollTo({ x: width * (index + 1), animated: true });
    setIndex(index + 1);
  };

  // On success the route guard moves the guest to /home.
  // Failures fall back to the sign-in screen, which shows provider errors properly.
  const continueWithGoogle = async () => {
    setGoogleBusy(true);
    try {
      await signInWithGoogle();
    } catch {
      router.push("/sign-in");
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />
      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        {width > 0 && slides.map((slide, i) => (
          <OnboardingSlide
            key={slide.key}
            slide={slide}
            index={i}
            count={slides.length}
            width={width}
            footerHeight={footerHeight}
          />
        ))}
      </ScrollView>

      {/* Fixed chrome: stays put while the slides swipe underneath. */}
      <View className="absolute inset-x-0 top-0 flex-row items-center justify-between px-6 pt-safe-offset-4">
        {/* PLACEHOLDER: wordmark asset still missing (see Logo). */}
        <Logo />
        <Button title="Skip" variant="glass" size="sm" onPress={() => router.push("/sign-up")} />
      </View>

      <View
        className="absolute inset-x-0 bottom-0 gap-3 px-6 pt-4 pb-safe-or-4"
        onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
      >
        <Button title="Get started" size="md" trailing={<Icon as={ArrowRight} />} onPress={next} />
        <Button
          title="Continue with Google"
          variant="secondary"
          size="md"
          leading={<GoogleMark />}
          loading={googleBusy}
          onPress={continueWithGoogle}
        />
      </View>
    </View>
  );
}
