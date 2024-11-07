import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';  // Backend API URL
  public currentUser: any;  // To store the logged-in user
  private apiUrl1 = 'https://api.themoviedb.org/3/movie/now_playing';
  private apiKey = 'd1b50bd15e18ead693839d26baa04e4a'; // Replace with your TMDb API key
  hasPremium: boolean = false; // This should be updated based on user's membership status
  
  constructor(private http: HttpClient) {
     // Check local storage for user data on initialization
     const userData = localStorage.getItem('currentUser');
    
     if (userData && userData !== 'undefined') {  // Ensure userData is valid and not 'undefined'
       this.currentUser = JSON.parse(userData);
     } else {
       this.currentUser = null;  // Explicitly set currentUser to null if no data is found
     }
  }

  signup(userData: { name: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  fetchUserReviews(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reviews/${userId}`);
  }

  // Store user information after login
  setCurrentUser(user: any): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));  // Store user in localStorage
    console.log('User stored:', this.currentUser);  // Debugging log to check if user is stored
  }

  getCurrentUser(): any {
    const storedUser = localStorage.getItem('currentUser');
    console.log("stored user:",storedUser);
    
    
    // Only parse if the storedUser is a valid string and not "undefined"
    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try {
            return JSON.parse(storedUser);
        } catch (error) {
            console.error('Error parsing stored user:', error);
            return null;
        }
    }
    
    return null;
}
getCurrentUserId(): string | null {
  const currentuser = localStorage.getItem('currentUser');
  console.log('Current User from localStorage:', currentuser); // Debugging log
  return currentuser ? JSON.parse(currentuser).id : null;
}


  // Fetch user profile
  getUserProfile(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

// auth.service.ts

// Update the AuthService's updateUserProfile method
updateUserProfile(userId: string, updatedData: any): Observable<any> {
  return this.http.put(`http://localhost:5000/api/auth/profile/${userId}`, updatedData);
}


getUserById(userId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/profile/${userId}`);
}
// Check if the user is logged in
isLoggedIn(): boolean {
  return this.currentUser !== null;
}
  // Logout method to clear user data
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');  // Clear from localStorage
    console.log(this.currentUser);
    
  }

  // Fetch latest movies in theaters
  // getLatestMovies(): Observable<any> {
  //   return this.http.get(`${this.apiUrl1}?api_key=${this.apiKey}&language=hi-IN&page=1&region=IN`);
  // }

  ProfilePic(userId: string, profileData: any) {
    return this.http.put(`/api/auth/profile/${userId}`, profileData).pipe(
      tap(response => {
        // Store the updated profile picture in local storage
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser) {
          currentUser.profilePicture = profileData.profilePicture; // Update profile picture
          localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Save it back to local storage
        }
      })
    );
  }

  // AuthService: Fetch reviews by other users
fetchReviewsByOtherUsers(): Observable<any> {
  const userId = this.getCurrentUserId(); // Get user ID using the function
  console.log('User ID to send:', userId); // Debugging log
  if (!userId) {
   Error('User ID is not available.'); // Handle the case where user ID is not found
  }
  return this.http.get(`${this.apiUrl}/reviewsbyothers`);
}

  
getProfileData(userId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/profile/${userId}`);
}

  // Method to set hasPremium status after checking from user data or API
  setPremiumStatus(status: boolean) {
    this.hasPremium = status;
  }
}

