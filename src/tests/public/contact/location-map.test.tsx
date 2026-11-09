import { render, screen } from '@testing-library/react';
import { LocationMap } from '@/app/(public)/contact/(components)/location-map';
import { LeafletMap } from '@/app/(public)/contact/(components)/location-map/leaflet-map';
import {
  MAP_ATTRIBUTION,
  MAP_MAX_ZOOM,
  MAP_POSITION,
  MAP_TILE_URL,
  MAP_ZOOM,
} from '@/app/(public)/contact/(components)/location-map/map-config';
import styles from '@/app/(public)/contact/(components)/location-map/styles.module.css';
import {
  CONTACT_INFO,
  DIRECTIONS_URL,
  LARGER_MAP_URL,
} from '@/shared/data/contact';

const {
  mockUseTheme,
  mockMap,
  mockTileLayer,
  mockMarker,
  mockDivIcon,
  mockRemove,
  mockAddTileLayer,
  mockAddMarker,
  mockBindPopup,
} = vi.hoisted(() => {
  const mockRemove = vi.fn();
  const mockAddTileLayer = vi.fn();
  const mockAddMarker = vi.fn();
  const mockBindPopup = vi.fn();

  return {
    mockUseTheme: vi.fn(),
    mockRemove,
    mockAddTileLayer,
    mockAddMarker,
    mockBindPopup,
    mockMap: vi.fn(() => ({ remove: mockRemove })),
    mockTileLayer: vi.fn(() => ({ addTo: mockAddTileLayer })),
    mockMarker: vi.fn(() => ({
      addTo: mockAddMarker,
      bindPopup: mockBindPopup,
    })),
    mockDivIcon: vi.fn(() => ({ icon: true })),
  };
});

vi.mock('next/dynamic', () => ({
  default: () => () => <div data-testid="leaflet-map" />,
}));

vi.mock('next-themes', () => ({
  useTheme: mockUseTheme,
}));

vi.mock('leaflet', () => ({
  default: {
    map: mockMap,
    tileLayer: mockTileLayer,
    marker: mockMarker,
    divIcon: mockDivIcon,
  },
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

  test('Should create the map centered on the restaurant location', () => {
    render(<LeafletMap />);

    expect(
      screen.getByRole('region', {
        name: /map showing the dish vibes location/i,
      }),
    ).toBeVisible();
    expect(mockMap).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      {
        center: MAP_POSITION,
        zoom: MAP_ZOOM,
        scrollWheelZoom: false,
      },
    );
  });

  test('Should add the OpenStreetMap tiles to the map', () => {
    render(<LeafletMap />);

    const map = mockMap.mock.results[0].value;

    expect(mockTileLayer).toHaveBeenCalledWith(MAP_TILE_URL, {
      attribution: MAP_ATTRIBUTION,
      maxZoom: MAP_MAX_ZOOM,
    });
    expect(mockAddTileLayer).toHaveBeenCalledWith(map);
  });

  test('Should add the marker with the restaurant popup', () => {
    render(<LeafletMap />);

    const map = mockMap.mock.results[0].value;

    expect(mockMarker).toHaveBeenCalledWith(
      MAP_POSITION,
      expect.objectContaining({
        icon: { icon: true },
        alt: `${CONTACT_INFO.name} location`,
        title: `${CONTACT_INFO.name} location`,
      }),
    );
    expect(mockAddMarker).toHaveBeenCalledWith(map);
    expect(mockBindPopup).toHaveBeenCalledWith(
      `<strong>${CONTACT_INFO.name}</strong><br />${CONTACT_INFO.address}`,
    );
  });

  test('Should create a custom marker icon', () => {
    render(<LeafletMap />);

    expect(mockDivIcon).toHaveBeenCalledWith(
      expect.objectContaining({
        className: styles.marker,
        html: '<span></span>',
        iconSize: [36, 44],
        iconAnchor: [18, 42],
        popupAnchor: [0, -38],
      }),
    );
  });

  test('Should remove the map on unmount', () => {
    const { unmount } = render(<LeafletMap />);

    unmount();

    expect(mockRemove).toHaveBeenCalledTimes(1);
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
});
