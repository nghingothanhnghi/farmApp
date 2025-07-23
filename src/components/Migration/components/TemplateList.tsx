import React, { useEffect, useState } from 'react';
import { getAllTemplates } from '../../../services/templateService';
import type { Template } from '../../../models/types/Template';
import { useAlert } from '../../../contexts/alertContext';

const TemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const { setAlert } = useAlert();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getAllTemplates();
        setTemplates(data);
      } catch (error) {
        console.error(error);
        setAlert({ type: 'error', message: 'Failed to load templates' });
      }
    };
    fetchTemplates();
  }, [setAlert]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">All Templates</h2>
      <ul className="space-y-2">
        {templates.map((template) => (
          <li key={template.id} className="border p-3 rounded bg-gray-50">
            <div><strong>Client ID:</strong> {template.client_id}</div>
            <div><strong>Created:</strong> {new Date(template.created_at).toLocaleString()}</div>
            <pre className="bg-white mt-2 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(template.mapping, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TemplateList;
