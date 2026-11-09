'use client';

import type { FC } from 'react';
import dynamic from 'next/dynamic';
import { ExternalLink, Navigation } from 'lucide-react';
import {
  CONTACT_INFO,
  DIRECTIONS_URL,
  LARGER_MAP_URL,
} from '@/shared/data/contact';
import styles from './styles.module.css';

const LeafletMap = dynamic(
  () => import('./leaflet-map').then((module) => module.LeafletMap),
  {
    ssr: false,
    loading: () => <div className={styles.loading} aria-hidden="true" />,
  },
);

export const LocationMap: FC = () => {
  return (
    <section className={styles.section} aria-labelledby="location-map-heading">
      <header className={styles.header}>
        <h2 id="location-map-heading" className={styles.heading}>
          Find <span>Us</span>
        </h2>
        <p className={styles.address}>{CONTACT_INFO.address}</p>
      </header>

      <LeafletMap />

      <div className={styles.actions}>
        <a
          className={styles.directions}
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Navigation aria-hidden="true" />
          Get directions
        </a>
        <a
          className={styles.largerMap}
          href={LARGER_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink aria-hidden="true" />
          View larger map
        </a>
      </div>
    </section>
  );
};
