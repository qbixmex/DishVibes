const PHONE = '+1 232-555-1232';
const EMAIL = 'contact@dishvibes.com';

export const CONTACT_INFO = {
  name: 'Dish Vibes',
  phone: PHONE,
  phoneHref: `tel:${PHONE.replace(/[^\d+]/g, '')}`,
  email: EMAIL,
  emailHref: `mailto:${EMAIL}`,
  address: '900 Granville Street, Vancouver, British Columbia.',
  coordinates: {
    lat: 49.2800971,
    lng: -123.121444,
  },
} as const;

export const DIRECTIONS_URL =
  `https://www.google.com/maps/dir/?api=1&destination=${CONTACT_INFO.coordinates.lat},${CONTACT_INFO.coordinates.lng}`;

export const LARGER_MAP_URL =
  `https://www.openstreetmap.org/?mlat=${CONTACT_INFO.coordinates.lat}&mlon=${CONTACT_INFO.coordinates.lng}#map=17/${CONTACT_INFO.coordinates.lat}/${CONTACT_INFO.coordinates.lng}`;
