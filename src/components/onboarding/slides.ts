export type OnboardingSlide = {
  key: string;
  /** Sample label for the stock photo, not where it was taken. */
  location: string;
  heading: string;
  body: string;
  imageUrl: string;
};

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80`;

export const slides: OnboardingSlide[] = [
  {
    key: "find",
    location: "Whistler, BC",
    heading: "Find a stay that fits your story",
    body: "From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip.",
    imageUrl: unsplash("1510798831971-661eb04b3739"),
  },
  {
    key: "describe",
    location: "Tulum, Mexico",
    heading: "Describe it, we'll find it",
    body: "Tell us what you want in one sentence, like a quiet pet friendly cabin with a hot tub, and get stays ranked for you.",
    imageUrl: unsplash("1499793983690-e29da59ef1c2"),
  },
  {
    key: "ask",
    location: "Palm Springs, CA",
    heading: "Answers straight from the stay",
    body: "Ask about check-in, pets or cancellation and see the house rules and policies word for word.",
    imageUrl: unsplash("1613490493576-7fde63acd811"),
  },
];
