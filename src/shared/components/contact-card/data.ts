import type { LucideIcon } from 'lucide-react';
import { AtSign, MapPin, Phone } from 'lucide-react';
import { CONTACT_INFO } from '@/shared/data/contact';

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
    value: CONTACT_INFO.phone,
    icon: Phone,
  },
  {
    id: 'x067',
    label: 'Email',
    value: CONTACT_INFO.email,
    icon: AtSign,
  },
  {
    id: '6u2v',
    label: 'Address',
    value: CONTACT_INFO.address,
    icon: MapPin,
  },
];
