import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ParticipantsDetails, ParticipantsResponse } from '../interface';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  participantList: Array<ParticipantsDetails>;
  constructor(private httpClient: HttpClient) {
    this.participantList = [];
   }

  fetchParticipants(): Array<ParticipantsDetails> {
    this.httpClient.get<any>(environment.BACKEND_IP + "/session").subscribe((res) => {
      this.updateParticipants(res);
    });
    return this.participantList;
  }

  updateParticipants(response: ParticipantsResponse): void {
    var fetchedData = response.participants;
    var part = ""
    fetchedData.forEach((participant) => {
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
  }
}
