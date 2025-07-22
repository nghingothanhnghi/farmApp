// src/components/HydroponicSystemPage/components/ControlPanel.tsx
import React from 'react';
import type { SystemStatus } from '../../../models/interfaces/HydroSystem';
import Button from '../../common/Button';

interface ControlPanelProps {
  systemStatus: SystemStatus | null;
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
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-4">System Controls</h2>
      <div className="space-y-4">
        {/* Pump Controls */}
        <div className="border rounded-lg p-4">
          <div className='flex items-center justify-between mb-3'>
            <h3 className="text-sm font-medium text-gray-700">Water Pump</h3>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${systemStatus?.devices.pump_state ? 'bg-green-600' : 'bg-gray-400'
                  }`}
              ></div>
              <span className="text-xs text-gray-600">
                Status: {' '}
                <span
                  className={`font-medium ${systemStatus?.devices.pump_state ? 'text-green-600' : 'text-gray-400'
                    }`}
                >
                  {systemStatus?.devices.pump_state ? 'Running' : 'Stopped'}
                </span>
              </span>
            </div>
          </div>
          <div className="flex space-x-2 items-center justify-between">
            <Button
              label='Turn On'
              onClick={() => onPumpControl(true)}
              disabled={loading || systemStatus?.devices.pump_state}
              className={`flex-1 ${systemStatus?.devices.pump_state
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              size='xs'
            />
            <Button
              label='Turn Off'
              onClick={() => onPumpControl(false)}
              disabled={loading || !systemStatus?.devices.pump_state}
              className={`flex-1 ${!systemStatus?.devices.pump_state
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              size='xs'
            />
          </div>
        </div>

        {/* Light Controls */}
        <div className="border rounded-lg p-4">
          <div className='flex items-center justify-between mb-3'>
            <h3 className="text-sm font-medium text-gray-700">Grow Lights</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${systemStatus?.devices.light_state ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
              <span className="text-xs text-gray-600">
                Status: {' '}
                <span
                  className={`font-medium ${systemStatus?.devices.light_state ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                >
                  {systemStatus?.devices.light_state ? 'On' : 'Off'}
                </span>
              </span>
            </div>
          </div>
          <div className="flex space-x-2 items-center justify-between">
            <Button
              label='Turn On'
              onClick={() => onLightControl(true)}
              disabled={loading || systemStatus?.devices.light_state}
              className={`flex-1 ${systemStatus?.devices.light_state
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-400 hover:bg-yellow-500 text-white'
                }`}
              size='xs'
            />
            <Button
              label='Turn Off'
              onClick={() => onLightControl(false)}
              disabled={loading || !systemStatus?.devices.light_state}
              className={`flex-1 ${!systemStatus?.devices.light_state
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              size='xs'
            />
          </div>

        </div>

        {/* Scheduler Controls */}
        <div className="border rounded-lg p-4">
          <div className='flex items-center justify-between mb-3'>
            <h3 className="text-sm font-medium text-gray-700">Automation</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${systemStatus?.system.scheduler_state ? 'bg-green-600' : 'bg-gray-400'
                }`}></div>
              <span className="text-xs text-gray-600">
                Status: {' '}
                <span
                  className={` font-medium ${systemStatus?.system.scheduler_state ? 'text-green-600' : 'text-gray-400'
                    }`}
                >
                  {systemStatus?.system.scheduler_state ? 'Running' : 'Stopped'}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-5">
            <div className="text-xs text-gray-600">
              Start automated watering and lighting schedule
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Button
                label="Start"
                onClick={onStartScheduler}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white flex-1"
                size='xs'
              />
              <Button
                label="Stop"
                onClick={onStopScheduler}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 text-white flex-1"
                size='xs'
              />
              <Button
                label="Restart"
                onClick={onRestartScheduler}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600 text-white flex-1"
                size='xs'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;