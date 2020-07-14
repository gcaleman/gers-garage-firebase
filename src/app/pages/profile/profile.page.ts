import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { LoadingController, AlertController } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FirestoreService } from "../../services/data/firestore.service";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public firestoreService: FirestoreService,
    public formBuilder: FormBuilder,
    public router: Router,
    public actRoute: ActivatedRoute
  ) {
   
  }

  ngOnInit() {}

  
}
