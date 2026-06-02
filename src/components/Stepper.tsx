interface StepperProps {
  steps: string[];
  activeStep: number;
  onSelectStep: (index: number) => void;
}

function Stepper({ steps, activeStep, onSelectStep }: StepperProps) {
  return (
    <nav className="stepper" aria-label="Prototype steps">
      {steps.map((step, index) => {
        const state = index === activeStep ? 'active' : index < activeStep ? 'complete' : 'upcoming';

        return (
          <button
            type="button"
            key={step}
            className={`stepper-item ${state}`}
            onClick={() => onSelectStep(index)}
            aria-current={index === activeStep ? 'step' : undefined}
          >
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </button>
        );
      })}
    </nav>
  );
}

export default Stepper;
