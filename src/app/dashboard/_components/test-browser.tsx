"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TestBrowser({
  title,
  deletedOnly,
}: {
  title: string;
  deletedOnly?: boolean;
}) {

  // Fetch all tests
  const aptitudeTests = useQuery(api.aptitude.getAllTests);
  const isLoading = aptitudeTests === undefined;

  // Map and structure the aptitude tests
  const modifiedAptitudeTests =
    aptitudeTests?.map((test: Doc<"aptitude_test">) => ({
      ...test,
    })) ?? [];

  return (
    <div>
      <div className="hidden md:flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        <Link href={"/dashboard/addtest"}>
          <Button type="button" className="text-sm px-2 py-1">
            Upload Test
          </Button>
        </Link>
      </div>

      <div className="md:hidden flex flex-col gap-5 mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        <Link href={"/dashboard/addjob"}>
          <Button type="button" className="text-sm px-2 py-1">
            Upload Test
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <p>Loading tests...</p>
      ) : modifiedAptitudeTests.length > 0 ? (
        <div className="space-y-8">
          {/* Loop over all tests and display each one */}
          {modifiedAptitudeTests.map((test, index) => (
            <div key={test._id} className="p-4 border rounded-md shadow-sm">
              <h2 className="text-2xl font-semibold">Test {index + 1}</h2>

              {/* Loop over questions and answers */}
              <div className="mt-4 space-y-4">
                {test.aptitudeTest?.map((qna, qIndex) => (
                  <div key={qIndex} className="p-2 border-b">
                    <p className="font-bold text-lg">
                      Question {qIndex + 1}: {qna.question}
                    </p>
                    <p className="mt-2">
                      <strong>Answer:</strong> {qna.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No tests available.</p>
      )}
    </div>
  );
}
