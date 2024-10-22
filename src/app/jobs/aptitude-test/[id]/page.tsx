"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";

const AptitudeTest = ({ params }: { params: { id: Id<"users"> } }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const tests = useQuery(api.aptitude.getAllTests);
  const router = useRouter();
  const submitResults = useMutation(api.results.submitResults);
  const convexUser = useQuery(api.users.getMe, {});

  // Fetch all applications
  const applications = useQuery(api.files.getFiles, {});
  
  if (!tests || !applications) {
    return <p>Loading...</p>;
  }
  
    // Get a random test from the fetched tests
    const randomTest = tests[1];

    // Get the applicant details
  const application = applications?.find((app: Doc<"files">) => app.userId === convexUser?._id);

  const applicantName = application?.name;
  const jobPost = application?.post;

  if (!application || !applicantName || !jobPost) {
    return <p>Unable to find application details.</p>;
  }

  // Handle answer selection
  const handleAnswerSelect = (questionIndex: number, selectedAnswer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: selectedAnswer,
    });
  };

  // Handle test submission
  const handleSubmit = async () => {
    if (randomTest && randomTest.aptitudeTest) {
      const correctAnswers = randomTest.aptitudeTest.map((qna) => {
        return qna.answers.find((answer) => answer.isCorrect)?.answer;
      });
    
      let correctCount = 0;
      const resultData = randomTest.aptitudeTest.map((qna, index) => {
        const isCorrect = selectedAnswers[index] === correctAnswers[index];
        if (isCorrect) {
          correctCount++;
        }
    
        return {
          question: qna.question,
          selectedAnswer: selectedAnswers[index] ?? "Not Answered",
        };
      });
    
      const score = (correctCount / randomTest.aptitudeTest.length) * 100;
    
      await submitResults({
        userId: params.id ,
        testId: randomTest._id,
        selectedAnswers: resultData,
        aptitudetestscore: score,
        applicantName: applicantName,
        jobPost: jobPost,
      });

      router.push(`/jobs/results/${score}`);
    } else {
      // TODO: Handle the case where randomTest or randomTest.aptitudeTest is undefined
    }
  };

  return (
    <div className="pt-10 pb-10">
      <div className="w-[80%] mx-auto">
        <h1 className="text-3xl font-semibold">Aptitude Test</h1>
        <div className="mt-8">
          {randomTest?.aptitudeTest?.map((testItem, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                {index + 1}. {testItem.question}
              </h3>
              <div className="flex flex-col gap-3">
                {testItem.answers.map((answer, answerIndex) => (
                  <div key={answerIndex}>
                    <input
                      type="radio"
                      id={`question-${index}-option-${answerIndex}`}
                      name={`question-${index}`}
                      value={answer.answer}
                      onChange={() => handleAnswerSelect(index, answer.answer)}
                    />
                    <label
                      htmlFor={`question-${index}-option-${answerIndex}`}
                      className="ml-2"
                    >
                      {answer.answer}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button onClick={handleSubmit} className="mt-6">
          Submit Test
        </Button>
      </div>
    </div>
  );
};

export default AptitudeTest;
