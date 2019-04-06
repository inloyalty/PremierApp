import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { LeagueComponent } from './league/league.component';
import { LeagueMatchListingComponent } from './league-match/league-match-listing.component';
import { LeageMatchAddEditComponent } from './league-match/league-match-add-edit.component';
import { LeagueMatchEventsComponent } from './league-events/league-events.component';
import { MatchScoreAddEditComponent } from './match-score/match-score-add-edit.component';
import { MatchScoreResultComponent } from './match-score/match-score-result.component';
import { MatchScoreIndividualAddEditComponent } from './match-score/match-score-individual-add-edit.component';
import { MatchScoreResultIndividualComponent } from './match-score/match-score-result-individual.component';
 

const LOGIN_ROUTES: Routes = [
    {
        path: '', component: LeagueComponent
    },
    {
        path: 'league-match', component: LeagueMatchListingComponent
    },
    {
        path: 'league-match-add-edit', component: LeageMatchAddEditComponent
    },
    {
        path: 'my-events', component: LeagueMatchEventsComponent
    },
    {
        path: 'match-score-add-edit', component: MatchScoreAddEditComponent
    },
    {
        path: 'match-score-result', component: MatchScoreResultComponent
    }, 
    {
        path: 'match-score-individual-add-edit', component: MatchScoreIndividualAddEditComponent
    },
    {
        path: 'match-score-result-individual', component: MatchScoreResultIndividualComponent
    },
]

@NgModule({
    imports: [
        RouterModule.forChild(LOGIN_ROUTES)
    ],
    exports: [RouterModule]
    
})

export class LeagueRoutingModule { }