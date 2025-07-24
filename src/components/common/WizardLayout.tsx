// src/components/common/WizardLayout.tsx
import React from "react";

interface WizardStep {
  title: string;
  component: React.ReactNode;
  hideNav?: boolean;        // hide all nav buttons
  hideNext?: boolean;       // hide only Next
  hideBack?: boolean;       // hide only Back
}

interface WizardLayoutProps {
  steps: WizardStep[];
  currentStep: number;
  goNext: () => void;
  goBack: () => void;
}

export default function WizardLayout({ steps, currentStep, goNext, goBack }: WizardLayoutProps) {
  const step = steps[currentStep];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step Header */}
      <div>
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex-1 text-center py-2 px-1 text-sm font-medium transition ${i === currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
            >
              {s.title}
              <div className={`h-1 mt-1 transition-all ${i <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            </div>
          ))}
        </div>
      </div>
      {/* Step Content */}
        {step.component}
      {/* Navigation Buttons */}
      {!step.hideNav && (
        <div className="flex justify-between pt-4">
          {!step.hideBack && (
            <button
              onClick={goBack}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
            >
              Back
            </button>
          )}
          {!step.hideNext && (
            <button
              onClick={goNext}
              disabled={currentStep >= steps.length - 1}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}
