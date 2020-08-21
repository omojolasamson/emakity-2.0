import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { IntroPage } from '../pages/intro/intro';
import { HomePage } from '../pages/home/home';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AddressPage } from '../pages/address/address';
import { CartPage } from '../pages/cart/cart';
import { CategoryPage } from '../pages/category/category';
import { NotificationsPage } from '../pages/notifications/notifications';
import { OrderHistoryPage } from '../pages/order-history/order-history';
import { OrderPlacedPage } from '../pages/order-placed/order-placed';
import { ProductDescPage } from '../pages/product-desc/product-desc';
import { ProductSearchPage } from '../pages/product-search/product-search';
import { ValidatorsModule } from '../validators/validators.module';
import { TextMaskModule } from 'angular2-text-mask';
import { OrderConfirmPage } from '../pages/order-confirm/order-confirm';
import { ContactPage } from '../pages/contact/contact';
import { OffersPage } from '../pages/offers/offers';
import { FeedbackPage } from '../pages/feedback/feedback';
import { ProductsPage } from '../pages/products/products';
import { HkApiproviderProvider } from '../providers/hk-apiprovider/hk-apiprovider';
import { HttpModule } from '@angular/http';
import { PaymenttypePage } from '../pages/paymenttype/paymenttype';
import { PaymentPage } from '../pages/payment/payment';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageServiceProvider } from '../providers/language-service/language-service';
import { TermsPage } from '../pages/terms/terms';
import { PayPal } from '@ionic-native/paypal';
import { NgxBraintreeModule } from 'ngx-braintree';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    IntroPage,
    LoginPage,
    RegisterPage,
    HomePage,
    AddressPage,
    CartPage,
    NotificationsPage,
    OrderHistoryPage,
    OrderPlacedPage,
    ProductDescPage,
    ProductSearchPage,
    OrderConfirmPage,
    ContactPage,
    ProductsPage,
    FeedbackPage,
    OffersPage,
    PaymenttypePage,
    PaymentPage,
    CategoryPage,
    TermsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ValidatorsModule,
    TextMaskModule,
    NgxBraintreeModule, HttpClientModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  exports: [

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IntroPage,
    LoginPage,
    RegisterPage,
    HomePage,
    AddressPage,
    CartPage,
    NotificationsPage,
    OrderHistoryPage,
    OrderPlacedPage,
    ProductDescPage,
    ProductSearchPage,
    OrderConfirmPage,
    ContactPage,
    ProductsPage,
    FeedbackPage,
    OffersPage,
    PaymenttypePage,
    PaymentPage,
    CategoryPage,
    TermsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HkApiproviderProvider,
    Geolocation,
    NativeGeocoder,
    LanguageServiceProvider,
    PayPal
  ]
})
export class AppModule {}
