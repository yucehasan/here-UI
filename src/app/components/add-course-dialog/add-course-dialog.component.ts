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
  constructor(
    public dialogRef: MatDialogRef<AddCourseDialogComponent>){}

  ngOnInit(): void {
  }

  onSave(): void {
    console.log("Save");
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
