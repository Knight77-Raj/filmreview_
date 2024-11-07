import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-reviewd',
  templateUrl: './reviewd.component.html',
  styleUrls: ['./reviewd.component.css']
})
export class ReviewedComponent implements OnInit {
  reviews: any[] = []; // Array to store user's reviews
  isDarkTheme: boolean = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private apiservice: ApiService
  ) {}

  // WhatsApp Share
  shareOnWhatsApp(review: any) {
    const message = `Hey, I wrote this review for "${review.movietitle}":\n\n"${review.reviewText}"`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

 // Instagram Share (using Web Share API as a fallback for mobile)
shareOnInstagram(review: any) {
  const message = `Hey, I wrote this review for "${review.movietitle}":\n\n"${review.reviewText}"`;

  if (navigator.share) {
    navigator.share({
      title: `My Review on ${review.movietitle}`,
      text: message,
    })
    .then(() => console.log("Review shared successfully"))
    .catch((error) => console.error("Error sharing review:", error));
  } else {
    navigator.clipboard.writeText(message).then(() => {
      alert("Review text copied! Paste it in your Instagram story or message.");
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }
}


  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser'); // Retrieve the current user from local storage
    const user = userData ? JSON.parse(userData) : null; // Parse the user data
  
    if (user) {
      this.authService.fetchUserReviews(user.id).subscribe({
        next: (data) => this.reviews = data,
        error: (err) => console.error('Error fetching reviews:', err)
      });
    } else {
      console.error('User is not logged in');
    }
  }
}
