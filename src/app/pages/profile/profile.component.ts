import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssignStudentComponent } from 'src/app/components/assign-student/assign-student.component';
import { AddCourseDialogComponent } from 'src/app/components/add-course-dialog/add-course-dialog.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, delay, map, retry, retryWhen, tap } from 'rxjs/operators';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  userType: string;
  username: string;
  token: string;
  user_id: number;
  saved_notes: any[];
  courses: any[];
  constructor(
    private assignStudentDialog: MatDialog,
    public addCourseDialog: MatDialog,
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthService,
    private httpService: HttpService) {
    this.username = "";
    this.token = "";
  }

  ngOnInit(): void {
    this.courses = [];
    this.authService.getToken().subscribe(token => {
      this.token = token;
    })

    this.authService.getUsername().subscribe(username => {
      this.username = username;
    })

    this.authService.getUserType().subscribe(userType => {
      this.userType = userType;
    })

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.token
    );

    // var getResponse = this.httpService.get(environment.BACKEND_IP + '/course', headers);
    // console.log(getResponse)
    this.httpService.get(environment.BACKEND_IP + '/course', headers).then((res) => {
      console.log("Retrieved: ", res);
    })
    
    
    // this.httpClient.get<any>(environment.BACKEND_IP + '/course', { headers: headers })
    //   .subscribe((res) => {
    //     console.log(res);
    //     this.courses = res.courses;
    //   },
    //     (err) => {
    //       console.log("Err: ", err);
    //       if (err.status === 401) {
    //         console.log("yes");
    //         this.authService.refreshAccessToken();
    //         setTimeout(() => {
    //           window.location.reload();
    //         }, 1000)
    //       }
    //     })

    if (this.token === "") {
      alert("You are not logged in");
      this.router.navigate(['/auth']);
    }
  }

  addCourse(): void {
    if (this.userType === "instructor") {
      // alert("Not yet implemented");
      // TODO
      this.addCourseDialog.open(AddCourseDialogComponent, {
        height: '800px',
        width: '1200px',
      });
    }
  }

  assignStudent(courseName: string, courseId: number): void {
    console.log(courseId);
    console.log(courseName);
    this.assignStudentDialog.open(AssignStudentComponent, {
      data: { courseName: courseName, courseId: courseId }
    });
  }

}
