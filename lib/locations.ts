export type Location = {
  id: string;
  name: string;
  address: string;
  zip: string;
  city: string;
  lat: number;
  lng: number;
  hours: string;
};

export const LOCATIONS: Location[] = [
  {
    id: 'labege',
    name: 'Wash&eat Labège',
    address: 'Centre commercial Labège 2',
    zip: '31670',
    city: 'Labège',
    lat: 43.5449,
    lng: 1.5088,
    hours: 'Ouvert 24h/24 · 7/7',
  },
];

export function mapsDir(l: Location): string {
  const q = encodeURIComponent(`${l.name}, ${l.address}, ${l.zip} ${l.city}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}
