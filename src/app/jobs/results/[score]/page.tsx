"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const ResultsPage = ({ params }: { params: { score: string } }) => {
  return (
    <div className="pt-10 pb-10">
      <div className="w-[80%] mx-auto">
        <h1 className="text-3xl font-semibold">Test Results</h1>
        <p className="mt-4 text-xl">
          Your test score is: <strong>{params.score}%</strong>
        </p>
        <p className="mt-2 mb-3">Thank you for taking the aptitude test!</p>
        <div className="flex gap-2">
          <Link href={"/"}>
            <Button size={"sm"}>Back to Home</Button>
          </Link>
          <Link href={"/jobs/my-scores"}>
            <Button variant={"outline"} size={"sm"}>
              View All My Scores
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
