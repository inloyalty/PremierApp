import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponet } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';


const LOGIN_ROUTES: Routes = [
    {
        path: '', component: DashboardComponet
    },
    {
        path: 'dashboard', component: DashboardComponet
    }
    ,
    {
        path: 'my-account', component: AccountComponent
    },
    {
        path: 'team', loadChildren: '../team/team.module#TeamModule'
    }
    ,
    {
        path: 'league', loadChildren: '../league/league.module#LeagueModule'
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(LOGIN_ROUTES)
    ],
    exports: [RouterModule]

})

export class UserRoutingModule { }