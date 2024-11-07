import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; 
import { ApiService } from '../api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isDarkTheme: boolean = false;
  showAccountMenu: boolean = false;
  profilePicture: string | null = null; // To hold the profile picture URL
  defaultIcon: string = 'filmreview\src\assets\anshit.raj.png'; // Set your default icon path here
  userId: string | null = null;
  user:any;
  showPopup = false;
  showCustomAlert: boolean= false;
  alertDisplayed = false; 
  showPopup1: boolean = false; // For showing the premium popup
  showAuthModal:boolean = false;

  constructor(public authService: AuthService, private router: Router, private apiservice: ApiService,private cdRef: ChangeDetectorRef) {}




  ngOnInit(): void {
    // Get the logged-in user's ID from your AuthService or local storage
    this.userId = this.authService.getCurrentUserId(); // Implement this method in your AuthService
    this.loadUserData();
  }
  // toggleTheme() {
  //   this.isDarkTheme = !this.isDarkTheme;
  //   this.applyTheme();
  // }
  
  // applyTheme() {
  //   if (this.isDarkTheme) {
  //     document.body.classList.add('dark-theme');
  //   } else {
  //     document.body.classList.remove('dark-theme');
      
  //   }
    
  // }

  

  toggleAccountMenu(event: Event) {
    // event.stopPropagation(); // Prevents the click from propagating up the DOM tree

    if (this.authService.isLoggedIn()) {
      console.log('User is logged in. Toggling account menu.');
      this.showAccountMenu = !this.showAccountMenu; // Toggle the account menu if the user is logged in
    } else {
      console.log('User is not logged in. Redirecting to signup page.');
      // this.router.navigate(['/signup']); // Redirect to signup if not logged in
      if (!this.alertDisplayed) { // Only show the alert if it hasn't been displayed yet
        console.log('User is not logged in. Showing alert.');
        this.showCustomAlert = true; // Show the alert if not logged in
        this.alertDisplayed = true;   // Set the flag to true to indicate the alert has been shown
      }
      
    }
  }

  closeAlert() {
    this.showCustomAlert = false; // Close the custom alert
    this.showAuthModal=false;
   
  }

    navigateToLogin() {
      this.closeAlert();
      this.router.navigate(['/login']); // Navigate to login
    }
    
    navigateToSignup() {
      this.closeAlert();
      this.router.navigate(['/signup']); // Navigate to signup
    }
  
  


  // loadProfilePicture() {
  //   const storedUser = localStorage.getItem('currentUser');
  //   if (storedUser) {
  //     const user = JSON.parse(storedUser);
  //     this.profilePicture = user.profilePicture; // Get the profile picture from local storage
  //   }
  // }
  loadUserData() {
    // Fetch the current user ID from AuthService
    const userId = this.authService.getCurrentUserId();
    
    // Check if userId is valid
    if (userId !== null) {
      // Use userId to fetch user data, including profile picture
      this.authService.getUserById(userId).subscribe({
        next: (data) => {
          // Assign the fetched user data and profile picture to the component's properties
          this.user = data;
          this.profilePicture = data.profilePicture || 'assets/user.png'; // Default to a specific default image
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      });
    } else {
      console.error('User ID is null or undefined.');
    }
  }
  
  
  handleAuthCheck(route: string) {
    if (!this.authService.isLoggedIn()) {
      this.showAuthModal = true;  // Show the popup if not logged in
      console.log('Auth check failed; showing popup');  // Debugging
      this.cdRef.detectChanges(); 
    } else {
      this.router.navigate([route]);  // Navigate if logged in
    }
  }
  

 
  // handleDisabledLink(event: Event) {
  //   if (!this.authService.isLoggedIn()) {
  //     event.preventDefault(); // Prevents navigation
  //     this.showPopup = true; // Shows the popup
  //   }
  // }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/search']);
  }

  // Close the dropdown when clicking outside
  closeAccountMenu() {
    this.showAccountMenu = false;
  }

  closeAuthModal() {
    this.showAuthModal = false;
  }

  //premium check

 
  checkMembershipAccess() {
    if (!this.authService.isLoggedIn()) {
      // If the user is not logged in, do nothing or show a login prompt if desired
      this.showAuthModal=true;
      return;
    }

    if (this.authService.hasPremium) {
      // Navigate to the Recommendation page if the user has premium access
      this.router.navigate(['/recom']);
    } else {
      // Show the popup for users without premium access
      this.showPopup1 = true;
    }
  }

  navigateToMembership() {
    this.router.navigate(['/membership']); // Directs user to the membership page
    this.showPopup1 = false;
  }

  closePopup() {
    this.showPopup1 = false; // Close the popup
  }
}