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
    templateUrl: './match-score-add-edit.component.html',
    providers: [LookupService, UtilService, TeamService, NavigationService, AccountService]

})

export class MatchScoreAddEditComponent implements OnInit {


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
    teamATotalPoints=0;
    teamBTotalPoints=0;

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

            if (this.leagueMatch.isTeamMatch) {
                this.teamAPlayers = this.leagueMatch.teamAPlayers;
                this.teamBPlayers = this.leagueMatch.teamBPlayers;
                this.teamA = this.leagueMatch.teamA;
                this.teamB = this.leagueMatch.teamB;
                this.matchQuaters = _.filter(this.leagueMatch.matchSessions, (item) => { return item.quarterNr != null; });
                this.teamAQuaters = this.matchQuaters;
                this.teamBQuaters = this.matchQuaters;
                this.matchQuaters.forEach(item => {
                    item.teamATotalPoints = 0;
                    item.teamBTotalPoints = 0;
                    item.teamATotalFouls = 0;
                    item.teamBTotalFouls = 0;
                    item.start = null
                    item.end = null

                });

            }

            console.log(this.teamA)
        }
    }


    addFouls(teamId: string, playerId: number) {
        if (teamId == 'A') {
            let quater = _.find(this.matchQuaters, (item) => { return item.id == this.currentSessionid; });
            if (quater.teamATotalFouls == null) {
                quater.teamATotalFouls = 1
            }
            else {
                quater.teamATotalFouls = quater.teamATotalFouls + 1;
            }

        }
        if (teamId == 'B') {
            let quater = _.find(this.matchQuaters, (item) => { return item.id == this.currentSessionid; });
            if (quater.teamBTotalFouls == null) {
                quater.teamBTotalFouls = 1
            }
            else {
                quater.teamBTotalFouls = quater.teamBTotalFouls + 1;
            }

        }

        console.log(this.matchQuaters);

    }

    addPoint(teamId: string, playerId: number) {
        if (teamId == 'A') {
            let quater = _.find(this.matchQuaters, (item) => { return item.id == this.currentSessionid; });
            if (quater.teamATotalPoints == null) {
                quater.teamATotalPoints = 1
            }
            else {
                quater.teamATotalPoints = quater.teamATotalPoints + 1;
            }

            this.matchQuaters.array.forEach(element => {
                
            });


        //     this.teamATotalPoints = _.sumBy(this.matchQuaters, function (x) { return x.teamATotalPoints; });
        //    console.log(this.teamATotalPoints)

           let _totalSum=_.sumBy(this.matchQuaters, function (x) { return x.teamATotalPoints; });
           this.teamATotalPoints = _totalSum;

        }
        if (teamId == 'B') {
            let quater = _.find(this.matchQuaters, (item) => { return item.id == this.currentSessionid; });
            if (quater.teamBTotalPoints == null) {
                quater.teamBTotalPoints = 1
            }
            else {
                quater.teamBTotalPoints = quater.teamBTotalPoints + 1;
            }
           
            let _totalSum=_.sumBy(this.matchQuaters, function (x) { return x.teamBTotalPoints; });
            this.teamBTotalPoints = _totalSum;
            console.log(this.teamBTotalPoints)

        }

        console.log(this.matchQuaters);

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

            this.navigationSvc.navigateTo('league/my-events');

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

    async  addTeamPoints(teamName: string, scorePointId: number, scorePointValue: number) {

        if (this.currentSessionid <= 0) {
            this.toastrSvc.error('Please start the match session.');
            return false;
        }

        let scoreModel: any = {
            matchId: this.leagueMatch.id,
            leagueMatchBasketBallSessionId: this.currentSessionid,
            sportStatisticId: scorePointId,
            value: scorePointValue

        }
        let quater = _.find(this.matchQuaters, (item) => { return item.id == this.currentSessionid; });
        if (teamName == 'A') {
            if (quater.teamATotalPoints == null) {
                quater.teamATotalPoints = scorePointValue
            }
            else {
                let _totalPoints: number = Number(quater.teamATotalPoints);
                let _sumTotal: number = +Number(_totalPoints) + Number(scorePointValue);
                console.log(_sumTotal)
                quater.teamATotalPoints = _sumTotal;

                // quater.teamATotalPoints = Number(quater.teamATotalPoints) + scorePointValue;
            }
            scoreModel.teamId = this.teamA.id;


        }
        else {
            if (quater.teamBTotalPoints == null) {
                quater.teamBTotalPoints = scorePointValue
            }
            else {
                let _totalPoints: number = Number(quater.teamBTotalPoints);
                let _sumTotal: number = +Number(_totalPoints) + Number(scorePointValue);
                console.log(_sumTotal)
                quater.teamBTotalPoints = _sumTotal;
            }
            scoreModel.teamId = this.teamB.id;
        }
        let apiResponse = await this.leageSvc.saveBasketBallMatchScorePoints(scoreModel);

    }

    async  addTeamFouls(teamName: string, scorePointId: number, scorePointValue: number) {

        if (this.currentSessionid <= 0) {
            this.toastrSvc.error('Please start the match session.');
            return false;
        }

        let scoreModel: any = {
            matchId: this.leagueMatch.id,
            leagueMatchBasketBallSessionId: this.currentSessionid,
            sportStatisticId: scorePointId,
            value: scorePointValue

        }
        let quater = _.find(this.matchQuaters, (item) => { return item.id == this.currentSessionid; });
        if (teamName == 'A') {
            if (quater.teamATotalFouls == null) {
                quater.teamATotalFouls = scorePointValue
            }
            else {
                let _totalPoints: number = Number(quater.teamATotalFouls);
                let _sumTotal: number = +Number(_totalPoints) + Number(scorePointValue);
                console.log(_sumTotal)
                quater.teamATotalFouls = _sumTotal;

                // quater.teamATotalPoints = Number(quater.teamATotalPoints) + scorePointValue;
            }
            scoreModel.teamId = this.teamA.id;


        }
        else {
            if (quater.teamBTotalFouls == null) {
                quater.teamBTotalFouls = scorePointValue
            }
            else {
                let _totalPoints: number = Number(quater.teamBTotalFouls);
                let _sumTotal: number = +Number(_totalPoints) + Number(scorePointValue);
                console.log(_sumTotal)
                quater.teamBTotalFouls = _sumTotal;

            }
            scoreModel.teamId = this.teamB.id;
        }

        let apiResponse = await this.leageSvc.saveBasketBallMatchScorePoints(scoreModel);


    }

    async finishMatch() {
        let apiResponse = await this.leageSvc.finishMatchMatch(this.leagueMatch.id);

        if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
            this.toastrSvc.success('Match finished successfully');

            this.navigationSvc.navigateTo('league/my-events');

        }
    }
}