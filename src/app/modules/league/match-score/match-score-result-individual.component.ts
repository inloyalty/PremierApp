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
import { AppConstant } from '../../constants/app-constant';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
    templateUrl: './match-score-result-individual.component.html',
    providers: [LookupService, UtilService, TeamService, NavigationService, AccountService, LocalStorageService]

})

export class MatchScoreResultIndividualComponent implements OnInit {


    public leagueMatch: any = {}
    leagues: any;
    countries: any;
    states: any;
    matchFormat = 1;
    teamAPlayers = [];
    teamBPlayers = [];
    teamAQuaters = [];
    teamBQuaters = [];
    currentSessionid = 0;
    showTeamDetail = false;

    id: any = null;
    matchDate: any;
    public bsConfig: Partial<BsDatepickerConfig>;
    teamB: any = {};
    teamA: any = {};
    matchQuaters: any;
    scorePoints: any;
    teamATotalPoints = null;
    teamBTotalPoints = null;
    userATotalPoints = null;

    winningTeamName = '';
    totalPoints: number;
    totalFouls: number;
    totalRebounds: number;
    totalAssists: number;
    totalSteals: number;
    totalBlocks: number;
    loginedUserDetail: any;
    userInfo: any;
    userType: string ='Individual';
    userABasketBallScoreSummary:any={};


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

    }

    ngOnInit(): void {
        this.id = this.route.snapshot.queryParamMap.get('id');
        this.loginedUserDetail = JSON.parse(this.localStorageSvc.get(AppConstant.LOGGED_IN_USER_INFO));


        if (this.id) {
            //   this.getLeagueMatch();
            this.getUserInfo();
            this.getBasketBallMatchScore();
        }
    }

    async  getBasketBallMatchScore() {

        let apiResponse = await this.leageSvc.getBasketBallMatchScore(this.id);
        console.log(apiResponse)
        if (apiResponse && apiResponse.data) {
            this.leagueMatch = apiResponse.data;
            this.matchQuaters = this.leagueMatch.basketBallScoreMatchQuaterSummaries;
            this.userABasketBallScoreSummary = this.leagueMatch.userABasketBallScoreSummary;

            // if (this.matchQuaters && this.matchQuaters.length > 0) {
            //     this.totalPoints = _.sumBy(this.matchQuaters, function (x) { return x.totalPoints; });
            //     this.totalRebounds = _.sumBy(this.matchQuaters, function (x) { return x.totalRebounds; });
            //     this.totalAssists = _.sumBy(this.matchQuaters, function (x) { return x.totalAssists; });
            //     this.totalSteals = _.sumBy(this.matchQuaters, function (x) { return x.totalSteals; });
            //     this.totalBlocks = _.sumBy(this.matchQuaters, function (x) { return x.totalBlocks; });
            //     this.totalFouls = _.sumBy(this.matchQuaters, function (x) { return x.totalFouls; });
            //     console.log(this.totalFouls)
            // }



        }
    }

 
    async getUserInfo() {
        let userId = this.loginedUserDetail.userId;
        let apiResponse = await this.accountSvc.getUserDetail(userId);
        if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
            this.userInfo = apiResponse.data;
            if (this.userInfo.userType == 1) {
                this.userType = 'Parent'
            }
            else if (this.userInfo.userType == 2) {
                this.userType = 'Individual'
            }
            else if (this.userInfo.userType == 3) {
                this.userType = 'Kid '
            }
            console.log(this.userInfo);
        }
    }



}