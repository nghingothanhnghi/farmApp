// src/models/interfaces/PageTitle.ts
import type { ReactNode } from 'react';
export interface PageTitleProps {
  title: string;
  subtitle?: ReactNode; // optional subtitle for additional context
  actions?: ReactNode; // anything: button, dropdown, etc.
}
