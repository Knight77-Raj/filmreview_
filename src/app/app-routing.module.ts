import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewformComponent } from './reviewform/reviewform.component';
import { SearchmovieComponent } from './searchmovie/searchmovie.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ReviewedComponent } from './reviewd/reviewd.component';
import { MembershipComponent } from './membership/membership.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsComponent } from './pages/terms/terms.component';
import { FooterComponent } from './footer/footer.component';
import { LatestMoviesComponent } from './latestmovies/latestmovies.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { RecomComponent } from './recom/recom.component';

const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },  
  { path: 'signup', component: SignupComponent },          
  { path: 'login', component: LoginComponent },            
  { path: 'search', component: SearchmovieComponent },     
  { path: 'reviewform/:title', component: ReviewformComponent },
  { path: 'reviewed', component: ReviewedComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:userId', component: ProfileComponent },
  { path: 'membership', component: MembershipComponent },
  { path: 'about', component: AboutComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'watchlist', component: WatchlistComponent },
  {path: 'recom', component: RecomComponent}

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
