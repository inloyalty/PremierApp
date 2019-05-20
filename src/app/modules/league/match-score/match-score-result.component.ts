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
import { RemoteImagePipe } from 'src/app/shared/pipes/remote-image.pipe';
import { Chart } from 'angular-highcharts';

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
    cardHeight = 500;
    cardHeight2 = 480;
    chartHeight = 400;
    id: any = null;
    matchDate: any;
    public bsConfig: Partial<BsDatepickerConfig>;
    teamB: any = {};
    teamA: any = {};
    matchQuaters: any;
    scorePoints: any;
    teamASummary: any = {};
    teamBSummary: any = {};
    teamAPlayerSummaries: any;
    teamBPlayerSummaries: any;
    statics: any = [];
    tabsQuaters = [];
    tabTeams = []
    teamASelectedQuater: any;
    teamBSelectedQuater: any;
    public teamALineups = [];
    public teamBLineups = [];
    public tabsPlayByPlayQuaters = [];
    winningTeamName = '';
    public tabs = [
        { id: 1, 'title': 'Match Summary', 'active': true },
        { id: 2, 'title': 'Statistics', 'active': false },
        { id: 3, 'title': 'Player Statistics', 'active': false },
        { id: 4, 'title': 'Lineup', 'active': false },
        { id: 5, 'title': 'Play By Play', 'active': false }
    ]
    selectedTab = 1;
    selectedQuaterTab = 0;
    selectedTeamTab = 0;
    selectedPlayByPlayQuaterId: any;
    selectedPlayByPlays: any;
    public isListView: boolean = true;
    leaders: any[];
    tableHeight: number = 300;
    chart: Chart;
    lineChartData: any;
    chartHeight2: number = 400;


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
        this.getGameStatics();
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.queryParamMap.get('id');
        if (this.id) {
            this.getBasketBallMatchScore();
        }
    }

    ngAfterViewChecked() {
        this.cardHeight = window.innerHeight - 335;
        this.cardHeight2 = window.innerHeight - 390;
        this.chartHeight = window.innerHeight - 429;
        this.chartHeight2 = window.innerHeight - 483;
        this.tableHeight = window.innerHeight - 540;
        this.cdRef.detectChanges();
    }

    jsonCopy(src) {
        return JSON.parse(JSON.stringify(src));
    }

    async  getBasketBallMatchScore() {


        let apiResponse = await this.leageSvc.getBasketBallMatchScore(this.id);
        if (apiResponse && apiResponse.data) {
            this.leagueMatch = apiResponse.data;
            if (this.leagueMatch.isTeamMatch) {
                this.teamAPlayers = this.leagueMatch.teamAPlayers;
                this.teamBPlayers = this.leagueMatch.teamBPlayers;
                if (this.leagueMatch.teamA && this.leagueMatch.teamA.image) {
                    this.leagueMatch.teamA.image = this.remoteImagePipe.transform(this.leagueMatch.teamA.image, "Teams");
                }
                if (this.leagueMatch.teamB && this.leagueMatch.teamB.image) {
                    this.leagueMatch.teamB.image = this.remoteImagePipe.transform(this.leagueMatch.teamB.image, "Teams");
                }
                this.teamA = this.leagueMatch.teamA;
                this.teamB = this.leagueMatch.teamB;
                this.matchQuaters = _.filter(this.leagueMatch.matchSessions, (item) => { return item.quarterNr != null; });
                // this.teamAQuaters = this.matchQuaters;
                // this.teamBQuaters = this.matchQuaters;
                this.matchQuaters.forEach(item => {
                    let _item: any = this.jsonCopy(item);
                    let _item1: any = this.jsonCopy(item);
                    this.teamAQuaters.push(_item);
                    this.teamBQuaters.push(_item1);
                    this.tabsQuaters.push({ id: item.id, 'title': `Quater ${item.quarterNr}`, 'active': false });
                });
                let overTime = _.filter(this.leagueMatch.matchSessions, (item) => { return item.isOverTime == true; });
                this.teamAQuaters.forEach(item => {
                    let id = item.id;
                    item.teamAscore = _.find(this.leagueMatch.basketBallScoreMatchQuaterSummaries, (item) => { return item.leagueMatchBasketBallSessionId == id && item.teamId == this.teamA.id; });
                });
                this.teamBQuaters.forEach(item => {
                    let id = item.id;
                    item.teamBscore = _.find(this.leagueMatch.basketBallScoreMatchQuaterSummaries, (item) => { return item.leagueMatchBasketBallSessionId == id && item.teamId == this.teamB.id; });;
                });
                if (overTime && overTime.length > 0) {
                    this.tabsQuaters.push({ id: -1, title: `OverTime`, active: false });
                    this.matchQuaters.push({ id: -1, quarterNr: `OT`, 'active': false });
                    let teamAOverTimeQuater: any = { id: -1, quarterNr: 'OverTime' };
                    teamAOverTimeQuater.teamAscore = _.find(this.leagueMatch.basketBallScoreMatchQuaterSummaries, (item) => { return item.leagueMatchBasketBallSessionId == -1 && item.teamId == this.teamA.id; });
                    let teamBOverTimeQuater: any = { id: -1, quarterNr: 'OverTime' };
                    teamBOverTimeQuater.teamBscore = _.find(this.leagueMatch.basketBallScoreMatchQuaterSummaries, (item) => { return item.leagueMatchBasketBallSessionId == -1 && item.teamId == this.teamB.id; });
                    this.teamAQuaters.push(teamAOverTimeQuater);
                    this.teamBQuaters.push(teamBOverTimeQuater);
                }
                this.teamASummary = _.find(this.leagueMatch.basketBallScoreMatchSummaries, (item) => { return item.teamId == this.teamA.id; });
                this.teamBSummary = _.find(this.leagueMatch.basketBallScoreMatchSummaries, (item) => { return item.teamId == this.teamB.id; });
                this.teamAPlayerSummaries = _.filter(this.leagueMatch.basketBallScoreMatchPlayerSummaries, (item) => { return item.teamId == this.teamA.id; });
                this.teamBPlayerSummaries = _.filter(this.leagueMatch.basketBallScoreMatchPlayerSummaries, (item) => { return item.teamId == this.teamB.id; });
                this.teamALineups = _.filter(this.leagueMatch.playerLineups, (item) => { return item.teamId == this.teamA.id; });
                this.teamBLineups = _.filter(this.leagueMatch.playerLineups, (item) => { return item.teamId == this.teamB.id; });
                this.tabsQuaters[0].active = true;
                this.selectedQuaterTab = this.tabsQuaters[0].id;
                this.selectedPlayByPlayQuaterId = this.tabsQuaters[0].id;;
                // this.tabsPlayByPlayQuaters.push({ id: 0, 'title': `Overall`, 'active': true });
                this.tabsQuaters.forEach(item => {
                    this.tabsPlayByPlayQuaters.push({ id: item.id, 'title': item.title, 'active': false });

                })
                this.tabTeams = [
                    { id: 0, 'title': `Overall`, 'active': true },
                    { id: 1, 'title': ` ${this.teamA.name}`, 'active': false },
                    { id: 2, 'title': ` ${this.teamB.name}`, 'active': false }
                ];
                this.bindLeaderBoxScore();

            }
        }
    }

    onTabChanged(event) {
        console.log(event);
        this.isListView = true;
        this.selectedTab = event.id;
        if (this.selectedTab == 2) {
            this.selectedQuaterTab = this.tabsQuaters[0].id;
            this.changedSelectedQuater(this.selectedQuaterTab);
        }
        if (this.selectedTab == 5) {
            this.selectedPlayByPlayQuaterId = this.tabsPlayByPlayQuaters[0].id;
            this.getSelectedPlayByPlayQuater(this.selectedPlayByPlayQuaterId);
        }
    }

    onTabsQuaterChanged(event) {
        this.selectedQuaterTab = event.id;
        this.changedSelectedQuater(this.selectedQuaterTab);
    }

    onTabsTeamChanged(event: any) {
        this.selectedTeamTab = event.id;
    }

    onPlayByPlayTabChanged(event: any) {
        this.selectedPlayByPlayQuaterId = event.id;
        this.getSelectedPlayByPlayQuater(this.selectedPlayByPlayQuaterId);
    }

    getSelectedPlayByPlayQuater(id: number) {
        if (id > 0) {
            this.selectedPlayByPlays = _.filter(this.leagueMatch.playByPlays, (item) => { return item.field2 == id; });
        }
        else {
            this.selectedPlayByPlays = _.filter(this.leagueMatch.playByPlays, (item) => { return item.field9 == 'OT'; });
        }
        this.bindChartData(this.selectedPlayByPlays);
    }

    changedSelectedQuater(quaterId: number) {

        let _teamASelectedQuater = _.find(this.teamAQuaters, (item) => { return item.id == quaterId });
        let _teamBSelectedQuater = _.find(this.teamBQuaters, (item) => { return item.id == quaterId });
        if (_teamASelectedQuater && _teamASelectedQuater.teamAscore) {
            this.teamASelectedQuater = _teamASelectedQuater.teamAscore;
        }
        else {
            this.teamASelectedQuater = {}
        }
        if (_teamBSelectedQuater && _teamBSelectedQuater.teamBscore) {
            this.teamBSelectedQuater = _teamBSelectedQuater.teamBscore;
        }
        else {
            this.teamBSelectedQuater = {}
        }
        // this.teamASelectedQuater = _teamASelectedQuater ? _teamASelectedQuater.teamAscore :{};
        // this.teamBSelectedQuater =_teamBSelectedQuater ?_teamBSelectedQuater.teamBscore:{}
        // this.changedSelectedQuater(quaterId);
    }

    private getGameStatics() {
        // {name:'Goals Made %',code:'',isHeader:true}
        // {name:'Free Throws %',code:'',isHeader:false},
        this.statics = [
            { name: 'Points', code: 'tpm', isHeader: true },
            { name: 'Goals Made', code: 'fgm', isHeader: true },
            { name: 'Goals Attempted', code: 'fga', isHeader: true },
            { name: 'Goals Made %', code: 'fgper', isHeader: true },
            { name: '3-Point Field Goal Made', code: 'pM3', isHeader: false },
            { name: '3 Point Field Goal Attempted', code: 'pA2', isHeader: false },
            { name: '3-Point Field Goal %', code: 'pM3PER', isHeader: false },
            { name: '2 Point Field Goal Made', code: 'pM2', isHeader: false },
            { name: '2 Point Field Goal Attempted', code: 'pA2', isHeader: false },
            { name: '2-Point Field Goals %', code: 'pT2PER', isHeader: false },
            { name: 'Free Throws Made', code: 'ftm', isHeader: false },
            { name: 'Free Throws Attempted', code: 'fta', isHeader: false },
            { name: 'Free Throws %', code: 'ftper', isHeader: false },
            { name: 'Offensive Rebound', code: 'oreb', isHeader: false },
            { name: 'Defensive Rebound', code: 'dreb', isHeader: false },
            { name: 'Total Rebounds', code: 'treb', isHeader: false },
            { name: 'Assist', code: 'ast', isHeader: false },
            { name: 'Block', code: 'blk', isHeader: false },
            { name: 'Turnover', code: 'tov', isHeader: false },
            { name: 'Steal', code: 'stl', isHeader: false },
            { name: 'Total Fouls', code: 'tfl', isHeader: false }
        ]
    }

    private bindLeaderBoxScore() {
        this.leaders = [];
        let leaderShipDto1: any;
        let leaderShipDto2: any;
        let finalDto: any;
        for (let i = 0; i < 3; i++) {
            if (i == 0) {
                leaderShipDto1 = {
                    teamAObj: _.maxBy(this.teamAPlayerSummaries, 'tpm'),
                    value: (_.maxBy(this.teamAPlayerSummaries, 'tpm')).tpm,
                };
                leaderShipDto2 = {
                    teamBObj: _.maxBy(this.teamBPlayerSummaries, 'tpm'),
                    value: (_.maxBy(this.teamBPlayerSummaries, 'tpm')).tpm,
                }
                finalDto = {
                    label: 'PTS',
                    teamA: leaderShipDto1,
                    teamB: leaderShipDto2
                }
            }
            else if (i == 1) {
                leaderShipDto1 = {
                    teamAObj: _.maxBy(this.teamAPlayerSummaries, 'treb'),
                    value: (_.maxBy(this.teamAPlayerSummaries, 'treb')).treb,
                };
                leaderShipDto2 = {
                    teamBObj: _.maxBy(this.teamBPlayerSummaries, 'treb'),
                    value: (_.maxBy(this.teamBPlayerSummaries, 'treb')).treb,
                }
                finalDto = {
                    label: 'REB',
                    teamA: leaderShipDto1,
                    teamB: leaderShipDto2
                }
            }
            else {
                leaderShipDto1 = {
                    teamAObj: _.maxBy(this.teamAPlayerSummaries, 'ast'),
                    value: (_.maxBy(this.teamAPlayerSummaries, 'ast')).ast,
                };
                leaderShipDto2 = {
                    teamBObj: _.maxBy(this.teamBPlayerSummaries, 'ast'),
                    value: (_.maxBy(this.teamBPlayerSummaries, 'ast')).ast,
                }
                finalDto = {
                    label: 'AST',
                    teamA: leaderShipDto1,
                    teamB: leaderShipDto2
                }
            }
            this.leaders.push(finalDto);
        }
    }

    private bindChartData(selectedPlayByPlays: any) {
        let chartData: any;
        let dateArray = [];
        let lineChartData = [];
        if (selectedPlayByPlays && selectedPlayByPlays.length > 0) {
            var teamGrouping = _.groupBy(selectedPlayByPlays, 'field6');
            var teamKeys = Object.keys(teamGrouping);
            let itemIndex = 1;
            teamKeys.forEach(element => {
                let teamData = teamGrouping[element];
                chartData = [];
                dateArray = [];
                teamData.forEach(item => {
                    let goal = item.field8.split('-');
                    chartData.push(item.field10, itemIndex == 1 ? parseInt(goal[0]) : parseInt(goal[1]));
                    dateArray.push(chartData);
                    chartData = [];
                });
                itemIndex += 1;
                var chartDto = {
                    name: element,
                    data: dateArray,
                };
                lineChartData.push(chartDto);
                this.chart = new Chart({
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: ''
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        type: 'datetime',
                        title: {
                            text: 'Time'
                        }
                    },
                    colors: ['#1379cd', '#1067af'],
                    yAxis: {
                        title: {
                            text: 'Points'
                        }
                    },
                    plotOptions: {
                        spline: {
                            marker: {
                                enabled: true
                            },
                            showInLegend: false
                        }
                    },
                    series: lineChartData
                });
            });
        }
        else {
            this.chart = new Chart({
                chart: {
                    type: 'spline'
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: 'Time'
                    }
                },
                colors: ['#1379cd', '#1067af'],
                yAxis: {
                    title: {
                        text: 'Points'
                    }
                },
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: true
                        },
                        showInLegend: false
                    }
                },
                series: []
            });
        }
    }
}