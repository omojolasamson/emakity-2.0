import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NotificationsPage } from '../pages/notifications/notifications';
import { OrderHistoryPage } from '../pages/order-history/order-history';
import { ContactPage } from '../pages/contact/contact';
import { FeedbackPage } from '../pages/feedback/feedback';
import { HomePage } from '../pages/home/home';
import { OffersPage } from '../pages/offers/offers';
import { IntroPage } from '../pages/intro/intro';
import { TermsPage } from '../pages/terms/terms';
import { PaymentPage } from '../pages/payment/payment';
import { Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { HkApiproviderProvider } from '../providers/hk-apiprovider/hk-apiprovider';
import { CategoryPage } from '../pages/category/category';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  validEmail:any;
  rootPage: any = IntroPage;

  fname = "Client";

  pages: Array<{title: string, component: any}>;

  apptoken = {"token":""};

  constructor(public events: Events, public platform: Platform, public app:App, public toastCtrl: ToastController, public loadingCtrl:LoadingController, public alertCtrl:AlertController,  public statusBar: StatusBar, public splashScreen: SplashScreen, translate: TranslateService) {
    this.initializeApp();
    translate.setDefaultLang('en');
    this.apptoken.token = HkApiproviderProvider.gettoken();
    localStorage.setItem('appconfig', JSON.stringify(this.apptoken));
    events.subscribe('userinfo', (user) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      this.fname = user;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#307722');
      this.splashScreen.hide();
    });
  }
  
  onclickHome(){
    this.nav.setRoot(HomePage);
  }

  onclickcategory(){
    this.nav.push(CategoryPage);
  }

  onclickMyOrder(){
    this.nav.push(OrderHistoryPage);
  }

  openContact(){
    this.nav.push(ContactPage);
  }

  onclickNoti(){
    this.nav.push(NotificationsPage);
  }

  openfeedback(){
    this.nav.push(FeedbackPage);
  }

  openoffers(){
    this.nav.push(OffersPage);
  }

  openterms(){
    this.nav.push(TermsPage);
  }

  openprivacy(){
    this.nav.push(TermsPage);
  }


  dologout(){
    localStorage.removeItem('userData');
    this.nav.setRoot(HomePage);
  }

  dologin(){
    this.nav.push(LoginPage);
  }




  checkLogin(){
    if(localStorage.getItem('userData')){
      return true;
    }else{
      return false;
    }
  }

}
