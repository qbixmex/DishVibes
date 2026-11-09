import type { LucideIcon } from "lucide-react";
import { AtSign, MapPin, Phone } from 'lucide-react';

type Detail = {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
};

export const contactDetails: Detail[] = [
  {
    id: '408b',
    label: 'Phone',
    value: '+1 232-555-1232',
    icon: Phone,
  },
  {
    id: 'x067',
    label: 'Email',
    value: 'contact@dishvibes.com',
    icon: AtSign,
  },
  {
    id: '6u2v',
    label: 'Address',
    value: '900 Ganville Street, Vancouver, British Columbia.',
    icon: MapPin,
  },
];
