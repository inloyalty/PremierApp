import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component(
    {
        selector: 'myd-side-drawer',
        templateUrl: 'myd-side-drawer.component.html',
        styleUrls: ['myd-side-drawer.component.css']
    }
)

export class MydSideDrawerComponent {

    @Input() showDrawer: boolean = true;
    @Input('title') title: string;
    @Input() footer: boolean = true;
    @Output() close: EventEmitter<any> = new EventEmitter();


    constructor() { }

    public closeDrawer() {
        this.showDrawer = false;
        this.close.emit(JSON.stringify(false));

    }
}