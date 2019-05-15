import { Component, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { RemoteImagePipe } from 'src/app/shared/pipes/remote-image.pipe';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { AppConstant } from '../../constants/app-constant';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';


@Component({
    selector: 'main-menu',
    templateUrl: 'main-menu.component.html',
    styleUrls: ['main-menu.component.css'],
    providers: [RemoteImagePipe,]
})
export class MainMenuComponent implements OnInit, OnDestroy {

    // declare the public variables
    mainMenuItems: any = [];
    isOpen: boolean = true;
    footerMenuItems: any = [];
    userProfileImage: string;
    public loading: boolean = false;
    apiResponseModel: any;

    @Output() titleChange: EventEmitter<any> = new EventEmitter();
    userName: string;


    constructor(
        private navigationSvc: NavigationService,
        private localStorageSvc: LocalStorageService
    ) {


        this.footerMenuItems = [
            {
                id: 103, "name": "Signout", "title": "Sign out", "url": "/login", "active": false, "order": 150, "iconImage": "", "iconClass": "fas fa-power-off"
            }
        ];
        this.getMainMenu();
    }
    ngOnInit(): void {

        let userDetail: any = this.localStorageSvc.get(AppConstant.USER_INFO);
        if (userDetail) {
            userDetail = JSON.parse(userDetail);
            this.userName = userDetail.firstName + ' ' + userDetail.lastName;
        }
    }


    ngOnDestroy(): void {
        this.doCleanUp();
    }

    onToggleNav() {
        this.isOpen = !this.isOpen;
        if (this.isOpen == true) {
            document.getElementById('content-wrapper').style.paddingLeft = '200px';
        }
        else {
            document.getElementById('content-wrapper').style.paddingLeft = '0px';
        }
    }


    async onMenuItemClick(menuItem: any) {

        console.log(menuItem);
        if (menuItem.id == 103) {
            this.signOut();
        }
        else {
            this.titleChange.emit(menuItem.title)
            await this.navigationSvc.navigateTo(menuItem.url);
        }

    }

    async signOut() {
        console.log('logout');
        // this.apiResponseModel = await this.authSvc.signOut();
        await this.navigationSvc.navigateTo('login');
    }

    lockOut() {
        // this.authSvc.lockOut()
        //     .then((result) => {
        //         if (result.success) {
        //             this.navigationSvc.navigateTo('login/lock');
        //         } else {
        //             this.messageBoxSvc.showMessageBox(result.message.text, "Error", MessageType.Error);
        //         }
        //     });
    }

    /* Helper Methods */

    private getMainMenu() {
        this.mainMenuItems = [
            {
                id: 1, "name": "Dashboard", "title": "Dashboard", "url": "/dashboard", "active": false, "order": 150, "iconImage": "", "iconClass": "fas fa-tachometer-alt"
            },
            {
                id: 3, "name": "Team", "title": "Team", "url": "/team", "active": false, "order": 150, "iconImage": "", "iconClass": "fas fa-users"
            },
            {
                id: 31, "name": "Player", "title": "Player", "url": "/team/team-player", "active": false, "order": 150, "iconImage": "", "iconClass": "fas fa-user"
            },
            {
                id: 31, "name": "School/League", "title": "School/League", "url": "/league", "active": false, "order": 150, "iconImage": "", "iconClass": "fas fa-basketball-ball"
            },
            {
                id: 31, "name": "Games", "title": "Games", "url": "/league/league-match", "active": false, "order": 150, "iconImage": "", "iconClass": "fas fa-basketball-ball"
            },

            {
                id: 4, "name": "My Event", "title": "My Event", "url": "/league/my-events", "active": false, "order": 150, "iconImage": "", "iconClass": "far fa-calendar-alt"
            }
            ,
            {
                id: 6, "name": "My Account", "title": "MyAccount", "url": "/my-account", "active": false, "order": 150, "iconImage": "", "iconClass": "fas fa-user-alt"
            }
        ];

    }

    private doCleanUp() {

    }


}
