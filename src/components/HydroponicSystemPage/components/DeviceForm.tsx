import React from 'react';
import { useNavigate } from 'react-router'; // Add this at the top of your file

import Form, { FormGroup, FormLabel, FormInput, FormActions } from '../../../components/common/Form';
import Button from '../../../components/common/Button';
import type { HydroDevice } from '../../../models/interfaces/HydroSystem';

type Props = {
    formData: Partial<HydroDevice>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    isEdit: boolean;
    fieldErrors: Record<string, string>;
};

const fields: [keyof HydroDevice, string, string, boolean, string?][] = [
    ['name', 'Device Name', 'text', true, 'Name used to identify this device.'],
    ['device_id', 'Device ID', 'text', true, 'Unique ID from the physical device or firmware.'],
    ['location', 'Location', 'text', false, 'Optional. E.g., "Grow Room A".'],
    ['type', 'Type', 'text', false, 'Type of the device (e.g., sensor, controller).'],
];

const DeviceForm: React.FC<Props> = ({
    formData,
    onChange,
    onSubmit,
    loading,
    isEdit,
    fieldErrors,
}) => {
    const navigate = useNavigate();
    return (
        <Form onSubmit={onSubmit} className="mx-auto max-w-4xl">
            {fields.map(([name, label, type, required, helper]) => (
                <FormGroup key={name} className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <FormLabel htmlFor={name}>{label}</FormLabel>
                        {helper && (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {helper}
                            </p>
                        )}
                    </div>
                    <div>
                        <FormInput
                            id={name}
                            name={name}
                            type={type}
                            value={(formData[name] ?? '') as string | number}
                            onChange={onChange}
                            required={required}
                        />
                        {fieldErrors[name] && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors[name]}</p>
                        )}
                    </div>
                </FormGroup>
            ))}

            <hr className="my-10 w-full border-t border-zinc-950/5 dark:border-white/5" />

            <FormActions className="lg:static fixed bottom-0 left-0 right-0 p-4 lg:pe-0 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                    type="button"
                    label="Back"
                    variant="secondary"
                    onClick={() => navigate('/hydro-devices')}
                    className="md:w-auto"
                    fullWidth={true}
                />
                <Button
                    type="submit"
                    label={
                        loading
                            ? isEdit
                                ? 'Updating...'
                                : 'Creating...'
                            : isEdit
                                ? 'Update Device'
                                : 'Create Device'
                    }
                    disabled={loading}
                    variant="primary"
                    className="md:w-auto"
                    fullWidth={true}
                />
            </FormActions>
        </Form>
    );
};

export default DeviceForm;
