import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { FormBuilder } from "@angular/forms";
import { RegisterCarPage } from "../register-car/register-car.page";
import * as pdfmake from "../../../www/pdfmake/build/pdfmake.js";
import * as pdfFonts from "../../../www/pdfmake/build/vfs_fonts";

@Component({
  selector: "app-admin-detail",
  templateUrl: "./admin-detail.page.html",
  styleUrls: ["./admin-detail.page.scss"],
})
export class AdminDetailPage implements OnInit {
  services: Observable<any>;
  serviceDate;
  docId;
  myDate = new Date().toISOString(); /* variable gets the current date and save as an ISOString object */

  static invalidDates = [];
  dateSundays: Date = new Date(
    2020,
    6,
    20
  ); /* Variable to hold an initial Sunday date (19/07/2020) */

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public formBuilder: FormBuilder,
  ) {
    for (let index = 0; index < 23; index++) {
      this.dateSundays.setDate(this.dateSundays.getDate() + 7);
      RegisterCarPage.invalidDates.splice(
        index,
        0,
        this.dateSundays.toISOString()
      );
    }
  }

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

  getDate() {
    return this.route.snapshot.paramMap.get("date");
  }
  getDocUid() {
    return this.route.snapshot.paramMap.get("docId");
  }
  getUserUid() {
    return this.route.snapshot.paramMap.get("uid");
  }
  getId() {
    return this.route.snapshot.paramMap.get("id");
  }

  generatePDF(date) {
    pdfmake.vfs = pdfFonts.pdfMake.vfs;
    var docDefinition = {
      content: [
        {
          columns: [
            [
              { text: "BITCOIN", style: "header" },
              { text: "Cryptocurrency Payment System", style: "sub_header" },
            ],
            [
              { text: "Date: " +date, style: "header" },
            ],
          ],
        },
      ],
      styles: {
        header: {
          bold: true,
          fontSize: 20,
          alignment: "right",
        },
        sub_header: {
          fontSize: 18,
          alignment: "right",
        },
        url: {
          fontSize: 16,
          alignment: "right",
        },
      },
      pageSize: "A4",
      pageOrientation: "portrait",
    };
    pdfmake.createPdf(docDefinition).open();
  }

  ngOnInit() {
    const serviceDate = this.route.snapshot.paramMap.get("date");
    const serviceId = this.route.snapshot.paramMap.get("docId");
    this.services = this.authService
      .getAdminDetail(serviceDate, serviceId)
      .valueChanges();
  }
}
