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
            <h1 className="text-[28px] sm:text-[35px] lg:text-[40px] text-[#05264e] leading-[3rem] lg:leading-[4rem] font-extrabold">
              Kakumiro District Local Government
            </h1>
            <h2 className="text-[18px] sm:text-[35px] lg:text-[40px] text-[#05264e] leading-[3rem]">
              Application Guidelines
            </h2>
            <ApplicationGuidelines />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
