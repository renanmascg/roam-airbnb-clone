import type { LucideIcon } from "lucide-react-native";
import { styled } from "nativewind";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { cn } from "@/lib/cn";

const sizes = { xs: 14, sm: 16, md: 20, lg: 24 } as const;

type IconBaseProps = {
  as: LucideIcon;
  size?: keyof typeof sizes;
  filled?: boolean;
  strokeWidth?: number;
  color?: string;
  fill?: string;
  style?: StyleProp<ViewStyle>;
};

function IconBase({ as: Glyph, size = "lg", filled, strokeWidth = 2, color, fill, style }: IconBaseProps) {
  // Native receives color/fill as props from the className mapping. Web keeps the
  // classes on the wrapper, so the SVG inherits them through currentColor/inherit.
  return (
    <View style={style}>
      <Glyph
        size={sizes[size]}
        strokeWidth={strokeWidth}
        color={color ?? "currentColor"}
        fill={filled ? (fill ?? "inherit") : "none"}
      />
    </View>
  );
}

const StyledIcon = styled(IconBase, {
  className: { target: "style", nativeStyleMapping: { color: true, fill: true } },
});

export type IconProps = IconBaseProps & {
  /** Text color sets the stroke (`text-ink`); `fill-*` sets the fill when `filled`. */
  className?: string;
};

export function Icon({ className, filled, ...props }: IconProps) {
  // Defaults only apply when the caller sets none: utilities resolve by CSS order, not className order.
  const colorDefault = /\btext-/.test(className ?? "") ? undefined : "text-ink";
  const fillDefault = filled && !/\bfill-/.test(className ?? "") ? "fill-current" : undefined;
  return <StyledIcon className={cn(colorDefault, fillDefault, className)} filled={filled} {...props} />;
}
