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
import { MydSideDrawerModule } from 'src/app/shared/modules/myd-side-drawer/myd-side-drawer.module';
import { RemoteImagePipe } from 'src/app/shared/pipes/remote-image.pipe';
import { MydListModule } from 'src/app/shared/modules/myd-list/myd-list.module';
import { ImageModule } from 'src/app/shared/modules/image/image.module';
import { SharedDirectiveModule } from 'src/app/shared/directives/shared.directive.module';
import { SharedPipeModule } from 'src/app/shared/pipes/shared.pipe.module';
import { LeagueRoutingModule } from './league-routing.module';
import { LeagueComponent } from './league/league.component';
import { LeageService } from './league.service';
import { LeagueMatchListingComponent } from './league-match/league-match-listing.component';
import { LeageMatchAddEditComponent } from './league-match/league-match-add-edit.component';
import { MydSegmentedButtonModue } from 'src/app/shared/modules/myd-segmented-button/myd-segmented-button.module';
import { LeagueMatchEventsComponent } from './league-events/league-events.component';
import { MatchScoreAddEditComponent } from './match-score/match-score-add-edit.component';
import { MatchScoreResultComponent } from './match-score/match-score-result.component';
import { MatchScoreIndividualAddEditComponent } from './match-score/match-score-individual-add-edit.component';
import { MatchScoreResultIndividualComponent } from './match-score/match-score-result-individual.component';
import { MydProgressBarModule } from 'src/app/shared/modules/myd-progress-bar/myd-progress-bar.module';
import { ChartModule } from 'angular-highcharts';


@NgModule({
    declarations: [LeagueComponent, LeagueMatchListingComponent, LeageMatchAddEditComponent
        , LeagueMatchEventsComponent, MatchScoreAddEditComponent, MatchScoreResultComponent
    ,MatchScoreIndividualAddEditComponent,MatchScoreResultIndividualComponent],
    imports: [CommonModule, FormsModule, NgSelectModule,MydProgressBarModule,ChartModule, BsDatepickerModule.forRoot(), CommandBarModule,
        MydTabModule, MydSideDrawerModule, MydListModule, ImageModule, SharedDirectiveModule, SharedPipeModule
        , MydSegmentedButtonModue],
    exports: [LeagueRoutingModule],
    providers: [NavigationService, HttpRestClientService, LocalStorageService, ToastrService, RemoteImagePipe, LeageService],
    entryComponents: []
})

export class LeagueModule { }