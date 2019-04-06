import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { TopNavbarComponent } from "../../core/top-navbar/top-navbar.component";

@Component({
    templateUrl: 'secure-layout.component.html',
    styleUrls: ['secure-layout.component.css'],
    providers: []
})

export class SecureLayoutComponent implements OnInit, OnDestroy {

    // Private Variabels
    private moduleName : any;

    // Public Variables
    public subscription: Subscription;

    // Declare the ViewChild type
    @ViewChild('topNavbar') topNavbar: TopNavbarComponent;
    pageTitle: string;

    constructor(
        private router: Router,
       
    ) {
         
        // this.subscription = MenuService.PAGE_TITLE.asObservable().subscribe(pageTitle => {
        //     this.pageTitle = pageTitle;
        //     this.topNavbar.pageTitle = this.pageTitle;
        // });
    }
    ngOnInit(): void {
         

    }
    ngOnDestroy(): void {
        this.doCleanUp();
    }
    
    collapesSidenav() { }
    sidenavMenu(event: any) { }

    ontitleChange(event)
    {
        console.log(event);
        this.pageTitle = event;
    }

    /* Helper Methods */
    private doCleanUp() {
    }
}