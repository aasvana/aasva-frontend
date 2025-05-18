"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import BackButton from "@/components/generic/back-button";
import { getSteps } from "../steps";

export default function ConfirmationVouchers() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentStep, setCurrentStep] = useState(0);

  const steps = getSteps(date, setDate);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between border-b pb-4">
        <BackButton />
        <h1 className="text-2xl font-bold">{steps[currentStep].title}</h1>

        <button
          type="button"
          className="inline-flex items-center gap-x-2 py-1 px-1.5 mx-4 text-xs font-medium rounded border border-transparent bg-gray-600 text-white hover:bg-gray-700 focus:outline-hidden focus:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none"
        >
          <SaveIcon className="shrink-0 size-3" />
          Save
        </button>
      </div>
      <div
        className="flex flex-col p-4 md:px-6 md:py-4"
      >
        <div className="flex justify-center gap-2 mb-6">
          <ul className="flex justify-center items-center w-full max-w-3xl mx-auto">
            {steps.map((_, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <li key={index} className="flex items-center flex-1">
                  <div
                    className={`z-10 size-7 flex justify-center items-center rounded-full font-medium 
                    ${
                        isCompleted
                        ? "bg-teal-500 text-white"
                        : isActive
                        ? "bg-gray-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {!isCompleted ? (
                      index + 1
                    ) : (
                      <svg
                        className="size-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 
                      ${isCompleted ? "bg-teal-500" : "bg-gray-200"}`}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="min-h-[300px] max-h-[460px] overflow-auto border p-6 rounded-lg bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700">
          {steps[currentStep].content}
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            disabled={isFirstStep}
            onClick={() => setCurrentStep((prev) => prev - 1)}
          >
            Back
          </Button>

          {!isLastStep ? (
            <Button onClick={() => setCurrentStep((prev) => prev + 1)}>
              Next
            </Button>
          ) : (
            <Button
              onClick={() => {
                alert("Form submitted!");
              }}
            >
              Finish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
