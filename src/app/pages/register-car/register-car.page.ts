import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register-car",
  templateUrl: "./register-car.page.html",
  styleUrls: ["./register-car.page.scss"],
})
export class RegisterCarPage implements OnInit {
  

  constructor(
    public authService: AuthService
  ) {} 

  ngOnInit(): void {}

}
