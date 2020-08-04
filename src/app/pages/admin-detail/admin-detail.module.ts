import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminDetailPageRoutingModule } from './admin-detail-routing.module';

import { AdminDetailPage } from './admin-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminDetailPageRoutingModule
  ],
  declarations: [AdminDetailPage]
})
export class AdminDetailPageModule {}
