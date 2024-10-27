"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";

const MyScores = () => {
  const { user, isLoaded: userLoaded } = useUser();

  const [convexUserId, setConvexUserId] = useState<string | null>(null);

  // Fetch all shortlisted users
  const shortlisted = useQuery(api.files.getAllShortListed);

  // Fetch all applications
  const applications = useQuery(api.files.getFiles, {});

  // Fetch user
  const convexUser = useQuery(api.users.getMe, {});

  useEffect(() => {
    if (convexUser && convexUser._id) {
      setConvexUserId(convexUser._id);
    }
  }, [convexUser]);

  // Fetch all results
  const results = useQuery(api.results.getAllResults);

  const applicantResult = results?.find(
    (result) => result.userId === convexUserId);

  if (!userLoaded || shortlisted === undefined) {
    return <p>Loading...</p>;
  }

  const givenJob = applications?.find((job) => job.userId === convexUserId);

  const applicantName = givenJob?.name;
  const jobPost = givenJob?.post;

  if (!results) {
    return <p>Loading your application status...</p>;
  }

  return (
    <div className="pt-[3rem] pb-[3rem]">
      <div className="w-[100%] h-[60vh] justify-center">
        <div className="w-[80%] mx-auto items-center justify-center gap-[2rem]">
          {/* Content */}
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-[28px] sm:text-[35px] lg:text-[40px] text-[#05264e] leading-[3rem] lg:leading-[4rem] font-extrabold">
              All Your Scores
            </h1>
            {!user ? (
              <p className="text-lg text-gray-600">
                Please log in to view all your scores.
              </p>
            ) : (
              <div className="mt-4 text-center w-[600px]">
                  <>
                    {applicantResult ? (
                      <div className="mt-5 grid grid-cols-1 gap-3">
                        <p>
                          <strong>Applicant Name:</strong> {applicantName}
                        </p>
                        <p>
                          <strong>Job applied for:</strong> {jobPost}
                        </p>
                        <p>
                          <strong>Aptitude Test Score:</strong>{" "}
                          {applicantResult.aptitudetestscore}%
                        </p>
                        <p>
                          <strong>Interview Average:</strong>{" "}
                          {applicantResult.oralInterviewAverage ?? "Pending"}%
                        </p>
                        <p>
                          <strong>Overall Average:</strong>{" "}
                          {applicantResult.overallAverageScore ?? "Pending"}%
                        </p>
                      </div>
                    ) : (
                      <Link href={`/jobs/aptitude-test/${convexUserId}`}>
                      <Button className="mt-4">Attempt Aptitude Test</Button>
                    </Link>
                    )}
                  </>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyScores;
