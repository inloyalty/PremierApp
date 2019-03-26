import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { TeamListingComponent } from './team/team-listing.component';
import { TeamPlayerListingComponent } from './team-player/team-player-listing.component';
 

const LOGIN_ROUTES: Routes = [
    {
        path: '', component: TeamListingComponent
    },
    {
        path: 'team-player', component: TeamPlayerListingComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(LOGIN_ROUTES)
    ],
    exports: [RouterModule]
    
})

export class TeamRoutingModule { }