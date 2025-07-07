"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Atur icon default leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

// Dynamic import
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

// Tipe koordinat
type LatLngTuple = [number, number];

interface NewPoint {
  lat: string;
  lng: string;
}

interface Config {
  maxStops: number;
  considerTravelTime: boolean;
  priorityAreas: string;
}

export default function RouteOptimizationSection() {
  const [config, setConfig] = useState<Config>({
    maxStops: 10,
    considerTravelTime: true,
    priorityAreas: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);

  const [routeCoordinates, setRouteCoordinates] = useState<LatLngTuple[]>([]);
  const [newPoint, setNewPoint] = useState<NewPoint>({ lat: "", lng: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPoint((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPoint = () => {
    const lat = parseFloat(newPoint.lat);
    const lng = parseFloat(newPoint.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setRouteCoordinates((prev) => [...prev, [lat, lng]]);
      setNewPoint({ lat: "", lng: "" });
    }
  };

  const handleRemovePoint = (index: number) => {
    setRouteCoordinates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateRoutes = () => {
    if (!config.priorityAreas.trim()) {
      alert("Mohon isi kolom Prioritas Area terlebih dahulu.");
      return;
    }
    const maxStops = parseInt(config.maxStops.toString());
    setRouteCoordinates((prev) => prev.slice(0, maxStops));
    setShowRoutes(true);
  };

  return (
    <section className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold">Optimasi Rute</h2>

      <div className="space-y-2">
        <p>Pengaturan Parameter:</p>
        <ul className="list-disc list-inside">
          <li>Jumlah pemberhentian maksimum per rute</li>
          <li>Pertimbangan waktu tempuh</li>
          <li>Pengaturan prioritas area tertentu</li>
        </ul>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Konfigurasikan Parameter Pengoptimalan
        </button>
        <button
          onClick={handleGenerateRoutes}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Lihat/Hasilkan Rute Dioptimalkan
        </button>
      </div>

      {showForm && (
        <div className="p-4 mt-4 border rounded bg-gray-50 dark:bg-neutral-800 space-y-4">
          <h3 className="font-semibold mb-2">Form Konfigurasi</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">
                Jumlah Maks. Pemberhentian
              </label>
              <input
                type="number"
                name="maxStops"
                value={config.maxStops}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="considerTravelTime"
                checked={config.considerTravelTime}
                onChange={handleChange}
              />
              <label className="text-sm">Pertimbangkan Waktu Tempuh</label>
            </div>
            <div>
              <label className="block text-sm mb-1">
                Prioritas Area (pisahkan dengan koma)
              </label>
              <input
                type="text"
                name="priorityAreas"
                value={config.priorityAreas}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <hr className="my-3" />

            <h4 className="font-semibold">Tambah Titik Koordinat</h4>
            <div className="flex gap-2">
              <input
                type="text"
                name="lat"
                placeholder="Latitude"
                value={newPoint.lat}
                onChange={handlePointChange}
                className="px-3 py-2 border rounded w-1/2"
              />
              <input
                type="text"
                name="lng"
                placeholder="Longitude"
                value={newPoint.lng}
                onChange={handlePointChange}
                className="px-3 py-2 border rounded w-1/2"
              />
              <button
                onClick={handleAddPoint}
                className="px-3 py-2 bg-blue-500 text-white rounded"
              >
                Tambah
              </button>
            </div>

            <ul className="list-decimal list-inside text-sm mt-2">
              {routeCoordinates.map((coord, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>
                    {coord[0].toFixed(5)}, {coord[1].toFixed(5)}
                  </span>
                  <button
                    onClick={() => handleRemovePoint(idx)}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showRoutes && (
        <div className="p-4 mt-4 border rounded bg-gray-50 dark:bg-neutral-800">
          <h3 className="font-semibold mb-2">Rute Dioptimalkan</h3>
          <p className="text-sm mb-2">Hasil simulasi dengan peta:</p>
          <MapContainer
            center={routeCoordinates[0] || [-7.42428, 109.23963]}
            zoom={13}
            scrollWheelZoom={false}
            className="h-64 w-full rounded"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {routeCoordinates.map((pos, idx) => (
              <Marker key={idx} position={pos} />
            ))}
            <Polyline positions={routeCoordinates} color="blue" />
          </MapContainer>
        </div>
      )}
    </section>
  );
}
