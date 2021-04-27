import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ScheduleResponse, WeeklySchedule } from '../../interface';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.sass'],
})
export class ScheduleTableComponent implements OnInit {
  displayedColumns: string[] = [
    'hour',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];
  dataSource;
  response: ScheduleResponse = {
    courses: [
      {
        id: 26,
        name: 'selam',
        slots: 'Monday-8.30,Monday-9.30,Friday-10.30,Friday-11.30',
      },
    ],
  };
  constructor(private courseService: CourseService, private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.httpClient.get<any>(environment.SCHEDULE_ENDPOINT).subscribe(
      (res) => {
        if (res['access_token'] !== undefined) {
          console.log('');
        }
        else {
          console.log(res);
          console.log("Failed");
        }
      }
    );
    this.dataSource = this.courseService.getEmptySchedule();
    this.courseService.getschedule().subscribe((schedule) => {
      console.log("yeni geldi", schedule)
      this.dataSource = schedule.schedule;
    });
    this.courseService.updateSchedule(this.response);
  }

  fetchCourses(): void {

  }

}

const response = {
  courses: [
    {
      id: 26,
      name: 'selam',
      slots: 'Monday-8.30,Monday-9.30,Friday-10.30,Friday-11.30',
    },
  ],
};
