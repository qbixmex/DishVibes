'use client';

import type { FC } from 'react';
import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { cn } from 'cn';
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

export const LeafletMap: FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: styles.marker,
        html: '<span></span>',
        iconSize: [36, 44],
        iconAnchor: [18, 42],
        popupAnchor: [0, -38],
      }),
    [],
  );

  return (
    <div
      className={cn(styles.mapWrapper, { [styles.dark]: isDark })}
      role="region"
      aria-label="Map showing the Dish Vibes location"
    >
      <MapContainer
        center={MAP_POSITION}
        zoom={MAP_ZOOM}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          url={MAP_TILE_URL}
          attribution={MAP_ATTRIBUTION}
          maxZoom={MAP_MAX_ZOOM}
        />
        <Marker
          position={MAP_POSITION}
          icon={markerIcon}
          alt={`${CONTACT_INFO.name} location`}
          title={`${CONTACT_INFO.name} location`}
        >
          <Popup>
            <strong>{CONTACT_INFO.name}</strong>
            <br />
            {CONTACT_INFO.address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
