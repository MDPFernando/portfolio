"use client";

import dynamic from "next/dynamic";

const LocationGlobeCanvas = dynamic(
  () => import("./LocationGlobeCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[260px] md:min-h-[320px] flex items-center justify-center">
        <div className="w-24 h-24 rounded-full border border-dashed border-accent-cyan/35 animate-spin" />
      </div>
    ),
  }
);

/**
 * LocationGlobe lazy loads the 3D grid Earth and beacon pin, ensuring
 * that Three.js does not impact initially served page sizes.
 */
export default function LocationGlobe() {
  return <LocationGlobeCanvas />;
}
