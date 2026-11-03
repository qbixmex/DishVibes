import type { LucideIcon } from 'lucide-react';

export interface Inquiry {
  id: string;
  query: string;
  answer: string;
  icon: LucideIcon;
}
