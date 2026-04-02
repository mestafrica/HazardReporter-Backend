import Swal from "sweetalert2";
import React, { useState } from "react";
import axios from "axios";
import { apiNewHazardReporter } from "../services/api";
import SubmitButton from "./SubmitButton";

type HazardFormProps = {
  readonly onSuccess: () => void;
};

export default function HazardForm(props: HazardFormProps) {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const fetchCountryFromCity = async (cityValue: string) => {
    if (cityValue.trim().length < 3) {
      setCountry("");
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            city: cityValue,
            format: "json",
            addressdetails: 1,
            limit: 1,
          },
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.data.length > 0) {
        const address = response.data[0].address;
        setCountry(address?.country || "");
      } else {
        setCountry("");
      }
    } catch (error) {
      console.error("Error fetching country:", error);
      setCountry("");
    }
  };

  const handleCityChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setCity(value);
    await fetchCountryFromCity(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      formData.set("city", city);
      formData.set("country", country);

      await apiNewHazardReporter(formData);

      props.onSuccess();

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
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong!",
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="space-y-10">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-x-4 grid-cols-2">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="title"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full mt-1 px-3 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="hazardtype"
              >
                Select Hazard Type
              </label>
              <select
                id="hazardtype"
                name="hazardtype"
                className="mt-1 block w-full px-3 py-2 mb-4 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                defaultValue=""
              >
                <option value="" disabled className="text-[#B3B3B3]">
                  select from list
                </option>
                <option value="environmental">Environmental</option>
                <option value="noise">Noise</option>
                <option value="accident">Accident</option>
                <option value="flood">Flood</option>
              </select>
            </div>
          </div>

          <div className="w-full flex gap-x-4">
            <div className="w-[52%]">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe the hazard here"
                className="mt-1 block w-full px-3 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                rows={4}
                required
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload Images
              </label>

              <label
                htmlFor="images"
                className="flex flex-col items-center justify-center w-full px-32 py-6 border-2 border-dashed border-gray-300 rounded-md shadow-sm cursor-pointer hover:border-blue-500 hover:text-blue-500"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-3xl text-gray-500">
                  +
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
              />
            </div>
          </div>

          <div className="grid gap-x-4 grid-cols-2">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="country"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={country}
                readOnly
                className="mt-1 w-full px-3 py-2 mb-4 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="city"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={city}
                onChange={handleCityChange}
                className="mt-1 block w-full px-3 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="grid gap-x-4 grid-cols-2 mb-3">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="longitude"
              >
                Longitude
              </label>
              <input
                type="number"
                step="any"
                id="longitude"
                name="longitude"
                className="w-full mt-1 px-3 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="latitude"
              >
                Latitude
              </label>
              <input
                type="number"
                step="any"
                id="latitude"
                name="latitude"
                className="mt-1 block w-full px-3 py-2 mb-4 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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