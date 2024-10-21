"use client";

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
        <p className="mt-2">Thank you for taking the aptitude test!</p>
      </div>
    </div>
  );
};

export default ResultsPage;
