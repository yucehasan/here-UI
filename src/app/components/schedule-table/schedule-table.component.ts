import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ScheduleResponse, WeeklySchedule } from '../../interface';
import { CourseService } from '../../services/course.service';
import { SessionService } from '../../services/session.service';

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
  constructor(
    private courseService: CourseService,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.dataSource = this.courseService.getEmptySchedule();
    this.courseService.getschedule().subscribe((schedule) => {
      this.dataSource = schedule.schedule;
    });
    this.courseService.fetchCourses();
  }

  onClick(event: MouseEvent): void{
    var target: HTMLButtonElement = event.target as HTMLButtonElement
    this.router.navigate(['conference', target.id], )
  }
}
