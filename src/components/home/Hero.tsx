import React from "react";
import HeroImg from "../../../public/1234.png";
import Image from "next/image";
import ApplicationGuidelines from "../Guidelines";

const Hero = () => {
  return (
    <div className="pt-[5rem] pb-[3rem]">
      <div className="w-[100%] h-[60vh] justify-center">
        <div className="w-[80%] mx-auto items-center justify-center gap-[2rem]">
          {/* Content */}
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src={HeroImg}
              alt="Hero"
              width={50}
              height={50}
              className="w-[10%] h-[10%] rounded-full"
            />
            <h3 className="text-[16px] sm:text-[16px] text-center lg:text-[16px] text-[#05264e] leading-[3rem] lg:leading-[4rem] font-extrabold">
              Kakumiro District Local Government
              e-Human Resource Management System <span className="text-red-600" >(e-HRMS)</span>

            </h3>
            <h4 className="text-[16px] sm:text-[16px] lg:text-[16px] text-[#05264e] leading-[3rem]">
              Application Guidelines
            </h4>
            <ApplicationGuidelines />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
