import React from 'react';
import type { HydroActuator } from '../../../models/interfaces/HydroSystem';
import Button from '../../common/Button';
import ButtonGroup from '../../common/ButtonGroup';
import { FormToggle } from '../../../components/common/Form';

interface ActuatorCardProps {
    actuator: HydroActuator;
    loading?: boolean;
    variant?: "control" | "linked"; // control = buttons, linked = toggle
    onToggle?: (id: number, active: boolean) => void;
    onControl?: (id: number, turnOn: boolean) => void;
}

const getActuatorIcon = (type: string): string => {
    switch (type.toLowerCase()) {
        case 'pump':
        case 'water_pump':
            return '💧';
        case 'light':
            return '💡';
        case 'fan':
            return '🌀';
        case 'valve':
            return '🚰';
        default:
            return '⚙️';
    }
};

const getActuatorColor = (type: string): { bg: string; hover: string } => {
    switch (type.toLowerCase()) {
        case 'pump':
        case 'water_pump':
            return { bg: 'bg-blue-500 shadow', hover: 'hover:bg-blue-600' };
        case 'light':
            return { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600' };
        case 'fan':
            return { bg: 'bg-cyan-500', hover: 'hover:bg-cyan-600' };
        case 'valve':
            return { bg: 'bg-green-500', hover: 'hover:bg-green-600' };
        default:
            return { bg: 'bg-gray-500', hover: 'hover:bg-gray-600' };
    }
};

const ActuatorCard: React.FC<ActuatorCardProps> = ({
    actuator,
    loading = false,
    variant = "control",
    onToggle,
    onControl,
}) => {
    const isActive = actuator.current_state;
    const colors = getActuatorColor(actuator.type);

    return (
        <div className="bg-gray-100 rounded-lg px-4 py-2">
            <div className='flex items-center justify-between mb-1'>
                <div className="flex items-center space-x-2">
                    <span className="text-lg">{getActuatorIcon(actuator.type)}</span>
                    <div className='flex-1'>
                        <div className="flex space-x-2">
                            <h3 className="text-[0.625rem] font-medium text-gray-700">{actuator.name}</h3>
                            <div className="flex items-center space-x-2">
                                <div
                                    className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-600' : 'bg-gray-400'}`}
                                ></div>
                                <span className="text-[0.625rem] text-gray-600">
                                    <span
                                        className={`font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}
                                    >
                                        {isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <p className="text-[0.625rem] text-gray-500">
                            {actuator.type} • Pin {actuator.pin} • Port {actuator.port}
                        </p>
                    </div>
                </div>
                {variant === "control" && onControl && (
                    <ButtonGroup>
                        <Button
                            label="On"
                            onClick={() => onControl(actuator.id, true)}
                            disabled={loading || isActive || !actuator.is_active}
                            className={`flex-1 ${isActive || !actuator.is_active
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : `${colors.bg} ${colors.hover} text-white`
                                }`}
                            size="xs"
                        />
                        <Button
                            label="Off"
                            onClick={() => onControl(actuator.id, false)}
                            disabled={loading || !isActive || !actuator.is_active}
                            className={`flex-1 ${!isActive || !actuator.is_active
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 text-white'
                                }`}
                            size="xs"
                        />
                    </ButtonGroup>
                )}

                {variant === "linked" && onToggle && (
                    <FormToggle
                        id={`toggle-${actuator.id}`}
                        checked={actuator.is_active}
                        onChange={(e) => onToggle(actuator.id, e.target.checked)}
                    />
                )}
            </div>

            {actuator.sensor_key && (
                <p className="text-xs text-gray-600">
                    Linked to: {actuator.sensor_key}
                    {actuator.linked_sensor_value !== null && (
                        <> (Value: {actuator.linked_sensor_value})</>
                    )}
                </p>
            )}

            {!actuator.is_active && (
                <p className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    ⚠️ Actuator is disabled
                </p>
            )}
        </div>
    );
};

export default ActuatorCard;
