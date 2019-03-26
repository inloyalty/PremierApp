import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const ROUTES: Routes = [
  {
    path: '',  loadChildren: './modules/home/home.module#HomeModule'
  },
  {
    path: 'home',  loadChildren: './modules/home/home.module#HomeModule'
  },
  {
    path: 'login', loadChildren: './modules/layouts/login-layout/login-layout.module#LoginLayoutModule'
  }  
  ,  
  {
    path: '', loadChildren: './modules/layouts/secure-layout/secure-layout.module#SecureLayoutModule' 
  }
];


export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(ROUTES, { useHash: true });
