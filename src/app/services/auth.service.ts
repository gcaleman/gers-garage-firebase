/* 
The codes from this project were adapted from multiple sources to fulfill the needs of the application;
The sources used for the codes are listed in the README file in the Git repository
Git repository: https://github.com/gcaleman/gers-garage-firebase
 */

import { Injectable, NgZone, OnInit } from "@angular/core";
import { User } from "./user";
import { Client } from "./client";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Router, ActivatedRoute } from "@angular/router";
import { Profile } from "./profile";

import { LoadingController, AlertController } from "@ionic/angular";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

import { Validator } from "./validator";
import { Vehicles } from "./vehicles";

@Injectable({
  providedIn: "root",
})
export class AuthService implements OnInit {
  userProfile: Observable<Profile>; // stores the data from the users profile
  userServices: Observable<Client>; // stores the data from the users services
  allServices: Observable<any>; // stores the data from all booked services
  user$: Observable<User>; // stores user credentials
  vehicles: Observable<Vehicles>;// store user vehicle
  services; // store the services
  userData; // stores the user data
  userUid; // stores the user unique identifier;
  public addProfileForm: FormGroup;
  public addServiceForm: FormGroup;
  public filterForm: FormGroup;
  constructor(
    public firestore: AngularFirestore, // Inject Firestore service
    public firestoreAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public actRoute: ActivatedRoute,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder
  ) {
    // Form group for user profile registration
    this.addProfileForm = formBuilder.group({
      fName: ["", Validators.required],
      lName: ["", Validators.required],
      userMobile: ["", Validators.required],
    });

    this.filterForm = formBuilder.group({
      date: [""],
      status: [""],
    });

    // Form group for service registration
    this.addServiceForm = formBuilder.group({
      date: new FormControl(
        "",
        Validators.compose([Validator.validDate, Validators.required])
      ),
      vehicleModel: ["", Validators.required],
      otherModel: [""],
      vehicleColor: ["", Validators.required],
      vehiclePlateNumb: ["", Validators.required],
      service: ["", Validators.required],
      comments: [""],
    });

    // return the data from the user from the database 'users'
    this.user$ = this.firestoreAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );

    // returns the user profile data from the database profileData
    this.userProfile = this.firestoreAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore
            .doc<Profile>(`profileData/${user.uid}`)
            .valueChanges();
        } else {
          window.Error("Please Log in!");
          return of(null);
        }
      })
    );

    // returns the documents from the getVehicles() method
    this.vehicles = this.firestoreAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.getVehicles().valueChanges();
        } else {
          window.Error("Please Log in!");
          return of(null);
        }
      })
    );

    // returns the documents from the getServices() method
    this.userServices = this.firestoreAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.getServices().valueChanges({ idField: "docId" });
        } else {
          window.Error("Please Log in!");
          return of(null);
        }
      })
    );

    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.firestoreAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.userUid = user.uid;
        localStorage.setItem("user", JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem("user"));
      } else {
        localStorage.setItem("user", null);
        JSON.parse(localStorage.getItem("user"));
      }
    });
  }

  ngOnInit() {}

  // method responsible for storing the data from the user profile form
  // to the database
  async addProfile() {
    var currentUser = await this.firestoreAuth.currentUser;

    const fName: String = this.addProfileForm.value.fName;
    const lName: String = this.addProfileForm.value.lName;
    const mobile: number = this.addProfileForm.value.userMobile;

    const userRef: AngularFirestoreDocument<Profile> = this.firestore.doc(
      `profileData/${currentUser.uid}`
    );
    const data = {
      fName: fName,
      lName: lName,
      mobile: mobile,
      uid: currentUser.uid,
    };
    return userRef
      .set(data, {
        merge: true,
      })
      .then(() => {
        window.alert("Successfully added to profile.");
        this.router.navigate(["home/profilepage"]);
      })
      .catch((error) => {
        window.alert(error.message);
        this.router.navigate(["sign-in"]);
      });
  }

  // method returns true if the user selected 'Other' option for booking 
  // a new service;
  getOtherVehicleModel(): Boolean {
    const vehicleModel: String = this.addServiceForm.value.vehicleModel;
    if (vehicleModel == "Other") {
      return true;
    } else {
      return false;
    }
  }

  // method returns the value typed by the user in case they select the 'Other'
  // option when booking a new service;
  getVehicleModel() {
    const vehicleModel: String = this.addServiceForm.value.vehicleModel;
    const otherModel: String = this.addServiceForm.value.otherModel;
    if (vehicleModel == "Other") {
      return otherModel;
    } else {
      return vehicleModel;
    }
  }

  // method returns true if the user selected 'Other' for vehicle model when booking
  // a new service and inputed the vehicle model;
  // returns false in case the user left the input empty;
  showButton(): Boolean {
    var valid = true;
    const vehicleModel: String = this.addServiceForm.value.vehicleModel;
    const otherModel: String = this.addServiceForm.value.otherModel;
    if (vehicleModel == "Other") {
      if (!otherModel) {
        valid = false;
      } else {
        valid = true;
      }
    } else {
      valid = true;
    }
    return valid;
  }

  // method responsible for adding new bookings to the database
  async createClientService() {
    var currentUser = await this.firestoreAuth.currentUser;
    var d = this.addServiceForm.value.date.split("T");
    const uid: String = currentUser.uid;
    const id: String = this.firestore.createId();
    const date: Date = d[0]; // date variable to hold split date (yyyy/mm/dd);
    console.log(date);
    var count = this.getDateCount(date); // get the date count from the database;
    const vehicleColor: String = this.addServiceForm.value.vehicleColor;
    const vehiclePlateNumb: String = this.addServiceForm.value.vehiclePlateNumb;
    const service: String = this.addServiceForm.value.service;
    const comments: String = this.addServiceForm.value.comments;
    var cost: String;
    if (service === "Repair") {
      cost = "$50";
    } else if (service === "Major Repair") {
      cost = "$100";
    } else if (service === "Annual Service") {
      cost = "$200";
    } else if (service === "Major Service") {
      cost = "$250";
    } else {
      cost = "Waiting avaliation";
    }

    const userBooking: AngularFirestoreCollection<Client> = this.firestore
      .collection("services")
      .doc(currentUser.uid)
      .collection("booking");
    const userVehicles: AngularFirestoreDocument<Vehicles> = this.firestore
      .collection("services")
      .doc(currentUser.uid)
      .collection("vehicles")
      .doc("last_booked");
    const allServices: AngularFirestoreCollection<any> = this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings");
    const data = {
      uid,
      date: date,
      vehicleModel: this.getVehicleModel(),
      vehicleColor: vehicleColor,
      vehiclePlateNumb: vehiclePlateNumb,
      service: service,
      comments: comments,
      status: "waiting",
      cost: cost,
      mechanic: "None",
      id,
      vehiclePieces: null,
    };
    const vehicles = {
      date: date,
      uid: currentUser.uid,
      vehicleModel: this.getVehicleModel(),
      vehicleColor: vehicleColor,
      vehiclePlateNumb: vehiclePlateNumb,
      service: service,
    };
    console.log("count: " + (await count));
      if ((await count) > 10) {
        window.alert("Date is fully booked. Please choose another one");
        this.router.navigate(["home/profilepage"]);
      } else {
        userVehicles.set(vehicles, {
          merge: true,
        });
        allServices.add(data);
        return userBooking
          .add(data)
          .then(() => {
            window.alert("Successfully added service.");
            this.router.navigate(["home/profilepage"]);
          })
          .catch((error) => {
            window.alert(error.message);
            this.router.navigate(["sign-in"]);
          });
      }
  }

  // method responsible for updating any edit to the bookings in the database
  async updateService(
    date,
    newDate,
    status,
    service,
    mechanic,
    comments,
    uid,
    docId,
    id,
    vehiclePieces
  ) {
    var docIdUser = this.getServicesFromDate(date, uid, id);

    var d = newDate.split("T");

    const nDate: Date = d[0]; // date variable to hold split date (yyyy/mm/dd);
    var count = this.getDateCount(nDate);
    var mechCount = this.getMechCount(nDate, mechanic);

    var cost;

    if (service === "Repair") {
      cost = 50;
    } else if (service === "Major Repair") {
      cost = 100;
    } else if (service === "Annual Service") {
      cost = 200;
    } else if (service === "Major Service") {
      cost = 250;
    } else {
      cost = 0;
    }
    const stringCost = "$" + cost.toString();
    const userService: AngularFirestoreDocument<Client> = this.firestore
      .collection("services")
      .doc(uid)
      .collection("booking")
      .doc(await docIdUser);
    const allServices: AngularFirestoreDocument<any> = this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings")
      .doc(docId);
    if ((await count) > 10 || (await mechCount) > 4) {
      window.alert(
        "Date or Mechanic is fully booked. Please choose another one"
      );
    } else {
      allServices.update({
        cost: stringCost,
        date: nDate,
        service: service,
        comments: comments,
        status: status,
        mechanic: mechanic,
        vehiclePieces: vehiclePieces,
      });
      return userService
        .update({
          cost: stringCost,
          date: nDate,
          service: service,
          comments: comments,
          status: status,
          mechanic: mechanic,
          vehiclePieces: vehiclePieces,
        })
        .then(() => {
          window.alert("Successfully updated.");
          this.router.navigate(["home/admin"]);
        })
        .catch((error) => {
          window.alert(error.message);
          this.router.navigate(["sign-in"]);
        });
    }
  }

  // This method was created only to add the vehicle pieces to the database
  /* addDataPieces() {
    const pieces: AngularFirestoreCollection<any> = this.firestore.collection(
      "pieces"
    );
    const vehiclePieces = [
      {
        id: 1,
        name: "Unexposed bumper",
        value: 25,
      },
      { id: 3, value: 25, name: "Exposed Bumper" },
      { id: 4, value: 20, name: "Cowl screen" },
      { id: 5, value: 20, name: "Decklid" },
      { id: 6, value: 30, name: "Fascia rear and support" },
      { id: 7, value: 20, name: "Fender" },
      { id: 8, value: 25, name: "Front clip" },
      { id: 9, value: 25, name: "Front fascia and header panel" },
      { id: 10, value: 25, name: "Grille" },
      { id: 11, value: 20, name: "Pillar and hard trim" },
      { id: 12, value: 30, name: "Quarter panel" },
      { id: 13, value: 40, name: "Radiator core support" },
      { id: 14, value: 30, name: "Rocker" },
      { id: 15, value: 20, name: "Roof rack" },
      { id: 16, value: 20, name: "Spoiler" },
      { id: 17, value: 20, name: "Front spoiler" },
      { id: 18, value: 20, name: "Rear spoiler" },
      { id: 19, value: 10, name: "Rims" },
      { id: 20, value: 10, name: "Hubcap" },
      { id: 21, value: 40, name: "Tire/Tyre" },
      { id: 22, value: 25, name: "Trim package" },
      { id: 23, value: 15, name: "Trunk/boot/hatch" },
      { id: 24, value: 15, name: "Trunk/boot latch" },
      { id: 25, value: 20, name: "Valance" },
      { id: 26, value: 20, name: "Welded assembly" },
      { id: 27, value: 10, name: "Ammeter" },
      { id: 28, value: 10, name: "Clinometer" },
      { id: 29, value: 10, name: "Dynamometer" },
      { id: 30, value: 10, name: "Fuel gauge" },
      { id: 31, value: 20, name: "Manometer" },
      { id: 32, value: 20, name: "Hydrometer" },
      { id: 33, value: 30, name: "Odometer" },
      { id: 34, value: 30, name: "Speedometer" },
      { id: 35, value: 30, name: "Tachometer" },
      { id: 36, value: 20, name: "Temperature gauge" },
      { id: 37, value: 10, name: "Tire pressure gauge" },
      { id: 38, value: 10, name: "Vacuum gauge" },
      { id: 39, value: 40, name: "Voltmeter" },
      { id: 40, value: 20, name: "Water temperature meter" },
      { id: 41, value: 30, name: "Oil pressure gauge" },
    ];
    for (let index = 0; index < vehiclePieces.length; index++) {
      pieces.add(vehiclePieces[index]);
    }
  } */

  // service gets the services booked for 
  async getDateCount(date) {
    var size;
    await this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) => ref.where("date", "==", date))
      .get()
      .toPromise()
      .then((snap) => {
        console.log(snap);
        size = snap.size;
      });
    console.log("size: " + size);
    return size;
  }

  // method returns the number of services booked for the particular mechanic
  // for the particular date and depending on the service type the count is double;
  // Major repair services have a double count of size.
  async getMechCount(date, mech) {
    var size;
    var size1;
    var size2;
    var size3;
    var size4;
    await this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) =>
        ref
          .where("date", "==", date)
          .where("mechanic", "==", mech)
          .where("service", "==", "Major Repair")
      )
      .get()
      .toPromise()
      .then((snap) => {
        size1 = snap.size * 2;
      });
    await this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) =>
        ref
          .where("date", "==", date)
          .where("mechanic", "==", mech)
          .where("service", "==", "Repair")
      )
      .get()
      .toPromise()
      .then((snap) => {
        size2 = snap.size;
      });
    await this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) =>
        ref
          .where("date", "==", date)
          .where("mechanic", "==", mech)
          .where("service", "==", "Annual Service")
      )
      .get()
      .toPromise()
      .then((snap) => {
        size3 = snap.size;
      });
    await this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) =>
        ref
          .where("date", "==", date)
          .where("mechanic", "==", mech)
          .where("service", "==", "Major Service")
      )
      .get()
      .toPromise()
      .then((snap) => {
        size4 = snap.size;
      });
    size = size1 + size2 + size3 + size4;
    console.log("mech size: " + size);
    return size;
  }

  // method returns the path to the database booking collection
  getServices(): AngularFirestoreCollection<Client> {
    return this.firestore
      .collection("services")
      .doc(this.userUid)
      .collection("booking");
  }

  // method queries the services/user.uid/booking database
  // where the date and service Id matches and return the document identification
  async getServicesFromDate(date, uid, serviceId) {
    var id;
    await this.firestore
      .collection("services")
      .doc(uid)
      .collection("booking", (ref) =>
        ref.where("date", "==", date).where("id", "==", serviceId)
      )
      .get()
      .toPromise()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          id = doc.id;
        });
      });
    console.log("id: " + id);
    return id;
  }

  // method queries the services/all/bookings database for the matching service id
  // and returns the service type from the database;
  async getServiceType(serviceId) {
    var service;
    await this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) => ref.where("id", "==", serviceId))
      .get()
      .toPromise()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          service = doc.data().service;
        });
      });
    return service;
  }

  // method queries the services/all/bookings database for the matching service id
  // and returns the vehicle model from the database;
  async getClientVehicle(serviceId) {
    var model;
    await this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) => ref.where("id", "==", serviceId))
      .get()
      .toPromise()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          model = doc.data().vehicleModel;
        });
      });
    return model;
  }

  // method queries the services/all/bookings database for the matching service id
  // and returns the vehicle license number from the database;
  async getClientVehiclePlate(serviceId) {
    var plate;
    await this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) => ref.where("id", "==", serviceId))
      .get()
      .toPromise()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          plate = doc.data().vehiclePlateNumb;
        });
      });
    return plate;
  }

  // method queries the profileData database for the user UID to gets the first name
  async getClientFName(uid) {
    var fName;
    await this.firestore
      .collection("profileData", (ref) => ref.where("uid", "==", uid))
      .get()
      .toPromise()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          fName = doc.data().fName;
        });
      });
    return fName;
  }

  // method queries the profileData database for the user UID to gets the last name
  async getClientLName(uid) {
    var lName;
    await this.firestore
      .collection("profileData", (ref) => ref.where("uid", "==", uid))
      .get()
      .toPromise()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          lName = doc.data().lName;
        });
      });
    return lName;
  }

  // method queries the profileData database for the user UID to gets the mobile
  async getClientMobile(uid) {
    var mobile;
    await this.firestore
      .collection("profileData", (ref) => ref.where("uid", "==", uid))
      .get()
      .toPromise()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          mobile = doc.data().mobile;
        });
      });
    return mobile;
  }

  // method queries the database services/all/bookings where the service id = serviceId
  // to get the id of the vehicle parts stored and add them to the var id;
  async getPiecesId(serviceId) {
    var id: Number[];
    await this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) => ref.where("id", "==", serviceId))
      .get()
      .toPromise()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          id = doc.data().vehiclePieces;
        });
      });
    console.log("id: " + id);
    return id;
  }
// method queries the database 'pieces' for the name of 
  // the items with id == id and store it into 'name' variable
  async getPieceName(id: number) {
    var name: string;
    console.log("id from get name method: " + id);
    await this.firestore
      .collection("pieces", (ref) => ref.where("id", "==", id))
      .get()
      .toPromise()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          name = doc.data().name;
        });
      });
    console.log("name: " + name);
    return name;
  }

  // method queries the database 'pieces' for the value of 
  // the items with id == id and store it into 'value' variable
  async getPieceValue(id: number) {
    var value: number;
    await this.firestore
      .collection("pieces", (ref) => ref.where("id", "==", id))
      .get()
      .toPromise()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          value = doc.data().value;
        });
      });
    console.log("value: " + value);
    return value;
  }

  // method queries the database services/all/bookings for the 
  // status from services booked for the date == date
  // the values are pushed into the variable schedule and returned
  async getScheduleStatus(date) {
    var schedule = [];
    await this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) => ref.where("date", "==", date))
      .get()
      .toPromise()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          schedule.push(doc.data().status);
        });
      });
    console.log("schedule: " + schedule);
    return schedule;
  }

  // method queries the database services/all/bookings for the 
  // services types from services booked for the date == date
  // the values are pushed into the variable schedule and returned
  async getScheduleService(date) {
    var schedule = [];
    await this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) => ref.where("date", "==", date))
      .get()
      .toPromise()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          schedule.push(doc.data().service);
        });
      });
    console.log("schedule: " + schedule);
    return schedule;
  } 
  // method queries the database services/all/bookings for the 
  // mechanics from services booked for the date == date
  // the values are pushed into the variable schedule and returned
  async getScheduleMechanic(date) {
    var schedule = [];
    await this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) => ref.where("date", "==", date))
      .get()
      .toPromise()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          schedule.push(doc.data().mechanic);
        });
      });
    return schedule;
  }

  // method queries the database services/all/bookings for the vehicle 
  // models from services booked for the date == date
  // the values are pushed into the variable schedule and returned
  async getScheduleVehicleModel(date) {
    var schedule = [];
    await this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) => ref.where("date", "==", date))
      .get()
      .toPromise()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          schedule.push(doc.data().vehicleModel);
        });
      });
    return schedule;
  }

  // Method gets the services from the date interval starDate - endDate
  // and status == status
  getAllServices(startDate, endDate): AngularFirestoreCollection<any> {
    const status: String = this.filterForm.value.status;
    console.log("status: " + status);
    if (status) {
      return this.firestore
        .collection("services")
        .doc("all")
        .collection("bookings", (ref) =>
          ref
            .where("date", ">=", startDate)
            .where("date", "<=", endDate)
            .where("status", "==", status)
        );
    } else {
      return this.firestore
        .collection("services")
        .doc("all")
        .collection("bookings", (ref) =>
          ref.where("date", ">=", startDate).where("date", "<=", endDate)
        );
    }
  }
  // method gets the last vehicle booked by the user
  getVehicles(): AngularFirestoreDocument<Vehicles> {
    return this.firestore
      .collection("services")
      .doc(this.userUid)
      .collection("vehicles")
      .doc("last_booked");
  }

  getServicesDetail(date): AngularFirestoreDocument<Client> {
    return this.firestore
      .collection("services")
      .doc(this.userUid)
      .collection("booking")
      .doc(date);
  }

  // Method queries database for the documents with id = serviceId and date == date;
  getAdminDetail(date, serviceId): AngularFirestoreDocument<any> {
    return this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) => ref.where("date", "==", date))
      .doc(serviceId);
  }

  /* ---------------------- METHODS FOR SYSTEM ACCESS ------------------------------ */

  // Method responsible for randling the login
  SignIn(email, password) {
    return this.firestoreAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.router.navigate(["home/profilepage"]);
        this.updateUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Method to handle the registration using email and password
  SignUp(email, password) {
    return this.firestoreAuth
      .createUserWithEmailAndPassword(email, password)
      .then(async (result) => {
        this.router.navigate(["sign-in"]);
        this.SendVerificationMail();
        this.updateUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Method to randle email verfificaiton when new user sign up
  async SendVerificationMail() {
    return (await this.firestoreAuth.currentUser)
      .sendEmailVerification()
      .then(() => {
        this.router.navigate(["sign-in"]);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.firestoreAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert("Password reset email sent, check your inbox.");
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user"));
    return user !== null && user.emailVerified !== false ? true : false;
  }

  
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.firestoreAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(["home"]);
        this.updateUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Method responsible for setting up the user data to be stored in the
  // collection 'users' and document 'user.uid';
  async updateUserData(user) {
    const userData: AngularFirestoreDocument<any> = this.firestore.doc(
      `users/${user.uid}`
    );
    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      roles: {
        customer: true,
      },
    };
    return userData.set(data, {
      merge: true,
    });
  }

  private checkAdminAuthorization(user: User, roles: string[]): boolean {
    if (!user) return false;
    for (const role of roles) {
      if (user.roles[role]) {
        return true;
      }
      return false;
    }
  }

  admAuthorization(user: User): boolean {
    const authorized = ["admin"];
    return this.checkAdminAuthorization(user, authorized);
  }

  // Sign out
  SignOut() {
    return this.firestoreAuth.signOut().then(() => {
      localStorage.removeItem("user");
      this.router.navigate([""]);
    });
  }
}
