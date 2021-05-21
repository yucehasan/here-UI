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
  "Monday": Course;
  "Tuesday": Course;
  "Wednesday": Course;
  "Thursday": Course;
  "Friday": Course;
}

export interface WeeklySchedule {
  schedule: DailySchedule[];
}

interface Course{
    name: string,
    id: number
}

export interface AnalyticsResponse {
  participants: 
    {
      name: string,
      hand_raise_count: number;
    }[],
  timestamps: number[]
}

export interface ParticipantsDetails {
    name: string,
    participation: string
}