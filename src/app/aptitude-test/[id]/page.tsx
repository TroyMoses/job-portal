"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

const AptitudeTest = ({ params }: { params: { id: string } }) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const tests = useQuery(api.aptitude.getAllTests);
  
    if (!tests) {
      return <p>Loading...</p>;
    }
  
    // Get a random test from the fetched tests
    const randomTest = tests[Math.floor(Math.random() * tests.length)];
  
    // Handle answer selection
    const handleAnswerSelect = (questionIndex: number, selectedAnswer: string) => {
      setSelectedAnswers({
        ...selectedAnswers,
        [questionIndex]: selectedAnswer,
      });
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
                  {/* Assuming we have 4 options, A, B, C, D */}
                  {["A", "B", "C", "D"].map((option) => (
                    <div key={option}>
                      <input
                        type="radio"
                        id={`question-${index}-option-${option}`}
                        name={`question-${index}`}
                        value={option}
                        onChange={() => handleAnswerSelect(index, option)}
                      />
                      <label
                        htmlFor={`question-${index}-option-${option}`}
                        className="ml-2"
                      >
                        {option}. {testItem.answer} {/* Display correct answer */}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-6">Submit Test</Button>
        </div>
      </div>
    );
};

export default AptitudeTest;
