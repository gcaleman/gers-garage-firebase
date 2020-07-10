import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterCarPageRoutingModule } from './register-car-routing.module';

import { RegisterCarPage } from './register-car.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterCarPageRoutingModule
  ],
  declarations: [RegisterCarPage]
})
export class RegisterCarPageModule {}
