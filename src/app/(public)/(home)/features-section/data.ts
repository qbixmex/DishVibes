import { ChefHat, Leaf, Motorbike } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Feature = {
  id: string;
  heading: string;
  description: string;
  icon: LucideIcon;
};

export const features: Feature[] = [
  {
    id: 'r84k',
    heading: 'Add to order',
    description: 'Select your items then add to order.',
    icon: Leaf,
  },
  {
    id: 'v6n3',
    heading: 'Cook to order',
    description: 'Our cookers start preparing your order.',
    icon: ChefHat,
  },
  {
    id: 'b4s9',
    heading: 'Deliver on time',
    description: 'We pack carefully your items for delivery.',
    icon: Motorbike,
  },
];
