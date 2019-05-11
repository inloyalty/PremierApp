/* tslint:disable */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationService } from 'src/app/shared/services/navigation.service';

declare var $: any;

@Component({
    selector: 'top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class TopNavComponent implements OnInit {
    public menus: any;
    public selectedLanguage: string;

    constructor(private navigationSvc : NavigationService) {
    }

    ngOnInit() {
        // window.addEventListener('scroll', () => {
        //     if (window.scrollY > 100) {
        //         $('.black-header').removeClass('scroll');
        //         $('.transparent').removeClass('hidden');
        //     }
        //     else {
        //         $('.black-header').addClass('scroll');
        //         $('.transparent').addClass('hidden');
        //     }
        // });
    }

    async onUrlCilck(url: string) {
        await this.navigationSvc.navigateTo(url);
    }

}
