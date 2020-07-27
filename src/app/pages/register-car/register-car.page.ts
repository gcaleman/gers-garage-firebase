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
  myDate = new Date().toISOString(); /* variable gets the current date and save as an ISOString object */

  static invalidDates = [];
  dateSundays: Date = new Date(
    2020,
    6,
    20
  ); /* Variable to hold an initial Sunday date (19/07/2020) */

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public firestoreService: FirestoreService,
    public formBuilder: FormBuilder,
    public router: Router,
    public actRoute: ActivatedRoute
  ) {
    /*
     For loop starts from the inital Sunday date declared above 'dateSundays'
     and goes for the remaining number of Sundays in the year (from that initial date there are 22 more Sundays in this year).
     Add each one of the Sundays in the 'invalidDates' array as an ISOstring object.
    */
    for (let index = 0; index < 23; index++) {
      this.dateSundays.setDate(this.dateSundays.getDate() + 7);
      RegisterCarPage.invalidDates.splice(
        index,
        0,
        this.dateSundays.toISOString()
      );
    }
  }

  ngOnInit(): void {}

  /* 
  Method uses a for loop to split each item (index) of the 'invalidDates' array
  into an array of two items 'arr'. The item is split where there is a string 'T'
  (that corresponds to 'time'). So the 'date' ISOString object is split between the actual date format (yyyy-mm-dd)
  and the time. The split date object is added to the array 'array', and them an if loop checks if the 'date' sent by the user
  matches any of the invalid dates inside 'array'.
  */
  dateChanged(date) {
    var array = [];
    
    /* const count = this.authService.getDateCount(date); */

    for (let index = 0; index < RegisterCarPage.invalidDates.length; index++) {
      var arr = RegisterCarPage.invalidDates[index].split("T");
      array.splice(index, 0, arr[0]);
      if (date.detail.value.includes(array[index])) {
        window.alert("Closed on sundays. Please pick another date.");
        date.detail.value = this.myDate;
      }
    }
  }
}
