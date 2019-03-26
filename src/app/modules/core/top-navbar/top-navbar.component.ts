// Use this package to show the popup using the popper js
// https://www.npmjs.com/package/ngx-popper

import { Component, OnInit, OnDestroy, ViewChild, Input } from "@angular/core";
import { NavigationService } from "src/app/shared/services/navigation.service";
import { UtilService } from "src/app/shared/services/util.service";
declare var $: any;

@Component({
    selector: 'top-navbar',
    templateUrl: 'top-navbar.component.html',
    styleUrls: ['top-navbar.component.css'],
    providers: [UtilService]
})

export class TopNavbarComponent implements OnInit, OnDestroy {

    // Public Variables
    public moduleName: string = '';
    @Input() public pageTitle: string = '';
    public showGlobalSearch = true;
    public colorTheme = 'theme-blue';
    public fromDate: string;
    public toDate: string;
     

     

    constructor(private navigationSvc: NavigationService,
        private utilSvc: UtilService) {
    }

    ngOnInit(): void {
         
    }

    onBackClick() {
        this.navigationSvc.navigateBack();
    }

    onActionBtnClicked() {
        this.navigationSvc.navigateTo('action/listing');
    }

    onTabChanged(event: any) {
         
    }

    

     
    

     

    ngOnDestroy(): void {

    }
}