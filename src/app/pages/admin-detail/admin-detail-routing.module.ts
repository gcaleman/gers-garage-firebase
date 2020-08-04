import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminDetailPage } from './admin-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AdminDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDetailPageRoutingModule {}
