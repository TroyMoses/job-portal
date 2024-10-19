import React from "react";
import { BiMoney } from "react-icons/bi";
import { FaMapLocation, FaRegBookmark } from "react-icons/fa6";
import { Doc } from "../../../convex/_generated/dataModel";

interface Props {
  job: Doc<"jobs">;
}

const JobCard = ({ job }: Props) => {
  return (
    <div className="p-4 mb-6 relative border-2 cursor-pointer hover:scale-110 hover:shadow-sm transition-all duration-300 border-gray-500 rounded-lg border-opacity-10">
      <div className="flex items-center space-x-6">
        {/* Image */}
        <div>
          Simple Image
        </div>
        {/* Content */}
        <div>
          <h1 className="text-[17px] font-semibold mb-[0.4rem]">
            {job?.title}
          </h1>
          <div className="flex items-center md:space-x-10 space-x-4">
            {/* Location */}
            <div className="flex items-center space-x-2">
              <FaMapLocation className="w-[0.8rem] h-[0.8rem] text-pink-700" />
              <p className="text-[14px] text-black font-semibold text-opacity-60">
                Sth like location
              </p>
            </div>
            {/* Salary */}
            <div className="flex items-center space-x-2">
              <BiMoney className="w-[0.8rem] h-[0.8rem] text-pink-700" />
              <p className="text-[14px] text-black font-semibold text-opacity-60">
                {job?.salaryScale}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 mt-[1rem]">
            <div className="text-[10px] sm:text-[14px] text-black font-semibold text-opacity-80 px-3 sm:px-6 py-1 rounded-full bg-opacity-30 capitalize bg-green-400">
                Something here
            </div>
            <div className="text-[10px] sm:text-[14px] text-black font-semibold text-opacity-80 px-3 sm:px-6 py-1 rounded-full bg-opacity-30 capitalize bg-red-400">
                Private
            </div>
            <div className="text-[10px] sm:text-[14px] text-black font-semibold text-opacity-80 px-3 sm:px-6 py-1 rounded-full bg-opacity-30 capitalize bg-blue-400">
                Urgent
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-[1rem] right-[1rem]">
        <FaRegBookmark className="w-[1rem] h-[1rem]" />
      </div>
    </div>
  );
};

export default JobCard;
