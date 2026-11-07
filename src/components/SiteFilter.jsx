import { settings } from "../data/settings";

// Un filtro CSS directo sobre <html> o <body> rompería los elementos con
// position: fixed (música, ventanas emergentes, sobre de la intro). Por eso
// el filtro se aplica con una capa transparente que filtra lo que hay detrás:
// cubre absolutamente todo (mapa, fotos, video, modales) y no bloquea toques.
const FILTERS = {
  sepia: "sepia(0.6) saturate(0.7) brightness(0.97)",
  grayscale: "grayscale(1) brightness(0.85) contrast(1.06)",
};

export default function SiteFilter() {
  const value = FILTERS[settings.siteFilter];
  if (!value) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        pointerEvents: "none",
        backdropFilter: value,
        WebkitBackdropFilter: value,
      }}
    />
  );
}
