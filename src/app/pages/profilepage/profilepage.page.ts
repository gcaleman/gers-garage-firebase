import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.page.html',
  styleUrls: ['./profilepage.page.scss'],
})
export class ProfilepagePage implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
