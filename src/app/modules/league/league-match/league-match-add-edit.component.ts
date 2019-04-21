import { Component, ChangeDetectorRef, OnInit } from "@angular/core";
import { LeageService } from '../league.service';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../shared/services/lookup.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { SegmentedButton } from 'src/app/shared/modules/myd-segmented-button/myd-segmented-button.component';
import * as _ from 'lodash';
import { TeamService } from '../../team/team.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../user/account/account.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { LookupFilter } from 'src/app/models/filter';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AppConstant } from '../../constants/app-constant';

@Component({
    templateUrl: './league-match-add-edit.component.html',
    providers: [LookupService, UtilService, TeamService, NavigationService, AccountService, LocalStorageService]

})

export class LeageMatchAddEditComponent implements OnInit {


    public leagueMatch: any = {}
    public stepTitle = 'Match Detail';
    public currentTabIndex = 1;
    leagues: any =[];
    countries: any;
    states: any;
    matchFormat = 1;
    teamAPlayers = [];
    teamBPlayers = [];
    players = [];
    selectedTeamAPlayers = [];
    selectedTeamBPlayers = [];
    public isTeamA = false;
    showDrader = false;
    public matchFormats: Array<SegmentedButton> = [
        { id: 1, name: 'Individual', label: 'Individual', active: true },
        { id: 2, name: 'Team', label: 'Team', active: false },
    ]
    teams: any;
    id: any = null;
    users: any;
    matchDate: any;
    public bsConfig: Partial<BsDatepickerConfig>;
    public lookupFilter: any = new LookupFilter();
    logedInUserInfo: any = {};
    sports: any =[];
    gameTypes: any =[];
    leagueImage: any;
    leageImageData: any;
    showResetButton: boolean;
    showLeagueDrader: boolean;
    league: any ={};
    schools: any =[];
    school:any= {};
    showSchoolDrader: boolean;
    schoolImage: any;
    schoolImageData: any;
    userSports: any;
    loading=false;

    constructor(
        private cdRef: ChangeDetectorRef,
        private leageSvc: LeageService,
        private toastrSvc: ToastrService,
        private utilSvc: UtilService,
        private lookupSvc: LookupService,
        private teamSvc: TeamService,
        private navigationSvc: NavigationService,
        private route: ActivatedRoute,
        private accountSvc: AccountService,
        private localStorageSvc: LocalStorageService

    ) {
        this.bsConfig = this.utilSvc.getBsDatepickerConfig();
        this.logedInUserInfo = this.localStorageSvc.get(AppConstant.LOGGED_IN_USER_INFO).toJSON();

    }

    ngOnInit(): void {
        this.id = this.route.snapshot.queryParamMap.get('id');

        this.getSchools();
        this.getLeagues();
        this.getCountries();
        this.getTeams();
       // this.getUsers();
     //   this.getSports();
     this.getUserSports();
        this.getGameTypes();
        if (this.id) {
            this.getLeagueMatch();
        }
    }


    async  getLeagueMatch() {

        let apiResponse = await this.leageSvc.getLeagueMatch(this.id);
        if (apiResponse && apiResponse.data) {
            this.leagueMatch = apiResponse.data;
            this.matchFormat = this.leagueMatch.isTeamMatch ? 2 : 1;

            if(this.leagueMatch.startDate)
            {
                this.matchDate = new Date(this.leagueMatch.startDate) 
            }
            if (this.leagueMatch.isTeamMatch) {
                this.matchFormat = 2;
                this.matchFormats[0].active = false;
                this.matchFormats[1].active = true;
            }
            else {
                this.matchFormat = 1;
                this.matchFormats[0].active = true;
                this.matchFormats[1].active = false;



            }
            if (this.leagueMatch.isTeamMatch) {
                this.selectedTeamAPlayers = this.leagueMatch.teamAPlayers;
                this.selectedTeamBPlayers = this.leagueMatch.teamBPlayers;
                await this.getTeamPlayers(true);
                await this.getTeamPlayers(false);
                if (this.teamAPlayers && this.teamAPlayers.length > 0) {
                    this.teamAPlayers.forEach(item => {
                        let teamPlayer = _.find(this.leagueMatch.teamAPlayers, (teamPlayer) => { return teamPlayer.id == item.id; });

                        if (teamPlayer != null) {
                            item.selected = true;
                        }
                    })
                }
                if (this.teamBPlayers && this.teamBPlayers.length > 0) {
                    this.teamBPlayers.forEach(item => {
                        let teamPlayer = _.find(this.leagueMatch.teamBPlayers, (teamPlayer) => { return teamPlayer.id == item.id; });

                        if (teamPlayer != null) {
                            item.selected = true;
                        }
                    })
                }



            }



        }
    }

    onNextClick() {

        this.currentTabIndex = this.currentTabIndex + 1;
        this.setStepTitle();

    }

    onPreviousClick() {
        this.currentTabIndex = this.currentTabIndex - 1;
        this.setStepTitle();
    }

    onViewChanged(event: any) {
        this.matchFormat = event.id;
        this.leagueMatch.isTeamMatch = event.id == 1 ? false : true;
    }
    private setStepTitle() {
        if (this.currentTabIndex == 1) {
            this.stepTitle = 'Match Detail'
        }

        else if (this.currentTabIndex == 2) {
            this.stepTitle = 'Team Detail'
        }

    }


    async  getLeagues() {

        let apiResponse = await this.leageSvc.getLeagues(this.lookupFilter);
        if (apiResponse && apiResponse.data && apiResponse.data.length > 0) {
            this.leagues = apiResponse.data;
        }
    }

    async  getTeams() {

        let apiResponse = await this.teamSvc.getTeams();
        if (apiResponse && apiResponse.data && apiResponse.data.length > 0) {
            this.teams = apiResponse.data;
        }
    }

    onCountryChange(event: any) {
        this.getState(event.id);
    }
    public async getCountries() {
        try {
            let apiResponse = await this.lookupSvc.getCoutries();
            this.countries = apiResponse.data;
        } catch (error) {

        }

    }

    public async getSports() {
        try {
            let apiResponse = await this.lookupSvc.getSports();
            this.sports = apiResponse.data;
        } catch (error) {

        }
    }

    public async getGameTypes() {
        try {
            let apiResponse = await this.lookupSvc.getGameTypes();
            this.gameTypes = apiResponse.data;
        } catch (error) {

        }

    }

    public async getSchools() {
        try {
            let apiResponse = await this.lookupSvc.getSchools();
            this.schools = apiResponse.data;
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

    public async getTeamPlayers(isTeamA: boolean) {
        let teamId = isTeamA == true ? this.leagueMatch.teamAId : this.leagueMatch.teamBId
        try {
            let apiResponse = await this.leageSvc.getTeamPlayersByTeamId(teamId);
            if (isTeamA) {
                this.selectedTeamAPlayers = [];
                this.teamAPlayers = apiResponse.data;
            }
            else {
                this.selectedTeamBPlayers = [];

                this.teamBPlayers = apiResponse.data;
            }

            if (apiResponse.data && apiResponse.data.length > 0) {
                apiResponse.data.forEach(item => {
                    if (item.isDefault == true) {
                        item.selected = true;
                        if (isTeamA) {
                            this.selectedTeamAPlayers.push(item);
                        }
                        else {
                            this.selectedTeamBPlayers.push(item);
                        }
                    }
                    else {
                        item.selected = false;
                    }


                });
            }


        } catch (error) {

        }
    }

    async onTeamChange(event: any, isTeamA: boolean) {

        if (isTeamA == true) {
            if (this.leagueMatch.teamAId == this.leagueMatch.teamBId) {

                this.toastrSvc.error('Team A and Team B cannot be same.');
                this.leagueMatch.teamAId = -1;
                return false;
            }

        }
        else {
            if (this.leagueMatch.teamAId == this.leagueMatch.teamBId) {

                this.toastrSvc.error('Team A and Team B cannot be same.');
                this.leagueMatch.teamBId = -1;
                return false;
            }
        }
        await this.getTeamPlayers(isTeamA);
    }
    public openTeamPlayerDrawer(isTeamA: boolean) {

        this.isTeamA = isTeamA;
        if (isTeamA) {
            this.players = this.teamAPlayers;
        }
        else {
            this.players = this.teamBPlayers;
        }
        this.showDrader = true;
    }

    onSubscribedToggle(player: any) {

        if (this.isTeamA) {
            if (!player.selected) {
                player.selected = true;
                let selectedPlayer = _.find(this.selectedTeamAPlayers, (element) => { return element.id == player.id; });
                if (selectedPlayer) {
                    selectedPlayer.isDeleted = false;
                }
                else {
                    this.selectedTeamAPlayers.push(player);
                }
            }
            else {
                player.selected = false;

                let selectedPlayer = _.find(this.selectedTeamAPlayers, (element) => { return element.id == player.id; });

                if (selectedPlayer.matchId) {
                    selectedPlayer.isDeleted = true;
                }
                else {
                    this.selectedTeamAPlayers = _.filter(this.selectedTeamAPlayers, (element) => { return element.id != player.id; });

                }

            }

        }
        else {
            if (!player.selected) {
                player.selected = true;

                let selectedPlayer = _.find(this.selectedTeamBPlayers, (element) => { return element.id == player.id; });
                if (selectedPlayer) {
                    selectedPlayer.isDeleted = false;
                }
                else {
                    this.selectedTeamBPlayers.push(player);
                }
            }
            else {
                player.selected = false;

                let selectedPlayer = _.find(this.selectedTeamBPlayers, (element) => { return element.id == player.id; });
                if (selectedPlayer.matchId) {
                    selectedPlayer.isDeleted = true;
                }
                else {
                    this.selectedTeamBPlayers = _.filter(this.selectedTeamBPlayers, (element) => { return element.id != player.id; });

                }

            }

        }
    }
    onClose(event: any) {
        this.showDrader = false;
    }

    async  getUsers() {

        let apiResponse = await this.accountSvc.getUsers();
        if (apiResponse && apiResponse.data && apiResponse.data.length > 0) {

            if (apiResponse.data && apiResponse.data.length > 0) {
                apiResponse.data.forEach(item => {
                    item.fullName = item.firstName;
                    if (item.middleName) {
                        item.fullName = `${item.fullName} ${item.middleName}`;
                    }
                    if (item.lastName) {
                        item.fullName = `${item.fullName} ${item.lastName}`;
                    }
                });
            }
            this.users = apiResponse.data;
        }
    }



    async  onSave() {

        if (this.matchDate) {
            this.leagueMatch.startDate = this.matchDate.toyyyymmdd()
        }
        if (this.matchFormat == 1) {
            this.leagueMatch.userAId = this.logedInUserInfo.userId;
        }
        else {
            this.leagueMatch.teamAPlayers = this.selectedTeamAPlayers;
            this.leagueMatch.teamBPlayers = this.selectedTeamBPlayers;
        }


        let apiResponse = await this.leageSvc.saveLeagueMatch(this.leagueMatch);
        if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
            this.toastrSvc.success('Saved successfully');

            this.navigationSvc.navigateTo('league/league-match');

        }

    }

   

    onAddNewLeage()
    {
        this.league ={};
        this.showLeagueDrader = true;
    }

    onUserImage(fileInput: any) {
        this.leagueImage = fileInput.target.files[0];
        let reader = new FileReader();
        reader.onload = (e: any) => {
            this.leageImageData = e.target.result;
        };
        // this.userModel.Picture = fileInput.target.files[0].name;
        reader.readAsDataURL(fileInput.target.files[0]);
        this.showResetButton = true;
    }


    async onLeagueSave() {

        const formData = {
            'dto': JSON.stringify(this.league),
            'file': this.leagueImage,
        };
        this.leagueImage = null;
        this.leageImageData = null

        let apiResponse = await this.leageSvc.saveLeague(formData);
        if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
            this.toastrSvc.success('Saved successfully');
        }
        this.getLeagues();
        
        this.showSchoolDrader = false;
    }


    onAddNewSchool()
    {
        this.school ={};
        this.showSchoolDrader = true;

    }

    onSchoolImage(fileInput: any) {
        this.schoolImage = fileInput.target.files[0];
        let reader = new FileReader();
        reader.onload = (e: any) => {
            this.schoolImageData = e.target.result;
        };
        // this.userModel.Picture = fileInput.target.files[0].name;
        reader.readAsDataURL(fileInput.target.files[0]);
        this.showResetButton = true;
    }

    async onSchoolSave() {

        try {
            const formData = {
                'dto': JSON.stringify(this.school),
                'file': this.schoolImageData,
            };
            this.schoolImage = null;
            this.schoolImageData = null
    
            let apiResponse = await this.leageSvc.saveSchool(formData);
            if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
                this.toastrSvc.success('Saved successfully');
            }
        this.showSchoolDrader = false;

            this.getSchools();
        } catch (error) {
        this.showSchoolDrader = false;
            
        }
       
        
    }

   
    public async getUserSports() {
        try {
            let userId = this.logedInUserInfo.userId;
            let apiResponse = await this.accountSvc.getUserSports(userId);
            // if (apiResponse.data && apiResponse.data.length > 0) {
            //     apiResponse.data.forEach(item => {
            //         item.image = this.remoteImagePipe.transform(item.image, "Sport");

            //     });
            // }
            this.sports = apiResponse.data;
            

        } catch (error) {

        }
    }


   
    

     
}