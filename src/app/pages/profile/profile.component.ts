import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssignStudentComponent } from 'src/app/components/assign-student/assign-student.component';
import { AddCourseDialogComponent } from 'src/app/components/add-course-dialog/add-course-dialog.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
    private router: Router,
    private authService: AuthService) {
    this.username = "";
    this.token = "";
  }

  ngOnInit(): void {
    // Fetch them from database
    // this.username = "John Doe";
    this.userType = "instructor";
    this.saved_notes = [
      {
        date: "10/11/2020",
        class: "CS464",
        link: ""
      },
      {
        date: "29/01/2021",
        class: "CS413",
        link: ""
      }
    ];
    this.courses = [
      {
        name: "Machine Learning",
        code: "CS464",
      },
      {
        name: "Seminar",
        code: "CS491",
      }
    ];

    this.authService.getToken().subscribe(token => {
      this.token = token;
    })

    this.authService.getUsername().subscribe(username => {
      this.username = username;
    })

    this.authService.getUserType().subscribe(userType => {
      this.userType = userType;
    })
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

  assignStudent(courseCode: string): void {
    this.assignStudentDialog.open(AssignStudentComponent, {
      data: { courseCode: courseCode }
    });
  }

}
