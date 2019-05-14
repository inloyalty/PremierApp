import { Component, ChangeDetectorRef, AfterViewChecked, OnInit, ViewChild } from "@angular/core";
import { TeamService } from '../team.service';
import { ToastrService } from 'ngx-toastr';
import { RemoteImagePipe } from 'src/app/shared/pipes/remote-image.pipe';
import { Filter } from 'src/app/models/filter';
import { ConfirmationDialogService } from 'src/app/shared/modules/confirmation-dialog/confirmation-dialog.service';
import { MydListComponent } from 'src/app/shared/modules/myd-list/myd-list.component';

@Component({
    templateUrl: './team-listing.component.html'
})

export class TeamListingComponent implements AfterViewChecked, OnInit {

    public windowHeight = (window.innerHeight - 128).toString();
    public cardHeight = (window.innerHeight - 205).toString();

    public forgotPasswordModel: any = {};
    public team: any = {};
    imageUser: any;
    public showDrader = false;
    showResetButton: boolean;
    UserImage: any;
    teams = [];
    totalRecords: number = 0;
    headerItems: any = [
        { title: 'Image', 'sortable': true, 'width': null, 'widthClass': 'col-2', 'sortBy': 'document_title', id: "1" },
        { title: 'Name', 'sortable': true, 'width': null, 'widthClass': 'col-3', 'sortBy': 'doc_status_id', id: "2" },
        { title: 'Description', 'sortable': true, 'width': null, 'widthClass': 'col-3', 'sortBy': 'document_creation_date', id: "3" },
        { title: 'Created On', 'sortable': true, 'width': null, 'widthClass': 'col-2', 'sortBy': 'document_creation_date', id: "3" },
        { title: '', 'sortable': false, 'width': null, 'widthClass': 'col-2 float-right', 'sortBy': ' ' },
    ]
    public filter: any = new Filter();
    public hasNextPage = true;
    public loading = false;
    @ViewChild('mydList') public mydList: MydListComponent;

    constructor(
        private cdRef: ChangeDetectorRef,
        private teamSvc: TeamService,
        private toastrSvc: ToastrService,
        private remoteImagePipe: RemoteImagePipe,
        private confirmationDialogSvc: ConfirmationDialogService

    ) {

    }
    ngOnInit(): void {
        console.log(this.filter)
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
    onAddTeam() {
        this.team = {};
        this.showDrader = true;
    }
    async  saveTeam() {
        const teamFormData = {
            'dto': JSON.stringify(this.team),
            'file': this.UserImage,
        };
        this.UserImage = null;
        this.imageUser = null

        let apiResponse = await this.teamSvc.saveTeam(teamFormData);
        if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
            this.toastrSvc.success('Saved successfully');
            this.showDrader = false;

        }
    }

    async  getTeams() {

        let apiResponse = await this.teamSvc.getTeams(this.filter);
        console.log(apiResponse)
        if (apiResponse && apiResponse.data && apiResponse.data.length > 0) {

            apiResponse.data.forEach(item => {
                item.image = this.remoteImagePipe.transform(item.image, "Teams");
            });
            this.teams = apiResponse.data;

            console.log()
        }
        if (apiResponse && apiResponse.data && apiResponse.data.length >= 20) {
            this.hasNextPage = true;
        }
        else {
            this.hasNextPage = false;
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
        console.log(event);
        if (this.hasNextPage) {
            this.filter.PageIndex = this.filter.PageIndex + 1;
            this.getTeams();
        }
    }

    onEdit(item: any) {
        this.team = item;
        this.showDrader = true;
    }

    onDelete(id: any) {
        this.openConfirmationDialog(id);
    }

    public openConfirmationDialog(id: any) {
        this.confirmationDialogSvc.confirm('Delete Team', 'Do you really want to delete this record?')
            .then(confirmed => {
                console.log('User confirmed:', confirmed)
                if(confirmed ==true)
                {
                    this.deleteTeam(id)
                }
            })
            .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }

    async deleteTeam(id :number)
     {
         try {
             this.loading=true;
            let apiResponse = await this.teamSvc.deleteTeam(id);
            if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
                this.toastrSvc.success('Record deleted successfully');
                this.mydList.clear();
               await this.getTeams();
                this.showDrader = false;
    
            }
            this.loading=false;
         } catch (error) {
            this.loading=false;
         }
       
     }

}