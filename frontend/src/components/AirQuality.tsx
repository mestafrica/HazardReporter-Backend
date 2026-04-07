import {  WindIcon } from "lucide-react";
import { CiLocationOn } from "react-icons/ci";

export default function AirQuality() {
  return (
    <>
      <div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex">
          <div className="border-2 border-[#3edb00] w-1/5"></div>
        <div className="border-2 border-[#a1f77e] w-1/5"></div>
          <div className="border-2 border-[#ffe02f] w-1/5"></div>
          <div className="border-2 border-[#ffb3b2] w-1/5"></div>
          <div className="border-2 border-[#f84343] w-1/5"></div>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <WindIcon className="size-6"/>
              <div className="flex flex-col">
                <h2 className="font-semibold text-md">Air Quality</h2>
                <div className="flex items-center gap-1">
                  <CiLocationOn className="size-4" />
                  <span className="text-xs text-gray-500">
                    Your current Location
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="bg-yellow-300 p-2 rounded-md font-extrabold text-3xl">55</h2>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2">
          <span className="w-2 h-2 bg-black rounded-full"> </span>
          <span className="w-2 h-2 bg-gray-400 rounded-full"> </span>
          <span className="w-2 h-2 bg-gray-400 rounded-full"> </span>
          </div>
        </div>
      </div>
    </>
  );
}
