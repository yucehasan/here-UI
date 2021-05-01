import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConferenceComponent } from './pages/conference/conference.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { SlideComponent } from './components/slide/slide.component';
import { LandingComponent } from './pages/landing/landing.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'main', component: MainComponent},
  {path: 'conference/:sessionID/:courseID', component: ConferenceComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'slide', component: SlideComponent},
  {path: 'analytics', component: AnalyticsComponent},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
