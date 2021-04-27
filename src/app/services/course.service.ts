import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { ScheduleResponse, WeeklySchedule } from '../interface';

const EMPTYDATA: WeeklySchedule = {
  schedule: [
    {
      hour: '8.30',
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
    },
    {
      hour: '9.30',
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
    },
    {
      hour: '10.30',
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
    },
    {
      hour: '11.30',
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
    },
    {
      hour: '13.30',
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
    },
    {
      hour: '14.30',
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
    },
    {
      hour: '15.30',
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
    },
    {
      hour: '16.30',
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
    },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  schedule: WeeklySchedule;
  scheduleSub = new Subject<WeeklySchedule>();

  constructor() {
    this.schedule = EMPTYDATA;
  }

  getEmptySchedule(): WeeklySchedule{
    return EMPTYDATA;
  }

  updateSchedule(response: ScheduleResponse): void {
    var fetchedData = response.courses;
    var aSlot;
    console.log(this.schedule);
    fetchedData.forEach((course) => {
      console.log('id', course.id, 'name', course.name);
      course.slots.split(',').forEach((slot) => {
        aSlot = slot.split('-');
        this.schedule.schedule[this.getHourIndex(aSlot[1])][aSlot[0]] =
          course.name;
      });
    });
    this.scheduleSub.next(this.schedule);
  }

  getHourIndex(hour: string): number {
    switch (hour) {
      case '8.30':
        return 0;
      case '9.30':
        return 1;
      case '10.30':
        return 2;
      case '11.30':
        return 3;
      case '13.30':
        return 4;
      case '14.30':
        return 5;
      case '15.30':
        return 6;
      case '16.30':
        return 7;
      default:
        return -1;
    }
  }

  getschedule(): Observable<WeeklySchedule> {
    return this.scheduleSub.asObservable();
  }
}
