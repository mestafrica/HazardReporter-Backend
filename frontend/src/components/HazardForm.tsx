import React from "react";
import Swal from "sweetalert2";
import CoordinatesAndLocation from "./CoordinatesAndLocation";

type HazardFormProps = Readonly<{
  onSuccess: () => void;
}>;

import { apiNewHazardReporter } from "../services/api";
import SubmitButton from "./SubmitButton";


export default function HazardForm(props: HazardFormProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

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
        text: "Something went wrong!",
      });
    }
  };

  const [locationData, setLocationData] = React.useState({
  latitude: "",
  longitude: "",
  city: "",
  country: "",
});

  return (
    <div className="flex flex-col">
      <div className=" space-y-10">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-x-4 grid-cols-2">
            <div className="">
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
              {/* Label text above */}
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload Images
              </label>

              {/* Upload box */}
              <label
                htmlFor="images"
                className="flex flex-col items-center justify-center w-full px-32 py-6
               border-2 border-dashed border-gray-300 rounded-md shadow-sm 
               cursor-pointer hover:border-blue-500 hover:text-blue-500 "
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-3xl text-gray-500">+</span>
              
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
                value={locationData.country}
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
