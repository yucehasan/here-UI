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

const config: SocketIoConfig = { url: environment.RTC_ENDPOINT, options: {transports: ['websocket'], upgrade: false} };
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
    AboutComponent,
    ContactComponent,
    HeadingComponent,
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
    DirectivesModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
