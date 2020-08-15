import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../app/guards/auth.guard";
import { AdminGuard } from "./guards/admin.guard";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./index/index.module").then((m) => m.IndexPageModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "detail/:uid",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/detail/detail.module").then((m) => m.DetailPageModule),
  },
  {
    path: "admin-detail/:date/:docId/:uid/:id/:status",
    canActivate: [AdminGuard, AuthGuard],
    loadChildren: () =>
      import("./pages/admin-detail/admin-detail.module").then(
        (m) => m.AdminDetailPageModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
