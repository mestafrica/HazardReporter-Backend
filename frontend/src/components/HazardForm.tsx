import React, { useState } from "react";
import Swal from "sweetalert2";
import { apiNewHazardReporter } from "../services/api";
import SubmitButton from "./SubmitButton";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CoordinatesAndLocation from "./CoordinatesAndLocation";

type HazardFormProps = Readonly<{
  onSuccess: () => void;
}>;

// 🌿 Main Hazard Form
export default function HazardForm({ onSuccess }: HazardFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

      await apiNewHazardReporter(formData);
      onSuccess();

      Swal.fire({
        icon: "success",
        title: "Hazard Reported Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Failed to report hazard:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Report Hazard",
        text: "Something went wrong!",
      });
    }
  };

  const [locationData, setLocationData] = useState({
    latitude: "",
    longitude: "",
    city: "",
    country: "",
  });

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

          <div className="grid gap-x-4 grid-cols-2">
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
                value={locationData.country}
                readOnly
                className="mt-1 w-full px-3 py-2 mb-4 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none sm:text-sm"
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
                value={locationData.city}
                readOnly
                className="mt-1 block w-full px-3 py-2 mb-4 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none sm:text-sm"
                required
              />
            </div>
          </div>
          <div className="w-full">

          <div className="mb-4">
           <CoordinatesAndLocation
              onSelect={(
              lat: string,
              lng: string,
              city: string,
              country: string
            ) =>
            setLocationData({
            latitude: lat,
            longitude: lng,
            city,
            country,
    })
  }
/>
          </div>

        <input type="hidden" name="latitude" value={locationData.latitude} />
        <input type="hidden" name="longitude" value={locationData.longitude} />
          </div>
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
