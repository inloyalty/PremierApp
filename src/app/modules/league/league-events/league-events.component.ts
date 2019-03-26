import { Component, ChangeDetectorRef, AfterViewChecked, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { RemoteImagePipe } from 'src/app/shared/pipes/remote-image.pipe';
import { LookupService } from '../../shared/services/lookup.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { UtilService } from 'src/app/shared/services/util.service';
import { MydListComponent } from 'src/app/shared/modules/myd-list/myd-list.component';
import { LeageService } from '../league.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ConfirmationDialogService } from 'src/app/shared/modules/confirmation-dialog/confirmation-dialog.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AppConstant } from '../../constants/app-constant';
import { Filter } from 'src/app/models/filter';

@Component({
    templateUrl: './league-events.component.html',
    providers: [LookupService, UtilService, NavigationService, ConfirmationDialogService, LocalStorageService]
})

export class LeagueMatchEventsComponent implements AfterViewChecked, OnInit {

    public windowHeight = (window.innerHeight - 128).toString();
    public cardHeight = (window.innerHeight - 205).toString();

    public forgotPasswordModel: any = {};
    public league: any = {};
    imageUser: any;
    public showDrader = false;
    showResetButton: boolean;
    UserImage: any;
    totalRecords: number = 0;
    headerItems: any = [
        { title: 'League', 'sortable': true, 'width': null, 'widthClass': 'col float-left', 'sortBy': 'document_title', id: "1" },
        { title: 'Match Nr', 'sortable': true, 'width': null, 'widthClass': 'col float-left', 'sortBy': 'doc_status_id', id: "2" },
        { title: 'Venue', 'sortable': true, 'width': null, 'widthClass': 'col float-left', 'sortBy': 'document_creation_date', id: "3" },
        { title: 'Venue Date', 'sortable': true, 'width': null, 'widthClass': 'col float-left', 'sortBy': 'document_creation_date', id: "3" },
        { title: 'Is Team Match', 'sortable': true, 'width': null, 'widthClass': 'col float-left', 'sortBy': 'document_creation_date', id: "3" },
        { title: 'TeamA', 'sortable': true, 'width': null, 'widthClass': 'col float-left', 'sortBy': 'document_creation_date', id: "3" },
        { title: 'TeamB', 'sortable': true, 'width': null, 'widthClass': 'col float-left', 'sortBy': 'document_creation_date', id: "3" },
        { title: '', 'sortable': false, 'width': null, 'widthClass': 'col float-left float-right', 'sortBy': ' ' },
    ]
    countries: any;
    states: any;
    public bsConfig: Partial<BsDatepickerConfig>;
    leagueMatches: any = [];
    dateOfBirth: any;
    @ViewChild('mydList') public mydList: MydListComponent;
    public loading = false;
    public tabs = [
        { id: 1, 'title': 'Up Coming', 'active': true },
        { id: 2, 'title': 'Past Match', 'active': false }


    ]

    selectedTab: any = 1;
    upcomingMatches: any = [];
    pastMatches: any = [];
    logedInUserInfo: any;
    public upComingFilter: any = new Filter();
    public pastFilter: any = new Filter();


    constructor(
        private cdRef: ChangeDetectorRef,
        private leageSvc: LeageService,
        private toastrSvc: ToastrService,
        private remoteImagePipe: RemoteImagePipe,
        private lookupSvc: LookupService,
        private utilSvc: UtilService,
        private navigationSvc: NavigationService,
        private confirmationDialogSvc: ConfirmationDialogService,
        private localStorageSvc: LocalStorageService


    ) {
        this.bsConfig = this.utilSvc.getBsDatepickerConfig();
        this.logedInUserInfo = this.localStorageSvc.get(AppConstant.LOGGED_IN_USER_INFO).toJSON();

        this.upComingFilter.OrderBy = 'StartDate';
        this.upComingFilter.SortOrder = 'ASC';
        this.pastFilter.OrderBy = 'StartDate';
        this.pastFilter.SortOrder = 'DESC';

    }
    ngOnInit(): void {
        this.getLeagueMatches();

        this.getUpComingMatches();
        this.getPastMatches();


    }

    ngAfterViewChecked() {
        this.cardHeight = (window.innerHeight - 165).toString();;
        this.windowHeight = (window.innerHeight - 80).toString();
        this.cdRef.detectChanges();
    }

    onClose() {
        this.showDrader = false;
    }
    onAddNew() {
        this.navigationSvc.navigateTo('league/league-match-add-edit');
    }
    async onSave() {

        if (this.dateOfBirth) {
            this.league.dateOfBirth = this.dateOfBirth.toyyyymmdd()
        }


        const formData = {
            'dto': JSON.stringify(this.league),
            'file': this.UserImage,
        };
        this.UserImage = null;
        this.imageUser = null

        let apiResponse = await this.leageSvc.saveLeague(formData);
        if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
            this.toastrSvc.success('Saved successfully');


        }
        this.getLeagueMatches();
        this.mydList.clear();
        this.showDrader = false;
    }

    async  getLeagueMatches() {

        let apiResponse = await this.leageSvc.getLeagueMatches();
        console.log(apiResponse)
        if (apiResponse && apiResponse.data && apiResponse.data.length > 0) {

            apiResponse.data.forEach(item => {
                item.image = this.remoteImagePipe.transform(item.image, "Leagues");
            });
            this.leagueMatches = apiResponse.data;
            console.log(this.leagueMatches)
        }
        this.totalRecords = apiResponse.filter.page.totalRecords;
    }

    onUserImage(fileInput: any) {
        this.UserImage = fileInput.target.files[0];
        let reader = new FileReader();
        reader.onload = (e: any) => {
            this.imageUser = e.target.result;
        };
        // this.userModel.Picture = fileInput.target.files[0].name;
        reader.readAsDataURL(fileInput.target.files[0]);
        this.showResetButton = true;
    }
    onSort(event: any) {
        console.log(event);
    }

    onPageChange(event: any) {

    }

    onMatchScoreEdit(match: any) {
        if (match.isTeamMatch) {
            this.navigationSvc.navigateByUrl(`league/match-score-add-edit?id=${match.id}`);
        }
        else {
            this.navigationSvc.navigateByUrl(`league/match-score-individual-add-edit?id=${match.id}`);

        }
    }

    onMatchScoreResult(id: number) {
        this.navigationSvc.navigateByUrl(`league/match-score-result?id=${id}`);
    }

    public async onTabChanged(event: any) {
        this.selectedTab = event.id;
    }

    async  getUpComingMatches() {
        let apiResponse = await this.leageSvc.getUpComingMatches(this.logedInUserInfo.userId, this.upComingFilter);
        console.log(apiResponse)
        if (apiResponse && apiResponse.data && apiResponse.data.length > 0) {
            apiResponse.data.forEach(item => {
                item.image = this.remoteImagePipe.transform(item.image, "Leagues");
            });
            this.upcomingMatches = apiResponse.data;
            console.log(this.upcomingMatches)
        }
        this.totalRecords = apiResponse.filter.page.totalRecords;
    }

    async  getPastMatches() {
        let apiResponse = await this.leageSvc.getPastMatches(this.logedInUserInfo.userId, this.pastFilter);
        console.log(apiResponse)
        if (apiResponse && apiResponse.data && apiResponse.data.length > 0) {
            apiResponse.data.forEach(item => {
                item.image = this.remoteImagePipe.transform(item.image, "Leagues");
            });
            this.pastMatches = apiResponse.data;
            console.log(this.pastMatches)
        }
        this.totalRecords = apiResponse.filter.page.totalRecords;
    }



}