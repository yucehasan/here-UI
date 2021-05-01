import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotesService } from 'src/app/services/notes.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-saved-notes',
  templateUrl: './saved-notes.component.html',
  styleUrls: ['./saved-notes.component.sass'],
})
export class SavedNotesComponent implements OnInit {
  @Input('title') classTitle: string;
  @Input('notes') notes: [];

  constructor(private authService: AuthService, private http: HttpClient, private notesService: NotesService) {}
  token;
  ngOnInit(): void {
    this.authService.getToken().subscribe( (token) => {
      this.token = token
    })
  }

  fetchAnote(note_id) {
    this.notesService.fetchANote(note_id, this.token);
  }

  preview(note_id) {
    this.fetchAnote(note_id);
  }

  download(event: MouseEvent) {}
}
