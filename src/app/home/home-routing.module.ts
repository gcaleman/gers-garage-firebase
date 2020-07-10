import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomePage } from "./home.page";

const routes: Routes = [
  {
    path: "home",
    component: HomePage,
    children: [
      {
        path: "profilepage",
        loadChildren: () =>
          import("../pages/profilepage/profilepage.module").then(
            (m) => m.ProfilepagePageModule
          ),
      },
      {
        path: "profile",
        loadChildren: () =>
          import("../pages/profile/profile.module").then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: "register-car",
        loadChildren: () =>
          import("../pages/register-car/register-car.module").then(
            (m) => m.RegisterCarPageModule
          ),
      },
      {
        path: "booking",
        loadChildren: () =>
          import("../pages/booking/booking.module").then(
            (m) => m.BookingPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
