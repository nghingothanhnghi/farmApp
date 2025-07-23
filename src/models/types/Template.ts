// src/models/types/Template.ts
export interface Template {
  id: number;
  client_id: string;
  mapping: Record<string, any>;
  created_at: string;
  updated_at: string;
}
