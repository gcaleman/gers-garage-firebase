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
import { Bookings } from "./bookings";
import { Cars } from "./cars";

@Injectable({
  providedIn: "root",
})
export class AuthService implements OnInit {
  userProfile: Observable<Profile>;
  userServices: Observable<Client>;
  allServices: Observable<any>;
  bookings: Observable<Bookings>;
  user$: Observable<User>;
  cars: Observable<Cars>;
  services;
  userData;
  userUid;
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
      date: ["", Validators.required],
      status: ["", Validators.required],
    });

    // Form group for service registration
    this.addServiceForm = formBuilder.group({
      date: new FormControl(
        "",
        Validators.compose([Validator.validDate, Validators.required])
      ),
      carModel: ["", Validators.required],
      otherModel: [""],
      carColor: ["", Validators.required],
      carPlateNumb: ["", Validators.required],
      service: ["", Validators.required],
      comments: [""],
    });

    this.user$ = this.firestoreAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );

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

    this.cars = this.firestoreAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.getCars().valueChanges();
        } else {
          window.Error("Please Log in!");
          return of(null);
        }
      })
    );

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

  getOtherCarModel(): Boolean{
    const carModel: String = this.addServiceForm.value.carModel; 
    if (carModel == "Other"){
      return true;
    } else {
      return false;
    }
  }

  getCarModel() {
    const carModel: String = this.addServiceForm.value.carModel; 
    const otherModel: String = this.addServiceForm.value.otherModel;
    if (carModel == "Other"){
      return otherModel;
    } else {
      return carModel;
    }
  }

  showButton(): Boolean{
    var valid = true;
    const carModel: String = this.addServiceForm.value.carModel;
    const otherModel: String = this.addServiceForm.value.otherModel;
    if(carModel == "Other"){
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

  async createClientService() {
    var currentUser = await this.firestoreAuth.currentUser;
    var d = this.addServiceForm.value.date.split("T");
    const uid: String = currentUser.uid;
    const id: String = this.firestore.createId();
    const date: Date = d[0]; // date variable to hold split date (yyyy/mm/dd);
    console.log(date);
    var count = this.getDateCount(date); // get the date count from the database;
    var serviceCount = this.getServicesCount(uid, date);
    const carColor: String = this.addServiceForm.value.carColor;
    const carPlateNumb: String = this.addServiceForm.value.carPlateNumb;
    const service: String = this.addServiceForm.value.service;
    const comments: String = this.addServiceForm.value.comments;
    var cost: String;
    if (service.includes("Repair")) {
      cost = "$50";
    } else if (service.includes("Major Repair")) {
      cost = "$100";
    } else if (service.includes("Annual Service")) {
      cost = "$200";
    } else if (service.includes("Major Service")) {
      cost = "$250";
    } else {
      cost = "Waiting avaliation";
    }

    const userRef: AngularFirestoreCollection<Client> = this.firestore
      .collection("services")
      .doc(currentUser.uid)
      .collection("booking");
    const userCars: AngularFirestoreDocument<Cars> = this.firestore.doc(
      `cars/${currentUser.uid}`
    );
    const allServices: AngularFirestoreCollection<any> = this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings");
    const data = {
      uid,
      date: date,
      carModel: this.getCarModel(),
      carColor: carColor,
      carPlateNumb: carPlateNumb,
      service: service,
      comments: comments,
      status: "waiting",
      cost: cost,
      mechanic: "None",
      id,
    };
    const cars = {
      date: date,
      uid: currentUser.uid,
      carModel: this.getCarModel(),
      carColor: carColor,
      carPlateNumb: carPlateNumb,
      service: service,
    };
    console.log("count: " + (await count));
    if ((await serviceCount) >= 1) {
      window.alert(
        "You have already booked for this date. Please choose another one"
      );
      this.router.navigate(["home/profilepage"]);
    } else {
      if ((await count) > 10) {
        window.alert("Date is fully booked. Please choose another one");
        this.router.navigate(["home/profilepage"]);
      } else {
        userCars.set(cars, {
          merge: true,
        });
        allServices.add(data);
        return userRef
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
  }

  async updateService(
    date,
    newDate,
    status,
    service,
    mechanic,
    comments,
    uid,
    docId,
    id
  ) {
    var docIdUser = this.getServicesFromDate(date, uid, id);
    var d = newDate.split("T");
    const nDate: Date = d[0]; // date variable to hold split date (yyyy/mm/dd);
    var count = this.getDateCount(nDate);
    var mechCount = this.getMechCount(nDate, mechanic);
    const userRef: AngularFirestoreDocument<Client> = this.firestore
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
        date: nDate,
        service: service,
        comments: comments,
        status: status,
        mechanic: mechanic,
      });
      return userRef
        .update({
          date: nDate,
          service: service,
          comments: comments,
          status: status,
          mechanic: mechanic,
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

  async getServicesCount(uid, date) {
    var size;
    await this.firestore
      .collection("services")
      .doc(uid)
      .collection("booking", (ref) => ref.where("date", "==", date))
      .get()
      .toPromise()
      .then((snap) => {
        console.log(snap);
        size = snap.size;
      });
    console.log("size: " + size);
    return size;
  }

  getServices(): AngularFirestoreCollection<Client> {
    return this.firestore
      .collection("services")
      .doc(this.userUid)
      .collection("booking");
  }

  async getServicesFromDate(date, uid, docId) {
    var id;
    await this.firestore
      .collection("services")
      .doc(uid)
      .collection("booking", (ref) =>
        ref.where("date", "==", date).where("id", "==", docId)
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

  getCars(): AngularFirestoreDocument<Cars> {
    return this.firestore.collection("cars").doc(this.userUid);
  }

  getServicesDetail(date): AngularFirestoreDocument<Client> {
    return this.firestore
      .collection("services")
      .doc(this.userUid)
      .collection("booking")
      .doc(date);
  }

  getAdminDetail(date, serviceId): AngularFirestoreDocument<any> {
    return this.firestore
      .collection("services")
      .doc("all")
      .collection("bookings", (ref) => ref.where("date", "==", date))
      .doc(serviceId);
  }

  // Sign in with email/password
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

  // Sign up with email/password
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

  // Send email verfificaiton when new user sign up
  async SendVerificationMail() {
    return (await this.firestoreAuth.currentUser)
      .sendEmailVerification()
      .then(() => {
        this.router.navigate(["verify-email"]);
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

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  async updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
      `users/${user.uid}`
    );
    const data: User = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      roles: {
        subscriber: true,
      },
    };
    return userRef.set(data, {
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
    const authorized = ["subscriber"];
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
