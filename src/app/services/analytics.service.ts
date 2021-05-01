import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ParticipantsDetails, ParticipantsResponse } from '../interface';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  participantList: ParticipantsDetails[];
  subParticipantList: Subject<ParticipantsDetails[]>;

  constructor(
    private httpService: HttpService
  ) {
    this.participantList = [];
  }

  fetchParticipants(): ParticipantsDetails[] {
    this.httpService.get(environment.BACKEND_IP + "/session").subscribe((res) => {
      this.updateParticipants(res);
    });
    return this.participantList;
  }

  updateParticipants(response: ParticipantsResponse): void {
    var fetchedData = response.participants;
    var part = ""
    fetchedData.forEach((participant) => {
      if (participant.hand_raise_count >= 2) {
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
  }

  getParticipantList(): Observable<ParticipantsDetails[]> {
    return this.subParticipantList.asObservable();
  }
}
