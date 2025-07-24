// components/Migration/steps/StepTransformResult.tsx
import TransformProcessedData from '../components/TransformProcessedData';

export default function StepTransformResult({ goNext, goBack }: { goNext?: () => void; goBack?: () => void }) {
  return (
    <TransformProcessedData goBack={goBack} onCompleteStep={goNext}/>
  );
}
