import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MydSideDrawerComponent } from './myd-side-drawer.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    declarations: [MydSideDrawerComponent],
    providers:[],
    exports: [CommonModule, RouterModule, FormsModule,MydSideDrawerComponent]
})
export class MydSideDrawerModule { }
