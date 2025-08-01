// src/components/Hydro/HydroponicDevicePage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Form, { FormGroup, FormLabel, FormInput, FormActions } from '../../components/common/Form';
import Button from '../../components/common/Button';
import PageTitle from '../../components/common/PageTitle';
import * as Yup from 'yup';
import { useAlert } from '../../contexts/alertContext';
import { deviceService } from '../../services/hydroDeviceService';
import type { HydroDevice } from '../../models/interfaces/HydroSystem';
import DeviceList from './components/DeviceList';

const deviceSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    device_id: Yup.string().required('Device ID is required'),
    location: Yup.string(),
    type: Yup.string(),
});

const HydroponicDevicePage: React.FC = () => {
    const { setAlert } = useAlert();
    const navigate = useNavigate();
    const { id } = useParams(); // For edit
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState<Partial<HydroDevice>>({
        name: '',
        device_id: '',
        location: '',
        type: '',
    });

    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEdit) {
            deviceService
                .get(Number(id))
                .then(setFormData)
                .catch(() =>
                    setAlert({ type: 'error', message: 'Failed to fetch device data' })
                );
        }
    }, [id]);

    const fields: [keyof HydroDevice, string, string, boolean][] = [
        ['name', 'Device Name', 'text', true],
        ['device_id', 'Device ID', 'text', true],
        ['location', 'Location', 'text', false],
        ['type', 'Type', 'text', false],
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await deviceSchema.validate(formData, { abortEarly: false });
            setFieldErrors({});
            if (isEdit) {
                await deviceService.update(Number(id), formData as HydroDevice);
                setAlert({ message: 'Device updated successfully!', type: 'success' });
            } else {
                await deviceService.create(formData as HydroDevice);
                setAlert({ message: 'Device created successfully!', type: 'success' });
            }
            navigate('/hydro-devices');
        } catch (err: any) {
            if (err.name === 'ValidationError') {
                const errors: Record<string, string> = {};
                err.inner.forEach((e: Yup.ValidationError) => {
                    if (e.path) errors[e.path] = e.message;
                });
                setFieldErrors(errors);
            } else {
                setAlert({
                    message: err?.response?.data?.detail || 'Error occurred',
                    type: 'error',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageTitle
                title={isEdit ? 'Edit Device' : 'Create Device'}
            />
            <DeviceList />
            <Form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                {fields.map(([name, label, type, required]) => (
                    <FormGroup key={name} className="grid gap-x-8 gap-y-1 sm:gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <FormLabel htmlFor={name}>{label}</FormLabel>
                        </div>
                        <div>
                            <FormInput
                                id={name}
                                name={name}
                                type={type}
                                value={(formData[name as keyof typeof formData] ?? '') as string | number}
                                onChange={handleChange}
                                required={required}
                            />
                            {fieldErrors[name] && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors[name]}</p>
                            )}
                        </div>
                    </FormGroup>
                ))}
                <hr className="my-10 w-full border-t border-zinc-950/5 dark:border-white/5" />
                <FormActions className="lg:static fixed bottom-0 left-0 right-0 p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        fullWidth
                    />
                </FormActions>
            </Form>
        </div>
    );
};

export default HydroponicDevicePage;
