import React from "react";
import HeroImg from "../../../public/hero.svg";
import Image from "next/image";
import ApplicationGuidelines from "../Guidelines";

const Hero = () => {
  return (
    <div className="pt-[5rem] pb-[3rem]">
      <div className="w-[100%] h-[60vh] justify-center">
        <div className="w-[80%] mx-auto items-center justify-center gap-[2rem]">
          {/* Content */}
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-[28px] sm:text-[35px] lg:text-[40px] text-[#05264e] leading-[3rem] lg:leading-[4rem] font-extrabold">
              Application Guidelines
            </h1>
            <ApplicationGuidelines />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
