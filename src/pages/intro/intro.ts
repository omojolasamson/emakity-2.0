import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import { LanguageServiceProvider } from '../../providers/language-service/language-service';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public langserv : LanguageServiceProvider,  translate: TranslateService) {
    langserv.getdefaultlang();
    translate.setDefaultLang(langserv.defaultlang);
    this.langserv.changelang('en');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }

  changelang(lang:string){
    this.langserv.changelang(lang);
    this.navCtrl.setRoot(HomePage);
  }

}
