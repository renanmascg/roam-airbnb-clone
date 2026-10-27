import { Stack } from "expo-router";
import {
  ArrowRight,
  Bath,
  Bookmark,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Globe,
  Heart,
  House,
  List,
  Lock,
  Luggage,
  Map,
  MapPin,
  MessageSquareText,
  Palmtree,
  PawPrint,
  Search,
  Settings,
  Share,
  SlidersHorizontal,
  TreePine,
  User,
  Waves,
} from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";

import {
  Alert,
  Button,
  Chip,
  Icon,
  IconButton,
  ListGroup,
  ListingCard,
  ListRow,
  Logo,
  PolicyCard,
  SegmentedControl,
  Stepper,
  TabBar,
  Tag,
  Text,
  TextField,
  Toggle,
} from "@/components/ui";

// Class names are listed in full so Tailwind can find them.
const swatches = [
  { name: "Primary", token: "primary", className: "bg-primary", use: "Primary actions, active states" },
  { name: "Lavender", token: "lavender", className: "bg-lavender", use: "Secondary actions, highlights" },
  { name: "Ink", token: "ink", className: "bg-ink", use: "Headings, primary text" },
  { name: "Ink muted", token: "ink-muted", className: "bg-ink-muted", use: "Body, secondary text" },
  { name: "Surface", token: "surface", className: "bg-surface border border-border", use: "Cards, sheets, modals" },
  { name: "Surface muted", token: "surface-muted", className: "bg-surface-muted", use: "App background, inputs" },
  { name: "Border", token: "border", className: "bg-border", use: "Dividers, borders" },
  { name: "Glass", token: "glass", className: "bg-glass border border-border", use: "Tab bar, glass surfaces" },
] as const;

const ramp = [
  { variant: "display", sample: "Find your next stay", spec: "Bold 56 / 56" },
  { variant: "heading", sample: "Modern Cabin with Hot Tub", spec: "Bold 28 / 34" },
  { variant: "title", sample: "Modern Cabin with Hot Tub", spec: "Bold 18 / 22" },
  { variant: "body", sample: "From mountain cabins to oceanfront villas, roam helps you find unforgettable stays.", spec: "Regular 16 / 24" },
  { variant: "label", sample: "Cabins in California", spec: "Medium 15 / 20" },
  { variant: "caption", sample: "Lake Arrowhead, CA", spec: "Medium 14 / 20" },
  { variant: "small", sample: "Full refund up to 7 days before check-in.", spec: "Regular 12 / 16" },
  { variant: "button", sample: "Book this stay", spec: "SemiBold 17 / 22" },
] as const;

const sampleStay = {
  title: "Modern Cabin with Hot Tub",
  location: "Lake Arrowhead, CA",
  // Remote placeholder photo (sample content only).
  imageUrl: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600",
  rating: 4.9,
  reviewCount: 342,
  pricePerNight: 280,
  amenities: [
    { label: "Hot Tub", icon: Bath },
    { label: "Pet Friendly", icon: PawPrint },
  ],
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-4 rounded-2xl bg-surface p-5">
      <Text variant="label" weight="semibold">
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function DesignSystemScreen() {
  const [filter, setFilter] = useState("Cabins");
  const [category, setCategory] = useState("All Stays");
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"home" | "search" | "trips" | "profile">("home");
  const [view, setView] = useState<"list" | "map">("list");
  const [instantBook, setInstantBook] = useState(true);
  const [guests, setGuests] = useState(1);
  const [alerts, setAlerts] = useState({ success: true, danger: true });

  return (
    <>
      <Stack.Screen options={{ title: "Design system" }} />
      <ScrollView className="flex-1 bg-surface-muted" contentContainerClassName="gap-4 p-4 pb-12">
        <Section title="01. Brand">
          <Logo />
          <Text variant="heading" weight="regular" tone="muted">
            Find unforgettable stays for every kind of trip.
          </Text>
        </Section>

        <Section title="02. Color palette">
          <View className="flex-row flex-wrap gap-4">
            {swatches.map((s) => (
              <View key={s.token} className="w-36 gap-1.5">
                <View className={`h-16 rounded-lg ${s.className}`} />
                <Text variant="caption" weight="semibold">
                  {s.name}
                </Text>
                <Text variant="small" tone="muted">
                  {s.token} · {s.use}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="03. Typography">
          {ramp.map((r) => (
            <View key={r.variant} className="gap-1">
              <Text variant="small" tone="muted">
                {r.variant} · Plus Jakarta Sans {r.spec}
              </Text>
              <Text variant={r.variant}>{r.sample}</Text>
            </View>
          ))}
        </Section>

        <Section title="04. Buttons">
          <Button title="Book this stay" trailing={<Icon as={ArrowRight} />} />
          {/* PLACEHOLDER: Globe stands in for the Google "G" logo until the brand asset is added. */}
          <Button title="Continue with Google" variant="secondary" leading={<Icon as={Globe} />} />
          <Button title="Book this stay" loading />
          <Button title="Book this stay" disabled />
          <View className="flex-row gap-4">
            <IconButton icon={Heart} accessibilityLabel="Save" />
            <IconButton icon={Share} accessibilityLabel="Share" />
            <IconButton icon={Search} accessibilityLabel="Search" />
            <IconButton icon={Bookmark} accessibilityLabel="Bookmark" />
          </View>
        </Section>

        <Section title="05. Input fields">
          <TextField
            icon={Search}
            placeholder="Search stays"
            defaultValue="Cabins in California"
            trailing={
              <Pressable accessibilityRole="button" accessibilityLabel="Filters" hitSlop={8}>
                <Icon as={SlidersHorizontal} />
              </Pressable>
            }
          />
          <TextField icon={User} placeholder="Enter your name" />
          <TextField icon={User} defaultValue="Joanna Smith" autoFocus />
          <TextField icon={Lock} placeholder="Password" defaultValue="password1" secureTextEntry />
        </Section>

        <Section title="06. Filter chips">
          <View className="flex-row flex-wrap gap-3">
            {["Cabins", "Under $300", "Pet Friendly", "Quiet"].map((label) => (
              <Chip key={label} label={label} selected={filter === label} onPress={() => setFilter(label)} />
            ))}
          </View>
          <View className="flex-row flex-wrap gap-2">
            {[
              { label: "All Stays", icon: House },
              { label: "Cabins", icon: TreePine },
              { label: "Beach", icon: Waves },
              { label: "City", icon: Building2 },
              { label: "Villas", icon: Palmtree },
            ].map((c) => (
              <Chip
                key={c.label}
                variant="category"
                label={c.label}
                icon={c.icon}
                selected={category === c.label}
                onPress={() => setCategory(c.label)}
              />
            ))}
          </View>
        </Section>

        <Section title="07. Listing card">
          <View className="rounded-2xl bg-surface-muted p-2">
            <ListingCard stay={sampleStay} saved={saved} onToggleSaved={() => setSaved((s) => !s)} />
          </View>
        </Section>

        <Section title="08. Policy card">
          <PolicyCard
            icon={MessageSquareText}
            title="Ask about policies"
            description="Cancellation, house rules, pets, check-in and more."
          />
          <PolicyCard
            icon={FileText}
            title="Free cancellation"
            description="Full refund up to 7 days before check-in."
          />
        </Section>

        <Section title="09. Profile row">
          <View className="rounded-2xl bg-surface-muted p-2">
            <ListGroup>
              <ListRow icon={User} label="Personal info" />
              <ListRow icon={CreditCard} label="Payment methods" />
              <ListRow icon={Luggage} label="Trips" />
            </ListGroup>
          </View>
        </Section>

        <Section title="10. Bottom navigation (glass tab bar)">
          <TabBar
            activeKey={tab}
            onSelect={setTab}
            items={[
              { key: "home", label: "Home", icon: House },
              { key: "search", label: "Search", icon: Search },
              { key: "trips", label: "Trips", icon: Calendar },
              { key: "profile", label: "Profile", icon: User },
            ]}
          />
        </Section>

        <Section title="11. Iconography">
          <View className="flex-row flex-wrap gap-3">
            {[House, Search, Heart, Calendar, User, Settings, MapPin, SlidersHorizontal].map((glyph, i) => (
              <View key={i} className="size-12 items-center justify-center rounded-full border border-border">
                <Icon as={glyph} />
              </View>
            ))}
          </View>
        </Section>

        <Section title="12. Segmented control">
          <SegmentedControl
            value={view}
            onChange={setView}
            segments={[
              { value: "list", label: "List", icon: List },
              { value: "map", label: "Map", icon: Map },
            ]}
          />
        </Section>

        <Section title="13. Toggles / Steppers">
          <View className="flex-row items-center gap-6">
            <Toggle value={instantBook} onValueChange={setInstantBook} accessibilityLabel="Instant book" />
            <Stepper label="Guests" value={guests} onChange={setGuests} min={1} max={16} />
          </View>
        </Section>

        <Section title="14. Status / Alerts">
          {alerts.success ? (
            <Alert
              tone="success"
              message="Account created successfully"
              onDismiss={() => setAlerts((a) => ({ ...a, success: false }))}
            />
          ) : null}
          {alerts.danger ? (
            <Alert
              tone="danger"
              message="Something went wrong. Please try again."
              onDismiss={() => setAlerts((a) => ({ ...a, danger: false }))}
            />
          ) : null}
        </Section>

        <Section title="15. Tags / Badges">
          <View className="flex-row flex-wrap gap-3">
            <Tag tone="favorite" label="Guest favorite" />
            <Tag tone="success" label="New" />
            <Tag tone="danger" label="20% off" />
            <Tag tone="info" label="Superhost" />
          </View>
        </Section>
      </ScrollView>
    </>
  );
}
