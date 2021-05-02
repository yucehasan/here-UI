import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http.service';
import { AnalyticsResponse, ParticipantsDetails } from '../interface';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  participantList: ParticipantsDetails[];
  subParticipantList = new Subject<ParticipantsDetails[]>();
  subTimeline = new Subject<number[]>();
  sessionID: number;
  token: string;


  constructor(private authService: AuthService, private httpService: HttpService) {
    this.participantList = [];
    this.token = '';
   }

  fetchData(sessionID): void {
    console.log("startimestamp" + localStorage.getItem("startTimestamp"));
    
    this.httpService.get(environment.BACKEND_IP + "/session/statistics/"+ sessionID + "?start_timestamp=" + localStorage.getItem("startTimestamp") + "&end_timestamp=" + Date.now().toString()).subscribe((res) => {
      this.updateData(res);
      console.log(res);
    });

    this.authService.getToken().subscribe((token) => {
      this.token = token;
    });

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.token
    );
    
    const formData = new FormData();
    this.httpService.post(environment.BACKEND_IP + "/session/leave", formData, headers ).subscribe((res) => {console.log(res);});
  }

  updateData(response: AnalyticsResponse): void {
    var fetchedParticipants = response.participants;
    var fetchedTimeline = response.timestamps;
    console.log("analyticsteki timeline" + fetchedTimeline);
    var part = ""
    fetchedParticipants.forEach((participant) => {
      if(participant.hand_raise_count >= 2){
        part = "active";
      }
      else if (participant.hand_raise_count == 1) {
        part = "normal";
      }
      else {
        part = "inactive";
      }
      this.participantList.push({ name: participant.name, participation: part });
    });
    this.subParticipantList.next(this.participantList);
    this.subTimeline.next(fetchedTimeline);
  }

  getParticipantList(): Observable<ParticipantsDetails[]> {
    return this.subParticipantList.asObservable();
  }

  getTimeline(): Observable<number[]> {
    return this.subTimeline.asObservable();
  }
}
