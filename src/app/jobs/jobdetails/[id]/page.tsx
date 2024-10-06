import ApplyButton from "@/components/helpers/ApplyButton";
import JobCard from "@/components/helpers/JobCard";
import { JobData } from "@/jobs/data";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const JobDetails = async ({ params }: { params: { id: string } }) => {
  const singleJob = JobData.find((job) => job.id.toString() == params.id);

  return (
    <div className="mt-20 mb-12">
      <div className="block sm:flex items-center justify-between w-[80%] mx-auto">
        <div className="flex-[0.7]">
          <JobCard job={singleJob!} />
        </div>
        <SignedIn>
          <ApplyButton />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <button className="px-8 py-3 bg-emerald-600 rounded-lg text-white">
              Sign Up To Apply
            </button>
          </SignInButton>
        </SignedOut>
      </div>
      <div className="mt-16 w-[80%] mx-auto">
        <h1 className="text-[20px] font-semibold">Job Description</h1>
        <p className="mt-4 text-black text-opacity-70">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus
          neque consequuntur vero beatae accusantium cupiditate excepturi ex
          optio, architecto unde fugit maiores eaque deserunt porro dolorem
          omnis nobis earum. Cumque.
        </p>
        <h1 className="text-[20px] mt-8 font-semibold">Key Responsibilities</h1>
        <p className="mt-4 text-black text-opacity-70">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus
          neque consequuntur vero beatae accusantium cupiditate excepturi ex
          optio, architecto unde fugit maiores eaque deserunt porro dolorem
          omnis nobis earum. Cumque. Possimus neque consequuntur vero beatae
          accusantium cupiditate excepturi ex optio, architecto unde fugit
          maiores eaque deserunt porro dolorem omnis nobis earum. Cumque.
        </p>
        <h1 className="text-[20px] mt-8 font-semibold">Skills Required</h1>
        <ul className="mt-4">
            <li className="mt-4 text-black text-opacity-70">React JS</li>
            <li className="mt-4 text-black text-opacity-70">Next JS</li>
            <li className="mt-4 text-black text-opacity-70">Tailwind CSS</li>
            <li className="mt-4 text-black text-opacity-70">Typescript</li>
            <li className="mt-4 text-black text-opacity-70">Next Auth</li>
        </ul>
      </div>
    </div>
  );
};

export default JobDetails;
