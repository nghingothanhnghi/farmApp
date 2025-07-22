import type { AnnouncementType } from '../types/AnnouncementType';
import type { ReactNode } from 'react';
export interface IAnnouncementProps {
  type?: AnnouncementType;
  title?: string;
  message: ReactNode; // ⬅️ Accepts HTML/JSX now
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}
