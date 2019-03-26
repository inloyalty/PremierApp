import { Component, Input, Output, EventEmitter, AfterViewChecked, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, Renderer } from '@angular/core';
import { OnInit } from '@angular/core';
import { Event } from '@angular/router';

import * as _ from 'lodash';

@Component({

    selector: 'myd-data-grid',
    templateUrl: 'myd-data-grid.component.html',
    styleUrls: ['myd-data-grid.component.css']

})

export class DataGridComponent implements OnInit, AfterViewChecked, OnDestroy {

    // @Input('dataSource') dataSource = [];
    @Input('columns') columns: Array<DataGridColumn> = [];
    @Input('sortable') sortable = true;
    @Input('showSearchBar') showSearchBar = true;
    @Input('showAdavanceFilter') showAdavanceFilter = false;
    @Input('width') width = '100%';
    @Input() pageSizes: any[];
    @Input('pageSize') pageSize: number;
    @Input('totalRecord') totalRecord: number;
    @Input('commands') commands: IDataGridCommand[] = [];
    @Input('quickCommands') quickCommands: IDataGridCommand[] = [];
    @Input('rowAction') rowAction = 'VED';
    @Input('showAction') showAction: boolean = true;
    @Input('localPagination') localPagination: boolean = false;
    @Input('filterDataSource') filterDataSource: any = [];
    @Input('onDemandDataSoure') onDemandDataSoure: boolean = false;
    @Input('height') height=600;

    @Input('dataSource')
    set dataSource(dataSource: any) {
        this._dataSource = dataSource;

        this.refreshDataSource(this._dataSource);
    }

    get dataSource(): any {
        return this._dataSource
    }
    private _dataSource = [];
    // Declare the output types  
    @Output() edit: EventEmitter<any> = new EventEmitter();
    @Output() delete: EventEmitter<any> = new EventEmitter();
    @Output() view: EventEmitter<any> = new EventEmitter();
    @Output() sort: EventEmitter<any> = new EventEmitter();
    @Output() search: EventEmitter<any> = new EventEmitter();
    @Output() pageChange: EventEmitter<any> = new EventEmitter();
    @Output() commandButtonClick: EventEmitter<any> = new EventEmitter();
    @Output() subscribeColumn: EventEmitter<any> = new EventEmitter();


    //public sortclassName:string='fa fa-sort';
    public sortColumnName: string = ''
    contentWidth: string = '100%';
    actionColumnWidth: number = 120;
    actionColumnWidthPx: string = this.actionColumnWidth.toString() + 'px';
    contentTableWidthPx: string = '100%';
    public searchText: string;
    private totalPageNumber: number;
    private currentPageNumber: number = 1;
    private localDataSource = [];
    private startIndex = 0;
    private endIndex = 0;
    public tempColumns: Array<DataGridColumn> = [];
    private subscribedColumns: Array<DataGridColumn> = [];
    public columnSearchText: string;
    public selectAllGridColumn: boolean = false;
    public localDataSourceTotalRecord = 0;
    showDrawer = false;
    title = 'Grid Columns'
    filterDrawerTitle = 'Advance Filter'
    showfilterDrawer = false;

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    start: any;
    pressed: boolean;
    startWidth: any;


    constructor(private cdRef: ChangeDetectorRef, public renderer: Renderer) {
        this.localDataSource = new Array();
    }

    ngOnInit() {
        let contentContainerWith = 0;
        if (this.width != '100%') {
            this.columns.forEach(item => {
                contentContainerWith += item.width;
            });
            contentContainerWith += this.actionColumnWidth;
            this.contentWidth = contentContainerWith + 'px';
        }
        // sort the grid column based on displayOrder provided  
        this.columns = _.orderBy(this.columns, 'displayOrder', 'asc');
        // start the displayOrder from 1 and the reset the colums display order. 
        //This will be used in change column display order 

        this.columns.forEach((item, index) => { item.displayOrder = index + 1; });
        this.tempColumns = this.columns.map(x => Object.assign({}, x));
        this.subscribedColumns = this.columns.map(x => Object.assign({}, x));
    }

    refreshDataSource(dataSoruce: any) {
        if (this.localPagination) {
            // show the record based on page scroll 
            if (this.onDemandDataSoure == false) {
                this.totalPageNumber = Math.ceil(dataSoruce.length / this.pageSize);

                this.localDataSource = dataSoruce;
                this.totalRecord = dataSoruce.length;

                this.changeDataSource();
            }
            else {
                if (dataSoruce != null && dataSoruce.length > 0) {
                    dataSoruce.forEach(element => {
                        this.localDataSource.push(element);
                    });

                    this._dataSource = this.localDataSource;
                }
            }
            this.localDataSourceTotalRecord = this.localDataSource.length;

            //   console.log(this.localDataSourceTotalRecord);
        }
    }

    private changeDataSource() {

        if (this.dataSource.length >= this.localDataSource.length)
            return;

        if (this.currentPageNumber < this.totalPageNumber) {
            this.startIndex = this.currentPageNumber * this.pageSize;


            // if (this.startIndex > 0)
            //     this.startIndex = this.startIndex - 1;
            // console.log(`currentPageNumber  : ${this.currentPageNumber}  totalPageNumber:  ${this.totalPageNumber} StartIndex:  ${this.startIndex}`)
            //let tempDataSource = this.dataSource.splice(this.startIndex, this.pageSize);
            //  this.localDataSource = this.localDataSource.concat(tempDataSource);
            for (let i = 1; i <= this.pageSize; i++) {
                // console.log(this.startIndex);
                if (this.startIndex < this.totalRecord)
                    this.dataSource.push(this.localDataSource[this.startIndex]);
                this.startIndex++;

            }
        }

    }

    ngAfterViewChecked() {
        let headerContainer = document.getElementById('myd-data-grid-header-table');
        if (headerContainer) {
            this.contentTableWidthPx = headerContainer.offsetWidth + 'px';
        }


        // Detact the element scroll bar 

        // let gridBody = document.getElementById('myd-data-grid-body-table');
        // var hasHorizontalScrollbar= gridBody.scrollWidth>gridBody.clientWidth;
        // var hasVerticalScrollbar= gridBody.scrollHeight>gridBody.clientHeight;
        // console.log(`Vertical Scroll :  ${hasVerticalScrollbar}    :  ${hasHorizontalScrollbar}`  );
        // console.log(`Scroll Width:  ${gridBody.scrollWidth}    :  ${gridBody.clientWidth}`  );

        this.cdRef.detectChanges();
    }

    onEditRow(row: Object) { this.edit.emit(row); }
    onDeleteRow(row: Object) {
        // this.delete.emit(row);
        const confirmResult = confirm('Are you sure you want to delete this item.');
        if (confirmResult) {
            this.delete.emit(row);
        }
    }
    onViewRow(row: Object) { this.view.emit(row); }

    onSort(gridColumnHeader: any) {
        // console.log(gridColumnHeader);
        if (this.sortColumnName != gridColumnHeader.fieldName) {
            this.columns.forEach(item => {
                if (item.fieldName == this.sortColumnName) {
                    item.sortClassName = ''
                    item.sortOrder = null;
                }

            })
        }
        if (gridColumnHeader.sortOrder == null || gridColumnHeader.sortOrder == 'desc') {
            gridColumnHeader.sortOrder = 'asc'
            gridColumnHeader.sortClassName = 'fas fa-long-arrow-alt-up';
        }
        else {
            gridColumnHeader.sortOrder = 'desc'
            gridColumnHeader.sortClassName = 'fas fa-long-arrow-alt-down';
        }
        this.sortColumnName = gridColumnHeader.fieldName;
        this.sort.emit(gridColumnHeader);
    }

    onResize(event: Event) {
        // console.log(event);
        let headerContainer = document.getElementById('myd-data-grid-header-table');
        // console.log(headerContainer.offsetWidth);
        if (headerContainer) {
            this.contentTableWidthPx = headerContainer.offsetWidth + 'px';
        }
    }

    onSearch() {
        this.search.emit(JSON.stringify(this.searchText));
    }
    onPageChange(currentPage: any) {
        this.pageChange.emit(currentPage);
        // this.cdRef.detectChanges();
    }

    OnCommandButtonClick(commandName: string) {
        this.commandButtonClick.emit(JSON.stringify(commandName));
    }
    checkRowAction(actionName: string) {
        return _.includes(this.rowAction.toUpperCase(), actionName)
    }
    /*
     Clean the component and dispose the objects 
    */
    ngOnDestroy(): void {

        this.dataSource = null;
        this.localDataSource = null;
        this.columns = null;
    }


    public onScroll() {
        if (this.localPagination == false)
            return false;
        let element = this.myScrollContainer.nativeElement
        // console.log(`element.scrollHeight : ${element.scrollHeight}    element.scrollTop  : ${element.scrollTop}  element.clientHeight ${element.clientHeight}`)
        let atBottom = element.scrollHeight - Math.ceil(element.scrollTop) === element.clientHeight
        // if(Math.floor(element.scrollTop) <10)
        // {
        //     this.currentPageNumber =1;
        // }
        // console.log(atBottom)
        if (atBottom) {
            this.currentPageNumber += 1;
            console.log(this.currentPageNumber)
            if (this.onDemandDataSoure) {

                console.log(`Local Pagination  total records ${this.totalRecord}  data source count : ${this.localDataSource.length}`)
                if (this.totalRecord > this.localDataSource.length) {
                    let page = {
                        totalItems: null,
                        currentPage: this.currentPageNumber,
                    };
                    console.log(page);
                    this.pageChange.emit(page);
                }

            } else {

                this.changeDataSource();
            }
        }
        // if (this.disableScrollDown && atBottom) {
        //     this.disableScrollDown = false
        // } else {
        //     this.disableScrollDown = true
        // }
    }

    public openColumnConfigurationDrawer() {
        this.columnSearchText = '';
        this.tempColumns = this.columns.map(x => Object.assign({}, x));
        this.subscribedColumns = this.columns.map(x => Object.assign({}, x));
        this.showDrawer = true;
        this.selectAllGridColumn = false;


    }

    onDrawerClose(isClose: any) {
        console.log(isClose);
        this.showDrawer = false;

    }

    applyDataGridColumnConfiguration() {
        this.columns.forEach(item => {
            let tempColumn = _.find(this.subscribedColumns, ['fieldName', item.fieldName]);
            if (tempColumn) {
                item.visible = tempColumn.visible;
                item.displayOrder = tempColumn.displayOrder;
            }
        });
        this.columns = _.orderBy(this.columns, 'displayOrder', 'asc');
        this.subscribeColumn.emit(this.columns)
        this.showDrawer = false;
    }
    onColumnSearch() {
        if (this.columnSearchText && this.columnSearchText.length > 0) {
            console.log(this.columnSearchText);
            let _searchText = this.columnSearchText.toLowerCase();
            let _filterColumns = _.filter(this.columns, function (x) { return x.title.toLowerCase().indexOf(_searchText) != -1; });
            if (_filterColumns && _filterColumns.length > 0) {


                this.tempColumns = _filterColumns.map(x => Object.assign({}, x));
                this.tempColumns.forEach(item => {
                    let tempColumn = _.find(this.subscribedColumns, ['fieldName', item.fieldName]);
                    if (tempColumn) {
                        item.visible = tempColumn.visible;
                    }
                });
            }
            else {
                this.tempColumns = [];
            }
            console.log(this.tempColumns);
        }
        else {
            this.tempColumns = this.subscribedColumns.map(x => Object.assign({}, x));
        }
    }

    onDataGridColumnChanged(column: DataGridColumn) {
        console.log(column);
        let tempColumn = _.find(this.subscribedColumns, ['fieldName', column.fieldName]);
        tempColumn.visible = column.visible;
        console.log(this.subscribedColumns);
    }

    onHideColumnClick(column: DataGridColumn) {
        let tempColumn = _.find(this.subscribedColumns, ['fieldName', column.fieldName]);
        tempColumn.visible = false;
        console.log(this.subscribedColumns);
        this.applyDataGridColumnConfiguration();
    }
    onGridColumnAllChange() {
        console.log(this.selectAllGridColumn);

        this.subscribedColumns.forEach(item => { item.visible = this.selectAllGridColumn; });
        this.tempColumns = this.subscribedColumns.map(x => Object.assign({}, x));
        console.log(this.subscribedColumns);

    }
    /*
    @displayOrder : pass the grid column display order 
    @orderType :(up,down) pass the up down in orderType parameter to changes to display order of grid colum
    */
    onGridColumnDisplayChange(displayOrder: number, orderType: string) {
        console.log(displayOrder)

        if (orderType.toLocaleLowerCase() == 'up') {
            this.subscribedColumns[displayOrder - 1].displayOrder = displayOrder - 1;
            this.subscribedColumns[displayOrder - 2].displayOrder = displayOrder;
        }
        else {
            this.subscribedColumns[displayOrder - 1].displayOrder = displayOrder + 1;
            this.subscribedColumns[displayOrder].displayOrder = displayOrder;
        }
        this.subscribedColumns = _.orderBy(this.subscribedColumns, 'displayOrder', 'asc');
        this.tempColumns = this.subscribedColumns.map(x => Object.assign({}, x));
    }

    onGridColumnDrop(sourceHeader: any, targetHeader: any) {


        let src = parseInt(sourceHeader.displayOrder);
        let trg = parseInt(targetHeader.displayOrder);
        // If the element was moved down
        if (src > trg) {
            for (let i = trg; i < src; i++) {
                console.log(`${i}  index : ${i - 1}`);
                this.subscribedColumns[i - 1].displayOrder = i + 1;
            }
            this.subscribedColumns[src - 1].displayOrder = trg;

        } else {  // if the element was moved up
            for (let i = src + 1; i <= trg; i++) {
                this.subscribedColumns[i - 1].displayOrder = i - 1;
            }
            this.subscribedColumns[src - 1].displayOrder = trg;
        }
        this.subscribedColumns = _.orderBy(this.subscribedColumns, 'displayOrder', 'asc');
        this.tempColumns = this.subscribedColumns.map(x => Object.assign({}, x));

    }

    onresizeStoped(event: any) {
        console.log(event);
        let tempColumn = _.find(this.columns, ['fieldName', event.id]);
        if (tempColumn != null) {
            // tempColumn.width =event.NewWidth  ;

        }
    }

    onApplyFilter(event: any) {
        console.log(event);
    }


    public clear() {
        this.localDataSource = [];
        this._dataSource = [];
    }


}

export class DataGridColumn {
    public constructor(_fieldName?: string, _tilte?: string, _apiFieldName: string = '', _format: string = '', _width: number = 130, _sortable: boolean = true, _displayOrder: number = 999, _isVisible: boolean = true, _groupid: string = '') {
        this.fieldName = _fieldName;
        this.format = _format;
        this.title = _tilte;
        this.width = _width;
        this.sortable = _sortable;
        if (_sortable) {

            this.sortClassName = ''
        }
        this.displayOrder = _displayOrder;
        this.visible = _isVisible;
        this.groupId = _groupid;
        this.apiFieldName = _apiFieldName;

    }
    public fieldName?: string;
    public title?: string;
    public format?: string;
    public width?: number;
    public sortable?: boolean;
    public sortClassName?: string;
    public sortOrder?: string;
    public displayOrder?: number;
    public visible?: boolean;
    public groupId?: string;
    public apiFieldName?: string;
    private _widthPx?: string;

    public get widthPx(): string {
        return this.width.toString() + 'px';
    }

    private _textAlign: TextAlign;
    public get TextAlign(): TextAlign {
        return this._textAlign != null || this._textAlign != undefined ? this._textAlign : TextAlign.Left;
    }
    public set TextAlign(value: TextAlign) {
        this._textAlign = value;
    }
    public get textAlignClassName(): string {
        if (this.TextAlign === TextAlign.Left) {
            return 'text-left'
        }
        else if (this.TextAlign === TextAlign.Center) {
            return 'text-center'
        }
        else if (this.TextAlign === TextAlign.Right) {
            return 'text-right'
        }
    }
}

enum TextAlign {
    Left = 1,
    Right = 2,
    Center = 3,
}



export interface IDataGridCommand {
    name: string;
    label: string;
    iconClass: string;
    class: string;
}

export class DataGridCommand implements IDataGridCommand {
    constructor() {
        this.class = 'el-btn el-btn-primary'
    }
    name: string;
    label: string;
    iconClass: string;
    class: string = '';
}
