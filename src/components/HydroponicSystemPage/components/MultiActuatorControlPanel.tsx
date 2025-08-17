// src/components/HydroponicSystemPage/components/MultiActuatorControlPanel.tsx
import React, { useEffect } from 'react';
import type { SystemStatusPerDevice, HydroActuator } from '../../../models/interfaces/HydroSystem';
import Button from '../../common/Button';
import ButtonGroup from '../../common/ButtonGroup';
import DropdownButton from '../../common/DropdownButton';
import Badge from '../../common/Badge';
import { playSound } from '../../../utils/sound';

interface MultiActuatorControlPanelProps {
  systemStatus: SystemStatusPerDevice | null;
  onActuatorControl: (actuatorId: number, turnOn: boolean) => void;
  onStartScheduler: () => void;
  onStopScheduler: () => void;
  onRestartScheduler: () => void;
  loading?: boolean;
}

const MultiActuatorControlPanel: React.FC<MultiActuatorControlPanelProps> = ({
  systemStatus,
  onActuatorControl,
  onStartScheduler,
  onStopScheduler,
  onRestartScheduler,
  loading = false
}) => {
  console.log('MultiActuatorControlPanel - systemStatus:', systemStatus);

  const handleActuatorControl = (actuatorId: number, turnOn: boolean) => {
    playSound(turnOn ? 'on' : 'off');
    onActuatorControl(actuatorId, turnOn);
  };

  const handleStartScheduler = () => {
    playSound('success');
    onStartScheduler();
  };

  const handleStopScheduler = () => {
    playSound('off');
    onStopScheduler();
  };

  const handleRestartScheduler = () => {
    playSound('on');
    onRestartScheduler();
  };

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
        return { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' };
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

  // Group actuators by type for better organization
  const groupedActuators = React.useMemo(() => {
    if (!systemStatus?.actuators) return {};

    return systemStatus.actuators.reduce((groups, actuator) => {
      const type = actuator.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(actuator);
      return groups;
    }, {} as Record<string, HydroActuator[]>);
  }, [systemStatus?.actuators]);

  const renderActuatorControl = (actuator: HydroActuator) => {
    const colors = getActuatorColor(actuator.type);
    const isActive = actuator.current_state;

    return (
      <div key={actuator.id} className="bg-gray-100 rounded-lg px-4 py-2">
        <div className='flex items-center justify-between mb-1'>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getActuatorIcon(actuator.type)}</span>
            <div>
              <h3 className="text-[0.625rem] font-medium text-gray-700">{actuator.name}</h3>
              <p className="text-[0.625rem] text-gray-500">
                {actuator.type.charAt(0).toUpperCase() + actuator.type.slice(1)} • Pin {actuator.pin} • Port {actuator.port}
              </p>
            </div>
          </div>
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
        <div className="flex items-center justify-between space-x-5">
          <div className="flex-1 text-[0.625rem] text-gray-600 line-clamp-2">
            {actuator.sensor_key && (
              <span>Linked to: {actuator.sensor_key}</span>
            )}
            {actuator.linked_sensor_value !== null && (
              <span> (Value: {actuator.linked_sensor_value})</span>
            )}
          </div>
          <div className="w-[180px] flex space-x-2 items-center justify-end">
            <ButtonGroup>
              <Button
                label='On'
                onClick={() => handleActuatorControl(actuator.id, true)}
                disabled={loading || isActive || !actuator.is_active}
                className={`flex-1 ${isActive || !actuator.is_active
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : `${colors.bg} ${colors.hover} text-white`
                  }`}
                size='xs'
              />
              <Button
                label='Off'
                onClick={() => handleActuatorControl(actuator.id, false)}
                disabled={loading || !isActive || !actuator.is_active}
                className={`flex-1 ${!isActive || !actuator.is_active
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                size='xs'
              />
            </ButtonGroup>
          </div>
        </div>

        {!actuator.is_active && (
          <div className="mt-2 text-[0.625rem] text-orange-600 bg-orange-50 px-2 py-1 rounded">
            ⚠️ Actuator is disabled
          </div>
        )}
      </div>
    );
  };

  // State for currently selected type
  const [selectedType, setSelectedType] = React.useState<string | null>(null);

  // When groupedActuators changes, set the default
  useEffect(() => {
    if (!selectedType && Object.keys(groupedActuators).length > 0) {
      setSelectedType(Object.keys(groupedActuators)[0]);
    }
  }, [groupedActuators, selectedType]);

  const typeDropdownItems = Object.keys(groupedActuators).map((type) => ({
    label: `${getActuatorIcon(type)} ${type.replace("_", " ")} (${groupedActuators[type].length})`,
    value: type,
  }));

  return (
    <div className='flex-1 overflow-y-auto space-y-0.5'>
      {/* Summary Stats */}
      {systemStatus?.actuators && systemStatus.actuators.length > 0 && (
        <div className="bg-gray-100 rounded-lg py-2 px-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4 items-center">
              <Badge size="xsmall">
                Total: {systemStatus.actuators.length}
              </Badge>
              <Badge size="xsmall">
                Active: {systemStatus.actuators.filter(a => a.current_state).length}
              </Badge>
              <Badge size="xsmall">
                Enabled: {systemStatus.actuators.filter(a => a.is_active).length}
              </Badge>
            </div>
            <DropdownButton
              label={
                selectedType
                  ? `${selectedType.replace("_", " ")} (${groupedActuators[selectedType].length})`
                  : "Select Actuator Type"
              }
              items={typeDropdownItems}
              onSelect={(item) => setSelectedType(item.value)}
              size='xs'
              direction='left'
            />
          </div>
        </div>
      )}
      {/* Show only actuators from the selected group */}
      {selectedType && (
        <>
          {groupedActuators[selectedType].map((actuator) => (
            <div key={actuator.id}>
              {renderActuatorControl(actuator)}
            </div>
          ))}
        </>
      )}


      {/* Scheduler Controls */}
      <div className="bg-gray-100 rounded-lg p-4 border-t-2 border-blue-200">
        <div className='flex items-center justify-between mb-1'>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🤖</span>
            <h3 className="text-sm font-medium text-gray-700">System Automation</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${systemStatus?.system?.scheduler_state ? 'bg-green-600' : 'bg-gray-400'
              }`}></div>
            <span className="text-xs text-gray-600">
              <span
                className={` font-medium ${systemStatus?.system?.scheduler_state ? 'text-green-600' : 'text-gray-400'
                  }`}
              >
                {systemStatus?.system?.scheduler_state ? 'Running' : 'Stopped'}
              </span>
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-5">
          <div className="flex-1 text-[0.625rem] text-gray-600 line-clamp-2">
            Automated control based on sensor readings and thresholds
          </div>
          <div className="w-[180px] flex items-center justify-end space-x-2">
            <ButtonGroup>
              <Button
                label="Start"
                onClick={handleStartScheduler}
                disabled={loading || systemStatus?.system?.scheduler_state === true}
                className={`flex-1 ${systemStatus?.system?.scheduler_state === true
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                size='xs'
              />
              <Button
                label="Stop"
                onClick={handleStopScheduler}
                disabled={loading || systemStatus?.system?.scheduler_state === false}
                className={`flex-1 ${systemStatus?.system?.scheduler_state === false
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                size='xs'
              />
              <Button
                label="Restart"
                onClick={handleRestartScheduler}
                disabled={loading || systemStatus?.system?.scheduler_state === false}
                className={`flex-1 ${systemStatus?.system?.scheduler_state === false
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
                size='xs'
              />
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiActuatorControlPanel;