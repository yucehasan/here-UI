import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-canvas-text-input',
  templateUrl: './canvas-text-input.component.html',
  styleUrls: ['./canvas-text-input.component.sass']
})
export class CanvasTextInputComponent implements OnInit {
  filterData;
  value;
  constructor(
    public dialogRef: MatDialogRef<CanvasTextInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.setPosition();
  }

  close(){
    this.dialogRef.close(this.value);
  }

  setPosition(): void {
    console.log("data", this.data)
    this.filterData = this.data;
    const leftMosPos = Number(this.filterData.left);
    const upMosPos = 140 
    console.log(this.filterData);
    this.dialogRef.updatePosition({
      bottom: `${upMosPos}px`,
      left: `${leftMosPos}px`,
    });
  }
}
