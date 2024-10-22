"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import Heading from "../helpers/Heading";
import Link from "next/link";
import JobCard from "../helpers/JobCard";
import { Loader2 } from "lucide-react";
import { api } from "../../../convex/_generated/api";

const FeaturedJobs = () => {

  const jobs = useQuery(api.jobs.getAllJobs);

  const isLoading = jobs === undefined;

  const modifiedJobs =
    jobs?.map((job) => ({
      ...job,
    })) ?? [];

  return (
    <div className=" mt-30 pt-20 pb-12">
      <Heading
        mainHeading="Featured Jobs"
        subHeading="Know your worth and find the job that qualify your life"
      />
      <div className="mt-12 w-[80%] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-12 md:mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading job listings...</div>
          </div>
        )}
        {modifiedJobs.map((job) => {
          return (
            <Link href={`/jobs/jobdetails/${job._id}`} key={job._id}>
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
