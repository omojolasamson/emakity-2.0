import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable()
export class LanguageServiceProvider {

  defaultlang : string

  constructor(public http: HttpClient, public translate: TranslateService) {
    this.defaultlang = "en"
  }

  getdefaultlang(){
  	this.defaultlang = "en";
  }

  changelang(lang : string){
  	this.translate.setDefaultLang(lang);
  	console.log(this.translate.defaultLang)
  }
}