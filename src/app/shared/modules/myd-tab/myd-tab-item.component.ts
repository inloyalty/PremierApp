import { Component, OnDestroy, Input, OnInit } from "@angular/core";

@Component({
    selector: 'tab-item',
    templateUrl: './myd-tab-item.component.html'
})

export class MydTabItemComponent {
    @Input() tabItem: any;
}

