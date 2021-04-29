import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

const TRY = {
  CS464: [
    {
      id: 1,
      date: 'bugun',
      course_id: 27,
    },
    {
      id: 2,
      date: 'dun',
      course_id: 27,
    },
  ],
  selam: [
    {
      id: 3,
      date: 'yarın',
      course_id: 26,
    },
    {
      id: 4,
      date: 'sonra',
      course_id: 26,
    },
  ],
};

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit {
  upcomingClasses: any[];
  username: string;
  token: string;
  classesWithNotes;

  constructor(private router: Router, private authService: AuthService) {
    this.username = '';
    this.token = '';
  }

  ngOnInit(): void {
    this.classesWithNotes = this.formatResponse(TRY)
    this.authService.getToken().subscribe((token) => {
      this.token = token;
    });

    this.authService.getUsername().subscribe((username) => {
      this.username = username;
    });
    if (this.token === '') {
      alert('You are not logged in');
      this.router.navigate(['/']);
    }
  }

  formatResponse(input: { [name: string]: {id: number, date: string, course_id: number}[]}): {id: string, notes: {id: number, date: string, course_id: number}[] }[] {
    var result = []
    var tempArr;
    Object.keys(input).forEach( (course) => {
      tempArr = [];
      input[course].forEach( (note) => {
        tempArr.push( {id: note.id, date: note.date, course_id: note.course_id})
      });
      result.push( {title: course, notes: tempArr})
    });
    return result;
  }
}
