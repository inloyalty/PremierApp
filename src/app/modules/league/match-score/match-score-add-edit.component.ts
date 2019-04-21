import { Component, ChangeDetectorRef, OnInit, OnDestroy } from "@angular/core";
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
import { RemoteImagePipe } from 'src/app/shared/pipes/remote-image.pipe';

@Component({
    templateUrl: './match-score-add-edit.component.html',
    styleUrls: ['./match-score-add-edit.component.css'],
    providers: [LookupService, UtilService, TeamService, NavigationService, AccountService]

})

export class MatchScoreAddEditComponent implements OnInit, OnDestroy {



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
    public totalPlayedTime: number = 0;
    public playByPlays = [];
    public showOverTime = false;
    public overtimeSessionSummary = {};






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
        private remoteImagePipe: RemoteImagePipe,


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
        if (apiResponse && apiResponse.data) {
            this.leagueMatch = apiResponse.data;

            if (this.leagueMatch.isTeamMatch) {
                this.teamAMatchSummary = this.getMatchSummaryObject();
                this.teamBMatchSummary = this.getMatchSummaryObject();

                this.teamAPlayers = this.leagueMatch.teamAPlayers;
                this.teamBPlayers = this.leagueMatch.teamBPlayers;

                if (this.teamAPlayers && this.teamAPlayers.length > 0) {
                    this.teamAPlayers.forEach(item => {
                        if (item.image) {
                            item.image = this.remoteImagePipe.transform(item.image, "TeamPlayers");
                        }
                    })
                }

                if (this.teamBPlayers && this.teamBPlayers.length > 0) {
                    this.teamBPlayers.forEach(item => {
                        if (item.image) {
                            item.image = this.remoteImagePipe.transform(item.image, "TeamPlayers");
                        }
                    })
                }



                this.teamA = this.leagueMatch.teamA;
                this.teamB = this.leagueMatch.teamB;
                this.matchQuaters = this.leagueMatch.matchSessions;
                this.matchQuaters = _.filter(this.leagueMatch.matchSessions, (item) => { return !item.isOverTime; });

                // let overTime = _.find(this.leagueMatch.matchSessions, (item) => { return item.isOverTime == true; });

                // if (overTime) {
                //     this.showOverTime = false;
                // }
                //this.matchQuaters = _.filter(this.leagueMatch.matchSessions, (item) => { return item.quarterNr != null; });
                this.teamAQuaters = this.matchQuaters;
                this.teamBQuaters = this.matchQuaters;
                this.matchQuaters.forEach(item => {
                    item.teamAMatchSummary = this.getMatchSummaryObject();
                    item.teamBMatchSummary = this.getMatchSummaryObject();
                    item.start = null
                    item.end = null
                    item.isPaused = false;
                    item.sessionTimeInSec = 0;
                });

                this.teamAPlayers.forEach(item => {
                    item.isInMatch = false;
                    item.sessionTimeInSec = 0;
                    item.statics = this.getMatchSummaryObject();
                })
                this.teamBPlayers.forEach(item => {
                    item.isInMatch = false;
                    item.sessionTimeInSec = 0;
                    item.statics = this.getMatchSummaryObject();

                })

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

        let field1 = player.isInMatch ? 'Player entered game' : 'Player exited game';


        this.saveBasketBallLineup(player.id, null, true);
        this.saveLeagueMatchPlayByPlay(field1, player, team);

    }

    showPlayerChangeDrawer(teamName: any, player: any) {
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

        if (this.selectedExchangeTeam == 'A') {
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

        this.saveBasketBallLineup(player.id, this.selectedOutPlayer.id, false);
        this.saveLeagueMatchPlayByPlay('Player exited game', this.selectedOutPlayer, this.selectedExchangeTeam);
        this.saveLeagueMatchPlayByPlay('Player entered game', player, this.selectedExchangeTeam);




    }


    onSessionStart(id: number) {
        this.currentSessionid = id;
        let quater = _.find(this.matchQuaters, (item) => { return item.id == id; });
        quater.start = true;
        quater.isPaused = false;
        this.calMatchPlayedTime();
    }

    onSessionEnd(id: number) {
        this.currentSessionid = 0;
        let quater = _.find(this.matchQuaters, (item) => { return item.id == id; });
        quater.end = true;
        quater.isPaused = false;
        let apiResponse = this.leageSvc.saveBasketBallSession(quater);
        let quaterLeft = _.filter(this.matchQuaters, (item) => { return item.end == null || item.end == false; });
       console.log(quaterLeft);
        if (quaterLeft && quaterLeft.length > 0) {
            this.showOverTime = false;
        }
        else {
            console.log(`this.teamAMatchSummary['TPTS'] ${this.teamAMatchSummary['TPTS']} this.teamBMatchSummary['TPTS'] ${this.teamBMatchSummary['TPTS']}`)
            if (this.teamAMatchSummary['TPTS'] == this.teamBMatchSummary['TPTS']) {
                this.showOverTime = true;
            }
            else {
                this.showOverTime = false;
            }
        }
    }
    onSessionPause(id: number) {
        let quater = _.find(this.matchQuaters, (item) => { return item.id == id; });
        quater.isPaused = true;
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
        if (apiResponse && apiResponse.data) {
            this.scorePoints = apiResponse.data;

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

        let player: any = {};

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

                player = _.find(this.teamAPlayers, (item) => { return item.id == this.selectedScorePlayer.id; });

                if (player != null) {
                    let _playerStatSumTotal = +Number(player.statics[statName]) + _stat.value;
                    player.statics[statName] = _playerStatSumTotal;
                }
                scoreModel.teamId = this.teamA.id;
                scoreModel.teamPlayerId = player.id;

                console.log(player);
                // calculate the total points 

                let total2Points = + Number(this.teamAMatchSummary['PTM2']) * 2;
                let total3Points = + Number(this.teamAMatchSummary['PTM3']) * 3;

                this.teamAMatchSummary['TPTS'] = + total2Points + total3Points;

                // this.teamAMatchSummary['TPTS'] = + Number(this.teamAMatchSummary['PTM2']) + Number(this.teamAMatchSummary['PTM3']);
                // let _quaterPointsSumTotal =  + (Number(quater.teamAMatchSummary['PTM2'])) + Number(quater.teamAMatchSummary['PTM3']);

                let qtytotal2Points = + Number(this.teamAMatchSummary['PTM2']) * 2;
                let qtytotal3Points = + Number(this.teamAMatchSummary['PTM3']) * 3;
                quater.teamAMatchSummary['TPTS'] = + qtytotal2Points + qtytotal3Points;


             //   quater.teamAMatchSummary['TPTS'] = +Number(quater.teamAMatchSummary['PTM1']) + Number(quater.teamAMatchSummary['PTM2']) + Number(quater.teamAMatchSummary['PTM3']);
               
               let playertotal2Points = + Number(player.statics['PTM2']) * 2;
                let playertotal3Points = + Number(player.statics['PTM3']) * 3;
                player.statics['TPTS'] = + playertotal2Points + playertotal3Points;

            // player.statics['TPTS'] = +Number(player.statics['PTM1']) + Number(player.statics['PTM2']) + Number(player.statics['PTM3']);


                //calculate the total fouls

                this.teamAMatchSummary['TFLS'] = +Number(this.teamAMatchSummary['PEF']) + Number(this.teamAMatchSummary['DEF']) + Number(this.teamAMatchSummary['OFF'])
                    + Number(this.teamAMatchSummary['FFF']) + Number(this.teamAMatchSummary['TEF']);

                quater.teamAMatchSummary['TFLS'] = +Number(quater.teamAMatchSummary['PEF']) + Number(quater.teamAMatchSummary['DEF']) + Number(quater.teamAMatchSummary['OFF'])
                    + Number(quater.teamAMatchSummary['FFF']) + Number(quater.teamAMatchSummary['TEF']);

                player.statics['TFLS'] = +Number(player.statics['PEF']) + Number(player.statics['DEF']) + Number(player.statics['OFF']) + Number(player.statics['FFF']) + Number(player.statics['TEF']);

                // calculate the rebound 

                this.teamAMatchSummary['REB'] = +Number(this.teamAMatchSummary['OREB']) + Number(this.teamAMatchSummary['DREB']);
                quater.teamAMatchSummary['REB'] = +Number(quater.teamAMatchSummary['OREB']) + Number(quater.teamAMatchSummary['DREB']);
                player.statics['REB'] = +Number(player.statics['OREB']) + Number(player.statics['DREB']);


            }
            else {

                let _stat = _.find(this.matchStatKeys, (item) => { return item.name == statName; });
                let _sumTotal = +Number(this.teamBMatchSummary[statName]) + _stat.value;
                this.teamBMatchSummary[statName] = _sumTotal;

                let _qtySumTotal = +Number(quater.teamBMatchSummary[statName]) + _stat.value;
                quater.teamBMatchSummary[statName] = _qtySumTotal;

                player = _.find(this.teamBPlayers, (item) => { return item.id == this.selectedScorePlayer.id; });

                if (player != null) {
                    let _playerStatSumTotal = +Number(player.statics[statName]) + _stat.value;
                    player.statics[statName] = _playerStatSumTotal;
                }
                scoreModel.teamId = this.teamB.id;
                scoreModel.teamPlayerId = player.id;

                // calculate the total points 
                let total2Points = + Number(this.teamBMatchSummary['PTM2']) * 2;
                let total3Points = + Number(this.teamBMatchSummary['PTM3']) * 3;

                this.teamBMatchSummary['TPTS'] = + total2Points + total3Points;


                let qtytotal2Points = + Number(this.teamBMatchSummary['PTM2']) * 2;
                let qtytotal3Points = + Number(this.teamBMatchSummary['PTM3']) * 3;
                quater.teamBMatchSummary['TPTS'] = + qtytotal2Points + qtytotal3Points;

                let playertotal2Points = + Number(player.statics['PTM2']) * 2;
                let playertotal3Points = + Number(player.statics['PTM3']) * 3;
                player.statics['TPTS'] = + playertotal2Points + playertotal3Points;

                //this.teamBMatchSummary['TPTS'] = +Number(this.teamBMatchSummary['PTM1']) + Number(this.teamBMatchSummary['PTM2']) + Number(this.teamBMatchSummary['PTM3']);
              //  quater.teamBMatchSummary['TPTS'] = +Number(quater.teamBMatchSummary['PTM1']) + Number(quater.teamBMatchSummary['PTM2']) + Number(quater.teamBMatchSummary['PTM3']);
               // player.statics['TPTS'] = +Number(player.statics['PTM1']) + Number(player.statics['PTM2']) + Number(player.statics['PTM3']);

                //calculate the total fouls
                this.teamBMatchSummary['TFLS'] = +Number(this.teamBMatchSummary['PEF']) + Number(this.teamBMatchSummary['DEF']) + Number(this.teamBMatchSummary['OFF'])
                    + Number(this.teamBMatchSummary['FFF']) + Number(this.teamBMatchSummary['TEF']);

                quater.teamBMatchSummary['TFLS'] = +Number(quater.teamBMatchSummary['PEF']) + Number(quater.teamBMatchSummary['DEF']) + Number(quater.teamBMatchSummary['OFF'])
                    + Number(quater.teamBMatchSummary['FFF']) + Number(quater.teamBMatchSummary['TEF']);

                player.statics['TFLS'] = +Number(player.statics['PEF']) + Number(player.statics['DEF']) + Number(player.statics['OFF']) + Number(player.statics['FFF']) + Number(player.statics['TEF']);

                // calculate the rebound 

                this.teamBMatchSummary['REB'] = +Number(this.teamBMatchSummary['OREB']) + Number(this.teamBMatchSummary['DREB']);
                quater.teamBMatchSummary['REB'] = +Number(quater.teamBMatchSummary['OREB']) + Number(quater.teamBMatchSummary['DREB']);
                player.statics['REB'] = +Number(player.statics['OREB']) + Number(player.statics['DREB']);


            }

            let apiResponse = this.leageSvc.saveBasketBallMatchScorePoints(scoreModel);

            this.saveLeagueMatchPlayByPlay(_stat.playByPlayDesc, player, this.selectedScoreTeam);


        }

        this.selectedScorePlayer = null;
        this.selectedScoreTeam = null;
        this.teamBInMatchPlayers.forEach(item => { item.selected = false });
        this.teamAInMatchPlayers.forEach(item => { item.selected = false });

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
            { id: 2, name: 'PTM1', value: 1, playByPlayDesc: '1pt Made' },
            { id: 5, name: 'PTM2', value: 1, playByPlayDesc: '2pt Made' },
            { id: 8, name: 'PTM3', value: 1, playByPlayDesc: '3pt Made' },
            { id: 1, name: 'FGA1', value: 1, playByPlayDesc: '1pt Miss' },
            { id: 4, name: 'FGA2', value: 1, playByPlayDesc: '2pt Miss' },
            { id: 7, name: 'FGA3', value: 1, playByPlayDesc: '3pt Miss' },
            { id: 17, name: 'AST', value: 1, playByPlayDesc: 'Assists' },
            { id: 18, name: 'BLK', value: 1, playByPlayDesc: 'Blocks' },
            { id: 20, name: 'STL', value: 1, playByPlayDesc: 'Steals' },
            { id: 29, name: 'REB', value: 1, playByPlayDesc: '' },
            { id: 14, name: 'OREB', value: 1, playByPlayDesc: 'Offensive Rebounds' },
            { id: 15, name: 'DREB', value: 1, playByPlayDesc: 'Defensive Rebounds' },
            { id: 24, name: 'PEF', value: 1, playByPlayDesc: 'Personal Foul' },
            { id: 25, name: 'DEF', value: 1, playByPlayDesc: 'Defensive Foul' },
            { id: 26, name: 'OFF', value: 1, playByPlayDesc: 'Offensive Foul' },
            { id: 27, name: 'FFF', value: 1, playByPlayDesc: 'Flagrant Foul' },
            { id: 28, name: 'TEF', value: 1, playByPlayDesc: 'Technical Fouls' },
            { id: 19, name: 'TOV', value: 1, playByPlayDesc: 'Turnover' },
            { id: 31, name: 'FTOV', value: 1, playByPlayDesc: 'Forced Turnover' },
            { id: 30, name: 'TCH', value: 1, playByPlayDesc: 'Take Charge' },
            { id: 32, name: 'FRST', value: 1, playByPlayDesc: 'Forced Rush Shot' },
            { id: 33, name: 'DFF', value: 1, playByPlayDesc: 'Deflect' },
            { id: 34, name: 'PBM', value: 1, playByPlayDesc: 'Putback Made' },
            { id: 35, name: 'PBA', value: 1, playByPlayDesc: 'Putback Attempted' },
            { id: 36, name: 'FJMP', value: 1, playByPlayDesc: 'Force Jump' },
            { id: 13, name: 'TPTS', value: 0, playByPlayDesc: '' },
            { id: 16, name: 'TREB', value: 0, playByPlayDesc: '' },
            { id: 37, name: 'TFLS', value: 0, playByPlayDesc: '' },
            { id: 10, name: 'FTA', value: 1, playByPlayDesc: 'Free Throws Attempted' },
            { id: 11, name: 'FTM', value: 1, playByPlayDesc: 'Free Throws Made' },
            { id: 38, name: 'LAYM', value: 1, playByPlayDesc: 'Layup Made' },
            { id: 39, name: 'LAYA', value: 1, playByPlayDesc: 'Layup Miss' },

        ]


    }

    private getMatchSummaryObject() {
        let retVal: any = {};
        this.matchStatKeys.forEach(item => {
            retVal[item.name] = 0;
        })
        return retVal;

    }

    private calMatchPlayedTime() {
        setInterval(() => {
            if (this.currentSessionid > 0) {
                let quater = _.find(this.matchQuaters, (item) => { return item.id == this.currentSessionid; });
                if (quater.isPaused == false) {
                    quater.sessionTimeInSec += 1;
                    this.totalPlayedTime += 1;
                    this.teamAPlayers.forEach(item => {
                        if (item.isInMatch == true) {
                            item.sessionTimeInSec += 1;
                        }
                    });
                    this.teamBPlayers.forEach(item => {
                        if (item.isInMatch == true) {
                            item.sessionTimeInSec += 1;
                        }
                    });

                }
            }
        }, 1000);

    }

    public saveBasketBallLineup(playerId: number, substitutePlayerId: number, isStartup: boolean = false) {
        let lineupModel: any = {
            matchId: this.leagueMatch.id,
            teamPlayerId: playerId,
            exchangeTeamPlayerId: substitutePlayerId,
            isStartup: isStartup
        }
        let apiResponse = this.leageSvc.saveBasketBallLineup(lineupModel);
    }

    public async saveLeagueMatchPlayByPlay(fiedl1: string, player: any, team: string) {
        console.log(player);
        let playByPlayModel: any = {};
        playByPlayModel.field1 = this.leagueMatch.id;
        playByPlayModel.field2 = this.currentSessionid;
        playByPlayModel.field3 = fiedl1;
        playByPlayModel.field4 = team == 'A' ? `#${player.shirtNr} - ${player.firstName} ${player.lastName}`
            : `#${player.shirtNr} - ${player.firstName} ${player.lastName}`;

        playByPlayModel.field5 = team == 'A' ? this.teamA.name : this.teamB.name;
        playByPlayModel.field6 = team == 'A' ? this.teamA.id : this.teamB.id;
        playByPlayModel.field7 = player.image;
        playByPlayModel.field8 = `${this.teamAMatchSummary.TPTS} - ${this.teamBMatchSummary.TPTS}`;
        let quater = _.find(this.matchQuaters, (item) => { return item.id == this.currentSessionid; });
        if (quater) {
            playByPlayModel.field9 = quater.isOverTime ? `OT` : `${quater.quarterNr}`;
            playByPlayModel.field10 = this.utilSvc.secondsTommss(quater.sessionTimeInSec);
        }




        let apiResponse = await this.leageSvc.saveLeagueMatchPlayByPlay(playByPlayModel);
        if (apiResponse && apiResponse.data) {
            this.playByPlays.push(apiResponse.data);

            if (this.playByPlays && this.playByPlays.length > 0) {
                this.playByPlays = _.orderBy(this.playByPlays, ['id'], ['desc']);
            }
        }
    }

    public async saveBasketBallOverTimeSession() {
        let overTimeSessionModel: any = {
            matchId: this.leagueMatch.id,
            isOverTime: true
        }
        let apiResponse = await this.leageSvc.saveBasketBallSession(overTimeSessionModel);
        if (apiResponse && apiResponse.data) {
            apiResponse.data.start = true
            apiResponse.data.end = false
            apiResponse.data.isPaused = false;
            apiResponse.data.sessionTimeInSec = 0;
            apiResponse.data.isInMatch = false;
            apiResponse.data.statics = await this.getMatchSummaryObject();
            this.showOverTime = false;
            this.currentSessionid = apiResponse.data.id;
            apiResponse.data.teamAMatchSummary = this.getMatchSummaryObject();
            apiResponse.data.teamBMatchSummary = this.getMatchSummaryObject();

            console.log(apiResponse.data)
            this.matchQuaters.push(apiResponse.data)
        }
        console.log(apiResponse);
    }

    ngOnDestroy(): void {

        let scoreModel: any = {
            matchId: this.leagueMatch.id,
            leagueMatchBasketBallSessionId: this.currentSessionid,
            sportStatisticId: 23,
        }

        this.teamAPlayers.forEach(item => {
            if (item.sessionTimeInSec > 0) {
                scoreModel.value = item.sessionTimeInSec;
                scoreModel.teamId = item.teamId;
                scoreModel.teamPlayerId = item.id;
                let apiResponse = this.leageSvc.saveBasketBallMatchScorePoints(scoreModel);
            }
        });

        this.teamBPlayers.forEach(item => {
            if (item.sessionTimeInSec > 0) {
                scoreModel.value = item.sessionTimeInSec;
                scoreModel.teamId = item.teamId;
                scoreModel.teamPlayerId = item.id;
                let apiResponse = this.leageSvc.saveBasketBallMatchScorePoints(scoreModel);

            }
        });


    }
}