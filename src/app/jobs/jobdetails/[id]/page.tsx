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

const JobDetails = ({ params }: { params: { id: string } }) => {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const singleJob = useQuery(
    api.jobs.getJobById,
    // @ts-ignore
    { jobId: params.id }
  );

  const isLoading = singleJob === undefined;

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <div className="mt-20 mb-12">
      <div className="block sm:flex items-center justify-between w-[80%] mx-auto">
        <div className="flex-[0.7]">
          <JobCard job={singleJob!} />
        </div>
        <SignedIn>
          <ApplyButton
            // @ts-ignore
            id={params.id}
          />
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
        <h1 className="text-[20px] font-semibold">Job Purpose</h1>
        <p className="mt-4 text-black text-opacity-70">{singleJob?.purpose}</p>

        <h1 className="text-[20px] font-semibold">Reports To</h1>
        <p className="mt-4 text-black text-opacity-70">
          {singleJob?.reportsTo}
        </p>

        <h1 className="text-[20px] font-semibold">Responsible For</h1>
        <ul>
          {singleJob?.responsibleFor?.map((responsibility) => (
            <li
              key={responsibility.name}
              className="mt-4 text-black text-opacity-70"
            >
              {responsibility.name}
            </li>
          ))}
        </ul>

        <h1 className="text-[20px] font-semibold">Key Outputs</h1>
        <ul>
          {singleJob?.keyOutputs?.map((output) => (
            <li key={output.output} className="mt-4 text-black text-opacity-70">
              {output.output}
            </li>
          ))}
        </ul>

        <h1 className="text-[20px] font-semibold">Key Functions</h1>
        <ul>
          {singleJob?.keyFunctions?.map((keyFunction) => (
            <li
              key={keyFunction.function}
              className="mt-4 text-black text-opacity-70"
            >
              {keyFunction.function}
            </li>
          ))}
        </ul>

        <div>
          <h1 className="text-[20px] font-semibold">Person Specifications</h1>
          <div>
            <h1 className="text-[18px] font-semibold">Qualifications</h1>
            <ul>
              {singleJob?.qualifications?.map((qualification) => (
                <li
                  key={qualification.qualification}
                  className="mt-4 text-black text-opacity-70"
                >
                  {qualification.qualification}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h1 className="text-[18px] font-semibold">Experience</h1>
            <ul>
              {singleJob?.experiences?.map((experience) => (
                <li
                  key={experience.experience}
                  className="mt-4 text-black text-opacity-70"
                >
                  {experience.experience}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h1 className="text-[18px] font-semibold">Competences</h1>
            <ul>
              {singleJob?.competences?.map((competence) => (
                <li
                  key={competence.competence}
                  className="mt-4 text-black text-opacity-70"
                >
                  {competence.competence}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
