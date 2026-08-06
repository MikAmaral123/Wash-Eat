'use client';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { LOCATIONS } from '@/lib/locations';

export default function AddressMap({ activeId }: { activeId?: string }) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !elRef.current || mapRef.current) return;

      const first = LOCATIONS[0];
      const map = L.map(elRef.current, { scrollWheelZoom: false, zoomControl: true })
        .setView([first.lat, first.lng], 14);
      mapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(map);

      const icon = L.divIcon({
        className: 'map-pin-wrap',
        html: '<span class="map-pin"></span>',
        iconSize: [30, 40],
        iconAnchor: [15, 36],
        popupAnchor: [0, -34],
      });

      LOCATIONS.forEach((l) => {
        L.marker([l.lat, l.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${l.name}</b><br>${l.address}<br>${l.zip} ${l.city}`);
      });

      setTimeout(() => map.invalidateSize(), 120);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Recenter when a card is focused
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeId) return;
    const l = LOCATIONS.find((x) => x.id === activeId);
    if (l) map.flyTo([l.lat, l.lng], 15, { duration: 0.6 });
  }, [activeId]);

  return <div ref={elRef} className="adr-map" />;
}
