import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilepagePage } from './profilepage.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilepagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilepagePageRoutingModule {}
