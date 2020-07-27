import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomePage } from "./home.page";
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profilepage',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("../pages/profilepage/profilepage.module").then(
            (m) => m.ProfilepagePageModule
          ),
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("../pages/profile/profile.module").then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: 'register-car',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("../pages/register-car/register-car.module").then(
            (m) => m.RegisterCarPageModule
          ),
      },
      {
        path: 'booking',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("../pages/booking/booking.module").then(
            (m) => m.BookingPageModule
          ),
      },
      {
        path: 'services',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("../pages/services/services.module").then(
            (m) => m.ServicesPageModule
          ),
      },
      {
        path: 'admin',
        canActivate: [AdminGuard, AuthGuard],
        loadChildren: () =>
          import("../pages/admin/admin.module").then(
            (m) => m.AdminPageModule
          ),
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
