import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  backToLogin(){
    this.router.navigate(["sign-in"]);
  }

}
