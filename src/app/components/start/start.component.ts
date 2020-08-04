import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: "app-start",
  templateUrl: "./start.component.html",
  styleUrls: ["./start.component.scss"],
})
export class StartComponent implements OnInit {
  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit() {}

  navigateToLogin() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['home/profilepage']);
    } else {
      this.router.navigate(['sign-in']);
    }
    
    }

}
