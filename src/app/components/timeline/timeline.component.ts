
import { Component, OnInit } from "@angular/core";
import { data } from "jquery";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip
} from "ng-apexcharts";
import { AnalyticsService } from "src/app/services/analytics.service";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.sass']
})
export class TimelineComponent implements OnInit {
  public series: ApexAxisChartSeries;
  public chart: ApexChart;
  public dataLabels: ApexDataLabels;
  public markers: ApexMarkers;
  public title: ApexTitleSubtitle;
  public fill: ApexFill;
  public yaxis: ApexYAxis;
  public xaxis: ApexXAxis;
  public tooltip: ApexTooltip;
  dataSeries: number[];

  constructor(private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.analyticsService.getTimeline().subscribe((res) => {
      console.log("dönen response" + res);
      this.dataSeries = res;
      this.dataSeries.sort();
      this.initChartData();
    });
  }

  public initChartData(): void {
    let dates = [];
    if(this.dataSeries){
      for(let i = 0; i < this.dataSeries.length; i++){
        this.dataSeries[i] = Number(this.dataSeries[i]);
      }

      let time = this.dataSeries[0];
      let end = this.dataSeries[this.dataSeries.length -1];
      let totalms = end-time;
      let gap = totalms / 10;
      console.log(gap);
      let counter = 0;
      let index = 1;
      dates.push([time, counter]);
      for (let i = 0; i < 10; i++) {
        time = time + gap;
        while(this.dataSeries[index] <= time){
          counter++;
          index++;
        }
        if( counter != 0){
          dates.push([time, counter]);
        }
        counter = 0;
      }
    }
    

    this.series = [
      {
        name: "Distracted Student Count",
        data: dates
      }
    ];
    this.chart = {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.title = {
      text: "See how well your students did.",
      align: "left"
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        formatter: function(val) {
          return val.toFixed(0);
        }
      },
      title: {
        text: "Distracted Students"
      }
    };
    this.xaxis = {
      type: "datetime"
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function(val) {
          return val.toFixed(0);
        }
      }
    };
  }
}

