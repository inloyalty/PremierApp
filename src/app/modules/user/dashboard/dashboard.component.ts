import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, AfterViewInit, AfterViewChecked, AfterContentChecked } from "@angular/core";
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AppConstant } from '../../constants/app-constant';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { AccountService } from '../account/account.service';

@Component({
    templateUrl: './dashboard.component.html',
    providers: [LocalStorageService, NavigationService, AccountService]
})

export class DashboardComponet implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked {



    loginedUserDetail: any;
    modalRef: BsModalRef;
    startupOption = 1;
    config = {
        keyboard: false
    };

    @ViewChild('template') public template: any;

    constructor(
        private localStorageSvc: LocalStorageService,
        private modalService: BsModalService,
        private cdRef: ChangeDetectorRef,
        private navigationSvc: NavigationService,
        private accountSvc: AccountService


    ) {
        this.loginedUserDetail = JSON.parse(this.localStorageSvc.get(AppConstant.LOGGED_IN_USER_INFO));
    }

    ngOnInit(): void {
        console.log(this.loginedUserDetail);



    }

    ngAfterViewInit(): void {
        //  this.openModal();
        if (!this.loginedUserDetail.isLogedIn) {
            setTimeout(() => {
                this.openModal();
            }, 1000);
            this.accountSvc.UpdateIslogedIn(this.loginedUserDetail.userId);

            this.loginedUserDetail.isLogedIn=true;
            this.localStorageSvc.set(  AppConstant.LOGGED_IN_USER_INFO,JSON.stringify(this.loginedUserDetail))

            console.log(JSON.stringify(this.loginedUserDetail))
        }
    }

    ngAfterViewChecked(): void {


        // this.cdRef.detectChanges();


    }

    ngAfterContentChecked(): void {

        //this.cdRef.detectChanges();
    }

    openModal() {
        this.modalRef = this.modalService.show(this.template, this.config);
        //  this.cdRef.detectChanges();
    }

    onOkClicked() {
        if (this.startupOption == 1) {
            this.navigationSvc.navigateTo('league/league-match-add-edit');
            this.modalRef.hide();
        }

        console.log(this.startupOption)
    }

    onSelectionChange(selectedValue) {
        this.startupOption = selectedValue;
        console.log(this.startupOption)
    }
}