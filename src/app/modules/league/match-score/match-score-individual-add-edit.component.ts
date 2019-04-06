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
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AppConstant } from '../../constants/app-constant';

@Component({
    templateUrl: './match-score-individual-add-edit.component.html',
    providers: [LookupService, UtilService, TeamService, NavigationService, AccountService, LocalStorageService]

})

export class MatchScoreIndividualAddEditComponent implements OnInit {


    public leagueMatch: any = {}
    leagues: any;
    countries: any;
    states: any;
    matchFormat = 1;
    currentSessionid = 0;
    showTeamDetail = false;

    id: any = null;
    matchDate: any;
    public bsConfig: Partial<BsDatepickerConfig>;
    teamB: any = {};
    teamA: any = {};
    matchQuaters: any;
    scorePoints: any;
    totalPoints: number;
    totalFouls: number;
    totalRebounds: any;
    totalAssists: any;
    totalSteals: any;
    totalBlocks: any;
    userInfo: any = {}
    loginedUserDetail: any;
    userType: string = 'Individual'

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
            this.getLeagueMatch();
            this.getScoringPoints();
            this.getUserInfo();
        }
    }


    async  getLeagueMatch() {

        let apiResponse = await this.leageSvc.getLeagueMatch(this.id);
        console.log(apiResponse)
        if (apiResponse && apiResponse.data) {
            this.leagueMatch = apiResponse.data;
            this.matchQuaters = this.leagueMatch.matchSessions;
            if (this.matchQuaters && this.matchQuaters.length > 0) {
                this.matchQuaters.forEach(item => {
                    item.totalPoints = 0;
                    item.totalFouls = 0;
                    item.totalRebounds = 0;
                    item.totalAssists = 0;
                    item.totalSteals = 0;
                    item.totalBlocks = 0
                });
            }
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


    onSessionStart(id: number) {
        this.currentSessionid = id;
        let quater = _.find(this.matchQuaters, (item) => { return item.id == id; });
        quater.start = true;
    }

    onSessionEnd(id: number) {
        this.currentSessionid = 0;
        let quater = _.find(this.matchQuaters, (item) => { return item.id == id; });
        quater.end = true;
        console.log(this.matchQuaters)
    }
    async  onSave() {

        if (this.matchDate) {
            this.leagueMatch.startDate = this.matchDate.toyyyymmdd()
        }


        let apiResponse = await this.leageSvc.saveLeagueMatch(this.leagueMatch);
        if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
            this.toastrSvc.success('Saved successfully');

            this.navigationSvc.navigateTo('league/league-match');

        }

    }

    async  getScoringPoints() {

        let apiResponse = await this.leageSvc.getScoringPoints();
        console.log(apiResponse)
        if (apiResponse && apiResponse.data) {
            this.scorePoints = apiResponse.data;

            console.log(this.teamA)
        }
    }

    async  addPoints(scorePointId: number, scorePointValue: number) {

        console.log(`scorePointId ${scorePointId} scorePointValue ${scorePointValue}`)
        // this.currentSessionid = this.matchQuaters[0].id;
        if (this.currentSessionid <= 0) {
            this.toastrSvc.error('Please start the match session.');
            return false;
        }

        let scoreModel: any = {
            matchId: this.leagueMatch.id,
            leagueMatchBasketBallSessionId: this.currentSessionid,
            sportStatisticId: scorePointId,
            value: scorePointValue,
            teamPlayerId: this.leagueMatch.userAId
        }

        let quater = _.find(this.matchQuaters, (item) => { return item.id == this.currentSessionid; });

        // Points 
        if (scorePointId == 1 || scorePointId == 5 || scorePointId == 8) {
            console.log()
            let _totalPoints: number = Number(quater.totalPoints);
            let _sumTotal: number = +Number(_totalPoints) + Number(scorePointValue);
            quater.totalPoints = _sumTotal;
            this.totalPoints = _.sumBy(this.matchQuaters, function (x) { return x.totalPoints; });
        }
        //Rebound
        else if (scorePointId == 29) {
            let _totalRebounds: number = Number(quater.totalRebounds);
            let _sumTotal: number = +Number(_totalRebounds) + Number(scorePointValue);
            quater.totalRebounds = _sumTotal;
            this.totalRebounds = _.sumBy(this.matchQuaters, function (x) { return x.totalRebounds; });

        }
        // Assist 
        else if (scorePointId == 17) {
            let _totalAssists: number = Number(quater.totalAssists);
            let _sumTotal: number = +Number(_totalAssists) + Number(scorePointValue);
            quater.totalAssists = _sumTotal;
            this.totalAssists = _.sumBy(this.matchQuaters, function (x) { return x.totalAssists; });

        }
        //Steal
        else if (scorePointId == 20) {
            let _totalSteals: number = Number(quater.totalSteals);
            let _sumTotal: number = +Number(_totalSteals) + Number(scorePointValue);
            quater.totalSteals = _sumTotal;
            this.totalSteals = _.sumBy(this.matchQuaters, function (x) { return x.totalSteals; });

        }
        //Block
        else if (scorePointId == 18) {
            let _totalBlocks: number = Number(quater.totalBlocks);
            let _sumTotal: number = +Number(_totalBlocks) + Number(scorePointValue);
            quater.totalBlocks = _sumTotal;
            this.totalBlocks = _.sumBy(this.matchQuaters, function (x) { return x.totalBlocks; });

        }
        //Foul
        else if (scorePointId == 24) {
            let _totalFouls: number = Number(quater.totalFouls);
            let _sumTotal: number = +Number(_totalFouls) + Number(scorePointValue);
            quater.totalFouls = _sumTotal;
            this.totalFouls = _.sumBy(this.matchQuaters, function (x) { return x.totalFouls; });

        }

        // if (quater.totalPoints == null) {
        //     quater.totalPoints = scorePointValue
        // }
        // else {
        //     let _totalFouls: number = Number(quater.totalFouls);
        //     let _sumTotal: number = +Number(_totalFouls) + Number(scorePointValue);
        //     quater.totalFouls = _sumTotal;
        // }



        let apiResponse = await this.leageSvc.saveBasketBallMatchScorePoints(scoreModel);
        console.log(apiResponse)

    }

    async  addFouls(scorePointId: number, scorePointValue: number) {

        if (this.currentSessionid <= 0) {
            this.toastrSvc.error('Please start the match session.');
            return false;
        }

        let scoreModel: any = {
            matchId: this.leagueMatch.id,
            leagueMatchBasketBallSessionId: this.currentSessionid,
            sportStatisticId: scorePointId,
            value: scorePointValue,
            teamPlayerId: this.leagueMatch.userAId
        }
        let quater = _.find(this.matchQuaters, (item) => { return item.id == this.currentSessionid; });

        if (quater.totalFouls == null) {
            quater.totalFouls = scorePointValue
        }
        else {
            let _totalPoints: number = Number(quater.totalFouls);
            let _sumTotal: number = +Number(_totalPoints) + Number(scorePointValue);
            console.log(_sumTotal)
            quater.totalFouls = _sumTotal;

        }

        let apiResponse = await this.leageSvc.saveBasketBallMatchScorePoints(scoreModel);

        this.totalFouls = _.sumBy(this.matchQuaters, function (x) { return x.totalFouls; });
    }

    async finishMatch() {
        let apiResponse = await this.leageSvc.finishMatchMatch(this.leagueMatch.id);

        if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
            this.toastrSvc.success('Match finished successfully');

            this.navigationSvc.navigateTo('league/my-events');

        }
    }
}