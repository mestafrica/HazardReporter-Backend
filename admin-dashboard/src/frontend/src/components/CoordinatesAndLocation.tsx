import ReactGoogleAutocomplete from "react-google-autocomplete";
import { mapApiKey } from "../services/config";

const CoordinatesAndLocation = () => {
  return (
    <div className="w-[100vw] h-auto flex justify-center items-center py-[40px]">
      <label htmlFor=""></label>
      <ReactGoogleAutocomplete
        apiKey={mapApiKey}
        onPlaceSelected={(place) => {
          console.log(place);
        }}
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "10px",
          width: "100%",
          maxWidth: "500px",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};

export default CoordinatesAndLocation;
