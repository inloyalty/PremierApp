import { Component, OnInit } from "@angular/core";
import { LookupService } from 'src/app/modules/shared/services/lookup.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import 'src/app/shared/utilties/extension.ts'
import { RemoteImagePipe } from 'src/app/shared/pipes/remote-image.pipe';
import * as _ from 'lodash';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { AuthService } from '../auth.service';

@Component({
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css'],
    providers: [LookupService, UtilService, RemoteImagePipe]
})

export class SignUpComponent implements OnInit {

    public signUpModel: any = {}
    public currentTabIndex = 1;
    public countries = [];
    public states = [];
    public sports = [];
    public bsConfig: Partial<BsDatepickerConfig>;
    public dateOfBirth = null;
    public stepTitle = 'Login Detail '
    public rewards: any = [
        { index: 1, name: 'r1' },
        { index: 1, name: 'r2' },
        { index: 1, name: 'r3' },

    ];

    public isEmailExist = false;
    public isUserName = false;
    public isChildEmailExist = false;
    private userRewardCurrentIndex = 1;
    private userClubCurrentIndex = 1;
    public userRewards: any = []
    public userClubs: any = []
    public loading = false;
    public segmentedButtons:any=[
        {id:1, name:'Parent', label:'Parent',active:true},
        {id:2, name:'Individual', label:'Individual',active:false},
        {id:3, name:'Kid', label:'Kid',active:false},
    ]


    public id: number;
    public name: string;
    public label: string;
    public active: boolean = false;
    rigistrationType: any=1;

    constructor(
        private authSvc: AuthService,
        private lookupSvc: LookupService,
        private utilSvc: UtilService,
        private remoteImagePipe: RemoteImagePipe,
        private navigationSvc: NavigationService

    ) {
        this.bsConfig = this.utilSvc.getBsDatepickerConfig();

    }

    ngOnInit() {
        this.getCountries();
        this.getSports();
    }



    onNextClick() {
        if (this.currentTabIndex == 1 && this.isEmailExist) {
            return false;
        }
        this.currentTabIndex = this.currentTabIndex + 1;
        this.setStepTitle();

    }

    onPreviousClick() {
        this.currentTabIndex = this.currentTabIndex - 1;
        this.setStepTitle();
    }

    async onSave() {
        try {
            this.loading = true;

            if (this.dateOfBirth) {
                this.signUpModel.dateOfBirth = this.dateOfBirth.toyyyymmdd()
            }

            var selectedSports = _.filter(this.sports, (element) => { return element.selected == true; });
            this.signUpModel.sports = selectedSports;
            this.signUpModel.userRewards = this.userRewards
            this.signUpModel.userClubs = this.userClubs
            this.signUpModel.userType = this.rigistrationType;

            let apiResponse = await this.authSvc.register(this.signUpModel);
            this.loading = false;
            await this.navigationSvc.navigateTo('login');

        } catch (error) {
            this.loading = false;
        }

    }

    onCountryChange(event: any) {
        console.log(event);
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

    public async getSports() {
        try {

            let apiResponse = await this.lookupSvc.getSports();
            if (apiResponse && apiResponse.data && apiResponse.data.length > 0) {
                apiResponse.data.forEach((item: any) => {
                    item.image = this.remoteImagePipe.transform(item.image, "Sport");
                    item.selected = false;
                });
                this.sports = apiResponse.data;
                console.log(this.sports);
            }

        } catch (error) {

        }
    }
    onSportItemClick(item: any) {
        item.selected = !item.selected;

        var selectedSports = _.filter(this.sports, (element) => { return element.selected == true; });
        console.log(selectedSports);

    }

    public async onUserNameChange(event: any) {
        try {
            if (this.signUpModel.userName && this.signUpModel.userName.length > 0) {
                let apiResponse = await this.authSvc.userNameExists(this.signUpModel.userName);
                this.isUserName = apiResponse.data.success;
                console.log(apiResponse)

            }
        } catch (error) {

        }
        console.log(this.signUpModel.email)
    }

    public async onEmailChange(event: any) {
        try {
            if (this.signUpModel.email && this.signUpModel.email.length > 0) {
                let apiResponse = await this.authSvc.emailExist(this.signUpModel.email);

                this.isEmailExist = apiResponse.data.success;

            }
        } catch (error) {

        }
        console.log(this.signUpModel.email)
    }

    public async onChildEmailChange(event: any) {
        try {
            if (this.signUpModel.childEmail && this.signUpModel.childEmail.length > 0) {
                let apiResponse = await this.authSvc.childEmailExists(this.signUpModel.childEmail);
                this.isChildEmailExist = apiResponse.data.success;


            }
        } catch (error) {

        }
    }

    private setStepTitle() {
        if (this.currentTabIndex == 1) {
            this.stepTitle = 'Login Detail'
        }
        else if (this.currentTabIndex == 2) {
            this.stepTitle = 'Personal Detail'
        }
        else if (this.currentTabIndex == 3) {
            this.stepTitle = 'Sports Detail'
        }
        else if (this.currentTabIndex == 4) {
            this.stepTitle = 'Reward and Club Detail'
        }
    }

    addUserReward() {
        if (this.signUpModel.rewardReceived && this.signUpModel.rewardReceived.length > 0) {
            this.userRewards.push({ index: this.userRewardCurrentIndex, name: this.signUpModel.rewardReceived })
        }
        this.userRewardCurrentIndex = this.userRewardCurrentIndex + 1;
        this.signUpModel.rewardReceived = ''
        console.log(this.userRewards)

    }

    addUserClud() {
        if (this.signUpModel.clubJoind && this.signUpModel.clubJoind.length > 0) {
            this.userClubs.push({ index: this.userRewardCurrentIndex, name: this.signUpModel.clubJoind })
        }
        this.userClubCurrentIndex = this.userClubCurrentIndex + 1;
        this.signUpModel.clubJoind = ''
        console.log(this.userClubs)
    }

    public onRegistrationChanged(registrationType:any)
    {
        this.rigistrationType = registrationType.id;
    }


}