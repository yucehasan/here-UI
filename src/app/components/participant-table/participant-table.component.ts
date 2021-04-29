import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-participant-table',
  templateUrl: './participant-table.component.html',
  styleUrls: ['./participant-table.component.sass']
})
export class ParticipantTableComponent implements OnInit {
  displayedColumns: string[] = ["id", "name", "participation",];
  dataSource;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.analyticsService.fetchParticipants().subscribe((res) => {
      this.dataSource = res.
    });
  }

}
