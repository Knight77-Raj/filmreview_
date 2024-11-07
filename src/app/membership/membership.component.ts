import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent {
    // membership(){
    //   alert("coming sooon")
    // }
    constructor(private authservice: AuthService, private router: Router){}
    onPurchaseSuccess() {
      // Logic to handle successful payment goes here
      alert("congratulations!! enjoy the reccomendations")
      // Update premium status in the frontend
      this.authservice.setPremiumStatus(true);
  
      // Optionally, navigate back to the main or recommendation page
      this.router.navigate(['/']);
    }
}
