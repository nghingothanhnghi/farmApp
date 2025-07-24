// components/Migration/RawDataForm.tsx
import React, { useRef, useState } from "react";
import { ingestRawData } from "../../../services/migrationService";
import FileInput from "../../common/FileInput";
import Form, { FormGroup, FormLabel, FormInput, FormActions } from "../../common/Form";
import Button from "../../common/Button";
import { useAlert } from '../../../contexts/alertContext';
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

const RawDataForm = () => {
  const { setAlert } = useAlert();
  const [clientId, setClientId] = useState("");
  const [payload, setPayload] = useState("{}");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text); // ensure it's valid JSON
        setPayload(JSON.stringify(parsed, null, 2)); // pretty-print
      } catch (error) {
        console.error("JSON parse error:", error);
        setAlert({
          type: "error",
          message: "Invalid JSON file. Please upload a valid .json file.",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const parsed = JSON.parse(payload);
      await ingestRawData({ client_id: clientId, payload: parsed });
      setAlert({ type: "success", message: "Data ingested successfully!" });
      setClientId("");
      setPayload("{}");
      setTimeout(() => {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 0);
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Invalid JSON or server error. Please check your input.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <FormGroup>
        <FormLabel htmlFor="client_id">Client ID</FormLabel>
        <FormInput
          id="client_id"
          name="client_id"
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
        />
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="json-upload">Upload JSON File</FormLabel>
        <FileInput
          id="json-upload"
          onChange={handleFileChange}
          inputRef={fileInputRef}
          accept=".json"
          multiple={false}
          label="Choose file"
        />
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="payload">Payload (Editable JSON)</FormLabel>
        <div className="border rounded-md overflow-hidden">
          <CodeMirror
            value={payload}
            height="300px"
            extensions={[json()]}
            onChange={(val) => setPayload(val)}
            theme="light"
          />
        </div>
      </FormGroup>

      <FormActions>
        <Button
          type="submit"
          label={isSubmitting ? "Submitting..." : "Submit Raw Data"}
          disabled={isSubmitting}
          variant="primary"
          fullWidth={true}
        />
      </FormActions>
    </Form>
  );
};

export default RawDataForm;
