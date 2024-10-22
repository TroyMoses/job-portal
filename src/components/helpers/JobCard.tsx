import React from "react";
import { BiMoney } from "react-icons/bi";
import { FaMapLocation, FaRegBookmark } from "react-icons/fa6";
import { Doc } from "../../../convex/_generated/dataModel";

interface Props {
  job: Doc<"jobs">;
}

const JobCard = ({ job }: Props) => {
  return (
    <div className=" hover:bg-red-500 p-4 mb-6 relative border-2 cursor-pointer hover:scale-110 hover:shadow-sm transition-all duration-300 border-gray-500 rounded-lg border-opacity-10">
      <div className="items-center space-x-6">
        
        {/* Content */}
        <div>
          <h1 className="text-[20px] font-semibold mb-[0.4rem]">
            {job?.title}
          </h1>
          <div className="flex items-center md:space-x-10 space-x-4">
            
            {/* Salary */}
            <div className="flex items-center space-x-2">
              <BiMoney className="w-[0.8rem] h-[0.8rem] text-pink-700" />
              <p className="text-[14px] text-black font-semibold text-opacity-60">
                Salary Type: {job?.salaryScale}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
