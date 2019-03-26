import { Injectable } from '@angular/core';

/** Provides default values for Pagination and pager components */
@Injectable()
export class PaginationConfig {
     
    constructor()
    {
        this.itemsPerPage= 10;
        this.boundaryLinks= false;
        this.directionLinks= true;
        this.firstLabel= 'First';
        this.previousLabel= 'Previous';
        this.nextLabel= 'Next';
        this.lastLabel= 'Last';
        this.firstIconClass= 'fa fa-angle-double-left';
        this.previousIconClass= 'fa fa-angle-left';
        this.nextIconClass= 'fa fa-angle-right';
        this.lastIconClass= 'fa fa-angle-double-right';
        this.showIcon= true;
        this.showLabel= true;
        this.pageBtnClass= ''; 
    }
        maxSize: number =0;
        itemsPerPage= 10;
        boundaryLinks= false;
        directionLinks: true;
        firstLabel: 'First';
        previousLabel: 'Previous';
        nextLabel: 'Next';
        lastLabel: 'Last';
        firstIconClass: 'fa fa-angle-double-left';
        previousIconClass: 'fa fa-angle-left';
        nextIconClass: 'fa fa-angle-right';
        lastIconClass: 'fa fa-angle-double-right';
        showIcon: true;
        showLabel: true;
        pageBtnClass: '';
        rotate: true
     
     
}