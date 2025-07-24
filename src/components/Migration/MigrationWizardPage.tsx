// components/Migration/MigrationWizard.tsx
import { useState } from "react";
import PageTitle from '../common/PageTitle';
import WizardLayout from "../common/WizardLayout";
import StepRawData from "./steps/StepRawData";
import StepCreateTemplate from "./steps/StepCreateTemplate";
import StepTransformResult from "./steps/StepTransformResult";

export default function MigrationWizardPage() {
  const [stepIndex, setStepIndex] = useState(0);

  const goNext = () => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const goBack = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const steps = [
    { title: "Raw Data", component: <StepRawData goNext={goNext} />, hideNav: true },
    { title: "Create Template", component: <StepCreateTemplate goNext={goNext} goBack={goBack} />, hideNav: true },
    { title: "Preview", component: <StepTransformResult goNext={goNext} goBack={goBack} />, hideNav: true },
  ];

  return (
    <div>
      <PageTitle
        title="Add Transform Data"
      />
      <WizardLayout
        steps={steps}
        currentStep={stepIndex}
        goNext={goNext}
        goBack={goBack}
      />
    </div>

  );
}
