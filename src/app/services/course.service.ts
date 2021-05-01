import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ScheduleResponse, WeeklySchedule } from '../interface';
import { AuthService } from './auth.service';
import { HttpService } from 'src/app/services/http.service';

const EMPTYDATA: WeeklySchedule = {
  schedule: [
    {
      hour: '8.30',
      Monday: { name: '', id: undefined },
      Tuesday: { name: '', id: undefined },
      Wednesday: { name: '', id: undefined },
      Thursday: { name: '', id: undefined },
      Friday: { name: '', id: undefined },
    },
    {
      hour: '9.30',
      Monday: { name: '', id: undefined },
      Tuesday: { name: '', id: undefined },
      Wednesday: { name: '', id: undefined },
      Thursday: { name: '', id: undefined },
      Friday: { name: '', id: undefined },
    },
    {
      hour: '10.30',
      Monday: { name: '', id: undefined },
      Tuesday: { name: '', id: undefined },
      Wednesday: { name: '', id: undefined },
      Thursday: { name: '', id: undefined },
      Friday: { name: '', id: undefined },
    },
    {
      hour: '11.30',
      Monday: { name: '', id: undefined },
      Tuesday: { name: '', id: undefined },
      Wednesday: { name: '', id: undefined },
      Thursday: { name: '', id: undefined },
      Friday: { name: '', id: undefined },
    },
    {
      hour: '13.30',
      Monday: { name: '', id: undefined },
      Tuesday: { name: '', id: undefined },
      Wednesday: { name: '', id: undefined },
      Thursday: { name: '', id: undefined },
      Friday: { name: '', id: undefined },
    },
    {
      hour: '14.30',
      Monday: { name: '', id: undefined },
      Tuesday: { name: '', id: undefined },
      Wednesday: { name: '', id: undefined },
      Thursday: { name: '', id: undefined },
      Friday: { name: '', id: undefined },
    },
    {
      hour: '15.30',
      Monday: { name: '', id: undefined },
      Tuesday: { name: '', id: undefined },
      Wednesday: { name: '', id: undefined },
      Thursday: { name: '', id: undefined },
      Friday: { name: '', id: undefined },
    },
    {
      hour: '16.30',
      Monday: { name: '', id: undefined },
      Tuesday: { name: '', id: undefined },
      Wednesday: { name: '', id: undefined },
      Thursday: { name: '', id: undefined },
      Friday: { name: '', id: undefined },
    },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  schedule: WeeklySchedule;
  scheduleSub = new Subject<WeeklySchedule>();

  constructor(private authService: AuthService, 
    private httpService: HttpService) {
    this.schedule = EMPTYDATA;
  }

  getEmptySchedule(): WeeklySchedule {
    return EMPTYDATA;
  }

  fetchCourses(token): void {
    var headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + token
    );
    console.log(headers);
    this.httpService.get(environment.BACKEND_IP + "/course", headers).subscribe((res) => {
      console.log(res)
      this.updateSchedule(res);
    },
      (err) => {
        console.log("Got an error")
        this.authService.refreshAccessToken().then((token) => {
          console.log("new token:", token)
          const headers = new HttpHeaders().set(
            'Authorization',
            'Bearer ' + token
          );
          this.httpService.get(environment.BACKEND_IP + '/course', headers).subscribe(
            (res) => {
              console.log(res);
              this.updateSchedule(res)
            })
        }).catch((err) => {
          console.log(err);
        });
      }
    );
  }

  updateSchedule(response: ScheduleResponse): void {
    var fetchedData = response.courses;
    var aSlot;
    fetchedData.forEach((course) => {
      course.slots.split(',').forEach((slot) => {
        aSlot = slot.split('-');
        this.schedule.schedule[this.getHourIndex(aSlot[1])][aSlot[0]] = {
          name: course.name,
          id: course.id
        }
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
