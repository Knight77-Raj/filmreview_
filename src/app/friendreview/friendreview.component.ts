import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-friend-review',
  templateUrl: './friendreview.component.html',
  styleUrls: ['./friendreview.component.css']
})
export class FriendReviewComponent implements OnInit {
  users: any[] = [];
  loggedInUserId: string = ''; // Declare the loggedInUserId property
  isLoggedIn: boolean = false; // Update this based on your authentication logic

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    // Initialize loggedInUserId when the component is initialized
    this.loggedInUserId = this.authService.getCurrentUserId() ?? ''; // Fallback to an empty string if null
    console.log("logged in user:",this.loggedInUserId);
    
    
    
    this.fetchReviews();
  }

  fetchReviews(): void {
    this.http.get<any[]>('http://localhost:5000/api/auth/reviewsbyothers').subscribe({
      next: (data) => {
        // Ensure data is an array, filter out logged-in user, and keep users with reviews
        if (Array.isArray(data)) {
          this.users = data
            .filter(user => user.userId !== this.loggedInUserId && user.reviews.length > 0) // Filter based on reviews
            .map(user => ({
              ...user,
              profilePicture: user.profilePicture || 'assets/user.png', // Use default if no profile picture
              reviews: user.reviews.slice(-2) // Get the last 2 reviews only
            }));

            console.log("users in review:",this.users);
        } else {
          console.error('Expected an array from the API response:', data);
        }
      },
      error: (error) => {
        console.error('Error fetching reviews:', error);
      },
      complete: () => {
        console.log('Fetch reviews completed');
      }
    });
  }
  
}
