"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

const AptitudeTest = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  const [convexUserId, setConvexUserId] = useState<string | null>(null);

  // Fetch all shortlisted users
  const shortlisted = useQuery(api.files.getAllShortListed);

  // Fetch all rejected users
  const rejected = useQuery(api.files.getAllRejected);

  // Fetch all applications
  const applications = useQuery(api.files.getFiles, {});

  // Get the Clerk user id
  const clerkUserId = user?.id;

  // Fetch Convex user data based on the tokenIdentifier
  const convexUser = useQuery(api.users.getMe, {});

  // Check if the user's Convex ID matches any of the shortlisted users
  useEffect(() => {
    if (convexUser && convexUser._id) {
      setConvexUserId(convexUser._id);
    }
  }, [convexUser]);

  console.log("COnvexUser: ", convexUser);

  const tests = useQuery(api.aptitude.getAllTests);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Check if user is loaded and part of the shortlist
  if (!userLoaded || shortlisted === undefined) {
    return <p>Loading...</p>;
  }

  const givenJob = applications?.find((job) => job.userId === convexUserId);

  const jobPost = givenJob?.post;

  const isShortlisted = shortlisted?.some(
    (applicant) => applicant.userId === convexUserId
  );
  const isRejected = rejected?.some(
    (applicant) => applicant.userId === convexUserId
  );

  // Fetch the corresponding rejected applicant to show rejection reason
  const rejectedApplicant = rejected?.find(
    (applicant) => applicant.userId === convexUserId
  );

  if (!isShortlisted) {
    return <p>You are not shortlisted for the aptitude test.</p>;
  }

  // Fetch the aptitude test data

  if (!tests) {
    return <p>Loading test...</p>;
  }

  // Get a random test from the fetched tests
  const randomTest = tests[Math.floor(Math.random() * tests.length)];

  // Handle answer selection
  const handleAnswerSelect = (
    questionIndex: number,
    selectedAnswer: string
  ) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: selectedAnswer,
    });
  };

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
              // If user is not logged in
              <p className="text-lg text-gray-600">
                Please log in to view your application status.
              </p>
            ) : (
              <div className="mt-4 text-center w-[500px]">
                {isShortlisted && (
                  <>
                    <p className="text-2xl font-semibold">Status: Approved</p>
                    <p className="text-lg text-gray-600">
                      <span className="text-green-500 text-xl">Congratulations!</span><br /> You
                      have been shortlisted for the position of {jobPost}
                    </p>
                    <Link href={`/aptitude-test/${convexUserId}`}>
                      <Button className="mt-4">Attempt Aptitude Test</Button>
                    </Link>
                  </>
                )}
                {isRejected && (
                  <>
                    <p className="text-xl font-semibold text-red-600">
                      Status: Rejected
                    </p>
                    <p className="text-lg text-gray-600">
                      Rejection Reason:{" "}
                      {
                        //@ts-ignore
                        rejectedApplicant?.reason || "Not provided"
                      }
                    </p>
                  </>
                )}
                {!isShortlisted && !isRejected && (
                  <>
                    <p className="text-xl font-semibold text-yellow-600">
                      Status: Pending
                    </p>
                    <p className="text-lg text-gray-600">
                      Your application is under review.
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

export default AptitudeTest;
