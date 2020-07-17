import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { LoadingController, AlertController } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FirestoreService } from "../../services/data/firestore.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-register-car",
  templateUrl: "./register-car.page.html",
  styleUrls: ["./register-car.page.scss"],
})
export class RegisterCarPage implements OnInit {
 
  myDate = new Date().toISOString();

  
  static invalidDates = [];
  dateSundays: Date = new Date(2020, 6, 20);

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public firestoreService: FirestoreService,
    public formBuilder: FormBuilder,
    public router: Router,
    public actRoute: ActivatedRoute
  ) {
    
    for (let index = 0; index < 23; index++) {
      this.dateSundays.setDate(this.dateSundays.getDate() + 7);
      console.log(this.dateSundays.toISOString());
      RegisterCarPage.invalidDates.splice(index, 0, this.dateSundays.toISOString());
      console.log(RegisterCarPage.invalidDates)
    }
    

  }

  ngOnInit(): void {}

  /* validateDate(): Boolean {
    var valid = false;
    for (let index = 0; index < this.invalidDates.length; index++) {
      if (this.myDate.getDate == this.invalidDates[index]) {
        valid = false;
      } else {
        valid = true;
      }
    }
    return valid;
  }  */ 

  dateChanged(date) {
    var array = [];
    
    for (let index = 0; index < RegisterCarPage.invalidDates.length; index++) {
      var arr = RegisterCarPage.invalidDates[index].split("T");
      array.splice(index, 0, arr[0]);
      console.log(array);
      if (date.detail.value.includes(array[index])) {
        window.alert("Closed on sundays. Please pick another date.");
        date.detail.value = this.myDate;
      }
    }    
    console.log(date.detail.value);
    console.log(this.myDate);
  }


  showCalendar() {
    var calendar = document.getElementById("myCalendar");
    if (calendar.style.display === "none") {
      calendar.style.display = "block";
    } else {
      calendar.style.display = "none";
    }
  }
}
