import React, { useState } from 'react';
import { createTemplate } from '../../../services/templateService';
import { useAlert } from '../../../contexts/alertContext';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

const TemplateCreator: React.FC = () => {
    const { setAlert } = useAlert();

    const [clientId, setClientId] = useState('');
    const [jsonInput, setJsonInput] = useState('{}');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        let parsed;
        try {
            parsed = JSON.parse(jsonInput);
        } catch (err) {
            setAlert({ type: 'error', message: 'Invalid JSON format in mapping.' });
            return;
        }
        try {
            setLoading(true);

            await createTemplate({
                client_id: clientId.trim(),
                mapping: parsed,
            });

            setAlert({ type: 'success', message: 'Template created successfully!' });
            setClientId('');
            setJsonInput('{}');
        } catch (err: any) {
            console.error(err);
            const message =
                err?.response?.data?.detail || 'Failed to create template.';
            setAlert({ type: 'error', message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Add New Template</h2>
            <p className="text-sm text-gray-500 mb-1">
                Please enter valid JSON like: <code>{"{\"source_key\": \"target_key\"}"}</code>
            </p>
            <div>
                <label className="block mb-1 font-medium">Client ID</label>
                <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter client ID"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Template Mapping (JSON)</label>
                <CodeMirror
                    value={jsonInput}
                    height="200px"
                    extensions={[json()]}
                    onChange={(val) => setJsonInput(val)}
                    className="border rounded"
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading || !clientId}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Creating...' : 'Create Template'}
            </button>
        </div>
    );
};

export default TemplateCreator;
