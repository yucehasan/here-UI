import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConferenceComponent } from './pages/conference/conference.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AssignStudentComponent } from './components/assign-student/assign-student.component';
import { ScheduleTableComponent } from './components/schedule-table/schedule-table.component';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { SlideComponent } from './components/slide/slide.component';
import { NoteCanvasComponent } from './components/note-canvas/note-canvas.component';
import { TaComponent } from './components/ta/ta.component';
import { AddCourseDialogComponent } from './components/add-course-dialog/add-course-dialog.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { HeadingComponent } from './components/heading/heading.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DirectivesModule } from './directives/directives.module';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LandingComponent } from './pages/landing/landing.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { ParticipantTableComponent } from './components/participant-table/participant-table.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { CanvasTextInputComponent } from './components/canvas-text-input/canvas-text-input.component';
import { SavedNotesComponent } from './components/saved-notes/saved-notes.component';
import { ChatComponent } from './components/chat/chat.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ErrorComponent } from './components/error/error.component';
import { NotePreviewComponent } from './components/note-preview/note-preview.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SimpleNotificationsModule } from 'angular2-notifications';

const config: SocketIoConfig = { url: environment.RTC_ENDPOINT, options: { transports: ['websocket'], upgrade: false } };
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PageNotFoundComponent,
    ConferenceComponent,
    LoginComponent,
    RegisterComponent,
    AssignStudentComponent,
    ScheduleTableComponent,
    AddCourseDialogComponent,
    SlideComponent,
    NoteCanvasComponent,
    TaComponent,
    AboutComponent,
    ContactComponent,
    HeadingComponent,
    ToolbarComponent,
    LandingComponent,
    EditProfileComponent,
    AnalyticsComponent,
    ParticipantTableComponent,
    TimelineComponent,
    CanvasTextInputComponent,
    SavedNotesComponent,
    ChatComponent,
    DashboardComponent,
    ErrorComponent,
    NotePreviewComponent,
    ReportsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    DirectivesModule,
    NgApexchartsModule,
    SimpleNotificationsModule.forRoot({
      maxStack: 5,
      timeOut: 5000
    })
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
