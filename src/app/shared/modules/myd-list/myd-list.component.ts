import { Component, OnInit, OnDestroy, ContentChild, TemplateRef, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener, AfterViewInit, Renderer, ChangeDetectorRef } from "@angular/core";
import { MydSelectOptionDirective, MydSelectOptionSelectedDirective, MydSelectOptionNotFoundDirective } from "./myd-list-directive";

// import third part
import * as _ from 'lodash';
import { MydFilterPipe } from "../../pipes/filter.pipe";


@Component({
    selector: 'myd-list',
    templateUrl: './myd-list.component.html',
    providers: [MydFilterPipe],
    styles: [` .active{
        background-color: red;
      }`]
})

export class MydListComponent implements OnInit, OnDestroy, AfterViewInit {


    // declare the inputs
    @Input() public multiSelect = false;
    @Input() public height;
    @Input() public width;
    @Input() public serverSidePagination = false;
    @Input() public totalRecord: number;
    @Input() public filter: any;
    @Input() public selectable = false;
    @Input() public templateBased = false;
    @Input() public bindLabel: string;
    @Input() public itemClassName: string = 'list-group-item';
    @Input() public selectedClassName: string = 'bg-primary text-white';
    @Input() public selectableOnScroll = false;
    @Input() public headerItems: Array<headerItem>;




    @Input('dataSource')
    set dataSource(dataSource: any) {
        this._dataSource = dataSource;
        this.refreshDataSource(this._dataSource);
    }

    get dataSource(): any {
        return this._dataSource
    }


    // declare the outputs
    @Output() public itemSelection: EventEmitter<any> = new EventEmitter();
    @Output() public pageChange: EventEmitter<number> = new EventEmitter();
    @Output() public sort: EventEmitter<headerItem> = new EventEmitter();


    // declare the public variables
    public hover = false;
    public sortColumnName: string = ''
    // declare the private variables
    public currentPageIndex = 1;
    public localDataSource: any = [];
    private _dataSource: any[];
    public activeIndex: number = 0;
    private selectedItems: any = []
    private searchTempItems: any = [];
    // decalre the view child
    @ContentChild(MydSelectOptionDirective, { read: TemplateRef }) templateOption: MydSelectOptionDirective;
    @ContentChild(MydSelectOptionSelectedDirective, { read: TemplateRef }) templateSelectedOption: MydSelectOptionSelectedDirective;
    @ContentChild(MydSelectOptionNotFoundDirective, { read: TemplateRef }) templateOptionNotFound: MydSelectOptionNotFoundDirective;
    @Input() childTemplate: TemplateRef<any>;
    @ViewChild('scrollContainer') private scrollContainer: ElementRef;
    // inject the service in contructor
    constructor(
        private renderer: Renderer,
        private cdRef: ChangeDetectorRef,
        private filterPipe: MydFilterPipe
    ) { }

    // initilize the variables
    ngOnInit(): void {

    }
    ngAfterViewInit(): void {
        this.scrollContainer.nativeElement.focus();
        this.renderer.invokeElementMethod(this.scrollContainer.nativeElement, 'scrollIntoViewIfNeeded');

        // if(!this.width || this.width <=0)
        // {
        //     this.width = window.innerWidth - 100;

        // }

    }

    // Handle the li select and unselect event 
    onItemSelection(item: any) {
        // reset all the selected item
        if (this.multiSelect == false)
            this.localDataSource.forEach(item => item.selected = false)

        item.selected = !item.selected;
        // item.ProductName='PKS'

        this.selectedItems = _.filter(this.localDataSource, function (x) { return x.selected == true });
        if (this.selectedItems != null && this.selectedItems.length > 0) {
        }
        this.itemSelection.emit(this.selectedItems);
        this.cdRef.detectChanges();

    }
    // refresh the local data source to append the new items to existing collection 
    refreshDataSource(dataSource: any) {
        if (dataSource && dataSource.length > 0) {
            let maxIndex = this.localDataSource.length - 1;
            dataSource.forEach(element => {
                element.selected = false;
                element.active = false;
                maxIndex = maxIndex + 1;
                element.index = maxIndex
                this.localDataSource.push(element);
            });
            this.localDataSource[0].active = true;
            this.searchTempItems = this.localDataSource;
            //this._dataSource = this.localDataSource;
        }
    }
    // raise the event to parent control to get the next page records 
    public onScroll(event: any) {
        let element = this.scrollContainer.nativeElement
        let totalScrolledHeight = (element.scrollHeight - Math.ceil(element.scrollTop)) + 10;
        let atBottom = false;
        if (totalScrolledHeight >= element.clientHeight) {
            atBottom = true;
        }
        // let atBottom = element.scrollHeight - Math.ceil(element.scrollTop) === element.clientHeight
        if (atBottom) {
            this.currentPageIndex += 1;
            let localDataSourceTotalRecord = 0;
            if (this.localDataSource.length > 0) {
                localDataSourceTotalRecord = this.localDataSource.length;
                console.log(`total records : ${this.totalRecord}  local data soure record count ${localDataSourceTotalRecord}`);
            }
            if (localDataSourceTotalRecord < this.totalRecord) {
                console.log('pagechange event raised ')
                this.pageChange.emit(this.currentPageIndex);
            }
        }

    }


    public getActiveClass(index: number) {
        let retVal = '';
        if (index === this.activeIndex) {
            retVal = 'cp-1 ls-3 bg-color';
        }
        return retVal;
    }

    public removeSelectedItem(item: any) {
        if (this.selectedItems && this.selectedItems.length > 0) {
            this.selectedItems = _.filter(this.selectedItems, function (x) { return x.index != item.index });
            //  let selectedItem= _.filter(this.localDataSource, function (x) { return x.index == item.index });
            this.localDataSource.forEach(element => {
                if (element.index == item.index) {
                    element.selected = false;
                }
            });

            this.itemSelection.emit(this.selectedItems);

        }
    }
    public onSearch(searchText: string) {

        console.log(searchText);
        if (this.serverSidePagination == true) {
            this.localDataSource = [];
            this.currentPageIndex = 1;
        }
        else {
            console.log('local search')
            console.log(this.searchTempItems);
            this.localDataSource = this.filterPipe.transform(this.searchTempItems, searchText, null, true);

        }
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        // event.key === 'ArrowUp'
        if (!this.hover) {
            return;
        }

        if (!this.localDataSource || (typeof this.localDataSource === 'undefined') || this.localDataSource.lenth <= 0)
            return;
        let liElement = document.getElementById(`li_${this.activeIndex}`);

        let liHeight = 0
        if (!liElement && this.localDataSource.lenth > 0) {
            liHeight = liElement.clientHeight;
        }
        if (event.key === 'ArrowUp') {

            this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : 0;

            let totalliScrolledHeight = (this.activeIndex) * liHeight;
            this.scrollContainer.nativeElement.scrollTop = totalliScrolledHeight
        }
        else if (event.key === 'ArrowDown') {
            this.scrollContainer.nativeElement.focus();

            if (this.localDataSource.length > this.activeIndex + 1) {
                this.activeIndex = this.activeIndex + 1;
                let totalliScrolledHeight = (this.activeIndex - 1) * liHeight;
                this.scrollContainer.nativeElement.scrollTop = totalliScrolledHeight
            }

        }

        // console.log(document.getElementById(`li_${this.activeIndex}`).clientHeight)
        // this.renderer.invokeElementMethod(this.scrollContainer.nativeElement, 'offsetHeight');

    }
    // distory all the user variables and object to release the memory
    ngOnDestroy(): void {
        this.localDataSource = null;
        this.itemSelection = null;

    }

    onMouseOver(event: any) {
        this.hover = true;
    }
    onMouseLeave(event: any) {
        this.hover = false;

    }


    onSort(headerItem: any) {
        // console.log(gridColumnHeader);
        if (this.sortColumnName != headerItem.title) {
            this.headerItems.forEach(item => {
                if (item.title == this.sortColumnName) {
                    item.sortClassName = null
                    item.sortOrder = null;
                }
            })
        }
        if (headerItem.sortOrder == null || headerItem.sortOrder == 'desc') {
            headerItem.sortOrder = 'asc'
            headerItem.sortClassName = 'fas fa-long-arrow-alt-up';
        }
        else {
            headerItem.sortOrder = 'desc'
            headerItem.sortClassName = 'fas fa-long-arrow-alt-down';
        }
        this.sortColumnName = headerItem.title;

        if (this.serverSidePagination) {
            this.sort.emit(headerItem)
        }
        else {
            this.localDataSource = _.orderBy(this.localDataSource, [headerItem.sortBy], [headerItem.sortOrder]);
        }

    }
    public clear() {
        this.localDataSource = [];
    }
}

export class headerItem {
    title: string;
    sortable: boolean;
    width: number;
    widthClass: string
    sortClassName: string;
    sortOrder: string;
    sortBy: string
}