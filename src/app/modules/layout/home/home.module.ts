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
import { TopNavModule } from '../../shared/modules/top-nav/top-nav.module';
import { FooterModule } from '../../shared/modules/footer/footer.module';
import { WorkComponent } from './work/work.component';
import { SupportComponent } from './support/support.component';
import { PricingComponent } from './pricing/pricing.component';
import { FindTeamsComponent } from './find-teams/find-teams.component';


@NgModule({
    declarations: [HomeComponent,WorkComponent,SupportComponent,PricingComponent, FindTeamsComponent],
    imports: [ CommonModule, FormsModule,NgSelectModule,FooterModule,TopNavModule,BsDatepickerModule.forRoot(),SharedDirectiveModule],
    exports: [HomeRoutingModule],
    providers: [NavigationService,HttpRestClientService,LocalStorageService],
    entryComponents: []
})

export class HomeModule { }