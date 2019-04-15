import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { HttpRestClientService } from 'src/app/shared/services/http-rest-client.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from "ngx-bootstrap";
import { DashboardComponet } from './dashboard/dashboard.component';
import { UserRoutingModule } from './user.routing.module';
import { AccountComponent } from './account/account.component';
import { CommandBarModule } from '../core/command-bar/command-bar.module';
import { ToastrService } from 'ngx-toastr';
import { MydTabModule } from 'src/app/shared/modules/myd-tab/myd-tab.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MydSideDrawerModule } from 'src/app/shared/modules/myd-side-drawer/myd-side-drawer.module';
import { ImageModule } from 'src/app/shared/modules/image/image.module';

@NgModule({
    declarations: [DashboardComponet, AccountComponent],
    imports: [CommonModule, FormsModule, NgSelectModule, BsDatepickerModule.forRoot(), CommandBarModule,
        MydTabModule,ModalModule.forRoot(), MydSideDrawerModule, ImageModule ],
    exports: [UserRoutingModule],
    providers: [NavigationService, HttpRestClientService, LocalStorageService, ToastrService],
    entryComponents: []
})

export class UserModule { }