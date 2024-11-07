import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  existingData: any;
  profilePicture: string = '';  // Assume this holds the URL for the uploaded picture
  userId: string = ''; // This will be fetched from localStorage
  movieControl = this.fb.control('', Validators.required);  // Control for new movie input
  user: any;

  constructor(
    private authService: AuthService,
    private apiservice: ApiService, 
    private router: Router, 
    private fb: FormBuilder,
    private snackBar: MatSnackBar) 
    
    {
    // Initialize the form
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      favoriteMovies: this.fb.array([], [Validators.required, Validators.maxLength(5)]),  // Max 5 favorite movies
      favoriteFilmmakers: this.fb.array([]),  // Initialize the array
      profilePicture: ['']
    });
  }

  ngOnInit(): void {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userId = user?.id;  // Assign userId from local storage
    }

    // Load profile data after userId is set
    this.loadProfileData();
    // this.loadUserData();
  }

 
  loadProfileData() {
    // Fetch profile data from the service
    this.authService.getProfileData(this.userId).subscribe(data => {
      this.existingData = data;

      const defaultProfilePicture = 'assets/user.png'; // Specify your default image path

      // Patch the form with existing data
      this.profileForm.patchValue({
        name: data.name,
        profilePicture: data.profilePicture || defaultProfilePicture  // Fallback to default if no picture is uploaded
      });

      // Populate favoriteMovies if they exist
      if (data.favoriteMovies) {
        data.favoriteMovies.forEach((movie: string) => this.addMovie(movie));
      }

      // Populate favoriteFilmmakers if they exist
      if (data.favoriteFilmmakers) {
        data.favoriteFilmmakers.forEach((filmmaker: string) => this.addFilmmaker(filmmaker));
      }

      // Set the profile picture if available
      if (data.profilePicture) {
        this.profilePicture = data.profilePicture;
      }
    });
  }

  // Getter for favoriteMovies FormArray
  get favoriteMovies(): FormArray {
    return this.profileForm.get('favoriteMovies') as FormArray;
  }

  // Getter for favoriteFilmmakers FormArray
  get favoriteFilmmakers(): FormArray {
    return this.profileForm.get('favoriteFilmmakers') as FormArray;
  }

  // Add a movie to the favoriteMovies array (with check for max length and duplicates)
  addMovie(movie: string = ''): void {
    const movieTitle = movie || this.movieControl.value;  // Use the value from the input or provided argument

    if (this.favoriteMovies.length >= 5) {
      alert('You can only add up to 5 favorite movies.');
      return;
    }

    // Check if the movie already exists in the list
    const movieExists = this.favoriteMovies.controls.some(control => control.value === movieTitle);
    if (movieExists) {
      alert('This movie is already in your favorites.');
      return;
    }

    // Add the movie to the form array
    this.favoriteMovies.push(this.fb.control(movieTitle, Validators.required));
    this.movieControl.reset();  // Clear the input box
  }

  // Add a filmmaker to the favoriteFilmmakers array
  addFilmmaker(filmmaker: string = ''): void {
    this.favoriteFilmmakers.push(this.fb.control(filmmaker, Validators.required));
  }

  // Remove a movie from the list
  removeMovie(index: number): void {
    this.favoriteMovies.removeAt(index);
  }

  // Remove a filmmaker from the list
  removeFilmmaker(index: number): void {
    this.favoriteFilmmakers.removeAt(index);
  }

  // Submit handler to update the profile
  onSubmit() {
    if (this.userId) {
      const updatedProfileData = {
        name: this.profileForm.value.name,
        favoriteMovies: this.profileForm.value.favoriteMovies.filter(Boolean),  // Remove empty values
        favoriteFilmmakers: this.profileForm.value.favoriteFilmmakers.filter(Boolean),  // Remove empty values
        profilePicture: this.profilePicture
      };

      // Call the AuthService to submit the profile update
      this.authService.updateUserProfile(this.userId, updatedProfileData).subscribe({
        next: (response) => {
          // Show success message with MatSnackBar
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,  // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          });
          console.log('Response from server:', response);
          
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          console.error('Error updating profile', error);
          // Optionally show an error message
          this.snackBar.open('Failed to update profile', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        },
        complete: () => {
          console.log('Profile update process completed');
        }
      });
      
    } else {
      console.error("User ID is not available.");
    }
  }

  // Handle file upload for profile picture
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicture = reader.result as string;  // Store the Base64 string
      };
      reader.readAsDataURL(file);  // Read the file as a data URL
    }
  }
}






// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../auth.service';  // Assuming AuthService is handling your HTTP requests
// import { Router } from '@angular/router';
// import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-profile',
//   templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.css']
// })
// export class ProfileComponent implements OnInit {
//   name: string = '';  // Bind this to the form
//   profilePicture: string = '';  // Assume this holds the URL for the uploaded picture
//   profileForm: FormGroup; // Declare profileForm
//   existingData: any;
//   userId: string = ''; // Replace with logic to get logged-in user's ID

//   movieControl = this.fb.control('', Validators.required); // Single control for the input box
//   filmmakerControl = this.fb.control('', Validators.required);

//   constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
//     this.profileForm = this.fb.group({
//       name: [''],
//       favoriteMovies: this.fb.array([this.fb.control('')]),  // Assuming favoriteMovies is an array
      
//       favoriteFilmmakers: this.fb.array([this.fb.control('')]),  // Favorite Filmmakers array
//       profilePicture: [''],
//       topMovies: ['']  // Add this line for 'topMovies' if it's a form control
      
//     });
//   }

//   ngOnInit(): void {
//     this.profileForm = this.fb.group({
//       name: ['', Validators.required],  // Add the 'name' form control
//       favoriteMovies: this.fb.array([]), // Initialize the favoriteMovies array
//       favoriteFilmmakers: this.fb.array([]) // Initialize the favoriteFilmmakers array
      
//     });

//     this.loadProfileData();
//   }

//   loadProfileData() {
//     this.authService.getProfileData(this.userId).subscribe(data => {
//       this.existingData = data;
//       this.profileForm.patchValue({
//         name: data.name,
//         // Add more fields if needed
//       });
//       if (data.favoriteMovies) {
//         data.favoriteMovies.forEach((movie: string) => this.addMovie(movie));
//       }
//       if (data.favoriteFilmmakers) {
//         data.favoriteFilmmakers.forEach((filmmaker: string) => this.addFilmmaker());
//       }
//     });

    
//   }

//   // Getter for favoriteMovies FormArray
//   get favoriteMovies(): FormArray {
//     return this.profileForm.get('favoriteMovies') as FormArray;
//   }

//   // Getter for favoriteFilmmakers FormArray
//   get favoriteFilmmakers(): FormArray {
//     return this.profileForm.get('favoriteFilmmakers') as FormArray;
//   }

//   // Add the movie from the input box to the list
//   addMovie(movie: string = ''): void {
//     const movieTitle = this.movieControl.value;
//     if (movieTitle) {
//       this.favoriteMovies.push(this.fb.control(movieTitle)); // Add the movie to the form array
//       this.movieControl.reset(); // Clear the input box
//     }
//   }

//   // Remove a movie from the list
//   removeMovie(index: number): void {
//     this.favoriteMovies.removeAt(index);
//   }

// // Add filmmaker
// addFilmmaker(): void {
//   // Create a new control for the filmmaker
//   const newFilmmakerControl = this.fb.control(''); // Create a new empty control
//   this.favoriteFilmmakers.push(newFilmmakerControl); // Add the new control to the form array
// }


//   // Submit handler
//   onSubmit() {
//     const storedUser = localStorage.getItem('currentUser');
//     if (storedUser) {
//       const user = JSON.parse(storedUser);
//       const userId = user?.id; // Safely access the id

//       if (userId) {
//         console.log("User ID is available:", userId);

//         // Prepare the profile data to send to the backend
//         const updatedProfileData = {
//           name: this.profileForm.value.name, // Get name from form
//           favoriteMovies: this.profileForm.value.favoriteMovies.filter(Boolean), // Filter out empty values
//           favoriteFilmmakers: this.profileForm.value.favoriteFilmmakers.filter(Boolean), // Filter out empty values
//           profilePicture: this.profilePicture // Include the Base64 profile picture
//         };

//         // Call the AuthService to submit the profile update
//         this.authService.updateUserProfile(userId, updatedProfileData).subscribe(
//           (response) => {
//             console.log('Profile updated successfully', response);
//             this.router.navigate(['/profile']);
//           },
//           (error) => {
//             console.error('Error updating profile', error);
//           }
//         );
//       } else {
//         console.error("User ID is not available.");
//       }
//     } else {
//       console.error("No user data found in localStorage.");
//     }
//   }

//   // Handle file upload for profile picture
//   onFileSelected(event: any) {
//     const file = event.target.files[0];

//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         this.profilePicture = reader.result as string; // Store the Base64 string
//       };
//       reader.readAsDataURL(file); // Read the file as a data URL
//     }
//   }
// }
