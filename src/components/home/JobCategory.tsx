import React from "react";
import Heading from "../helpers/Heading";
import JobCategoryCard from "../helpers/JobCategoryCard";

const JobCategory = () => {
  return (
    <div className="pt-20 pb-12">
      <Heading
        mainHeading="Popular Job Categories"
        subHeading="2024 Jobs live - 176 Added Today"
      />
      <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-[4rem] gap-[3rem] items-center">
          <JobCategoryCard
            image="/icon1.png"
            category="Finance"
            openPositions="23"
          />
          <JobCategoryCard
            image="/icon2.png"
            category="Marketing"
            openPositions="13"
          />
          <JobCategoryCard
            image="/icon3.png"
            category="Design"
            openPositions="33"
          />
          <JobCategoryCard
            image="/icon4.png"
            category="Development"
            openPositions="23"
          />
          <JobCategoryCard
            image="/icon5.png"
            category="Human Resource"
            openPositions="33"
          />
          <JobCategoryCard
            image="/icon6.png"
            category="Automotive"
            openPositions="43"
          />
          <JobCategoryCard
            image="/icon7.png"
            category="Customer Services"
            openPositions="12"
          />
          <JobCategoryCard
            image="/icon8.png"
            category="Health and Care"
            openPositions="54"
          />
          <JobCategoryCard
            image="/icon9.png"
            category="Project Management"
            openPositions="23"
          />
      </div>
    </div>
  );
};

export default JobCategory;
