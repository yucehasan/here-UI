import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { NotesService } from 'src/app/services/notes.service';
import { environment } from 'src/environments/environment';
import { NotePreviewComponent } from '../note-preview/note-preview.component';

@Component({
  selector: 'app-saved-notes',
  templateUrl: './saved-notes.component.html',
  styleUrls: ['./saved-notes.component.sass'],
})
export class SavedNotesComponent implements OnInit {
  @Input('title') classTitle: string;
  @Input('notes') notes: [];

  constructor(private authService: AuthService, private dialog: MatDialog, private http: HttpClient, private notesService: NotesService) {}
  token;
  ngOnInit(): void {
    this.authService.getToken().subscribe( (token) => {
      this.token = token
    })
  }


  preview(note_id) {
    this.notesService.fetchANote(note_id, this.token).then(
      (res) => {
          console.log(res);
          this.dialog.open(NotePreviewComponent, {
            data: res
          });
      }
    ).catch(
      (err) => {
        console.error("Error -->", err);
      }
    );
  }

  download(note_id) {
    this.notesService.fetchANote(note_id, this.token).then(
      (res) => {
          console.log(res);
          const downloadLink = document.createElement("a");
          const fileName = "Image.png";
          downloadLink.href = "data:image/png;base64," + res;
          downloadLink.download = fileName;
          downloadLink.click();
      }
    ).catch(
      (err) => {
        console.error("Error -->", err);
      }
    );
  }
}
