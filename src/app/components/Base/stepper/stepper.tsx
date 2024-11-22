import React from "react";

interface StepperProps {
  currentStep: number; // current active step
  steps: string[]; // array of step labels
  onStepClick: (step: number) => void; // callback for when a step is clicked
}

const Stepper: React.FC<StepperProps> = ({
  currentStep,
  steps,
  onStepClick,
}) => {
  return (
    <div className="flex justify-center items-center w-full mb-12 flex-wrap">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep >= stepNumber;
        const isCompleted = currentStep > stepNumber;
        const isLastStep = stepNumber === steps.length;

        return (
          <div key={index} className="flex items-center">
            {/* Step Circle */}
            <div
              className="relative flex flex-col items-center text-center cursor-pointer z-10"
              onClick={() => onStepClick(stepNumber)}
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ease-in-out ${isActive
                  ? "bg-[#4E43F1] text-white"
                  : "bg-gray-200 text-gray-500"
                  }`}
              >
                {stepNumber}
              </div>
              <span
                className={`text-xs sm:text-sm transition-colors duration-300 ${isActive ? "text-[#4E43F1]" : "text-gray-400"
                  }`}
              >
                {label}
              </span>
            </div>

            {!isLastStep && (
              <div
                className="flex-1 h-1 bg-gray-300 mx-2 relative"
                style={{
                  width: "150px",
                  maxWidth: "calc(100vw - 400px)", // Example for mobile screens
                }}
              >
                <div
                  className={`h-full ${isCompleted ? "bg-[#4E43F1]" : "bg-gray-300"
                    } transition-all duration-300`}
                  style={{ width: isCompleted ? "100%" : "0%" }}
                ></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
