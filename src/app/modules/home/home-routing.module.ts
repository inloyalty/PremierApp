import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const LOGIN_ROUTES: Routes = [
    {
        path: '', component: HomeComponent
    }
     
]

@NgModule({
    imports: [
        RouterModule.forChild(LOGIN_ROUTES)
    ],
    exports: [RouterModule]
    
})

export class HomeRoutingModule { }