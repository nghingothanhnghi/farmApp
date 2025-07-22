// src/interfaces/role.ts
// This file defines the TypeScript interface for the Role model used in the application.
export interface Role {
  id: number;
  name: string;               // Internal name (e.g., "ADMIN")
  display_name: string;        // Friendly name (e.g., "Administrator")
  description?: string;
  is_active?: boolean;
  is_system_role: boolean;
  permissions?: string[];       // JSON string from backend
  created_at: string;
  updated_at?: string;
}
