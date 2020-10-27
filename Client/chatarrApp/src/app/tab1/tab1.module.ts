import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExamPage } from '../exam/exam.page';
import { IonicStorageModule } from '@ionic/storage';

import { Tab1PageRoutingModule } from './tab1-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    IonicStorageModule.forRoot()
  ],
  declarations: [Tab1Page, ExamPage],
  entryComponents: [ExamPage]
})
export class Tab1PageModule {}
