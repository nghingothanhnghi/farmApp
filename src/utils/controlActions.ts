// src/utils/controlActions.ts
import type { ControlAction } from '../models/interfaces/HydroSystem';

export async function handleControlAction(
  label: string,
  actionFn: () => Promise<{ status: string }>,
  setControlActions: React.Dispatch<React.SetStateAction<ControlAction[]>>,
  setError?: React.Dispatch<React.SetStateAction<string | null>>
) {
  try {
    const result = await actionFn();
    const successAction: ControlAction = {
      action: label,
      timestamp: new Date().toISOString(),
      success: true,
      message: result.status
    };
    setControlActions(prev => [successAction, ...prev.slice(0, 9)]);
  } catch (err) {
    const failureAction: ControlAction = {
      action: label,
      timestamp: new Date().toISOString(),
      success: false,
      message: `Failed to ${label.toLowerCase()}`
    };
    setControlActions(prev => [failureAction, ...prev.slice(0, 9)]);
    if (setError) setError(`Failed to ${label.toLowerCase()}`);
  }
}
