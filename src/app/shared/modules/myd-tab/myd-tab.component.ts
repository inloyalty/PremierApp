import { Component, OnDestroy, AfterContentInit, ContentChildren, Input, Output, EventEmitter, } from "@angular/core";
import { MydTabItemComponent } from './myd-tab-item.component';

@Component({
    selector: 'myd-tab',
    templateUrl: './myd-tab.component.html'

})

export class MydTabComponent implements OnDestroy, AfterContentInit {

    @Input() vertical = false;
    @Input() className = '';
    // @Input() tabItems:Array<any>;

    @ContentChildren(MydTabItemComponent) mydTabItemComponents;

    @Output() public tabChanged: EventEmitter<any> = new EventEmitter();


    // public tabs: Array<MydTabItemComponent>;

    public _tabItems: Array<any>
    @Input('tabItems')
    set tabItems(value: Array<any>) {
        this._tabItems = value;

    }

    get tabItems(): Array<any> {
        return this._tabItems
    }



    ngAfterContentInit(): void {
        if (this.mydTabItemComponents && this.mydTabItemComponents.length > 0) {
            this.mydTabItemComponents.toArray().forEach(element => {
                this._tabItems.push(element.tabItem)
            });;
            const actives = this._tabItems.filter(t => { return t.active });


            if (actives.length > 1) {
            } else if (!actives.length && this._tabItems.length) {
                this._tabItems[0].active = true;
            }
        }


    }
    ngOnDestroy(): void {

    }
    onTabChanged(tab: any) {
        this._tabItems.forEach(tab => tab.active = false);
        tab.active = true;
        this.tabChanged.emit(tab);
    }

}