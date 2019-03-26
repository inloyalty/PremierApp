import { NgModule } from "@angular/core";
import { MydTabComponent } from './myd-tab.component';
import { MydTabItemComponent } from './myd-tab-item.component';
import { CommonModule } from '@angular/common';

@NgModule({
 declarations:[MydTabComponent,MydTabItemComponent],
 imports:[CommonModule],
 exports:[MydTabComponent,MydTabItemComponent]
})
export class MydTabModule{}