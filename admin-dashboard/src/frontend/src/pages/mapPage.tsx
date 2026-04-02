
import React from 'react';
import Map from '../components/Map';
import Navbar from '../components/Navbar';
import Sidebar  from '../components/Sidebar';

const MapPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      <div>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <div>
          <Navbar />
        </div>

        <div className="flex-1 p-6 ">
          <Map />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
