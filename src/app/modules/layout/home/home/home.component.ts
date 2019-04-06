import { Component } from "@angular/core";
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
    templateUrl:'./home.component.html',
    styleUrls:[ "./home.component.css"],
    providers:[NavigationService]
})

export class HomeComponent
{
    constructor(
        private navigationSvc:NavigationService
    )
    {

    }


   
}