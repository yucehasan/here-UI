import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-saved-notes',
  templateUrl: './saved-notes.component.html',
  styleUrls: ['./saved-notes.component.sass'],
})
export class SavedNotesComponent implements OnInit {
  @Input('title') classTitle: string;
  @Input('notes') notes: [];

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {}

  preview(event: MouseEvent) {
    var unified = (event.target as HTMLButtonElement).id.split('-');
    var id = unified[0];
    var course_id = unified[1];
    this.http.get(environment.BACKEND_IP + '/notes', {
      params: {
        id: id,
      },
    }).subscribe(
      (res) => {console.log("response of preview", res)},
      (err) => {console.log("error of preview", err)},
      ()    => {console.log("preview completed")}
    );
  }

  download(event: MouseEvent) {}
}
