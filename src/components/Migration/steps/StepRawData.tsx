// components/Migration/steps/StepRawData.tsx
import RawDataForm from "../components/RawDataForm";

export default function StepRawData({ goNext }: { goNext: () => void }) {
  return (
      <RawDataForm onSuccess={goNext}/>
  );
}
