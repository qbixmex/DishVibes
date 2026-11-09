import { CONTACT_INFO } from '@/shared/data/contact';

export const MAP_ZOOM = 16;
export const MAP_MAX_ZOOM = 19;

export const MAP_POSITION: [number, number] = [
  CONTACT_INFO.coordinates.lat,
  CONTACT_INFO.coordinates.lng,
];

export const MAP_TILE_URL =
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
