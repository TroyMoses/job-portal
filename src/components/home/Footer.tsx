import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="pt-[5rem] pb-[3rem] bg-[#111111]">
      <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[3rem] items-start pb-[2rem] border-b-2 border-white border-opacity-10">

        {/* 1st part of footer */}
        <div>
          <h1 className="text-[24px] text-white mb-[1rem] font-bold uppercase">
            Jobify
          </h1>
          <p className="text-[14px] text-white text-opacity-70">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Exercitationem quibusdam magnam alias, doloribus vel eius
          </p>
          {/* Social icons */}
          <div className="mt-[1.5rem] flex items-center space-x-3">
            <div className="w-[2.4rem] h-[2.4rem] bg-blue-600 rounded-full flex items-center justify-center flex-col hover:scale-110 transition-all duration-300 cursor-pointer">
              <FaFacebook className="text-white" />
            </div>
            <div className="w-[2.4rem] h-[2.4rem] bg-sky-400 rounded-full flex items-center justify-center flex-col hover:scale-110 transition-all duration-300 cursor-pointer">
              <FaTwitter className="text-white" />
            </div>
            <div className="w-[2.4rem] h-[2.4rem] bg-red-600 rounded-full flex items-center justify-center flex-col hover:scale-110 transition-all duration-300 cursor-pointer">
              <FaYoutube className="text-white" />
            </div>
            <div className="w-[2.4rem] h-[2.4rem] bg-red-400 rounded-full flex items-center justify-center flex-col hover:scale-110 transition-all duration-300 cursor-pointer">
              <FaInstagram className="text-white" />
            </div>
          </div>
        </div>

        {/* 2nd part of footer */}
        <div>
          <h1 className="text-[22px] w-fit text-white font-semibold mb-[1.5rem]">
            About Us
          </h1>
          <p className="text-[15px] text-white text-opacity-30 hover:text-yellow-300 w-fit cursor-pointer mb-[0.7rem]">
            Job
          </p>
          <p className="text-[15px] text-white text-opacity-30 hover:text-yellow-300 w-fit cursor-pointer mb-[0.7rem]">
            Privacy
          </p>
          <p className="text-[15px] text-white text-opacity-30 hover:text-yellow-300 w-fit cursor-pointer mb-[0.7rem]">
            Policy
          </p>
          <p className="text-[15px] text-white text-opacity-30 hover:text-yellow-300 w-fit cursor-pointer mb-[0.7rem]">
            Application
          </p>
          <p className="text-[15px] text-white text-opacity-30 hover:text-yellow-300 w-fit cursor-pointer mb-[0.7rem]">
            Candidates
          </p>
        </div>

        {/* 3rd part of footer */}
        <div>
          <h1 className="text-[22px] w-fit text-white font-semibold mb-[1.5rem]">
            Quick Links
          </h1>
          <p className="text-[15px] text-white text-opacity-30 hover:text-yellow-300 w-fit cursor-pointer mb-[0.7rem]">
            All Jobs
          </p>
          <p className="text-[15px] text-white text-opacity-30 hover:text-yellow-300 w-fit cursor-pointer mb-[0.7rem]">
            Job Details
          </p>
          <p className="text-[15px] text-white text-opacity-30 hover:text-yellow-300 w-fit cursor-pointer mb-[0.7rem]">
            How To Apply
          </p>
          <p className="text-[15px] text-white text-opacity-30 hover:text-yellow-300 w-fit cursor-pointer mb-[0.7rem]">
            Resume
          </p>
        </div>

        {/* 4th part of footer */}
        <div>
          <h1 className="text-[22px] w-fit text-white font-semibold mb-[1.5rem]">
            Get in Touch
          </h1>
          <p className="text-[15px] text-white text-opacity-30 hover:text-yellow-300 w-fit cursor-pointer mb-[0.7rem]">
            +256 7827778
          </p>
          <p className="text-[15px] text-white text-opacity-30 hover:text-yellow-300 w-fit cursor-pointer mb-[0.7rem]">
            info@hobify.com
          </p>
          <p className="text-[15px] text-white text-opacity-30 hover:text-yellow-300 w-fit cursor-pointer mb-[0.7rem]">
            Kampala, Uganda
          </p>
        </div>

      </div>

      <h1 className="mt-[2rem] text-[14px] w-[80%] text-center mx-auto text-white opacity-50">
        COPYRIGHT BY TROY LEGACY - 2024
      </h1>
    </div>
  );
};

export default Footer;
