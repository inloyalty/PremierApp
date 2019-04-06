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
    styleUrls: ['./match-score-add-edit.component.css'],
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
    teamATotalPoints = 0;
    teamBTotalPoints = 0;
    selectedTab = 1;
    public tabs = [
        { id: 1, 'title': 'Play by Play', 'active': true },
        { id: 2, 'title': 'Home', 'active': false },
        { id: 3, 'title': 'Vistor', 'active': false }

    ]
    teamAInMatchPlayers = [];
    teamBInMatchPlayers = [];
    selectedOutPlayer: any;
    selectedExchangeTeam: any;
    exchangePlayers: any = []
    showDrader: boolean;
    matchStatKeys = [];
    public matchStats = []
    public matchSummary: any = {};
    public selectedScoreTeam: any = '';
    public selectedScorePlayer: any = null;
    public selectedScoreState: any = ''
    public teamAMatchSummary: any;
    public teamBMatchSummary: any;
    public totalPlayedTime:number=0;



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
        this.getMatchStats();

    }

    ngOnInit(): void {
        this.id = this.route.snapshot.queryParamMap.get('id');


        if (this.id) {
            this.getLeagueMatch();
            this.getScoringPoints();
        }
    }

    onTabChanged(event: any) {
        this.selectedTab = event.id;
    }

    async  getLeagueMatch() {

        let apiResponse = await this.leageSvc.getLeagueMatch(this.id);
        console.log(apiResponse)
        if (apiResponse && apiResponse.data) {
            this.leagueMatch = apiResponse.data;

            if (this.leagueMatch.isTeamMatch) {
                this.teamAMatchSummary = this.getMatchSummaryObject();
                this.teamBMatchSummary = this.getMatchSummaryObject();

                this.teamAPlayers = this.leagueMatch.teamAPlayers;
                this.teamBPlayers = this.leagueMatch.teamBPlayers;

                this.teamA = this.leagueMatch.teamA;
                this.teamB = this.leagueMatch.teamB;
                this.matchQuaters = _.filter(this.leagueMatch.matchSessions, (item) => { return item.quarterNr != null; });
                this.teamAQuaters = this.matchQuaters;
                this.teamBQuaters = this.matchQuaters;
                this.matchQuaters.forEach(item => {
                    item.teamAMatchSummary = this.getMatchSummaryObject();
                    item.teamBMatchSummary = this.getMatchSummaryObject();
                    item.start = null
                    item.end = null
                    item.sessionTimeInSec = 0;
                });

                this.teamAPlayers.forEach(item => {
                    item.isInMatch = false;
                    item.sessionTimeInSec=0;
                    item.statics = this.getMatchSummaryObject();
                })
                this.teamBPlayers.forEach(item => {
                    item.isInMatch = false;
                    item.sessionTimeInSec=0;
                    item.statics = this.getMatchSummaryObject();

                })

                console.log(this.matchQuaters);
            }

        }
    }

    onInMatchChanged(team, player) {
        if (team == 'A') {
            if (!player.isInMatch) {

                this.teamAInMatchPlayers = _.filter(this.teamAInMatchPlayers, (item) => { return item.id != player.id; });
            }
            else {
                this.teamAInMatchPlayers.push({ id: player.id, shirtNr: player.shirtNr, firstName: player.firstName, lastName: player.lastName, teamId: player.teamId })
            }
        }
        else {
            if (!player.isInMatch) {
                this.teamBInMatchPlayers = _.filter(this.teamBInMatchPlayers, (item) => { return item.id != player.id; });
            }
            else {
                this.teamBInMatchPlayers.push({ id: player.id, shirtNr: player.shirtNr, firstName: player.firstName, lastName: player.lastName, teamId: player.teamId })
            }
        }

    }

    showPlayerChangeDrawer(teamName: any, player: any) {
        console.log(teamName, player)
        this.selectedOutPlayer = player;
        this.selectedExchangeTeam = teamName;
        if (teamName == 'A') {

            this.exchangePlayers = _.filter(this.teamAPlayers, (item) => { return !item.isInMatch; });
        }
        else {
            this.exchangePlayers = _.filter(this.teamBPlayers, (item) => { return !item.isInMatch; });

        }
        this.showDrader = true;

    }
    onPlayerExchange(player: any) {
        console.log(`this.selectedExchangeTeam ${this.selectedExchangeTeam}`);
        if (this.selectedExchangeTeam == 'A') {
            console.log(this.teamAInMatchPlayers);
            this.teamAInMatchPlayers.forEach(item => {
                if (item.id == this.selectedOutPlayer.id) {
                    item.id = player.id;
                    item.shirtNr = player.shirtNr;
                    item.firstName = player.firstName;
                    item.lastName = player.lastName,
                    item.teamId = player.teamId;
                }
            })

            this.teamAPlayers.forEach(item => {
                if (item.id == this.selectedOutPlayer.id) {
                    item.isInMatch = false;
                }
                if (item.id == player.id) {
                    item.isInMatch = true;
                }
            })
        }
        else {
            console.log(this.teamBInMatchPlayers);
            this.teamBInMatchPlayers.forEach(item => {
                if (item.id == this.selectedOutPlayer.id) {
                    item.id = player.id;
                    item.shirtNr = player.shirtNr;
                    item.firstName = player.firstName;
                    item.lastName = player.lastName,
                        item.teamId = player.teamId;
                }
            })

            this.teamBPlayers.forEach(item => {
                if (item.id == this.selectedOutPlayer.id) {
                    item.isInMatch = false;
                }
                if (item.id == player.id) {
                    item.isInMatch = true;
                }
            })
        }

        console.log(this.teamBInMatchPlayers);
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

            let _totalSum = _.sumBy(this.matchQuaters, function (x) { return x.teamATotalPoints; });
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

            let _totalSum = _.sumBy(this.matchQuaters, function (x) { return x.teamBTotalPoints; });
            this.teamBTotalPoints = _totalSum;
            console.log(this.teamBTotalPoints)

        }

        console.log(this.matchQuaters);

    }

    onSessionStart(id: number) {
        this.currentSessionid = id;
        let quater = _.find(this.matchQuaters, (item) => { return item.id == id; });
        quater.start = true;
        this.calMatchPlayedTime();
    }

    onSessionEnd(id: number) {
        this.currentSessionid = 0;
        let quater = _.find(this.matchQuaters, (item) => { return item.id == id; });
        quater.end = true;
        let apiResponse =   this.leageSvc.saveBasketBallSession(quater);

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

    public onSelectScorePlayer(selectedTeam: string, player: any) {
        this.selectedScorePlayer = player;
        this.selectedScoreTeam = selectedTeam;
        this.teamBInMatchPlayers.forEach(item => { item.selected = false });
        this.teamAInMatchPlayers.forEach(item => { item.selected = false });
        player.selected = true;
    }
    public addScore(statName: any) {

        //this.currentSessionid = this.matchQuaters[0].id;
        if (this.currentSessionid <= 0) {
            this.toastrSvc.error('Please start the match session.');
            return false;
        }

         let quater = _.find(this.matchQuaters, (item) => { return item.id == this.currentSessionid; });
       // let quater = this.matchQuaters[0];

        

        if (this.selectedScorePlayer != null && this.selectedScoreTeam != null) {
            let _stat = _.find(this.matchStatKeys, (item) => { return item.name == statName; });
            let scoreModel: any = {
                matchId: this.leagueMatch.id,
                leagueMatchBasketBallSessionId: this.currentSessionid,
                sportStatisticId: _stat.id,
                value: _stat.value
    
            }
            
            if (this.selectedScoreTeam == 'A') {

                let _sumTotal = +Number(this.teamAMatchSummary[statName]) + _stat.value;
                this.teamAMatchSummary[statName] = _sumTotal;

                let _qtySumTotal = +Number(quater.teamAMatchSummary[statName]) + _stat.value;
                quater.teamAMatchSummary[statName] = _qtySumTotal;

                let player = _.find(this.teamAPlayers, (item) => { return item.id == this.selectedScorePlayer.id; });

                console.log(player)
                if (player != null) {
                    let _playerStatSumTotal = +Number(player.statics[statName]) + _stat.value;
                    player.statics[statName] = _playerStatSumTotal;
                }
                scoreModel.teamId = this.teamA.id;
                scoreModel.teamPlayerId= player.id;

                // calculate the total points 
                 
                this.teamAMatchSummary['TPTS']= +Number(this.teamAMatchSummary['PTM1'])  +Number(this.teamAMatchSummary['PTM2'])  +Number(this.teamAMatchSummary['PTM3']);
                let _quaterPointsSumTotal  = +Number(quater.teamAMatchSummary['PTM1'])  + (Number(quater.teamAMatchSummary['PTM2']))  +Number(quater.teamAMatchSummary['PTM3']);
                quater.teamAMatchSummary['TPTS']= +Number(quater.teamAMatchSummary['PTM1'])  + Number(quater.teamAMatchSummary['PTM2'])  +Number(quater.teamAMatchSummary['PTM3']);
                player.statics['TPTS']= +Number(player.statics['PTM1'])  +Number(player.statics['PTM2'])  +Number(player.statics['PTM3']);
              
              
                //calculate the total fouls
                this.teamAMatchSummary['TFLS']= +Number(this.teamAMatchSummary['PEF'])  +Number(this.teamAMatchSummary['DEF'])  +Number(this.teamAMatchSummary['OFF'])
                +Number(this.teamAMatchSummary['FFF'])+Number(this.teamAMatchSummary['TEF']);
                
                quater.teamAMatchSummary['TFLS']= +Number(quater.teamAMatchSummary['PEF'])  +Number(quater.teamAMatchSummary['DEF'])  +Number(quater.teamAMatchSummary['OFF'])
                +Number(quater.teamAMatchSummary['FFF'])+Number(quater.teamAMatchSummary['TEF']);
                
                player.statics['TFLS']= +Number(player.statics['PEF'])  +Number(player.statics['DEF'])  +Number(player.statics['OFF']) +Number(player.statics['FFF'])+Number(player.statics['TEF']);
                
                // calculate the rebound 

                this.teamAMatchSummary['REB']= +Number(this.teamAMatchSummary['OREB'])  +Number(this.teamAMatchSummary['DREB']) ;
                quater.teamAMatchSummary['REB']= +Number(quater.teamAMatchSummary['OREB'])  +Number(quater.teamAMatchSummary['DREB']) ;
                player.statics['REB']= +Number(player.statics['OREB'])  +Number(player.statics['DREB']) ;
              

                
                console.log(this.teamAMatchSummary)
                console.log(this.matchQuaters)
                console.log(this.teamAPlayers)


            }
            else { 

                let _stat = _.find(this.matchStatKeys, (item) => { return item.name == statName; });
                let _sumTotal = +Number(this.teamBMatchSummary[statName]) + _stat.value;
                this.teamBMatchSummary[statName] = _sumTotal;

                let _qtySumTotal = +Number(quater.teamBMatchSummary[statName]) + _stat.value;
                quater.teamBMatchSummary[statName] = _qtySumTotal;
                
                let player = _.find(this.teamBPlayers, (item) => { return item.id == this.selectedScorePlayer.id; });

                if (player != null) {
                    let _playerStatSumTotal = +Number(player.statics[statName]) + _stat.value;
                    player.statics[statName] = _playerStatSumTotal;
                }
                scoreModel.teamId = this.teamB.id;
                scoreModel.teamPlayerId= player.id;
                console.log(this.teamBMatchSummary)

                  // calculate the total points 
                  this.teamBMatchSummary['TPTS']= +Number(this.teamBMatchSummary['PTM1'])  +Number(this.teamBMatchSummary['PTM2'])  +Number(this.teamBMatchSummary['PTM3']);
                  quater.teamBMatchSummary['TPTS']= +Number(quater.teamBMatchSummary['PTM1'])  +Number(quater.teamBMatchSummary['PTM2'])  +Number(quater.teamBMatchSummary['PTM3']);
                  player.statics['TPTS']= +Number(player.statics['PTM1'])  +Number(player.statics['PTM2'])  +Number(player.statics['PTM3']);
                
                  //calculate the total fouls
                  this.teamBMatchSummary['TFLS']= +Number(this.teamBMatchSummary['PEF'])  +Number(this.teamBMatchSummary['DEF'])  +Number(this.teamBMatchSummary['OFF'])
                  +Number(this.teamBMatchSummary['FFF'])+Number(this.teamBMatchSummary['TEF']);
                  
                  quater.teamBMatchSummary['TFLS']= +Number(quater.teamBMatchSummary['PEF'])  +Number(quater.teamBMatchSummary['DEF'])  +Number(quater.teamBMatchSummary['OFF'])
                  +Number(quater.teamBMatchSummary['FFF'])+Number(quater.teamBMatchSummary['TEF']);
                  
                  player.statics['TFLS']= +Number(player.statics['PEF'])  +Number(player.statics['DEF'])  +Number(player.statics['OFF']) +Number(player.statics['FFF'])+Number(player.statics['TEF']);
                  
                  // calculate the rebound 
  
                  this.teamBMatchSummary['REB']= +Number(this.teamBMatchSummary['OREB'])  +Number(this.teamBMatchSummary['DREB']) ;
                  quater.teamBMatchSummary['REB']= +Number(quater.teamBMatchSummary['OREB'])  +Number(quater.teamBMatchSummary['DREB']) ;
                  player.statics['REB']= +Number(player.statics['OREB'])  +Number(player.statics['DREB']) ;
              
                  
            }

            let apiResponse =   this.leageSvc.saveBasketBallMatchScorePoints(scoreModel);
        }
        this.selectedScorePlayer = null;
        this.selectedScoreTeam = null;
        this.teamBInMatchPlayers.forEach(item => { item.selected = false });
        this.teamAInMatchPlayers.forEach(item => { item.selected = false });

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

    onClose($event) {
        this.showDrader = false;
    }

    private getMatchStats() {
        this.matchStatKeys = [
            { id: 2, name: 'PTM1', value: 1 },
            { id: 5, name: 'PTM2', value: 2 },
            { id: 8, name: 'PTM3', value: 3 },
            { id: 1, name: 'FGA1', value: 1 },
            { id: 4, name: 'FGA2', value: 1 },
            { id: 7, name: 'FGA3', value: 1 },
            { id: 17, name: 'AST', value: 1 },
            { id: 18, name: 'BLK', value: 1 },
            { id: 20, name: 'STL', value: 1 },
            { id: 29, name: 'REB', value: 1 },
            { id: 14, name: 'OREB', value: 1 },
            { id: 15, name: 'DREB', value: 1 },
            { id: 24, name: 'PEF', value: 1 },
            { id: 25, name: 'DEF', value: 1 },
            { id: 26, name: 'OFF', value: 1 },
            { id: 27, name: 'FFF', value: 1 },
            { id: 28, name: 'TEF', value: 1 },
            { id: 19, name: 'TOV', value: 1 },
            { id: 31, name: 'FTOV', value: 1 },
            { id: 30, name: 'TCH', value: 1 },
            { id: 32, name: 'FRST', value: 1 },
            { id: 33, name: 'DFF', value: 1 },
            { id: 34, name: 'PBM', value: 1 },
            { id: 35, name: 'PBA', value: 1 },
            { id: 36, name: 'FJMP', value: 1 },
            { id: 13, name: 'TPTS', value: 0 },
            { id: 16, name: 'TREB', value: 0 },
            { id: 37, name: 'TFLS', value: 0 },
        ]


    }

    private getMatchSummaryObject() {
        let retVal: any = {};
        this.matchStatKeys.forEach(item => {
            retVal[item.name] = 0;
        })
        return retVal;

    }

    private calMatchPlayedTime()
    {
     setInterval( ()=>{
         if(this.currentSessionid >0)
         {
            let quater = _.find(this.matchQuaters, (item) => { return item.id == this.currentSessionid ; });
            quater.sessionTimeInSec += 1;
            this.totalPlayedTime +=1;
            this.teamAPlayers.forEach(item => {
                if( item.isInMatch ==true)
                {
                    item.sessionTimeInSec += 1;
                }
            });
            this.teamBPlayers.forEach(item => {
                if( item.isInMatch ==true)
                {
                    item.sessionTimeInSec += 1;
                }
            });
           console.log(this.teamAPlayers)
           console.log(this.teamBPlayers)

         }
     },1000);

    }
}