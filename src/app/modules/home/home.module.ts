import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
 
import { NavigationService } from 'src/app/shared/services/navigation.service';
 
import { HttpRestClientService } from 'src/app/shared/services/http-rest-client.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from "ngx-bootstrap";
 
import { SharedDirectiveModule } from 'src/app/shared/directives/shared.directive.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';


@NgModule({
    declarations: [HomeComponent],
    imports: [ CommonModule, FormsModule,NgSelectModule,BsDatepickerModule.forRoot(),SharedDirectiveModule],
    exports: [HomeRoutingModule],
    providers: [NavigationService,HttpRestClientService,LocalStorageService],
    entryComponents: []
})

export class HomeModule { }