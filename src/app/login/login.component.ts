import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Import AuthService
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private authService: AuthService,
    private snackBar: MatSnackBar) 
    {} // Inject AuthService

  login() {
    // Validate email and password fields
    if (!this.email || !this.password) {
      this.errorMessage = 'Both email and password are required';
      return;
    }

    // Send login request to the backend
    this.http.post('http://localhost:5000/api/auth/login', { email: this.email, password: this.password })
      .subscribe({
        next: (response: any) => {
          // Handle successful login response
          console.log('Login successful!', response);

          // Check if the response contains user data
          if (response && response.user) {
            this.authService.setCurrentUser(response.user);  // Store the user in AuthService
            
            // Optionally store the token if backend sends it
            if (response.token) {
              localStorage.setItem('authToken', response.token);  // Store the token in localStorage
            }

            // Set success message and redirect to the search page
            this.successMessage = 'Login successful! Redirecting...'; 
            this.errorMessage = '';
            this.router.navigate(['/search']);  // Redirect to search page
          } else {
            console.error('User data is missing in response');
            // this.errorMessage = 'Login failed, please try again';
            this.snackBar.open('Signup successful, Please login now', 'Close', {
              duration: 3000,  // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
            
          }
        },
        error: (error) => {
          // Handle error response
          console.error('Error logging in:', error);

          if (error.status === 401) {
            this.errorMessage = 'Email or password is incorrect';
          } else if (error.status === 500) {
            this.errorMessage = 'Server error, please try again later';
          } else {
            this.errorMessage = 'An unexpected error occurred';
          }
        }
      });
  }
}


