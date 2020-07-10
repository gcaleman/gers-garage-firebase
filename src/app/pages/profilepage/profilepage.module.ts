import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilepagePageRoutingModule } from './profilepage-routing.module';

import { ProfilepagePage } from './profilepage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilepagePageRoutingModule
  ],
  declarations: [ProfilepagePage]
})
export class ProfilepagePageModule {}
