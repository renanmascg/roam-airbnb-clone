import { Image } from "expo-image";
import { Heart, MapPin, Star, type LucideIcon } from "lucide-react-native";
import { Pressable, View, type PressableProps } from "react-native";

import { cn } from "@/lib/cn";

import { Icon } from "./icon";
import { IconButton } from "./icon-button";
import { Tag } from "./tag";
import { Text } from "./text";

export type ListingCardStay = {
  title: string;
  location: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  amenities: { label: string; icon: LucideIcon }[];
};

export type ListingCardProps = Omit<PressableProps, "children"> & {
  stay: ListingCardStay;
  saved?: boolean;
  onToggleSaved?: () => void;
  className?: string;
};

const price = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ListingCard({ stay, saved, onToggleSaved, className, ...props }: ListingCardProps) {
  return (
    <View className={cn("rounded-2xl bg-surface", className)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${stay.title}, ${stay.location}, ${price.format(stay.pricePerNight)} per night`}
        className="flex-row gap-4 rounded-2xl p-2 active:opacity-90"
        {...props}
      >
        <View className="size-40 overflow-hidden rounded-lg bg-surface-muted">
          <Image source={stay.imageUrl} contentFit="cover" style={{ width: "100%", height: "100%" }} />
        </View>

        <View className="flex-1 gap-1.5 py-1">
          <Text variant="title" numberOfLines={2}>
            {stay.title}
          </Text>
          <View className="flex-row items-center gap-1">
            <Icon as={MapPin} size="sm" className="text-ink-muted" />
            <Text variant="caption" weight="regular" tone="muted" numberOfLines={1}>
              {stay.location}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Icon as={Star} size="sm" filled className="fill-primary text-primary" />
            <Text variant="caption" weight="semibold">
              {stay.rating.toFixed(1)}
            </Text>
            <Text variant="caption" weight="regular" tone="muted">
              ({stay.reviewCount})
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {stay.amenities.map((a) => (
              <Tag key={a.label} label={a.label} icon={a.icon} size="sm" />
            ))}
          </View>
          <View className="flex-row items-baseline gap-1">
            <Text variant="title">{price.format(stay.pricePerNight)}</Text>
            <Text variant="body" tone="muted">
              / night
            </Text>
          </View>
        </View>
      </Pressable>
      {/* A sibling, not a child: nested buttons are invalid on web and confuse screen readers. */}
      {onToggleSaved ? (
        <IconButton
          icon={Heart}
          size="sm"
          variant="surface"
          active={saved}
          iconClassName={saved ? "fill-danger text-danger" : undefined}
          accessibilityLabel={saved ? "Remove from saved" : "Save stay"}
          onPress={onToggleSaved}
          className="absolute left-32 top-4"
        />
      ) : null}
    </View>
  );
}
