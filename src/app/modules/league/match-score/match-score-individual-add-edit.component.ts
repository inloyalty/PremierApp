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

@Component({
    templateUrl: './match-score-individual-add-edit.component.html',
    providers: [LookupService, UtilService, TeamService, NavigationService, AccountService]

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

    constructor(
        private cdRef: ChangeDetectorRef,
        private leageSvc: LeageService,
        private toastrSvc: ToastrService,
        private utilSvc: UtilService,
        private lookupSvc: LookupService,
        private teamSvc: TeamService,
        private navigationSvc: NavigationService,
        private route: ActivatedRoute,
        private accountSvc: AccountService

    ) {
        this.bsConfig = this.utilSvc.getBsDatepickerConfig();

    }

    ngOnInit(): void {
        this.id = this.route.snapshot.queryParamMap.get('id');


        if (this.id) {
            this.getLeagueMatch();
            this.getScoringPoints();
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

                });
            }
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

        console.log(quater)
        if (quater.totalPoints == null) {
            quater.totalPoints = scorePointValue
        }
        else {
            let _totalPoints: number = Number(quater.totalPoints);
            let _sumTotal: number = +Number(_totalPoints) + Number(scorePointValue);
            quater.totalPoints = _sumTotal;
        }

        this.totalPoints = _.sumBy(this.matchQuaters, function (x) { return x.totalPoints; });

        let apiResponse = await this.leageSvc.saveBasketBallMatchScorePoints(scoreModel);

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