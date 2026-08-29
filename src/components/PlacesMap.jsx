import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { places } from "../data/content";

// Ícono de pin personalizado (evita el problema clásico de Leaflet+bundlers
// con las imágenes por defecto, y de paso combina con la paleta del sitio).
const pinIcon = new L.DivIcon({
  className: "",
  html: `
    <svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 0C5.8 0 0 5.8 0 13c0 9.75 13 21 13 21s13-11.25 13-21C26 5.8 20.2 0 13 0z" fill="#A2314A"/>
      <circle cx="13" cy="13" r="5" fill="#FBF1EC"/>
    </svg>`,
  iconSize: [26, 34],
  iconAnchor: [13, 34],
  popupAnchor: [0, -30],
});

// Acomoda el mapa para que se vean todos los pines, sin tener que calcular
// centro/zoom a mano en content.js cada vez que se agrega uno.
function AjustarVista({ pins }) {
  const map = useMap();

  useEffect(() => {
    if (!pins || pins.length === 0) return;
    if (pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], places.zoom);
      return;
    }
    const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [map, pins]);

  return null;
}

export default function PlacesMap() {
  return (
    <section className="section" style={{ paddingTop: 10 }}>
      <div className="card" style={{ padding: 20 }}>
        <p className="eyebrow">{places.eyebrow}</p>
        <h2 className="section-title" style={{ marginBottom: 16, fontSize: 22 }}>
          {places.title}
        </h2>
        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--card-line)" }}>
          <MapContainer
            center={[places.centerLat, places.centerLng]}
            zoom={places.zoom}
            scrollWheelZoom={false}
            style={{ height: 280, width: "100%" }}
          >
            {/* Tiles estándar de OpenStreetMap: gratis, sin cuenta ni API key. */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <AjustarVista pins={places.pins} />
            {places.pins.map((pin, i) => (
              <Marker key={i} position={[pin.lat, pin.lng]} icon={pinIcon}>
                <Popup>{pin.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
