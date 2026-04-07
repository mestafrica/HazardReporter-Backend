
import React from 'react';
import Map from '../components/Map';

const MapPage: React.FC = () => {
  return (
    <div className="flex h-screen">

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 ">
          <Map />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
