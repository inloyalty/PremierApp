import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { PagerService } from "./myd-pager-service";
import { PaginationConfig } from "./pagination.config";

@Component({
    selector: 'myd-pagination',
    templateUrl: 'myd-pagination.component.html',
    styleUrls: ['myd-pagination.component.css']
})

export class PaginationComponent implements OnInit {

    @Input() public pageSize: number;
    @Input() public totalRecord: number;
    @Input() public pageSizes: any[] = [10, 20, 50, 100, 200];
    @Input() public paginationConfig: PaginationConfig = new PaginationConfig();
    @Output() pageChange: EventEmitter<any> = new EventEmitter();

    //pageSizes:any[]=[10,20,50,100,200]
    // array of all items to be paged
    private allItems: any[];
    // public totalRecord:number=100;
    private recordFrom: number
    private recordTo: number;

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];

    constructor(private pagerService: PagerService) {
        this.pageSize = 20;
    }
    ngOnInit() {
        if (this.paginationConfig == null) {
            this.paginationConfig = new PaginationConfig();
        }
        // this.setPage(1);
        this.pager = this.pagerService.getPager(this.totalRecord, 1, this.pageSize);
    }

    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.totalRecord, page, this.pageSize);
        this.pageChange.emit(this.pager);

        // get current page of items
        // this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
    public changePageSize() {
        this.pager = this.pagerService.getPager(this.totalRecord, 1, this.pageSize);        
        this.pageChange.emit(this.pager);
        // this.calculatePageNumbers();
        // this.currentPage = 1;
        // const $event = {
        //   event,
        //   pageNo: 1,
        //   pageSize: this.pageSize,
        //   data: this.nullAble
        // };
        // this.changePageData($event);
    }

    getIconClassName(classNameFor: string) {
        return this.paginationConfig.previousIconClass;
    }


}