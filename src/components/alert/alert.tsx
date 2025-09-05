import React, { useEffect } from 'react';
import { IconX, IconExclamationCircle, IconCheck, IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';
import Button from '../common/Button';
import { useAlert } from '../../contexts/alertContext';
import { playSound } from '../../utils/sound';

const Alert: React.FC = () => {
    const { alert, setAlert } = useAlert();
    useEffect(() => {
        if (alert) {
            // ✅ Use your centralized sound util
            if (alert.type === 'error') playSound('error');
            else if (alert.type === 'warning' || alert.type === 'info') playSound('alert');
            else if (alert.type === 'success') playSound('success');

            const timeout = setTimeout(() => {
                setAlert(null);
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [alert, setAlert]);


    if (!alert) return null;

    const handleClose = () => {
        setAlert(null);
    };

    const alertStyles = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    };

    const alertIcons = {
        success: (
            <IconCheck className="h-6 w-6 text-green-500" />
        ),
        error: (
            <IconExclamationCircle className='h-6 w-6 text-red-500' />
        ),
        info: (
            <IconInfoCircle className="h-6 w-6 text-blue-500" />
        ),
        warning: (
            <IconAlertCircle className="h-6 w-6 text-yellow-500" />
        ),
    };

    return (
        <div className={`fixed top-4 right-4 max-w-sm w-full border-l-4 p-4 rounded shadow-lg ${alertStyles[alert.type]} z-50`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        {alertIcons[alert.type]}
                    </div>
                    <span className="ml-3 flex-1">{alert.message}</span>
                </div>
                <Button
                    onClick={handleClose}
                    variant="secondary"
                    icon={<IconX size={16} />}
                    iconOnly
                    label="Close"
                    className="text-gray-800 hover:text-gray-900 bg-transparent"
                    rounded='full'
                />
            </div>
        </div>
    );
};

export default Alert;
