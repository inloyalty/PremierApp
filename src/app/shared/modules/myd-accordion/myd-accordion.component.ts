import { Component, OnInit, OnDestroy, ContentChild, TemplateRef, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener, AfterViewInit, Renderer, ChangeDetectorRef } from "@angular/core";

declare var $: any;

@Component({
    selector: 'myd-accordion',
    templateUrl: './myd-accordion.component.html',
    styleUrls: ['myd-accordion.component.css']
})

export class MydAccordionComponent implements OnInit, OnDestroy {

    /* Public Variables */
    public isExpand: boolean = true;

    /*Input Variables */
    @Input() title: string;
    @Input() positionData: any;
    @Input() headerTemplate: TemplateRef<any>;
    constructor() {

    }

    ngOnInit() {

    }

    public toggleIcon(e: any) {
        $(e.currentTarget).find('.cat-header').toggleClass('fa-chevron-right fa-chevron-down');
    }

    public color(index: number) {
        var accColors = ['','#1067af','#1379cd','#1379cd','#1379cd'];
        return accColors[index];
    }

    ngOnDestroy() {

    }
}