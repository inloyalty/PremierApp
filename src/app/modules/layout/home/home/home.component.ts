import { Component, OnInit } from "@angular/core";
import { NavigationService } from 'src/app/shared/services/navigation.service';

declare var $: any;

@Component({
    templateUrl: './home.component.html',
    styleUrls: ["./home.component.css"],
    providers: [NavigationService]
})

export class HomeComponent implements OnInit {
    constructor(
        private navigationSvc: NavigationService
    ) {

    }

    ngOnInit() {
      
    }

}