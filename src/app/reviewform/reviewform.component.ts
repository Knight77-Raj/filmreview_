import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';  // Import AuthService

@Component({
  selector: 'app-reviewform',
  templateUrl: './reviewform.component.html',
  styleUrls: ['./reviewform.component.css']
})
export class ReviewformComponent {
  rating: number = 0;
  movieTitle: string;
  user: any;  // Store the logged-in user here

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService  // Inject AuthService
  ) {
    this.movieTitle = this.route.snapshot.paramMap.get('title') || 'the movie';
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    console.log('User in review form:', this.user);  // Add this to check the user
    if (!this.user) {
      alert('Please log in to submit a review.');
    }
  }

  setRating(rating: number): void {
    this.rating = rating;
  }

  submitReview(): void {
    const reviewText = (document.getElementById('reviewText') as HTMLTextAreaElement).value;

    if (!reviewText || this.rating === 0) {
      alert('Please write a review and provide a rating.');
      return;
    }

    // Get the logged-in user from AuthService
    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('Please log in to submit a review.');
      return;
    }

    // Prepare the review data
    const reviewData = {
      userId: this.authService.currentUser.id, 
      movieTitle: this.movieTitle,
      rating: this.rating,
      reviewText: reviewText,
    };

    // Send the review to the backend
this.http.post('http://localhost:5000/api/auth/reviews', reviewData)
.subscribe({
  next: (response) => {
    console.log('Response from server:', response); // Log the response
    alert('Review submitted successfully!'); // Show the alert
  },
  error: (error) => {
    console.error('Error submitting review:', error); // Log the error for debugging
    alert('Error submitting review.'); // Show a general error message
  }
});

  }
}
