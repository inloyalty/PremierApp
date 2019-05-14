import { Component, ChangeDetectorRef, AfterViewChecked, OnInit, ViewChild } from "@angular/core";
import { TeamService } from '../team.service';
import { ToastrService } from 'ngx-toastr';
import { RemoteImagePipe } from 'src/app/shared/pipes/remote-image.pipe';
import { LookupService } from '../../shared/services/lookup.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { UtilService } from 'src/app/shared/services/util.service';
import { MydListComponent } from 'src/app/shared/modules/myd-list/myd-list.component';
import { Filter, LookupFilter } from 'src/app/models/filter';
import { ConfirmationDialogService } from 'src/app/shared/modules/confirmation-dialog/confirmation-dialog.service';

@Component({
    templateUrl: './team-player-listing.component.html',
    providers: [LookupService, UtilService]
})

export class TeamPlayerListingComponent implements AfterViewChecked, OnInit {

    public windowHeight = (window.innerHeight - 128).toString();
    public cardHeight = (window.innerHeight - 205).toString();

    public forgotPasswordModel: any = {};
    public teamPlayer: any = {};
    imageUser: any;
    public showDrader = false;
    showResetButton: boolean;
    UserImage: any;
    teams = [];
    totalRecords: number = 0;
    headerItems: any = [
        { title: 'Image', 'sortable': true, 'width': null, 'widthClass': 'col-1', 'sortBy': 'document_title', id: "1" },
        { title: 'First Name', 'sortable': true, 'width': null, 'widthClass': 'col-2', 'sortBy': 'doc_status_id', id: "2" },
        { title: 'Last Name', 'sortable': true, 'width': null, 'widthClass': 'col-2', 'sortBy': 'document_creation_date', id: "3" },
        { title: 'Shirt Nr', 'sortable': true, 'width': null, 'widthClass': 'col-2', 'sortBy': 'document_creation_date', id: "3" },
        { title: 'Country', 'sortable': true, 'width': null, 'widthClass': 'col-2', 'sortBy': 'document_creation_date', id: "3" },

        { title: 'Date of Birth', 'sortable': true, 'width': null, 'widthClass': 'col-2', 'sortBy': 'document_creation_date', id: "3" },
        { title: '', 'sortable': false, 'width': null, 'widthClass': 'col-2 float-right', 'sortBy': ' ' },
    ]
    countries: any;
    states: any;
    public bsConfig: Partial<BsDatepickerConfig>;
    teamPlayers: any;
    dateOfBirth: any;
    @ViewChild('mydList') public mydList: MydListComponent;
    public filter: any = new Filter();
    public hasNextPage = true;
    public lookupFilter: any = new LookupFilter();
    public loading = false;

    constructor(
        private cdRef: ChangeDetectorRef,
        private teamSvc: TeamService,
        private toastrSvc: ToastrService,
        private remoteImagePipe: RemoteImagePipe,
        private lookupSvc: LookupService,
        private utilSvc: UtilService,
        private confirmationDialogSvc: ConfirmationDialogService

    ) {
        this.bsConfig = this.utilSvc.getBsDatepickerConfig();
    }
    ngOnInit(): void {
        this.getTeamPlayers();
        this.getCountries();
        this.getTeams();

    }

    ngAfterViewChecked() {
        this.cardHeight = (window.innerHeight - 155).toString();;
        this.windowHeight = (window.innerHeight - 80).toString();
        this.cdRef.detectChanges();
    }

    onClose(event: any) {
        this.showDrader = false;
    }
    onAddteamPlayer() {
        this.showDrader = true;
        this.teamPlayer = {};
    }
    async  saveTeamPlayer() {

        if (this.dateOfBirth) {
            this.teamPlayer.dateOfBirth = this.dateOfBirth.toyyyymmdd()
        }


        const teamFormData = {
            'dto': JSON.stringify(this.teamPlayer),
            'file': this.UserImage,
        };
        this.UserImage = null;
        this.imageUser = null

        let apiResponse = await this.teamSvc.saveTeamPlayer(teamFormData);
        if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
            this.toastrSvc.success('Saved successfully');


        }
        this.filter.PageIndex = 1;
        this.mydList.clear();
        this.getTeamPlayers();
        this.showDrader = false;
    }

    async  getTeamPlayers() {

        let apiResponse = await this.teamSvc.getTeamPlayers(this.filter);
        if (apiResponse && apiResponse.data && apiResponse.data.length > 0) {
            apiResponse.data.forEach(item => {
                item.imageIcon = this.remoteImagePipe.transform(item.image, "TeamPlayers");
            });
            this.teamPlayers = apiResponse.data;
        }
        this.totalRecords = apiResponse.filter.page.totalRecords;

        if (apiResponse && apiResponse.data && apiResponse.data.length >= 20) {
            this.hasNextPage = true;
        }
        else {
            this.hasNextPage = false;
        }
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
        if (this.hasNextPage) {
            this.filter.PageIndex = this.filter.PageIndex + 1;
            this.getTeamPlayers();
        }
    }

    onCountryChange(event: any) {
        console.log(event);
        this.getState(event.id);
    }
    public async getCountries() {
        try {
            let apiResponse = await this.lookupSvc.getCoutries();
            console.log(apiResponse)
            this.countries = apiResponse.data;
        } catch (error) {

        }

    }

    public async getState(countryId: null) {
        try {
            let apiResponse = await this.lookupSvc.getStatesByCountryId(countryId);
            this.states = apiResponse.data;

        } catch (error) {

        }
    }

    public async getTeams() {
        try {
            let apiResponse = await this.teamSvc.getTeams(this.lookupFilter);
            console.log(apiResponse)
            this.teams = apiResponse.data;
        } catch (error) {

        }

    }
   async onEdit(item: any) {
        console.log(item);
        if(item != null)
        {
            this.teamPlayer = item;
            this.imageUser = item.imageIcon;
           await this.getState(item.countryId)
        }
        else
        {
            this.teamPlayer ={}; 
        }
        
        this.showDrader = true;
    }

    onDelete(id: any) {
        this.openConfirmationDialog(id);
    }

    public openConfirmationDialog(id: any) {
        this.confirmationDialogSvc.confirm('Delete Team Player', 'Do you really want to delete this record?')
            .then(confirmed => {
                console.log('User confirmed:', confirmed)
                if (confirmed == true) {
                    this.deleteTeam(id)
                }
            })
            .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }

    async deleteTeam(id: number) {
        try {
            this.loading = true;
            let apiResponse = await this.teamSvc.deleteTeamPlayer(id);
            if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
                this.toastrSvc.success('Record deleted successfully');
                this.mydList.clear();
                await this.getTeamPlayers();
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