import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  successMessage: string = '';  // To store success message
  errorMessage: string = '';    // To store error message

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  signup() {
    console.log({ name: this.name, email: this.email, password: this.password });
    this.http.post('http://localhost:5000/api/auth/signup', 
      { name: this.name, email: this.email, password: this.password }, 
      { observe: 'response' }
    ).subscribe({
      next: response => {
        if (response.status === 201) {
          console.log('Signup successful!', response);
          // this.successMessage = 'Signup successful! Please login now';
          this.snackBar.open('Signup successful, Please login now', 'Close', {
            duration: 3000,  // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          });
          this.errorMessage = '';
        }
      },
      error: error => {
        console.error('Error signing up:', error);
        this.errorMessage = 'Error signing up. Please try again.';
        this.successMessage = '';
      }
    });
  }
  
  
  

}
