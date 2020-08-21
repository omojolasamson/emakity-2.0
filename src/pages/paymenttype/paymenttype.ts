import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { HkApiproviderProvider } from '../../providers/hk-apiprovider/hk-apiprovider';
import { HomePage } from '../home/home';
import { PaymentPage } from '../payment/payment';
import { OrderConfirmPage } from '../order-confirm/order-confirm';

declare var StripeCheckout;
declare var RazorpayCheckout:any;

@IonicPage()
@Component({
  selector: 'page-paymenttype',
  templateUrl: 'paymenttype.html',
})
export class PaymenttypePage {

  order = {
    token: "",
    user_id:"",
    fname: "",
    city:"",
    area : "",
    address: "",
    mobile: "",
    total : "",
    shipping :"",
    coupon: "",
    couponprice: "",
    ptype: "",
    payid : "",
    dtype: "",
    lat: "",
    lng : "",
    items : []
  }

  resposeData :any;
  orderdataSet:any;
  public userDetails:any;
  handler:any;

  userData = {
    fname: "",
    city: "",
    area: "",
    address: "",
    mobile: ""
  };

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public auth: HkApiproviderProvider,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private paypal: PayPal
    ) {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;

    this.userData.fname = this.navParams.get('fullname');
    this.userData.mobile = this.navParams.get('mobile');
    this.userData.area = this.navParams.get('area');
    this.userData.address = this.navParams.get('address');
    this.userData.city = this.navParams.get('city');
    this.order.dtype = this.navParams.get('dtype');
    this.order.lng = this.navParams.get('lng');
    this.order.lat = this.navParams.get('lat');
  }


  // HANDLE CASH ON DELIVERY

  onCod(){
    this.order.ptype = "COD";
    this.order.token = this.userDetails.token;
    this.order.fname = this.userData.fname;
    this.order.mobile = this.userData.mobile;
    this.order.area = this.userData.area;
    this.order.address = this.userData.address;
    this.order.user_id = this.userDetails.user_id;
    this.order.city = this.userData.city;
    this.order.coupon = HomePage.orderinfo.couponcode;
    this.order.couponprice = HomePage.orderinfo.couponprice;
    this.order.total = HomePage.orderinfo.total;
    this.order.shipping  = HomePage.orderinfo.shiping;
    this.order.items = HomePage.cartData;
    let zest = this.loadingCtrl.create({
      content: "Submitting Order..",
      duration:20000,
      spinner:'crescent'
    });  

    zest.present();

    if(this.order.fname != "" && this.order.address != "" && this.order.area != "" && this.order.mobile != "" && this.order.user_id != "" && this.order.token != ""){
      this.auth.postData(this.order, "placeorder").then(
        result => {
          zest.dismiss();
          this.resposeData = result;
          if(this.resposeData.success){
            this.navCtrl.setRoot(HomePage);
            this.navCtrl.push(OrderConfirmPage,{ OrderId: this.resposeData.success });
          }else{
            console.log("Error");
          }
        },
        err => {
          zest.dismiss();
        }
      );
      }
      else{
          let alert = this.alertCtrl.create({
            title: 'Something Wrong',
            subTitle: 'Unable to Place Order.',
            buttons: ['Dismiss']
          });
          alert.present();
          zest.dismiss();
      }
  }


  // HANDLE PAYPAL (OLD PAYPAL REPLACED WITH BRAINTREE)

  payWithPaypal(){
    let amount = parseFloat(HomePage.orderinfo.total);

    this.navCtrl.push(PaymentPage, amount);
    
    /*this.paypal.init({
      PayPalEnvironmentProduction: 'YOUR KEY',
      PayPalEnvironmentSandbox: 'YOUR KEY'
    }).then(() => {
      this.paypal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
      })).then(() => {
         let payment = new PayPalPayment(amount.toString(), "PHP", 'For Grocery', 'Store2Door');
        this.paypal.renderSinglePaymentUI(payment).then((res) => {
           this.online('PAYPAL',res.response.id);
        }, (err) => {
          let alert = this.alertCtrl.create({
            title: 'Something Wrong',
            subTitle: err,
            buttons: ['Dismiss']
          });
          alert.present();

        });
      }, (err) => {
        let alert = this.alertCtrl.create({
          title: 'Something Wrong',
          subTitle: err,
          buttons: ['Dismiss']
        });
        alert.present();
      });
    }, (err) => {
      let alert = this.alertCtrl.create({
        title: 'Something Wrong',
        subTitle: err,
        buttons: ['Dismiss']
      });
      alert.present();
    });*/
  }

  // HANDLE STRIPE

  ionViewDidLoad(){
    setTimeout(() => {
      this.handler =  StripeCheckout.configure({
        key: 'YOUR KEY',
        image: 'https://stripe.com/img/documentation/checkout/marketplace.png', // Picture you want to show in pop up
        locale: 'auto',
        token: token => {
          this.online('STRIPE',token.id);
        }
      })
    }, 1000);
  }

  handlerOpen(){
    this.handler.open({
      name: 'Grocery', 
      amount: (+this.order.total * 100) + 1 
    });
  }
  onPopstate() {
    this.handler.close(); 
  }
  payButtonClickHandler(){
    this.handlerOpen(); 
  }


  // HANDLE CARD ON DELIVERY

  oncard(){
    this.order.ptype = "CARD-ON-DELIVERY";
    this.order.token = this.userDetails.token;
    this.order.fname = this.userData.fname;
    this.order.mobile = this.userData.mobile;
    this.order.area = this.userData.area;
    this.order.address = this.userData.address;
    this.order.user_id = this.userDetails.user_id;
    this.order.city = this.userData.city;
    this.order.coupon = HomePage.orderinfo.couponcode;
    this.order.couponprice = HomePage.orderinfo.couponprice;
    this.order.total = HomePage.orderinfo.total;
    this.order.shipping  = HomePage.orderinfo.shiping;
    this.order.items = HomePage.cartData;
    let zest = this.loadingCtrl.create({
      content: "Submitting Order..",
      duration:20000,
      spinner:'crescent'
    });  

    zest.present();

    if(this.order.fname != "" && this.order.address != "" && this.order.area != "" && this.order.mobile != "" && this.order.user_id != "" && this.order.token != ""){
      this.auth.postData(this.order, "placeorder").then(
        result => {
          zest.dismiss();
          this.resposeData = result;
          if(this.resposeData.success){
            this.navCtrl.setRoot(HomePage);
            this.navCtrl.push(OrderConfirmPage,{ OrderId: this.resposeData.success });
          }else{
            console.log("Error");
          }
        },
        err => {
          zest.dismiss();
        }
      );
      }
      else{
          let alert = this.alertCtrl.create({
            title: 'Something Wrong',
            subTitle: 'Unable to Place Order.',
            buttons: ['Dismiss']
          });
          alert.present();
          zest.dismiss();
      }
  }

  // HANDLE STORE PICK UP

  onstore(){
    this.order.ptype = "STORE_PICKUP";
    this.order.token = this.userDetails.token;
    this.order.fname = this.userData.fname;
    this.order.mobile = this.userData.mobile;
    this.order.area = this.userData.area;
    this.order.address = this.userData.address;
    this.order.user_id = this.userDetails.user_id;
    this.order.city = this.userData.city;
    this.order.coupon = HomePage.orderinfo.couponcode;
    this.order.couponprice = HomePage.orderinfo.couponprice;
    this.order.total = HomePage.orderinfo.total;
    this.order.shipping  = HomePage.orderinfo.shiping;
    this.order.items = HomePage.cartData;
    let zest = this.loadingCtrl.create({
      content: "Submitting Order..",
      duration:20000,
      spinner:'crescent'
    });  

    zest.present();

    if(this.order.fname != "" && this.order.address != "" && this.order.area != "" && this.order.mobile != "" && this.order.user_id != "" && this.order.token != ""){
      this.auth.postData(this.order, "placeorder").then(
        result => {
          zest.dismiss();
          this.resposeData = result;
          if(this.resposeData.success){
            this.navCtrl.setRoot(HomePage);
            this.navCtrl.push(OrderConfirmPage,{ OrderId: this.resposeData.success });
          }else{
            console.log("Error");
          }
        },
        err => {
          zest.dismiss();
        }
      );
      }
      else{
          let alert = this.alertCtrl.create({
            title: 'Something Wrong',
            subTitle: 'Unable to Place Order.',
            buttons: ['Dismiss']
          });
          alert.present();
          zest.dismiss();
      }
  }


  // SUBMIT ORDER WITH PAYID

  online(pfrom, pid){
    this.order.ptype = pfrom;
    this.order.payid = pid;
    this.order.token = this.userDetails.token;
    this.order.fname = this.userData.fname;
    this.order.mobile = this.userData.mobile;
    this.order.area = this.userData.area;
    this.order.address = this.userData.address;
    this.order.user_id = this.userDetails.user_id;
    this.order.city = this.userData.city;
    this.order.coupon = HomePage.orderinfo.couponcode;
    this.order.couponprice = HomePage.orderinfo.couponprice;
    this.order.total = HomePage.orderinfo.total;
    this.order.shipping  = HomePage.orderinfo.shiping;
    this.order.items = HomePage.cartData;
    let zest = this.loadingCtrl.create({
      content: "Submitting Order..",
      duration:20000,
      spinner:'crescent'
    });  
    zest.present();
    if(this.order.fname != "" && this.order.address != "" && this.order.area != "" && this.order.mobile != "" && this.order.user_id != "" && this.order.token != ""){
      this.auth.postData(this.order, "placeorder").then(
        result => {
          zest.dismiss();
          this.resposeData = result;
          if(this.resposeData.success){
            this.navCtrl.setRoot(HomePage);
            this.navCtrl.push(OrderConfirmPage,{ OrderId: this.resposeData.success });
          }else{
            console.log("Error");
          }
        },
        err => {
          zest.dismiss();
        }
      );
      }
      else{
          let alert = this.alertCtrl.create({
            title: 'Something Wrong',
            subTitle: 'Unable to Place Order.',
            buttons: ['Dismiss']
          });
          alert.present();
          zest.dismiss();
      }
  }


  payrazorpay() {

    let temp = HomePage.orderinfo.total;

    var amount = parseFloat(temp) * 100;

    var options = {
      description: 'Checkout',
      image: 'https://raw.githubusercontent.com/ajayrandhawa/Grocery-App-Documentation/fd562e7eb1e8e1939abd2aaa66239e1d60a96c5a/razorpay-glyph.svg',
      currency: 'INR', // your 3 letter currency code
      key: "YOUR KEY", // your Key Id from Razorpay dashboard
      amount: amount, // Payment amount in smallest denomiation e.g. cents for USD
      name: 'Grocery',
      prefill: {
        email: this.userDetails.email,
        contact: this.userDetails.mobile,
        name: this.userDetails.fname
      },
      theme: {
        color: '#3ac746'
      },
      modal: {
        ondismiss: function () {
          window.alert('dismissed')
        }
      }
    };
    let me = this;
    var successCallback = function(payment_id) {
      me.order.payid = payment_id;
      me.online('RAZORPAY',payment_id);
      me.navCtrl.push(OrderConfirmPage,{
        payid : payment_id
      });
    };
    var cancelCallback = function (error) {
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }

}
