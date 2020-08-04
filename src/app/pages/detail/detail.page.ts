import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Client } from "../../services/client";
import { AuthService } from "src/app/services/auth.service";
import { Observable } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"],
})
export class DetailPage implements OnInit {
  public services: Observable<Client>;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    const serviceDate = this.route.snapshot.paramMap.get("uid");
    this.services = this.authService
      .getServicesDetail(serviceDate)
      .valueChanges();
  }
}
