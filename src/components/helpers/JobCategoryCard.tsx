import Image from "next/image";
import React from "react";

interface Props {
  image: string;
  category: string;
  openPositions: string;
}

const JobCategoryCard = ({ category, image, openPositions }: Props) => {
  return (
    <div className="p-4 border-2 cursor-pointer hover:scale-110 hover:shadow-sm transition-all duration-300 border-gray-500 rounded-lg border-opacity-10">
        <div className="flex items-center space-x-4">
            {/* Image */}
            <Image 
                src={image}
                alt={category}
                width={60}
                height={60}
            />
            {/* Content */}
            
        </div>
    </div>
  );
};

export default JobCategoryCard;
