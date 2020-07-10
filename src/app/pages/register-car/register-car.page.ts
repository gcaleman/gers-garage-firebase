import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Client } from "../../services/client";
import { ClientService } from "../../services/clientservice.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register-car",
  templateUrl: "./register-car.page.html",
  styleUrls: ["./register-car.page.scss"],
})
export class RegisterCarPage implements OnInit {
  clientForm: Client;

  constructor(
    private clientService: ClientService,
    public authService: AuthService
  ) {} // StudentService is injected

  ngOnInit(): void {}

/*   // When register button is clicked, this method starts
  Register(regForm: NgForm) {
    this.clientForm = regForm.form.value;
    this.save();
  } */

/*   save() {
    this.clientService.createStudent(this.clientForm);
  } */
}
