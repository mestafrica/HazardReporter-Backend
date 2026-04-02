import React, { useState } from "react";
import profilePic from "../assets/images/postHazzardReportUi/profilePic.png";
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

const PostHazzardReportUi: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="">
        <div className="flex-col w-[92%] mx-auto space-y-3 pt-6 pb-4">
          <div className="flex items-center justify-center gap-x-5">
            {/* Start Avatar Section */}

            <div className="w-[45px] h-[45px] overflow-hidden">
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
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <DialogBackdrop className="fixed inset-0 bg-black/50" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex w-[90%] mx-auto items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <DialogPanel className=" flex flex-col gap-y-[1.5rem] space-y-4 bg-white p-12 rounded-[10px] w-[100%] max-w-3xl">
            <div>
              <DialogTitle className="text-[1.5rem] font-bold">
                Report Environmental Hazards
              </DialogTitle>
              <Description className="text-[#9B9B9B]">
                Submit report on pollution by providing details, photos, and <br />
                location to help us track and address environmental concerns{" "}
              </Description>
            </div>
            <div className="w-[100%]">
              <HazardForm onSuccess={() => setIsOpen(false)} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default PostHazzardReportUi;
