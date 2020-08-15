import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { LoadingController, AlertController } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-register-car",
  templateUrl: "./register-car.page.html",
  styleUrls: ["./register-car.page.scss"],
})
export class RegisterCarPage implements OnInit {
  todayDate = new Date(); /* variable gets the current date and save as an ISOString object */
  myDate = this.todayDate.setDate(this.todayDate.getDate()+1);
  todayDateString = this.todayDate.toISOString();

  vehicles = [
    {type: "Toyta Corolla", value: "Toyta Corolla"},
    {type: "Toyota Camry", value: "Toyota Camry"},
    {type: "Toyota Vios", value: "Toyota Vios"},
    {type: "Toyota Wigo", value: "Toyota Wigo"},
    {type: "Toyota Yaris", value: "Toyota Yaris"},
    {type: "BMW X6", value: "BMW X6"},
    {type: "BMW X3", value: "BMW X3"},
    {type: "BMW X4", value: "Toyta Corolla"},
    {type: "BMW 5 Series", value: "BMW 5 Series"},
    {type: "BMW X5", value: "BMW X5"},
    {type: "BMW 6 Series", value: "BMW 6 Series"},
    {type: "Mitsubishi ASX Model", value: "Mitsubishi ASX Modela"},
    {type: "Mitsubishi Mirage", value: "Mitsubishi Mirage"},
    {type: "Mitsubishi Montero Sport", value: "Mitsubishi Montero Sport"},
    {type: "Mitsubishi Pajero", value: "Mitsubishi Pajero"},
    {type: "Peugeot 508", value: "Peugeot 508"},
    {type: "Peugeot Expert Tepee", value: "Peugeot Expert Tepee"},
    {type: "Peugeot 5008", value: "Peugeot 5008"},
    {type: "Peugeot 3008", value: "Peugeot 3008"},
    {type: "Peugeot 2008", value: "Peugeot 2008"},
    {type: "Ford EcoSport", value: "Ford EcoSport"},
    {type: "Ford Everest", value: "Ford Everest"},
    {type: "Ford Expedition", value: "Ford Expedition"},
    {type: "Ford Explorer", value: "Ford Explorer"},
    {type: "Yamaha YZF-R1", value: "Yamaha YZF-R1"},
    {type: "Yamaha’s Tracer 900", value: "Yamaha’s Tracer 900"},
    {type: "KTM 890 DUKE R", value: "KTM 890 DUKE R"},
    {type: "Triumph Rocket 3", value: "Triumph Rocket 3"},
    {type: "Ford Transit", value: "Toyta Corolla"},
    {type: "Fiat Ducato", value: "Fiat Ducato"},
    {type: "Mercedes-Benz Vario", value: "Mercedes-Benz Vario"},
    {type: "Other", value: "Other"},
  ]

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
