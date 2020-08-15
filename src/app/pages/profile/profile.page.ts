import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  
  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    public actRoute: ActivatedRoute
  ) {
   
  }

  ngOnInit() {}

  
}
