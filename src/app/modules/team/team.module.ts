import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { HttpRestClientService } from 'src/app/shared/services/http-rest-client.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from "ngx-bootstrap";
import { CommandBarModule } from '../core/command-bar/command-bar.module';
import { ToastrService } from 'ngx-toastr';
import { MydTabModule } from 'src/app/shared/modules/myd-tab/myd-tab.module';
import { TeamRoutingModule } from './team-routing.module';
import { TeamListingComponent } from './team/team-listing.component';
import { MydSideDrawerModule } from 'src/app/shared/modules/myd-side-drawer/myd-side-drawer.module';
import { TeamService } from './team.service';
import { RemoteImagePipe } from 'src/app/shared/pipes/remote-image.pipe';
import { MydListModule } from 'src/app/shared/modules/myd-list/myd-list.module';
import { ImageModule } from 'src/app/shared/modules/image/image.module';
import { SharedDirectiveModule } from 'src/app/shared/directives/shared.directive.module';
import { SharedPipeModule } from 'src/app/shared/pipes/shared.pipe.module';
import { TeamPlayerListingComponent } from './team-player/team-player-listing.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from 'src/app/shared/modules/confirmation-dialog/confirmation-dialog.service';


@NgModule({
    declarations: [TeamListingComponent ,TeamPlayerListingComponent],
    imports: [CommonModule, FormsModule, NgSelectModule, BsDatepickerModule.forRoot(), CommandBarModule,
        MydTabModule , MydSideDrawerModule,MydListModule,ImageModule,SharedDirectiveModule,SharedPipeModule
    ],
    exports: [TeamRoutingModule],
    providers: [NavigationService, HttpRestClientService, LocalStorageService, 
        ToastrService,TeamService,RemoteImagePipe,ConfirmationDialogService],
    entryComponents: []
})

export class TeamModule { }