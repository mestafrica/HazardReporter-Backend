"use client";

// import React, { useState } from "react";
import Swal from "sweetalert2";
import { apiNewHazardReporter } from "../services/api";
import SubmitButton from "./SubmitButton";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import type { LatLngExpression, LeafletMouseEvent } from "leaflet";
// import "leaflet/dist/leaflet.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

type HazardFormProps = {
  onSuccess: () => void;
};

// 🌍 Sub-component: Select location using OpenStreetMap
// function LocationPicker({
//   onLocationSelect,
// }: {
//   onLocationSelect: (address: string) => void;
// }) {
//   const [position, setPosition] = useState<[number, number] | null>(null);
//   const [address, setAddress] = useState<string>("");

//   function LocationMarker() {
//     useMapEvents({
//       click: async (e: LeafletMouseEvent) => {
//         const { lat, lng } = e.latlng;
//         setPosition([lat, lng]);

//         try {
//           // Reverse geocode with Nominatim API
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
//             {
//               headers: {
//                 "Accept-Language": "en",
//                 "User-Agent": "hazard-reporter-app/1.0 (contact@example.com)",
//               },
//             }
//           );
//           const data = await response.json();
//           const newAddress = data.display_name || "Unknown location";

//           setAddress(newAddress);
//           onLocationSelect(newAddress);
//         } catch (err) {
//           console.error("Reverse geocoding failed:", err);
//           setAddress("Unknown location");
//           onLocationSelect("Unknown location");
//         }
//       },
//     });

//     return position ? <Marker position={position as LatLngExpression} /> : null;
//   }

//   const center: LatLngExpression = [5.6037, -0.187]; // Accra

//   return (
//     <div className="flex flex-col gap-2">
//       <div className="h-64 w-full rounded-lg overflow-hidden">
//         <MapContainer center={center} zoom={13} className="h-full w-full z-0">
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <LocationMarker />
//         </MapContainer>
//       </div>

//       {address && (
//         <p className="text-sm text-gray-700 mt-1">
//           📍 <span className="font-medium">Selected:</span> {address}
//         </p>
//       )}
//     </div>
//   );
// }

// 🌿 Main Hazard Form
export default function HazardForm({ onSuccess }: HazardFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // const [location, setLocation] = useState<string>("");
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    toast.success("Kindly Login to report hazard", {
      position: "top-right",
      autoClose: 1500,
    });
    setTimeout(() => navigate("/login"), 1500);
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      // formData.append("location", location);

      await apiNewHazardReporter(formData);
      onSuccess();

      Swal.fire({
        icon: "success",
        title: "Hazard Reported Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Report Hazard",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="space-y-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title + Hazard Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="hazardtype"
                className="block text-sm font-medium text-gray-700"
              >
                Select Hazard Type
              </label>
              <select
                id="hazardtype"
                name="hazardtype"
                className="mt-1 block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select from list</option>
                <option value="environmental">Environmental</option>
                <option value="noise">Noise</option>
                <option value="accident">Accident</option>
                <option value="flood">Flood</option>
              </select>
            </div>
          </div>

          {/* Description + Upload */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Description */}
            <div className="flex-1">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe the hazard here"
                className="mt-1 block w-full h-40 sm:h-44 md:h-52
                px-6 py-4 border border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                rows={4}
                required
              ></textarea>
            </div>

            {/* Upload Images */}
            {/* Upload Images */}
            <div className="flex-1 flex flex-col">
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload Images
              </label>

              <label
                htmlFor="images"
                className="flex flex-col items-center justify-center 
      w-full h-40 sm:h-44 md:h-52
      px-6 py-4 border-2 border-dashed border-gray-300 rounded-md 
      shadow-sm cursor-pointer hover:border-blue-500 hover:text-blue-500 
      transition-colors duration-200"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-3xl text-gray-500">
                  +
                </span>
                <span className="mt-2 text-sm text-gray-500">
                  Click to upload
                </span>
              </label>

              <input
                type="file"
                id="images"
                name="images"
                className="hidden"
                required
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setSelectedFiles(files);
                }}
              />

              {/* Show selected files with remove option */}
              {selectedFiles.length > 0 && (
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>• {file.name}</span>
                      <button
                        type="button"
                        className="text-red-500 ml-3"
                        onClick={() => {
                          const newFiles = selectedFiles.filter(
                            (_, i) => i !== index
                          );
                          setSelectedFiles(newFiles);

                          // update the input's FileList
                          const dt = new DataTransfer();
                          newFiles.forEach((f) => dt.items.add(f));
                          const input = document.getElementById(
                            "images"
                          ) as HTMLInputElement;
                          if (input) input.files = dt.files;
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Country + City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
