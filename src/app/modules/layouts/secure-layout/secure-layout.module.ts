import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SecureLayoutRoutingModule } from "./secure-layout.routing.module";
import { SecureLayoutComponent } from "./secure-layout.component";
import { MainMenuComponent } from "../../core/main-menu/main-menu.component";
import { TopNavbarComponent } from "../../core/top-navbar/top-navbar.component";
import { FormsModule } from "@angular/forms";
import { BsDatepickerModule } from "ngx-bootstrap";
import { UserModule } from '../../user/user.module';

@NgModule({
    declarations: [MainMenuComponent, TopNavbarComponent, SecureLayoutComponent],
    imports: [CommonModule, SecureLayoutRoutingModule,
        BsDatepickerModule.forRoot()   , FormsModule,UserModule],
        exports: [SecureLayoutRoutingModule]
})

export class SecureLayoutModule { }