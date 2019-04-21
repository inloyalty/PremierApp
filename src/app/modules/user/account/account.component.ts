import { Component, OnInit } from "@angular/core";
import { AccountService } from './account.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AppConstant } from '../../constants/app-constant';
import { LookupService } from '../../shared/services/lookup.service';
import { NgSelectModule, NgOption, NgSelectConfig } from '@ng-select/ng-select';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { UtilService } from 'src/app/shared/services/util.service';
import 'src/app/shared/utilties/extension.ts'
import { ToastrService } from 'ngx-toastr';
import { RemoteImagePipe } from 'src/app/shared/pipes/remote-image.pipe';
import * as _ from 'lodash';


@Component({
    templateUrl: './account.component.html',
    providers: [AccountService, LookupService, UtilService, RemoteImagePipe]
})

export class AccountComponent implements OnInit {

    public loginDetail: any = {};
    public userModel: any = {};
    public countries = [];
    public states = [];
    public bsConfig: Partial<BsDatepickerConfig>;
    public dateOfBirth: any = null;

    public tabs = [
        { id: 1, 'title': 'My Profile', 'active': true },
        { id: 2, 'title': 'My Rewards', 'active': false },
        { id: 3, 'title': 'My Clubs', 'active': false },
        { id: 4, 'title': 'My Sports', 'active': false }

    ]
    selectedTab: any = 1;
    sports: any;
    showDrader: boolean;
    userSports = [];
    userRewards: any;
    userClubJoins: any;
    reward = '';
    clubName = ''

    constructor(
        private accountSvc: AccountService,
        private localStorageSvc: LocalStorageService,
        private lookupSvc: LookupService,
        private config: NgSelectConfig,
        private utilSvc: UtilService,
        private toastrSvc: ToastrService,
        private remoteImagePipe: RemoteImagePipe,




    ) {
        this.loginDetail = JSON.parse(this.localStorageSvc.get(AppConstant.LOGGED_IN_USER_INFO));
        this.bsConfig = this.utilSvc.getBsDatepickerConfig();

    }

    async ngOnInit() {
        this.loginDetail = JSON.parse(this.localStorageSvc.get(AppConstant.LOGGED_IN_USER_INFO));
        this.getCountries();
        await this.getUserDetail()
        this.getUserSports();
        this.getUserClubJoins();
        this.getUserRewards();
    }
    public async onTabChanged(event: any) {
        this.selectedTab = event.id;
    }
    onCountryChange(event: any) {
        this.getState(event.id);
    }
    public async getCountries() {
        try {
            let apiResponse = await this.lookupSvc.getCoutries();
            console.log(apiResponse)
            this.countries = apiResponse.data;
        } catch (error) {

        }

    }

    public async getState(countryId: null) {
        try {
            let apiResponse = await this.lookupSvc.getStatesByCountryId(countryId);
            this.states = apiResponse.data;

        } catch (error) {

        }
    }

    onClose(event:any)
    {
        this.showDrader=false;
    }
    public async getUserSports() {
        try {
            let userId = this.loginDetail.userId;
            let apiResponse = await this.accountSvc.getUserSports(userId);
            if (apiResponse.data && apiResponse.data.length > 0) {
                apiResponse.data.forEach(item => {
                    item.image = this.remoteImagePipe.transform(item.image, "Sport");

                });
            }
            this.userSports = apiResponse.data;
            this.getSports();

        } catch (error) {

        }
    }
    public async getUserRewards() {
        try {
            let userId = this.loginDetail.userId;
            let apiResponse = await this.accountSvc.getUserRewards(userId);
            if (apiResponse.data && apiResponse.data.length > 0) {

            }
            this.userRewards = apiResponse.data;
            this.getSports();

        } catch (error) {

        }
    }

    public async getUserClubJoins() {
        try {
            let userId = this.loginDetail.userId;
            let apiResponse = await this.accountSvc.getUserClubJoins(userId);
            if (apiResponse.data && apiResponse.data.length > 0) {

            }
            this.userClubJoins = apiResponse.data;
            this.getSports();

        } catch (error) {

        }
    }

    public async onAddReward() {
        try {
            if (this.reward && this.reward.length > 0) {
                let rewardModel = {
                    userId: this.loginDetail.userId,
                    name: this.reward
                }
                let apiResponse = await this.accountSvc.saveUserReward(rewardModel);
                if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {

                    this.userRewards.push(apiResponse.data);
                    this.reward='';
                }
            }
        } catch (error) {

        }


    }

    public async deleteUserReward(reward: any) {

        let apiResponse = await this.accountSvc.deleteUserReward(reward.id);
        if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
            this.toastrSvc.success('Deleted successfully');
            this.userRewards = _.filter(this.userRewards, (x) => { return x.id != reward.id; });
        }
    }

    public async onAddUserClubJoin() {
        try {
            if (this.clubName && this.clubName.length > 0) {
                let rewardModel = {
                    userId: this.loginDetail.userId,
                    name: this.clubName
                }
                let apiResponse = await this.accountSvc.saveUserClubJoin(rewardModel);
                if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {

                    this.userClubJoins.push(apiResponse.data);
                    this.clubName='';
                }
            }
        } catch (error) {

        }


    }

    public async deleteUserClubJoin(club: any) {

        try {
            let apiResponse = await this.accountSvc.deleteUserClubJoin(club.id);
            if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
                this.toastrSvc.success('Deleted successfully');
                this.userClubJoins = _.filter(this.userClubJoins, (x) => { return x.id != club.id; });
                
            }
        
        } catch (error) {

        }

    }



    public async getSports() {
        try {
            let apiResponse = await this.lookupSvc.getSports();
            if (apiResponse.data && apiResponse.data.length > 0) {
                apiResponse.data.forEach(item => {
                    item.image = this.remoteImagePipe.transform(item.image, "Sport");

                    if (this.userSports) {
                        let sport = _.find(this.userSports, (x) => { return x.sportId == item.id; });
                        if (sport) {
                            item.selected = true;
                        }

                    }
                });
            }
            this.sports = apiResponse.data;

        } catch (error) {

        }
    }
    onAddEditSport() {
        this.showDrader = true;
    }


    public async getUserDetail() {
        try {
            console.log(this.loginDetail)
            let userId = this.loginDetail.userId;
            let apiResponse = await this.accountSvc.getUserDetail(userId);

            console.log(apiResponse);
            if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
                this.dateOfBirth = new Date(apiResponse.data.dateOfBirth);
                if (apiResponse.data.countryId) {
                    await this.getState(apiResponse.data.countryId);
                }
                this.userModel = apiResponse.data;
                console.log(this.userModel)

            }
            console.log(this.userModel)
        } catch (error) {

        }

    }

    public async onDone() {
        if (this.dateOfBirth) {
            this.userModel.dateOfBirth = this.dateOfBirth.toyyyymmdd()
        }

        let apiResponse = await this.accountSvc.saveUserDetail(this.userModel);
        if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
            this.toastrSvc.success('Saved successfully');

        }
    }

    async onSubscribedToggle(sport: any) {

        let sportModel = {
            userId: this.loginDetail.userId,
            sportId: sport.id
        }
        let apiResponse = await this.accountSvc.saveUserSport(sportModel);
        if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
            apiResponse.data.image = sport.image;
            apiResponse.data.name = sport.name;

            this.userSports.push(apiResponse.data);
            sport.selected = !sport.selected;
        }
    }

    public async deleteUserSport(sport: any) {

        let apiResponse = await this.accountSvc.deleteUserSport(sport.id);
        if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
            this.toastrSvc.success('Deleted successfully');
            let _sport = _.find(this.sports, (x) => { return x.id == sport.sportId; });
            this.userSports = _.filter(this.userSports, (x) => { return x.id != sport.id; });

            console.log(this.userSports);
            if (_sport) {
                _sport.selected = false;
            }
        }
    }

}