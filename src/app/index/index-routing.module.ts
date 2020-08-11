import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { IndexPage } from "./index.page";

const routes: Routes = [
  {
    path: '',
    component: IndexPage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import("../pages/welcome/welcome.module").then(
            (m) => m.WelcomePageModule
          ),
      },
      {
        path: 'sign-in',
        loadChildren: () =>
          import("../pages/sign-in/sign-in.module").then(
            (m) => m.SignInPageModule
          ),
      },
      {
        path: 'sign-up',
        loadChildren: () =>
          import("../pages/sign-up/sign-up.module").then(
            (m) => m.SignUpPageModule
          ),
      },
      {
        path: 'recover-password',
        loadChildren: () =>
          import("../pages/recover-password/recover-password.module").then(
            (m) => m.RecoverPasswordPageModule
          ),
      },
      {
        path: 'services',
        loadChildren: () =>
          import("../pages/services/services.module").then(
            (m) => m.ServicesPageModule
          ),
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexPageRoutingModule {}
