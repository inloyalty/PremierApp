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

@Component({
    templateUrl: './league-match-listing.component.html',
    providers: [LookupService, UtilService,NavigationService,ConfirmationDialogService]
})

export class LeagueMatchListingComponent implements AfterViewChecked, OnInit {

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
    leagueMatches: any=[];
    dateOfBirth: any;
    @ViewChild('mydList') public mydList: MydListComponent;
    public loading=false;

    constructor(
        private cdRef: ChangeDetectorRef,
        private leageSvc: LeageService,
        private toastrSvc: ToastrService,
        private remoteImagePipe: RemoteImagePipe,
        private lookupSvc: LookupService,
        private utilSvc: UtilService,
        private navigationSvc:NavigationService,
        private confirmationDialogSvc: ConfirmationDialogService


    ) {
        this.bsConfig = this.utilSvc.getBsDatepickerConfig();
    }
    ngOnInit(): void {
        this.getLeagueMatches();


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

      
     

    onEdit(id:number)
    {
        console.log(id);
        this.navigationSvc.navigateByUrl(`league/league-match-add-edit?id=${id}`);

    }

    onDelete(id: any) {
        this.openConfirmationDialog(id);
    }

    public openConfirmationDialog(id: any) {
        this.confirmationDialogSvc.confirm('Delete League Match', 'Do you really want to delete this record?')
            .then(confirmed => {
                console.log('User confirmed:', confirmed)
                if (confirmed == true) {
                    this.deleteLeague(id)
                }
            })
            .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }

    async deleteLeague(id: number) {
        try {
            this.loading = true;
            let apiResponse = await this.leageSvc.deleteLeagueMatch(id);
            if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
                this.toastrSvc.success('Record deleted successfully');
                this.mydList.clear();
                await this.getLeagueMatches();
                this.showDrader = false;
            }
            else {
                this.toastrSvc.error('Something went wrong.');
            }
            this.loading = false;
        } catch (error) {
            this.loading = false;
        }
    }


}