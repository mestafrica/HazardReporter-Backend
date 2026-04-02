import { Hazard } from "../data/hazard";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";

const GOOGLE_MAP_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const HazardMap = ({ hazards }: { hazards: Hazard[] }) => {
  const center: google.maps.LatLngLiteral = {
    lat: hazards[0].location.latitude,
    lng: hazards[0].location.longitude,
  };
  return (
    <div className="w-full h-[450px] rounded-lg shadow-md">
      <APIProvider apiKey={GOOGLE_MAP_API_KEY}>
        <Map defaultCenter={center} defaultZoom={10} mapId="DEMO_MAP_ID">
          {hazards.map((hazard) => (
            <AdvancedMarker
              position={{
                lat: hazard.location.latitude,
                lng: hazard.location.longitude,
              }}
              key={hazard.id}
              title={hazard.title}
            />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
};

export default HazardMap;
