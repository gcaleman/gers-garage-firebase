import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../app/guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import("./index/index.module").then((m) => m.IndexPageModule),
  },
  {
    path: '',
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: 'detail/:date',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/detail/detail.module').then( m => m.DetailPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
