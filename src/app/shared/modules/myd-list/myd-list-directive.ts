import { Directive, TemplateRef } from "@angular/core";

@Directive({selector: '[myd-select-option]'})
export class MydSelectOptionDirective {
    constructor(public template: TemplateRef<any>) {
    }
}

@Directive({selector: '[myd-select-option-selected]'})
export class MydSelectOptionSelectedDirective {
    constructor(public template: TemplateRef<any>) {
    }
}

@Directive({selector: '[myd-select-option-not-found]'})
export class MydSelectOptionNotFoundDirective {
    constructor(public template: TemplateRef<any>) {
    }
}