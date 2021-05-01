import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssignStudentComponent } from 'src/app/components/assign-student/assign-student.component';
import { AddCourseDialogComponent } from 'src/app/components/add-course-dialog/add-course-dialog.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {
  token: string;
  courses: any[];
  constructor(
    private assignStudentDialog: MatDialog,
    public addCourseDialog: MatDialog,
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.token = '';
  }

  ngOnInit(): void {
    this.courses = [];
    this.authService.getToken().subscribe((token) => {
      this.token = token;
    });

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.token
    );

    this.httpClient
      .get<any>(environment.BACKEND_IP + '/course', { headers: headers })
      .subscribe(
        (res) => {
          console.log(res);
          this.courses = res.courses;
        },
        (err) => {
          console.log("Got an error")
          this.authService.refreshAccessToken().then( (token) => {
            console.log("new token:", token)
            const headers = new HttpHeaders().set(
              'Authorization',
              'Bearer ' + this.token
            );
            this.httpClient.get<any>(environment.BACKEND_IP + '/course', { headers: headers }).subscribe(
              (res) => {
                console.log(res);
                this.courses = res.courses;
              })
          }).catch( (err) => {
            console.log(err);
          });
        },
        () => {console.log("Completed")}
      );

    // if (this.token === "") {
    //   alert("You are not logged in");
    //   this.router.navigate(['/']);
    // }
  }

  addCourse(): void {
    this.addCourseDialog.open(AddCourseDialogComponent, {});
  }

  assignStudent(courseName: string, courseId: number): void {
    this.assignStudentDialog.open(AssignStudentComponent, {
      data: { courseName: courseName, courseId: courseId },
    });
  }
}
