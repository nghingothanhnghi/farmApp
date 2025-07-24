// src/components/Migration/MigrationPage.tsx
import { useEffect, useState } from "react";
import RawDataForm from "./components/RawDataForm";
import TemplateList from "./components/TemplateList";
import TemplateSelector from "./components/TemplateSelector";
import TemplateCreator from "./components/TemplateCreator";
import PageTitle from '../common/PageTitle';
import { getAllTemplates } from "../../services/templateService";
import type { Template } from "../../models/types/Template";

const MigrationPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [reloadFlag, setReloadFlag] = useState(0); // To force TemplateSelector re-run

  const reloadTemplates = async () => {
    const all = await getAllTemplates();
    console.log("Fetched templates:", all);
    setTemplates(all);
  };

  useEffect(() => {
    reloadTemplates();
  }, [reloadFlag]);

  const triggerReload = () => setReloadFlag((prev) => prev + 1);

  return (
    <div>
      <PageTitle
        title="Data Migration "
      />
      <RawDataForm />
      <TemplateSelector templates={templates} />
      <TemplateList templates={templates} />
      <TemplateCreator onTemplateCreated={triggerReload} />
    </div>
  );
};

export default MigrationPage;
