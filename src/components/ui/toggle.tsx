import { styled } from "nativewind";
import { Platform, Switch, type SwitchProps } from "react-native";

export type ToggleProps = Omit<SwitchProps, "trackColor" | "thumbColor">;

type SwitchBaseProps = ToggleProps & { onColor?: string; offColor?: string; thumb?: string };

function SwitchBase({ onColor, offColor, thumb, ...props }: SwitchBaseProps) {
  return <Switch trackColor={{ true: onColor, false: offColor }} thumbColor={thumb} {...props} />;
}

// The native Switch is the design system here; only its colors come from tokens.
// Switch takes colors as props, so the className is mapped onto them (native only;
// web keeps the platform default colors).
const StyledSwitch = styled(SwitchBase, {
  className: {
    target: false,
    nativeStyleMapping: { backgroundColor: "onColor", borderColor: "offColor", color: "thumb" },
  },
});

export function Toggle(props: ToggleProps) {
  // On web the mapping is skipped and would hand Switch a className object instead.
  if (Platform.OS === "web") return <Switch {...props} />;
  return <StyledSwitch className="border-border bg-primary text-white" {...props} />;
}
