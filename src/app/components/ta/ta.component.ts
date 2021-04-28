import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ta',
  templateUrl: './ta.component.html',
  styleUrls: ['./ta.component.sass']
})
export class TaComponent implements OnInit {
  filterData;
  message;
  userType: "instructor" | "student";
  constructor(public dialogRef: MatDialogRef<TaComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.filterData = this.data;
    this.userType = this.filterData.userType;
    this.message = this.filterData.message;
    const rightMostPos = window.innerWidth - Number(this.filterData.left);
    this.dialogRef.updatePosition({ top: `${this.filterData.top}px`,
    right: `${rightMostPos}px`});
  }

}
