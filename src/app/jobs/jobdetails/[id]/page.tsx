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
    </div>
  );
};

export default JobDetails;
