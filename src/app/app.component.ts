import { Component } from '@angular/core';
import { LocalStorageService } from './shared/services/local-storage.service';
import { AppConstant } from './modules/constants/app-constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sport-app';
  baseUrl = 'http://premierapi.coderlipi.com/api/';
 //   baseUrl = 'http://localhost:55937/api/';

  constructor(
    private localStorageSvc: LocalStorageService
  ) {
    this.localStorageSvc.set(AppConstant.API_BASE_URL, this.baseUrl);
  }
}
