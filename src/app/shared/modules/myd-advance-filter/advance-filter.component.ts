import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'myd-advance-filter',
    templateUrl: 'advance-filter.component.html'
})

export class MydAdvanceFilterComponent implements OnInit {

    @Input('dataSource') dataSource: Array<FilteItem> = [];
    @Output() applyFilter: EventEmitter<any> = new EventEmitter();

    filterColumns: Array<any>;
    selectedVal: any;
    searchText: any;
    filterGroupColumns: any;


    constructor() { }
    ngOnInit(): void {
        console.log(this.dataSource);
    }

    onApplyFilter() {
        console.log(this.dataSource);
        this.applyFilter.emit(this.dataSource);
    }
    onResetFilter() {
        this.dataSource.forEach(item => {
            item.value = null;
            item.toValue = null;
        });
     
}
}

export class FilteItem {
    public fieldName: string;
    public displayName?: string;
    public dataType?: DataType;
    public isLookup?: boolean = false;
    public options?: Array<LookupItem>;
    public value?: any;
    public toValue?: any;
    public isRange?: boolean = false

}

export class LookupItem {
    public value: string;
    public text: string;
}


enum DataType {
    Text = 1,
    Number = 2,
    Currency = 3,
    Date = 4,
    DateTime = 5,
    Time = 6,
    Range = 7,
    Lookup = 8
}

enum OperatorType {
    //Equal to
    EQ = 1,
    //Not equal to
    NEQ = 2,
    //Less than
    LT = 3,
    //Greater than
    GT = 4,
    //Less than equal to
    LTE = 5,
    //Greater than equal to
    GTE = 6,
    //Starts with
    SW = 7,
    //Ends with
    EW = 8,
    //Contains
    CN = 9
}