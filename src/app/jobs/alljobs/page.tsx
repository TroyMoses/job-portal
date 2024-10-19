"use client";

import JobCard from "@/components/helpers/JobCard";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Link from "next/link";
import React, { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Loader2 } from "lucide-react";

const AllJobs = ({
  title,
  deletedOnly,
}: {
  title: string;
  deletedOnly?: boolean;
}) => {
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

  return (
    <div className="mt-12 w-[80%] mx-auto mb-12">
      <div className="mb-[2rem]">
        <h1 className="font-semibold">Show Result ({modifiedJobs.length})</h1>
      </div>
      <div className="space-y-8">
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
    </div>
  );
};

export default AllJobs;
