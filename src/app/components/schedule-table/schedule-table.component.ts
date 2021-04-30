import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
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
  token;
  userType;
  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.dataSource = this.courseService.getEmptySchedule().schedule;
    this.authService.getToken().subscribe( (token) => {
      this.token = token;
    });
    this.authService.getUserType().subscribe( (userType) => {
      this.userType = userType;
    });
    this.courseService.getschedule().subscribe((schedule) => {
      this.dataSource = schedule.schedule;
    });
    this.courseService.fetchCourses(this.token);
  }

  onClick(event: MouseEvent): void{
    var target: HTMLButtonElement = event.target as HTMLButtonElement
    if(this.userType == "student")
      this.sessionService.joinSession((event.target as HTMLButtonElement).id, this.token);
    else if(this.userType == "instructor")
      this.sessionService.openSession((event.target as HTMLButtonElement).id, this.token);
    else
      console.error("Invalid user type");

    // REDIRECT THE USER
    //this.router.navigate(['conference', target.id], )
  }
}
