// src/modesls/interfaces/scheduler.ts
export interface JobStatus {
  id: string;
  name: string;
  status: "running" | "stopped";
}

export interface SchedulerHealth {
  scheduler_running: boolean;
  jobs: JobStatus[];
  job_count: number;
  running_count: number;
  stopped_count: number;
}
