// src/models/interfaces/PageTitle.ts
import type { ReactNode } from 'react';
export interface PageTitleProps {
  title: string;
  subtitle?: string; // optional subtitle for additional context
  actions?: ReactNode; // anything: button, dropdown, etc.
}
