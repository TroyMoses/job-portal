"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";

const ApplicationStatus = () => {
  const { user, isLoaded: userLoaded } = useUser();

  const [convexUserId, setConvexUserId] = useState<string | null>(null);

  const shortlisted = useQuery(api.files.getAllShortListed);

  // Fetch all rejected users
  const rejected = useQuery(api.files.getAllRejected);

  const applications = useQuery(api.files.getFiles, {});

  const convexUser = useQuery(api.users.getMe, {});

  useEffect(() => {
    if (convexUser && convexUser._id) {
      setConvexUserId(convexUser._id);
    }
  }, [convexUser]);

  const results = useQuery(api.results.getAllResults);

  if (!userLoaded || shortlisted === undefined) {
    return <p>Loading...</p>;
  }

  const givenJob = applications?.find((job) => job.userId === convexUserId);

  const applicantName = givenJob?.name;
  const jobPost = givenJob?.post;

  const isShortlisted = shortlisted?.some(
    (applicant) => applicant.userId === convexUserId
  );

  const hasNotApplied = !applications?.some(
    (applicant) => applicant.userId === convexUserId
  );
  
  const isRejected = rejected?.some(
    (applicant) => applicant.userId === convexUserId
  );

  const rejectedApplicant = rejected?.find(
    (applicant) => applicant.userId === convexUserId
  ); 

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
              Your Application Status
            </h1>
            {!user ? (
              <p className="text-lg text-gray-600">
                Please log in to view your application status.
              </p>
            ) : (
              <div className="mt-4 text-center w-[600px]">
                {isShortlisted && (
                  <>
                    <p className="text-2xl font-semibold mb-2">Status: Approved</p>
                    <p className="text-lg text-gray-600">
                      <span className="text-green-500 text-xl">
                        Congratulations! {applicantName}
                      </span>
                      <br /> You have been shortlisted for the position of{" "}
                      {jobPost}
                    </p>
                    <Link href={`/jobs/aptitude-test/${convexUserId}`}>
                      <Button className="mt-4">Attempt Aptitude Test</Button>
                    </Link>
                  </>
                )}
                {isRejected && (
                  <>
                    <p className="text-xl font-semibold text-red-600">
                      Status: Unsuccessfull
                    </p>
                    {/* <p className="text-lg text-gray-600">
                       Reason:{" "}
                      {
                        //@ts-ignore
                        rejectedApplicant?.reason || "Not provided"
                      }
                    </p> */}
                  </>
                )}
                {!isShortlisted && !isRejected && !hasNotApplied &&(
                  <>
                    <p className="text-xl font-semibold text-yellow-600">
                      Status: Pending
                    </p>
                    <p className="text-lg text-gray-600">
                      Your application is under review.
                    </p>
                  </>
                )}
                {!isShortlisted && !isRejected && hasNotApplied && (
                  <>
                    <p className="text-xl font-semibold text-red-600">
                      Status: Not Applied
                    </p>
                    <p className="text-lg text-gray-600">
                      You have not applied for any job yet. <br/>
                      <Link href="/jobs/alljobs">
                        <Button className="mt-4">View Jobs</Button>
                      </Link>
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;
