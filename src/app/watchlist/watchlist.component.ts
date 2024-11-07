// watchlist.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  watchlist: any[] = [];
  loading = true;
  error: string | null = null;
  watchlistMovies: string[] = [];
  userId: string | null = null;
  loggedInUserId: any='';

  constructor(
    private authservice: AuthService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.userId = this.authservice.getCurrentUserId();
    this.loggedInUserId=this.authservice.getCurrentUserId();

    if (this.userId) {
      this.fetchWatchlist(this.userId);
    } else {
      console.error('User ID is required');
      // Handle case where userId is not available
    }
  }

  fetchWatchlist(userId: string) {
    this.http.get<any[]>(`http://localhost:5000/api/auth/watchlist/${userId}`).subscribe({
      next: (data) => {
        this.watchlist = data;
      },
      error: (error) => {
        console.error('Error fetching watchlist:', error);
      },
      complete: () => {
        // Optional: Code to run when the observable completes
      },
    });
  }
  

  removeFromWatchlist(movieTitle: string) {
    this.apiService.deleteFromWatchlist(this.loggedInUserId, movieTitle).subscribe({
      next: (response) => {
        console.log('Movie removed from watchlist:', response);
        this.watchlist = this.watchlist.filter(movie => movie.movieTitle !== movieTitle); // Update UI
        alert('Movie removed from watchlist');
      },
      error: (error) => {
        console.error('Error removing movie from watchlist:', error);
        alert('Could not remove movie from watchlist');
      }
    });
  }
}
