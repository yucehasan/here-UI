import { Component, OnInit } from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas'; 
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.sass']
})
export class AnalyticsComponent implements OnInit {
  sessionID: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private analyticsService: AnalyticsService) {
    this.activatedRoute.params.subscribe((params: Params) => this.sessionID = params['sessionID']);
    this.analyticsService.fetchData(this.sessionID);
   }

  ngOnInit(): void {
    
  }

  captureScreen()  
  {  
    var data = document.getElementById('grid'); 
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      let imgWidth = 208;   
      let imgHeight = canvas.height * imgWidth / canvas.width;  

      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      let position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('analytics.pdf'); // Generated PDF   
    });  
  }  

  goHome(){
    this.router.navigate(['main']);
  }

}
