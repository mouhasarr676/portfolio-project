import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../utils/leafletIcons';

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * Carte cliquable : clique n'importe où pour placer/déplacer le marqueur.
 * lat/lng = position actuelle (peut être vide au premier chargement).
 */
export default function LocationPicker({ lat, lng, onChange }) {
  const hasPosition = typeof lat === 'number' && typeof lng === 'number' && !Number.isNaN(lat);
  const center = hasPosition ? [lat, lng] : [14.7167, -17.4677]; // Dakar par défaut

  return (
    <div>
      <label className="mb-1.5 block text-xs text-slate-500">
        Localisation — clique sur la carte pour placer le repère
      </label>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <MapContainer center={center} zoom={hasPosition ? 13 : 11} style={{ height: '260px', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={onChange} />
          {hasPosition && <Marker position={[lat, lng]} />}
        </MapContainer>
      </div>
      {hasPosition && (
        <p className="mt-1.5 text-xs text-slate-600">
          {lat.toFixed(5)}, {lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}