import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EncryptorService } from './shared/services/encryptor.service';
import { HttpRestClientService } from './shared/services/http-rest-client.service';
import { LocalStorageService } from './shared/services/local-storage.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './shared/interceptors/request.interceptor';
import { ConfirmationDialogComponent } from './shared/modules/confirmation-dialog/confirmation-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeModule } from './modules/home/home.module';
@NgModule({
  declarations: [
    AppComponent,ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // import HttpClientModule after BrowserModule.
    HttpClientXsrfModule.withOptions({
      cookieName: 'My-Xsrf-Cookie',
      headerName: 'My-Xsrf-Header',
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot() // ToastrModule added
    ,NgbModule.forRoot()
  ],
  providers: [HttpClient, EncryptorService, HttpRestClientService, LocalStorageService
  , { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },],
  bootstrap: [AppComponent],
  entryComponents: [ ConfirmationDialogComponent ],
})
export class AppModule { }
