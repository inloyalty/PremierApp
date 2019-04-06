import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TopNavComponent } from './top-nav.component';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  declarations: [TopNavComponent],
  exports: [TopNavComponent],
  providers : [NavigationService]
})
export class TopNavModule { }
