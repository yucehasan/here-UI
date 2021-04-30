import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-participant-table',
  templateUrl: './participant-table.component.html',
  styleUrls: ['./participant-table.component.sass']
})
export class ParticipantTableComponent implements OnInit {
  displayedColumns: string[] = ["id", "name", "participation"];
  dataSource;
  dataLength;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    /*
    this.analyticsService.getParticipantList().subscribe((res) => {
      this.dataSource = res;
    });
    this.analyticsService.fetchParticipants();
  }*/
    this.dataSource = [ {
      name: "Busra Buyukgebiz",
      participation: 'normal'
      },
      {
        name: "Yuce Hasan Kilic",
        participation: 'active'
      } ,
      {
        name: "Ozan Aydin",
        participation: 'inactive'
      },
      {
        name: "Mert Aslan",
        participation: 'active'
      },
      {
        name: "Burak Okumus",
        participation: 'normal'
      } 
    ];
    this.dataLength = 2;
  }

}
