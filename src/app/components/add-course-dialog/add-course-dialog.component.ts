import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
  styleUrls: ['./add-course-dialog.component.sass']
})
export class AddCourseDialogComponent implements OnInit {

  dataSource = DATA_SOURCE;
  days = DAYS;
  hours = HOURS;
  checkboxes: boolean[][];
  constructor(
    public dialogRef: MatDialogRef<AddCourseDialogComponent>) {
    this.checkboxes = new Array(5)
      .fill(false)
      .map(() => new Array(8)
        .fill(false));
  }

  ngOnInit(): void {

  }

  onSave(): void {
    console.log("Save");
    for (let i = 0; i < DAYS.length; i++) {
      for (let j = 0; j < HOURS.length; j++) {
        if (this.checkboxes[i][j]) {
          console.log(DAYS[i] + " " + HOURS[j]);
        }
      }
    }
  }

  onCancel(): void {
    console.log("Cancel");
    this.dialogRef.close();
  }

  onCheckChange(event) {
    console.log(event.checked);
    console.log(event.source.id);
    var hour = event.source.id.split("-")[0];
    var day = event.source.id.split("-")[1];
    var hourIndex = HOURS.indexOf(hour);
    var dayIndex = DAYS.indexOf(day);
    console.log("Hour: " + hour);
    console.log("Day: " + day);
    console.log("Checked: " + event.checked);
    console.log("Day Index:" + dayIndex);
    console.log("Hour Index:" + hourIndex);
    this.checkboxes[dayIndex][hourIndex] = event.checked;
  }
}

const DAYS: String[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
];

const HOURS: String[] = [
  "8.30", "9.30", "10.30", "11.30", "13.30", "14.30", "15.30", "16.30"
];

const DATA_SOURCE = [
  { days: DAYS, hours: HOURS }
];
