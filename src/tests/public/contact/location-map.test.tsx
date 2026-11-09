import type { ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import { LocationMap } from '@/app/(public)/contact/(components)/location-map';
import { LeafletMap } from '@/app/(public)/contact/(components)/location-map/leaflet-map';
import {
  MAP_MAX_ZOOM,
  MAP_TILE_URL,
  MAP_ZOOM,
} from '@/app/(public)/contact/(components)/location-map/map-config';
import styles from '@/app/(public)/contact/(components)/location-map/styles.module.css';
import {
  CONTACT_INFO,
  DIRECTIONS_URL,
  LARGER_MAP_URL,
} from '@/shared/data/contact';

const { mockUseTheme, mockDivIcon } = vi.hoisted(() => ({
  mockUseTheme: vi.fn(),
  mockDivIcon: vi.fn(() => ({ icon: true })),
}));

vi.mock('next/dynamic', () => ({
  default: () => () => <div data-testid="leaflet-map" />,
}));

vi.mock('next-themes', () => ({
  useTheme: mockUseTheme,
}));

vi.mock('leaflet', () => ({
  default: {
    divIcon: mockDivIcon,
  },
}));

vi.mock('react-leaflet', () => ({
  MapContainer: ({
    children,
    center,
    zoom,
  }: {
    children: ReactNode;
    center: [number, number];
    zoom: number;
  }) => (
    <div
      data-testid="map-container"
      data-lat={center[0]}
      data-lng={center[1]}
      data-zoom={zoom}
    >
      {children}
    </div>
  ),
  TileLayer: ({
    url,
    maxZoom,
  }: {
    url: string;
    maxZoom?: number;
  }) => (
    <div
      data-testid="tile-layer"
      data-url={url}
      data-max-zoom={maxZoom}
    />
  ),
  Marker: ({ children, alt }: { children: ReactNode; alt?: string }) => (
    <div data-testid="marker" data-alt={alt}>
      {children}
    </div>
  ),
  Popup: ({ children }: { children: ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
}));

describe('Test on <LocationMap /> component', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'light' });
  });

  test('Should render the heading and address', () => {
    render(<LocationMap />);

    expect(
      screen.getByRole('heading', { level: 2, name: /find us/i }),
    ).toBeVisible();
    expect(screen.getByText(CONTACT_INFO.address)).toBeVisible();
  });

  test('Should render the lazily loaded map', () => {
    render(<LocationMap />);

    expect(screen.getByTestId('leaflet-map')).toBeVisible();
  });

  test('Should render the directions and larger map links', () => {
    render(<LocationMap />);

    const directions = screen.getByRole('link', {
      name: /get directions/i,
    });
    const largerMap = screen.getByRole('link', {
      name: /view larger map/i,
    });

    expect(directions).toHaveAttribute('href', DIRECTIONS_URL);
    expect(directions).toHaveAttribute('target', '_blank');
    expect(largerMap).toHaveAttribute('href', LARGER_MAP_URL);
    expect(largerMap).toHaveAttribute('target', '_blank');
  });

  test('Should render every icon as decorative', () => {
    const { container } = render(<LocationMap />);

    const icons = container.querySelectorAll('svg');

    expect(icons).toHaveLength(2);

    icons.forEach((icon) => {
      expect(icon).toBeVisible();
    });
  });
});

describe('Test on <LeafletMap /> component', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'light' });
  });

  test('Should center the map on the restaurant location', () => {
    render(<LeafletMap />);

    const container = screen.getByTestId('map-container');

    expect(container).toHaveAttribute(
      'data-lat',
      String(CONTACT_INFO.coordinates.lat),
    );
    expect(container).toHaveAttribute(
      'data-lng',
      String(CONTACT_INFO.coordinates.lng),
    );
    expect(container).toHaveAttribute('data-zoom', String(MAP_ZOOM));
    expect(
      screen.getByRole('region', {
        name: /map showing the dish vibes location/i,
      }),
    ).toBeVisible();
  });

  test('Should render the OpenStreetMap tiles', () => {
    render(<LeafletMap />);

    const tileLayer = screen.getByTestId('tile-layer');

    expect(tileLayer).toHaveAttribute('data-url', MAP_TILE_URL);
    expect(tileLayer).toHaveAttribute(
      'data-max-zoom',
      String(MAP_MAX_ZOOM),
    );
  });

  test('Should render the marker with the restaurant popup', () => {
    render(<LeafletMap />);

    const marker = screen.getByTestId('marker');

    expect(marker).toHaveAttribute(
      'data-alt',
      `${CONTACT_INFO.name} location`,
    );

    const popup = within(screen.getByTestId('popup'));

    expect(popup.getByText(CONTACT_INFO.name)).toBeVisible();
    expect(popup.getByText(CONTACT_INFO.address)).toBeVisible();
  });

  test('Should not apply the dark filter in the light theme', () => {
    render(<LeafletMap />);

    const region = screen.getByRole('region', {
      name: /map showing the dish vibes location/i,
    });

    expect(region).not.toHaveClass(styles.dark);
  });

  test('Should apply the dark filter in the dark theme', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'dark' });

    render(<LeafletMap />);

    const region = screen.getByRole('region', {
      name: /map showing the dish vibes location/i,
    });

    expect(region).toHaveClass(styles.dark);
  });

  test('Should create a custom marker icon', () => {
    render(<LeafletMap />);

    expect(mockDivIcon).toHaveBeenCalledWith(
      expect.objectContaining({
        iconSize: [36, 44],
        iconAnchor: [18, 42],
      }),
    );
  });
});
