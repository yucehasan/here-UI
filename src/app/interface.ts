export interface ScheduleResponse {
  courses: [
    {
      id: number;
      name: string;
      slots: string;
    }
  ];
}

export interface DailySchedule {
  "hour": string; //TODO hours will be seperate
  "Monday": string;
  "Tuesday": string;
  "Wednesday": string;
  "Thursday": string;
  "Friday": string;
}

export interface WeeklySchedule {
  schedule: DailySchedule[];
}
