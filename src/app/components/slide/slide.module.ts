import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SlideComponent } from './slide.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    SlideComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [SlideComponent]
})
export class SlideModule { }
