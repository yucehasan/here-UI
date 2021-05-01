import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CourseService } from 'src/app/services/course.service';

// TODO: Add text input for course code and course name, merge them together and send to the backend as a single string
@Component({
  selector: 'app-add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
  styleUrls: ['./add-course-dialog.component.sass'],
})
export class AddCourseDialogComponent implements OnInit {
  username: string;
  token: string;
  userType: string;
  displayedColumns: string[] = [
    'hour',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];
  hours: String[] = [
    '8.30',
    '9.30',
    '10.30',
    '11.30',
    '13.30',
    '14.30',
    '15.30',
    '16.30',
  ];
  dataSource;
  courseName: string = '';
  checkboxes: boolean[][];
  SERVER_URL = 'https://hereapp-live.herokuapp.com/course';
  // /course/id: parameter: student email

  constructor(
    private courseService: CourseService,
    public dialogRef: MatDialogRef<AddCourseDialogComponent>,
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this.checkboxes = new Array(5)
      .fill(false)
      .map(() => new Array(8).fill(false));
    this.username = '';
    this.token = '';
    this.userType = '';
  }

  ngOnInit(): void {
    this.dataSource = this.courseService.getEmptySchedule().schedule;
    this.authService.getToken().subscribe((token) => {
      this.token = token;
    });
    this.authService.getUsername().subscribe((username) => {
      this.username = username;
    });
    this.authService.getUserType().subscribe((userType) => {
      this.userType = userType;
    });
  }

  onSave(): void {
    // /course post request token, coursename, slot string
    // /assign student: student email, course id
    console.log('Save');
    console.log(this.courseName);
    var count: number = 0;
    var slots: string = '';
    for (let i = 0; i < DAYS.length; i++) {
      for (let j = 0; j < HOURS.length; j++) {
        if (this.checkboxes[i][j]) {
          var currentSlot: string = DAYS[i] + '-' + HOURS[j] + ',';
          console.log(currentSlot);
          slots = slots.concat(currentSlot);
          count++;
        }
      }
    }
    if(this.courseName.trim().length === 0) alert('Enter course name');
    else if (count > 6) alert('Too many hours');
    else if (count == 0) alert('You have to pick hours');
    else {
      const formData = new FormData();
      formData.append('course_name', this.courseName);
      formData.append('slots', slots.slice(0, -1));

      const headers = new HttpHeaders().set(
        'Authorization',
        'Bearer ' + this.token
      );

      console.log('Form data Course name: ' + formData.get('course_name'));
      console.log('Form data Slots: ' + formData.get('slots'));
      this.httpClient
        .post<any>(this.SERVER_URL, formData /*, { headers: headers } */)
        .subscribe((res) => {
          console.log(res);
          alert("The course is added");
          this.dialogRef.close();
        });
    }
  }

  onCancel(): void {
    console.log('Cancel');
    this.dialogRef.close();
  }

  onCheckChange(event) {
    // console.log(event.checked);
    // console.log(event.source.id);
    var hour = this.hours[event.source.id.split('-')[0] as number];
    var day = event.source.id.split('-')[1];
    var hourIndex = event.source.id.split('-')[0];
    var dayIndex = DAYS.indexOf(day);
    // console.log("Hour: " + hour);
    // console.log("Day: " + day);
    // console.log("Checked: " + event.checked);
    // console.log("Day Index:" + dayIndex);
    // console.log("Hour Index:" + hourIndex);
    this.checkboxes[dayIndex][hourIndex] = event.checked;
    console.log(this.checkboxes);
  }
}

const DAYS: String[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const HOURS: String[] = [
  '8.30',
  '9.30',
  '10.30',
  '11.30',
  '13.30',
  '14.30',
  '15.30',
  '16.30',
];

const DATA_SOURCE = [{ days: DAYS, hours: HOURS }];
