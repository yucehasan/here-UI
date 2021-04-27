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
import { ProfileComponent } from './pages/profile/profile.component';
import { ConferenceComponent } from './pages/conference/conference.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthComponent } from './pages/auth/auth.component';
import { AssignStudentComponent } from './components/assign-student/assign-student.component';
import { ScheduleTableComponent } from './components/schedule-table/schedule-table.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { SlideComponent } from './components/slide/slide.component';
import { NoteCanvasComponent } from './components/note-canvas/note-canvas.component';
import { TaComponent } from './components/ta/ta.component';
import { AddCourseDialogComponent } from './components/add-course-dialog/add-course-dialog.component';
import { JwtInterceptor } from './helpers/JwtInterceptor';
import { ErrorInterceptor } from './helpers/ErrorInterceptor';

const config: SocketIoConfig = { url: environment.RTC_ENDPOINT, options: { transports: ['websocket'], upgrade: false } };
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PageNotFoundComponent,
    ProfileComponent,
    ConferenceComponent,
    LoginComponent,
    RegisterComponent,
    AuthComponent,
    AssignStudentComponent,
    ScheduleTableComponent,
    AddCourseDialogComponent,
    SlideComponent,
    NoteCanvasComponent,
    TaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
