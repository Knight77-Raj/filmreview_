import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { SearchmovieComponent } from './searchmovie/searchmovie.component';
import { ReviewformComponent } from './reviewform/reviewform.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ReviewedComponent } from './reviewd/reviewd.component';
import { LatestMoviesComponent } from './latestmovies/latestmovies.component';
import { ProfileComponent } from './profile/profile.component';
import { MembershipComponent } from './membership/membership.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FriendReviewComponent } from './friendreview/friendreview.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsComponent } from './pages/terms/terms.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RecomComponent } from './recom/recom.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchmovieComponent,
    ReviewformComponent,
    SignupComponent,
    LoginComponent,
    ReviewedComponent,
    LatestMoviesComponent,
    ProfileComponent,
    MembershipComponent,
    FriendReviewComponent,
    FooterComponent,
    AboutComponent,
    TermsComponent,
    WatchlistComponent,
    RecomComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
