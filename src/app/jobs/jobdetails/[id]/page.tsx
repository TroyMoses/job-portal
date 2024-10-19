"use client";

import ApplyButton from "@/components/helpers/ApplyButton";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import JobCard from "@/components/helpers/JobCard";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";

const JobDetails = ({ params }: { params: { id: Doc<"jobs"> } }) => {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const jobs = useQuery(
    api.jobs.getJobs,
    orgId
      ? {
          orgId,
          query,
        }
      : "skip"
  );
  const isLoading = jobs === undefined;

  const modifiedJobs =
    jobs?.map((job) => ({
      ...job,
    })) ?? [];

  const singleJob = modifiedJobs.find((job) => job._id === params.id._id);

  return (
    <div className="mt-20 mb-12">
      <div className="block sm:flex items-center justify-between w-[80%] mx-auto">
        {isLoading && (
          <div className="flex flex-col justify-center gap-8 w-full items-center mt-12 md:mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading job...</div>
          </div>
        )}
        <div className="flex-[0.7]">
          <JobCard job={singleJob!} />
        </div>
        <SignedIn>
          <ApplyButton id={params.id._id} />
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
