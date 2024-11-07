import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
 
    constructor(private router: Router){}

    insta(){
      window.open('https://www.instagram.com/gy.who.edits/profilecard/?igsh=MWEyMnl3cG9kdno1cQ==', '_blank');
    }
}
