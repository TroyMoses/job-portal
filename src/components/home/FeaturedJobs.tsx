import React from "react";
import Heading from "../helpers/Heading";
import { JobData } from "@/jobs/data";
import Link from "next/link";
import JobCard from "../helpers/JobCard";

const FeaturedJobs = () => {
  return (
    <div className="pt-20 pb-12">
      <Heading
        mainHeading="Featured Jobs"
        subHeading="Know your worth and find the job that qualify your life"
      />
      <div className="mt-12 w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {JobData.map((job) => {
          return (
            <Link href={`/jobs/jobdetails/${job.id}`} key={job.id}>
              <JobCard job={job} />
            </Link>
          );
        })}
      </div>
      <Link href={"/jobs/alljobs"}>
        <div className="text-center mt-[3rem]">
            <button className="px-8 py-2 font-semibold hover:bg-blue-500 transition-all duration-300 bg-blue-500 rounded-lg text-white hover:scale-105 cursor-pointer">
                View All Jobs
            </button>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedJobs;
