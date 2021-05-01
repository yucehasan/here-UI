import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnalyticsResponse, ParticipantsDetails } from '../interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  participantList: ParticipantsDetails[];
  subParticipantList: Subject<ParticipantsDetails[]>;
  subTimeline: Subject<number[]>;
  sessionID: number;
  token: string;

  constructor(private httpClient: HttpClient, private activatedRoute: ActivatedRoute, private authService: AuthService) {
    this.participantList = [];
    this.activatedRoute.params.subscribe((params: Params) => this.sessionID = params['sessionID']);
    this.token = '';
   }

  fetchData(): void {
    this.httpClient.get<any>(environment.BACKEND_IP + "/session/statistics/"+ this.sessionID + "?timestamp=" + Date.now().toString()).subscribe((res) => {
      this.updateData(res);
    });

    this.authService.getToken().subscribe((token) => {
      this.token = token;
    });

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.token
    );
    
    const formData = new FormData();
    this.httpClient.post<any>(environment.BACKEND_IP + "/session/end", formData, { headers: headers }).subscribe((res) => {});
  }

  updateData(response: AnalyticsResponse): void {
    var fetchedParticipants = response.participants;
    var fetchedTimeline = response.timestamps;
    var part = ""
    fetchedParticipants.forEach((participant) => {
      if(participant.hand_raise_count >= 2){
        part = "active";
      } 
      else if(participant.hand_raise_count == 1){
        part = "normal";
      }
      else{
        part = "inactive";
      }
      this.participantList.push({name: participant.name, participation: part});
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
