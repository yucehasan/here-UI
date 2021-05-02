import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssignStudentComponent } from 'src/app/components/assign-student/assign-student.component';
import { AddCourseDialogComponent } from 'src/app/components/add-course-dialog/add-course-dialog.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http.service';
import { ErrorComponent } from '../error/error.component';

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
    private router: Router,
    private authService: AuthService,
    private httpService: HttpService,
    private dialogController: MatDialog
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

    this.httpService.get(environment.BACKEND_IP + '/course', headers).subscribe(
      (res) => {
        console.log(res);
        this.courses = res.courses;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addCourse(): void {
    this.addCourseDialog.open(AddCourseDialogComponent, {});
  }

  assignStudent(courseName: string, courseId: number): void {
    this.assignStudentDialog.open(AssignStudentComponent, {
      data: { courseName: courseName, courseId: courseId },
    });
  }

  uploadFile(event): void {
    var files = (document.getElementById('pdf-input') as HTMLInputElement)
      .files;
    if (files.length > 0) {
      var fileToLoad = files[0];
      var fileReader = new FileReader();
      var base64File;
      fileReader.onload = (event) => {
        base64File = event.target.result;
        // Send base64file to backend

        this.dialogController.open(ErrorComponent, {
          data: "File successfully uploaded."
        });

      //   const headers = new HttpHeaders().set(
      //     'Authorization',
      //     'Bearer ' + this.token
      //   );

      //   var formData = new FormData();
      //   formData.append('pdf', base64File);

      //   this.httpService
      //     .post(environment.BACKEND_IP + '/course', formData, headers)
      //     .subscribe(
      //       (res) => {
      //         console.log(res);
      //         this.dialogController.open(ErrorComponent, {
      //           data: "File successfully uploaded."
      //         });
      //       },
      //       (err) => {
      //         console.log(err);
      //       }
      //     );
      };

      // Convert data to base64
      fileReader.readAsDataURL(fileToLoad);
    }
  }
}
