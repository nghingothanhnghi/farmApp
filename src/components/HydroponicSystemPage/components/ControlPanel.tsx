// src/components/HydroponicSystemPage/components/ControlPanel.tsx
import React from 'react';
import type { SystemStatusPerDevice } from '../../../models/interfaces/HydroSystem';
import Button from '../../common/Button';
import ButtonGroup from '../../common/ButtonGroup';
import { playSound } from '../../../utils/sound';

interface ControlPanelProps {
  systemStatus: SystemStatusPerDevice | null;
  onPumpControl: (turnOn: boolean) => void;
  onLightControl: (turnOn: boolean) => void;
  onStartScheduler: () => void;
  onStopScheduler: () => void;
  onRestartScheduler: () => void;
  loading?: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  systemStatus,
  onPumpControl,
  onLightControl,
  onStartScheduler,
  onStopScheduler,
  onRestartScheduler,
  loading = false
}) => {
  // 👇 Log the current system status
  console.log('ControlPanel - systemStatus:', systemStatus);

  const handlePumpControl = (turnOn: boolean) => {
    playSound(turnOn ? 'on' : 'off');
    onPumpControl(turnOn);
  };

  const handleLightControl = (turnOn: boolean) => {
    playSound(turnOn ? 'on' : 'off');
    onLightControl(turnOn);
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

  return (
    <div>
      <div className="space-y-0.5">
        {/* Pump Controls */}
        <div className="bg-gray-100 rounded-lg p-4">
          <div className='flex items-center justify-between mb-1'>
            <h3 className="text-sm font-medium text-gray-700">Water Pump</h3>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${systemStatus?.actuators?.pump ? 'bg-green-600' : 'bg-gray-400'
                  }`}
              ></div>
              <span className="text-xs text-gray-600">
                <span
                  className={`font-medium ${systemStatus?.actuators?.pump ? 'text-green-600' : 'text-gray-400'
                    }`}
                >
                  {systemStatus?.actuators?.pump ? 'Running' : 'Stopped'}
                </span>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-5">
            <div className="flex-1 text-[0.625rem] text-gray-600 line-clamp-2">

            </div>
            <div className="w-[180px] flex space-x-2 items-center justify-end">
              <ButtonGroup>
                <Button
                  label='On'
                  onClick={() => handlePumpControl(true)}
                  disabled={loading || systemStatus?.actuators?.pump}
                  className={`flex-1 ${systemStatus?.actuators?.pump
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  size='xs'
                />
                <Button
                  label='Off'
                  onClick={() => handlePumpControl(false)}
                  disabled={loading || !systemStatus?.actuators?.pump}
                  className={`flex-1 ${!systemStatus?.actuators?.pump
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  size='xs'
                />

              </ButtonGroup>

            </div>
          </div>

        </div>

        {/* Light Controls */}
        <div className="bg-gray-100 rounded-lg p-4">
          <div className='flex items-center justify-between mb-1'>
            <h3 className="text-sm font-medium text-gray-700">Grow Lights</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${systemStatus?.actuators?.light ? 'bg-green-600' : 'bg-gray-400'
                }`}></div>
              <span className="text-xs text-gray-600">
                <span
                  className={`font-medium ${systemStatus?.actuators?.light ? 'text-green-600' : 'text-gray-400'
                    }`}
                >
                  {systemStatus?.actuators?.light ? 'On' : 'Off'}
                </span>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-5">
            <div className="flex-1 text-[0.625rem] text-gray-600 line-clamp-2">
              Start automated watering and lighting schedule
            </div>
            <div className="w-[180px] flex space-x-2 items-center justify-end">
              <ButtonGroup>
                <Button
                  label='On'
                  onClick={() => handleLightControl(true)}
                  disabled={loading || systemStatus?.actuators?.light}
                  className={`flex-1 ${systemStatus?.actuators?.light
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  size='xs'
                />
                <Button
                  label='Off'
                  onClick={() => handleLightControl(false)}
                  disabled={loading || !systemStatus?.actuators?.light}
                  className={`flex-1 ${!systemStatus?.actuators?.light
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  size='xs'
                />
              </ButtonGroup>


            </div>
          </div>
        </div>

        {/* Scheduler Controls */}
        <div className="bg-gray-100 rounded-lg p-4">
          <div className='flex items-center justify-between mb-1'>
            <h3 className="text-sm font-medium text-gray-700">Automation</h3>
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
              Start automated watering and lighting schedule
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
    </div>
  );
};

export default ControlPanel;