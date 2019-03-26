// import angular class, directive,pipe etc.
import { Injectable } from '@angular/core';
import {  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

// import third party class, directive,pipe etc.
// import {AppConstant}  from "src/app/modules/core/constants/app-constant";
// import the application class, directive,pipe etc.
import { LocalStorageService } from '../services/local-storage.service';
import { AppConstant } from 'src/app/modules/constants/app-constant';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private localStoreSvc: LocalStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.localStoreSvc.get(AppConstant.AUTH_TOKEN);

    // console.log(authToken)
    let authReq = req.clone();
    /*
    * The verbose way:
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });
    */
    // Clone the request and set the new header in one step.
    if(authToken !=null)
    {
      authReq = req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } });
    }

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}