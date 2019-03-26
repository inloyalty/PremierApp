import { Component, OnInit } from "@angular/core";
import { AccountService } from './account.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AppConstant } from '../../constants/app-constant';
import { LookupService } from '../../shared/services/lookup.service';
import {NgSelectModule, NgOption, NgSelectConfig} from '@ng-select/ng-select';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { UtilService } from 'src/app/shared/services/util.service';
import 'src/app/shared/utilties/extension.ts'
import { ToastrService } from 'ngx-toastr';


@Component({
    templateUrl: './account.component.html',
    providers: [AccountService,LookupService,UtilService]
})

export class AccountComponent  implements OnInit {
   
    public loginDetail: any = {};
    public userModel: any = {};
    public countries=[];
    public states=[];
    public bsConfig: Partial<BsDatepickerConfig>;
    public dateOfBirth:any = null;

    public tabs = [
        { id: 1, 'title': 'My Profile', 'active': true },
        { id: 2, 'title': 'My Reward', 'active': false },
        { id: 3, 'title': 'My Club', 'active': false }

    ]
    selectedTab: any=1;

    constructor(
        private accountSvc: AccountService,
        private localStorageSvc: LocalStorageService,
        private lookupSvc:LookupService,
        private config: NgSelectConfig,
        private utilSvc: UtilService,
        private toastrSvc: ToastrService,



    ) {
        this.loginDetail = JSON.parse(this.localStorageSvc.get(AppConstant.LOGGED_IN_USER_INFO));
        this.bsConfig = this.utilSvc.getBsDatepickerConfig();

    }

   async ngOnInit() {
    this.loginDetail = JSON.parse(this.localStorageSvc.get(AppConstant.LOGGED_IN_USER_INFO));
       this.getCountries();
       await this.getUserDetail()
    }
    public async onTabChanged(event: any) {
            this.selectedTab = event.id;
        }
    onCountryChange(event:any)
    {
        console.log(event);
        this.getState(event.id);
    }
    public async getCountries()
    {
       try {
        let apiResponse= await  this.lookupSvc.getCoutries();
        console.log(apiResponse)
        this.countries = apiResponse.data ;
       } catch (error) {
           
       }

    }

    public async getState(countryId:null)
    {
        try {
       let apiResponse= await  this.lookupSvc.getStatesByCountryId(countryId);
       this.states = apiResponse.data;
            
        } catch (error) {
            
        }
    }


    public async getUserDetail()
    {
       try {
           console.log(this.loginDetail)
           let userId =this.loginDetail.userId;
        let apiResponse= await  this.accountSvc.getUserDetail(userId);
       
        console.log(apiResponse);
        if(apiResponse && apiResponse.message && apiResponse.message.code== 200)
        {
            this.dateOfBirth= new Date( apiResponse.data.dateOfBirth); 
            if(apiResponse.data.countryId)
            {
                await this.getState(apiResponse.data.countryId);
            }
            this.userModel = apiResponse.data ;
            console.log(this.userModel)

        }
        console.log(this.userModel)
       } catch (error) {
           
       }

    } 

    public async onDone()
    {
        if(this.dateOfBirth)
        {
            this.userModel.dateOfBirth=this.dateOfBirth.toyyyymmdd()
        }

        let apiResponse= await  this.accountSvc.saveUserDetail(this.userModel);
        if(apiResponse && apiResponse.message && apiResponse.message.code== 200)
        {
            this.toastrSvc.success('Saved successfully');

        }
    }

}