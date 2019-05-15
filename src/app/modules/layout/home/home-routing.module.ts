import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WorkComponent } from './work/work.component';
import { SupportComponent } from './support/support.component';
import { PricingComponent } from './pricing/pricing.component';
import { FindTeamsComponent } from './find-teams/find-teams.component';

const LOGIN_ROUTES: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path: 'work', component: WorkComponent
    },
    {
        path: 'support', component: SupportComponent
    },
    {
        path: 'pricing', component: PricingComponent
    },
    {
        path: 'find-teams', component: FindTeamsComponent
    }

]

@NgModule({
    imports: [
        RouterModule.forChild(LOGIN_ROUTES)
    ],
    exports: [RouterModule]

})

export class HomeRoutingModule { }