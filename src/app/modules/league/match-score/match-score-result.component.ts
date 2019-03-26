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
    templateUrl: './match-score-result.component.html',
    providers: [LookupService, UtilService, TeamService, NavigationService, AccountService]

})

export class MatchScoreResultComponent implements OnInit {


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
    teamATotalPoints=null;
    teamBTotalPoints=null;
    userATotalPoints=null;

    winningTeamName='';

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
         //   this.getLeagueMatch();
            this.getBasketBallMatchScore();
        }
    }

    async  getBasketBallMatchScore() {

        let apiResponse = await this.leageSvc.getBasketBallMatchScore(this.id);
        console.log(apiResponse)
        if (apiResponse && apiResponse.data) {
            this.leagueMatch = apiResponse.data;
            if( this.leagueMatch.isTeamMatch)
            {
                // && this.leagueMatch.basketBallResult
                if(this.leagueMatch.basketBallResult.winerTeamId == this.leagueMatch.teamA.id)
                {
                    this.teamATotalPoints= this.leagueMatch.basketBallResult.winerTeamPoints;
                    this.teamBTotalPoints= this.leagueMatch.basketBallResult.loserTeamPoints;
                    this.winningTeamName = this.leagueMatch.teamA.name;
                }
                else
                {
                    this.teamATotalPoints= this.leagueMatch.basketBallResult.loserTeamPoints;
                    this.teamBTotalPoints= this.leagueMatch.basketBallResult.winerTeamPoints;
                    this.winningTeamName = this.leagueMatch.teamB.name;
                }
            }
            else
            {
                if(this.leagueMatch && this.leagueMatch.userABasketBallScoreSummaries 
                    && this.leagueMatch.userABasketBallScoreSummaries.length >0)
                {
                    this.userATotalPoints =0;
                    this.leagueMatch.userABasketBallScoreSummaries.forEach(item => {
                        
                        if(item.totalPoints >0)
                        {
                            let _sumTotal: number = +Number(item.totalPoints) + Number(this.userATotalPoints);
                             this.userATotalPoints = _sumTotal;
                        }
                    });
                }
            }
        }
    }

    async  getLeagueMatch() {

        let apiResponse = await this.leageSvc.getBasketBallMatchScore(this.id);
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

 
}