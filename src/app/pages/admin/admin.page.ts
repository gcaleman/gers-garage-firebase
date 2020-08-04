import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Observable } from "rxjs";


@Component({
  selector: "app-admin",
  templateUrl: "./admin.page.html",
  styleUrls: ["./admin.page.scss"],
})
export class AdminPage implements OnInit {
  startDate = new Date().toISOString();
  endDate = new Date().toISOString();
  splitStartDate = this.startDate.split("T");
  splitEndDate = this.startDate.split("T");
  startDateFilter = this.splitStartDate[0];
  endDateFilter = this.splitEndDate[0];
  allServices: Observable<any>;
  userServices: Observable<any>;

  constructor(public authService: AuthService) {}

  ngOnInit() {}

  startDateChanged(sDate) {
    console.log("sDate: "+sDate.detail.value);
    var sd = sDate.detail.value.split("T");
    this.startDateFilter = sd[0];
  }

  endDateChanged(eDate) {
    console.log("eDate: "+eDate.detail.value);
    var ed = eDate.detail.value.split("T");
    this.endDateFilter = ed[0];
  }

  runFilter(){
     this.allServices = this.authService
    .getAllServices(this.startDateFilter, this.endDateFilter).valueChanges({ idField: 'docId' });
  }
  
}
