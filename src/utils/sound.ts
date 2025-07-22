// src/utils/sound.ts
type SoundType = 'on' | 'off' | 'alert' | 'error' | 'success';

const soundMap: Record<SoundType, string> = {
  on: '/sounds/on.mp3',
  off: '/sounds/off.mp3',
  alert: '/sounds/alert.mp3',
  error: '/sounds/error.mp3',
  success: '/sounds/start-schedule.mp3',
};

export const playSound = (type: SoundType) => {
  const src = soundMap[type];
  if (!src) return;

  const audio = new Audio(src);
  audio.play().catch(err => {
    console.warn(`Failed to play sound "${type}":`, err);
  });
};

