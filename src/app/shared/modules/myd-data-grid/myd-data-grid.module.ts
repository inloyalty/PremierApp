import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataGridComponent } from './myd-data-grid.component';
import { PaginationModule } from '../myd-pagination/myd-pagination.module';
import { MydSideDrawerModule } from '../myd-side-drawer/myd-side-drawer.module';
 
import { MydAdvanceFilterModule } from '../myd-advance-filter/advance-filter.module';
import { SharedDirectiveModule } from '../../directives/shared.directive.module';
 

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        PaginationModule,
        MydSideDrawerModule,
        SharedDirectiveModule,
        MydAdvanceFilterModule
    ],
    declarations: [DataGridComponent],
    exports: [CommonModule, RouterModule, FormsModule,DataGridComponent]
})
export class DataGridModule { }
