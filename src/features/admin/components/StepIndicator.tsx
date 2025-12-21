interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all ${
            index + 1 === currentStep
              ? "w-8 bg-primary"
              : index + 1 < currentStep
              ? "w-2 bg-primary/60"
              : "w-2 bg-gray-300 dark:bg-gray-700"
          }`}
        />
      ))}
    </div>
  );
}
