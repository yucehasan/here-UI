import { _isNumberValue } from '@angular/cdk/coercion';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-assign-student',
  templateUrl: './assign-student.component.html',
  styleUrls: ['./assign-student.component.sass']
})
export class AssignStudentComponent implements OnInit {
  studentEmail: string;
  username: string;
  token: string;
  userType: string;
  SERVER_URL: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { courseName: string, courseId: number},
    private dialogRef: MatDialogRef<AssignStudentComponent>,
    private httpClient: HttpClient,
    private authService: AuthService) {
    this.username = '';
    this.token = '';
    this.userType = '';
    this.SERVER_URL = 'https://hereapp-live.herokuapp.com/course/' + this.data.courseId;
  }

  ngOnInit(): void {
    this.authService.getToken().subscribe((token) => {
      this.token = token;
    });
    this.authService.getUsername().subscribe((username) => {
      this.username = username;
    });
    this.authService.getUserType().subscribe((userType) => {
      this.userType = userType;
    });
    this.studentEmail = undefined;
  }

  assignStudent(): void {
    if (this.studentEmail != undefined) {
      if (this.studentEmail.length > 0) {
        alert("Assigning " + this.studentEmail + " to " + this.data.courseName);

       const formData = new FormData();
        formData.append('student_email', this.studentEmail);

        const headers = new HttpHeaders().set(
          'Authorization',
          'Bearer ' + this.token
        );
        this.httpClient.post<any>(this.SERVER_URL, formData, { headers: headers })
          .subscribe((res) => {
            console.log(res);
          })
        this.dialogRef.close();
      }
      else {
        alert("Enter student email");
      }
    }
    else {
      alert("Enter a valid ID");
    }
  }
}
