import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
 
import { PagerService } from './myd-pager-service';
import { PaginationComponent } from './myd-pagination.component';
 

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    declarations: [PaginationComponent],
    providers:[PagerService],
    exports: [CommonModule, RouterModule, FormsModule,PaginationComponent]
})
export class PaginationModule { }
