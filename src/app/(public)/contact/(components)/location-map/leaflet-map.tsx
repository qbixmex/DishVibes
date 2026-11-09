'use client';

import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import L from 'leaflet';
import { cn } from '@/lib/utils';
import { CONTACT_INFO } from '@/shared/data/contact';
import {
  MAP_ATTRIBUTION,
  MAP_MAX_ZOOM,
  MAP_POSITION,
  MAP_TILE_URL,
  MAP_ZOOM,
} from './map-config';
import styles from './styles.module.css';
import 'leaflet/dist/leaflet.css';

const MARKER_ICON_SIZE: [number, number] = [36, 44];
const MARKER_ICON_ANCHOR: [number, number] = [18, 42];
const MARKER_POPUP_ANCHOR: [number, number] = [0, -38];

export const LeafletMap: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const map = L.map(container, {
      center: MAP_POSITION,
      zoom: MAP_ZOOM,
      scrollWheelZoom: false,
    });

    L.tileLayer(MAP_TILE_URL, {
      attribution: MAP_ATTRIBUTION,
      maxZoom: MAP_MAX_ZOOM,
    }).addTo(map);

    const marker = L.marker(MAP_POSITION, {
      icon: L.divIcon({
        className: styles.marker,
        html: '<span></span>',
        iconSize: MARKER_ICON_SIZE,
        iconAnchor: MARKER_ICON_ANCHOR,
        popupAnchor: MARKER_POPUP_ANCHOR,
      }),
      alt: `${CONTACT_INFO.name} location`,
      title: `${CONTACT_INFO.name} location`,
    });

    marker.addTo(map);
    marker.bindPopup(
      `<strong>${CONTACT_INFO.name}</strong><br />${CONTACT_INFO.address}`,
    );

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      className={cn(styles.mapWrapper, { [styles.dark]: isDark })}
      role="region"
      aria-label="Map showing the Dish Vibes location"
    >
      <div ref={containerRef} className={styles.map} />
    </div>
  );
};
