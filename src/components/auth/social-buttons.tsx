import { Button, GoogleMark } from "@/components/ui";

import { OrDivider } from "./or-divider";

type Props = {
  /** True while the Google call is running. */
  loading: boolean;
  /** True while another action on the screen is running. */
  disabled: boolean;
  onPress: () => void;
};

/** "or" divider plus the Google button, shared by sign up and sign in. */
export function SocialButtons({ loading, disabled, onPress }: Props) {
  return (
    <>
      <OrDivider />
      <Button
        title="Continue with Google"
        variant="secondary"
        size="md"
        align="start"
        leading={<GoogleMark />}
        loading={loading}
        disabled={disabled && !loading}
        onPress={onPress}
      />
    </>
  );
}
