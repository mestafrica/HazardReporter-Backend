import ReactGoogleAutocomplete from "react-google-autocomplete";
import { mapApiKey } from "../services/config";

type CoordinatesAndLocationProps = {
  onSelect: (
    lat: string,
    lng: string,
    city: string,
    country: string
  ) => void;
};

const CoordinatesAndLocation = ({
  onSelect,
}: CoordinatesAndLocationProps) => {
  return (
    <div className="w-full h-auto py-4">
      <ReactGoogleAutocomplete
        apiKey={mapApiKey}
        onPlaceSelected={(place) => {
          const latitude = place?.geometry?.location?.lat?.();
          const longitude = place?.geometry?.location?.lng?.();

          let city = "";
          let country = "";

          const addressComponents = place?.address_components || [];

          addressComponents.forEach((component) => {
            const types = component.types || [];

            if (
              types.includes("locality") ||
              types.includes("administrative_area_level_2")
            ) {
              city = component.long_name;
            }

            if (types.includes("country")) {
              country = component.long_name;
            }
          });

          if (latitude !== undefined && longitude !== undefined) {
            onSelect(
              String(latitude),
              String(longitude),
              city,
              country
            );
          }
        }}
        options={{
          types: ["geocode"],
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Search and pick a location"
      />
    </div>
  );
};

export default CoordinatesAndLocation;