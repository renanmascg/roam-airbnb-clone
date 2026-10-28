import { styled } from "nativewind";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

// Drawn on a 390-wide box (the design's screen width) and stretched to any width,
// so it needs no window measurement (which differs between server and client on web).
const W = 390;
const H = 56;
const PATH = `M0,32 Q0,0 32,0 C214,0 346,14 374,30 Q${W},38 ${W},${H} L${W},${H + 1} L0,${H + 1} Z`;

function CurveBase({ color, style }: { color?: string; style?: StyleProp<ViewStyle> }) {
  // Native gets the color from the className mapping; web inherits it through currentColor.
  return (
    <View style={style}>
      <Svg width="100%" height={H + 1} viewBox={`0 0 ${W} ${H + 1}`} preserveAspectRatio="none">
        <Path d={PATH} fill={color ?? "currentColor"} />
      </Svg>
    </View>
  );
}

const StyledCurve = styled(CurveBase, {
  className: { target: "style", nativeStyleMapping: { color: true } },
});

/** The sheet's curved top edge, filled with the sheet's surface color. */
export function SheetCurve() {
  return <StyledCurve className="text-surface" />;
}
