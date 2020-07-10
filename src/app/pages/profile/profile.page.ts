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
  /* public addProfileForm: FormGroup; */

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public firestoreService: FirestoreService,
    public formBuilder: FormBuilder,
    public router: Router,
    public actRoute: ActivatedRoute
  ) {
    /* this.addProfileForm = formBuilder.group({
      fName: ["", Validators.required],
      lName: ["", Validators.required],
      userMobile: ["", Validators.required],
    }); */
  }

  ngOnInit() {}

  /* async addProfile() {
    const loading = await this.loadingCtrl.create();

    const fName = this.addProfileForm.value.fName;
    const lName = this.addProfileForm.value.lName;
    const mobile = this.addProfileForm.value.userMobile;

    this.firestoreService
    .createProfile(lName, fName, mobile)
    .then(
      () => {
        loading.dismiss().then(() => {
          this.router.navigate(["profilepage"]);
        });
      },
      error => {
        console.error(error);
      }
    );

    return await loading.present();
  } */
}
