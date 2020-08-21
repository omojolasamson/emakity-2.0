import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymenttypePage } from './paymenttype';

@NgModule({
  declarations: [
    PaymenttypePage,
  ],
  imports: [
    IonicPageModule.forChild(PaymenttypePage),
  ],
})
export class PaymenttypePageModule {}
