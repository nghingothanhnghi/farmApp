// src/components/Migration/MigrationPage.tsx
import RawDataForm from "./components/RawDataForm";
import TemplateList from "./components/TemplateList";
import TemplateSelector from "./components/TemplateSelector";
import TemplateCreator from "./components/TemplateCreator";

const MigrationPage = () => (
  <div className="p-6">
    <h1 className="text-xl font-bold mb-4">Submit Data Template</h1>
    <RawDataForm />
    <TemplateSelector/>
    <TemplateList/>
    <TemplateCreator />
  </div>
);

export default MigrationPage;
