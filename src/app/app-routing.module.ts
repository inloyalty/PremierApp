import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const ROUTES: Routes = [
  {
    path: '', loadChildren: './modules/layout/home/home.module#HomeModule'
  },
  {
    path: 'home', loadChildren: './modules/layout/home/home.module#HomeModule'
  },
  {
    path: 'login', loadChildren: './modules/layout/login/login.module#LoginModule'
  },
  {
    path: '', loadChildren: './modules/layouts/secure-layout/secure-layout.module#SecureLayoutModule'
  }
];


export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(ROUTES, { useHash: true });
