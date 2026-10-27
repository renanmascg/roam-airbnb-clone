import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { Children, Fragment, type ReactNode } from "react";
import { Pressable, View, type PressableProps } from "react-native";

import { cn } from "@/lib/cn";

import { Icon } from "./icon";
import { Text } from "./text";

export type ListRowProps = Omit<PressableProps, "children"> & {
  label: string;
  icon?: LucideIcon;
  className?: string;
};

export function ListRow({ label, icon, className, ...props }: ListRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn("min-h-14 flex-row items-center gap-4 px-4 py-3 active:bg-surface-muted", className)}
      {...props}
    >
      {icon ? <Icon as={icon} /> : null}
      <Text variant="caption" className="flex-1">
        {label}
      </Text>
      <Icon as={ChevronRight} size="sm" />
    </Pressable>
  );
}

/** Groups rows on one surface, separated by hairlines (not one card per row). */
export function ListGroup({ children, className }: { children: ReactNode; className?: string }) {
  const rows = Children.toArray(children);
  return (
    <View className={cn("overflow-hidden rounded-xl bg-surface", className)}>
      {rows.map((row, i) => (
        <Fragment key={i}>
          {i > 0 ? <View className="mx-4 h-px bg-border" /> : null}
          {row}
        </Fragment>
      ))}
    </View>
  );
}
