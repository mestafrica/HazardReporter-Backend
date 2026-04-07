import React, { useState } from "react";
import profilePic from "../assets/images/profile.png";
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ASSETS } from "../assets/assets";
import HazardForm from "./HazardForm";
import SubmitButton from "./SubmitButton";

type PostHazzardReportUiProps = {
  onSuccess: () => void; // 👈 accept callback from parent
};

const PostHazzardReportUi: React.FC<PostHazzardReportUiProps> = ({
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="">
        <div className="flex-col w-[92%] mx-auto space-y-3 pt-6 pb-4">
          <div className="flex items-center justify-center gap-x-5">
            {/* Start Avatar Section */}

            <div className="w-[45px] h-[45px] overflow-hidden rounded-full">
              <img
                src={profilePic}
                alt="profile picture"
                className="h-[100%] w-[100%]"
              />
            </div>
            <div className="w-[95%] h-auto">
              <textarea
                className="w-[100%] h-[40px] text-[1rem] py-2 px-[20px] rounded-full bg-[#F2F2F2] font-[#B3b3b3] focus:outline-none"
                placeholder="type here"
                onClick={() => setIsOpen(true)}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-between items-center w-[91%] ml-auto">
            {/* div for icons */}
            <div>
              <div id="icons" className="flex gap-x-[1.5rem]">
                <img
                  src={ASSETS.icons.imageIcon}
                  alt="image upload icon"
                  className="w-[20px]"
                />
                <img
                  src={ASSETS.icons.mapIcon}
                  alt="map icon"
                  className="w-[20px]"
                />
                <img
                  src={ASSETS.icons.paperClipIcon}
                  alt="attach file icon"
                  className="w-[20px]"
                />
                <img
                  src={ASSETS.icons.smileyFaceIcon}
                  alt="emotion icon"
                  className="w-[20px]"
                />
              </div>
            </div>
            {/* div for submit-button */}
            <div>
              <SubmitButton />
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        {/* Backdrop */}
        <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Centered container */}
        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
          <DialogPanel
            className="
        flex flex-col gap-y-4 bg-white rounded-2xl shadow-lg
        w-full max-w-3xl sm:w-[90%] md:w-[80%] lg:w-[60%]
        p-6 sm:p-8 md:p-10
        overflow-y-auto max-h-[95vh]
      "
          >
            {/* Header */}
            <div className="space-y-2 text-center sm:text-left">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                Report Environmental Hazards
              </DialogTitle>
              <Description className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Submit a report on pollution by providing details, photos, and
                location to help us track and address environmental concerns.
              </Description>
            </div>

            {/* Form */}
            <div className="w-full">
              <HazardForm
                onSuccess={() => {
                  setIsOpen(false); // Close modal
                  onSuccess(); // Re-fetch hazards
                }}
              />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default PostHazzardReportUi;
