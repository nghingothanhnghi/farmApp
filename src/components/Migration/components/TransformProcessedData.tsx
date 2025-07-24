import React, { useState } from 'react';
import { useAlert } from '../../../contexts/alertContext';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import Form, { FormGroup, FormLabel, FormActions } from "../../common/Form";
import Button from '../../common/Button';
interface TransformProcessedDataProps {
    onCompleteStep?: () => void;
    goBack?: () => void;
}

const TransformProcessedData: React.FC<TransformProcessedDataProps> = ({ onCompleteStep, goBack }) => {
    const { setAlert } = useAlert();

    const [clientId, setClientId] = useState('');
    const [jsonInput, setJsonInput] = useState('{}');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
    };
    return (
        <Form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
            <FormGroup>
                <FormLabel htmlFor="template_mapping">Result</FormLabel>
                <div className="border rounded-md overflow-hidden">
                    <CodeMirror
                        value={jsonInput}
                        height="200px"
                        extensions={[json()]}
                        onChange={(val) => setJsonInput(val)}
                        theme="light"
                    />
                </div>
            </FormGroup>
            <FormActions>
                <Button
                    type="button"
                    label="Back"
                    variant="secondary"
                    onClick={goBack}
                />
                <Button
                    type="submit"
                    label={loading ? 'Creating...' : 'Create Template'}
                    disabled={loading || !clientId}
                    variant="primary"
                />
            </FormActions>
        </Form>
    );
};

export default TransformProcessedData;
