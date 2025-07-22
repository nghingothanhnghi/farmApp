// src/utils/sound.ts
export const playAlertSound = () => {
  const audio = new Audio('/sounds/alert.mp3');
  audio.play().catch((err) => {
    console.warn('Unable to play alert sound:', err);
  });
};
