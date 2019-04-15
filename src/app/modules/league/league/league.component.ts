import { Component, ChangeDetectorRef, AfterViewChecked, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { RemoteImagePipe } from 'src/app/shared/pipes/remote-image.pipe';
import { LookupService } from '../../shared/services/lookup.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { UtilService } from 'src/app/shared/services/util.service';
import { MydListComponent } from 'src/app/shared/modules/myd-list/myd-list.component';
import { LeageService } from '../league.service';
import { Filter, LookupFilter } from 'src/app/models/filter';
import { ConfirmationDialogService } from 'src/app/shared/modules/confirmation-dialog/confirmation-dialog.service';

@Component({
    templateUrl: './league.component.html',
    providers: [LookupService, UtilService,ConfirmationDialogService]
})

export class LeagueComponent implements AfterViewChecked, OnInit {

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
        { title: 'Image', 'sortable': true, 'width': null, 'widthClass': 'col-2', 'sortBy': 'document_title', id: "1" },
        { title: 'Name', 'sortable': true, 'width': null, 'widthClass': 'col-3', 'sortBy': 'doc_status_id', id: "2" },
        { title: 'Description', 'sortable': true, 'width': null, 'widthClass': 'col-3', 'sortBy': 'document_creation_date', id: "3" },
        { title: 'Created On', 'sortable': true, 'width': null, 'widthClass': 'col-2', 'sortBy': 'document_creation_date', id: "3" },
        { title: '', 'sortable': false, 'width': null, 'widthClass': 'col-2 float-right', 'sortBy': ' ' },
    ]
    countries: any;
    states: any;
    public bsConfig: Partial<BsDatepickerConfig>;
    leagues: any = [];
    dateOfBirth: any;
    @ViewChild('mydList') public mydList: MydListComponent;
    public filter: any = new Filter();
    public hasNextPage = true;
    public lookupFilter: any = new LookupFilter();

    public loading=false;

    constructor(
        private cdRef: ChangeDetectorRef,
        private leageSvc: LeageService,
        private toastrSvc: ToastrService,
        private remoteImagePipe: RemoteImagePipe,
        private lookupSvc: LookupService,
        private utilSvc: UtilService,
        private confirmationDialogSvc: ConfirmationDialogService


    ) {
        this.bsConfig = this.utilSvc.getBsDatepickerConfig();
    }
    ngOnInit(): void {
        this.getLeagues();


    }

    ngAfterViewChecked() {
        this.cardHeight = (window.innerHeight - 165).toString();;
        this.windowHeight = (window.innerHeight - 80).toString();
        this.cdRef.detectChanges();
    }

    onClose(event:any) {
        this.showDrader = false;
    }
    onAddNew() {
        this.showDrader = true;
        this.league={};
    }
    async onSave() {

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
        this.getLeagues();
        this.mydList.clear();
        this.showDrader = false;
    }

    async  getLeagues() {

        let apiResponse = await this.leageSvc.getLeagues(this.filter);
        console.log(apiResponse)
        if (apiResponse && apiResponse.data && apiResponse.data.length > 0) {

            apiResponse.data.forEach(item => {
                item.imageIcon = this.remoteImagePipe.transform(item.image, "Leagues");
            });
            this.leagues = apiResponse.data;
            console.log(this.leagues)
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


    onEdit(item: any) {
        console.log(item);
        this.league = item;
        this.imageUser = item.imageIcon;
        this.showDrader = true;
    }
    onPageChange(event: any) {
        if (this.hasNextPage) {
            this.filter.PageIndex = this.filter.PageIndex + 1;
            this.getLeagues();
        }
    }

    onDelete(id: any) {
        this.openConfirmationDialog(id);
    }

    public openConfirmationDialog(id: any) {
        this.confirmationDialogSvc.confirm('Delete League', 'Do you really want to delete this record?')
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
            let apiResponse = await this.leageSvc.deleteLeague(id);
            if (apiResponse && apiResponse.message && apiResponse.message.code == 200) {
                this.toastrSvc.success('Record deleted successfully');
                this.mydList.clear();
                await this.getLeagues();
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