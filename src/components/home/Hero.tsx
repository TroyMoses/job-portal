import React from 'react'
import HeroImg from "../../../public/hero.svg";
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="pt-[5rem] pb-[3rem]">
        <div className='w-[100%] h-[60vh] flex flex-col items-center justify-center'>
            <div className="w-[80%] mx-auto flex flex-col items-center justify-center gap-[2rem]">
                {/* Content */}
                <div className=""></div>
                {/* Image */}
                <div className="hidden lg:block">
                    <Image src={HeroImg} alt="hero image" width={700} height={400} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero