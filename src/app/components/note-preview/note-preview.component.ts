import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-note-preview',
  templateUrl: './note-preview.component.html',
  styleUrls: ['./note-preview.component.sass']
})
export class NotePreviewComponent implements OnInit {
  b64;
  constructor(    
    private dialogRef: MatDialogRef<NotePreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.b64 = "data:image/png;base64," + this.data
  }

  download(): void {
    const downloadLink = document.createElement("a");
    const fileName = "Image.png";
  
    downloadLink.href = this.b64;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  close(): void {
    this.dialogRef.close();
  }
}
