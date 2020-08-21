import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from "ionic-angular";
import { AddressPage } from "../address/address";
import { HomePage } from '../home/home';
import { HkApiproviderProvider } from "../../providers/hk-apiprovider/hk-apiprovider";
import { LoginPage } from "../login/login";

@IonicPage()
@Component({
  selector: "page-cart",
  templateUrl: "cart.html"
})
export class CartPage {

  public userDetails:any;
  
  postData={
    "token":"",
    "user_id":"",
    "amount" : 0.00
  }

  couponcode = "NO";
  couponprice = 0.00 ;


  coupons:any
  
  public resposeData: any;
  shippingcost = 0.00;

  amount = 0;
  finalamount = 0.00;

  public showtxt:boolean;
  public showcartdata:boolean;

  public baseUrlImage:String;

  cartquantity = 1;

  finalcartdata;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastController: ToastController,
    private auth: HkApiproviderProvider,
    private loadingCtrl : LoadingController
  ) {
    this.postData.token = HkApiproviderProvider.gettoken();
    if(localStorage.getItem('userData')){
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
    }
    this.baseUrlImage = auth.getimage();
    this.finalcartdata = HomePage.cartData;
    if(this.finalcartdata.length == 0){
      this.showtxt = true;
      this.showcartdata = false;
    }else{
      this.showtxt = false;
      this.showcartdata = true;
    }

    this.couponcode = HomePage.orderinfo.couponcode;
    this.couponprice = +HomePage.orderinfo.couponprice;

    this.calculatecart();
    this.getshipping();
  }

  goToCheckout() {
    HomePage.orderinfo.total = this.finalamount.toString();
    HomePage.orderinfo.shiping = this.shippingcost.toString();

    if(localStorage.getItem('userData')){
      this.navCtrl.push(AddressPage);
    }else{
      this.navCtrl.push(LoginPage);
    }
    
  }


  // Calaculate Cart Data

    calculatecart(){
      this.amount = 0;
      for(let item of this.finalcartdata){
        this.amount += parseInt(item.itemprice) * parseInt(item.Mquantity); 
      }
        this.finalamount = +this.amount + +this.shippingcost;
        this.finalamount = +this.finalamount - +this.couponprice;

  }
  

  // Empty Cart

    emptycart(){
      HomePage.cartData = [];
      this.navCtrl.popToRoot();
    }


    // Increment and Decrement Product Quantity
  
    changeQty(i, change){
  
        let qty = parseInt(this.finalcartdata[i].Mquantity);
        qty += parseInt(change);
  
        if(qty != 0){
          this.finalcartdata[i].Mquantity = qty.toString();
          this.calculatecart();
        }else if(qty == 0){
          this.finalcartdata.splice(i, 1);
          this.calculatecart();
          if(this.finalcartdata.length == 0){
            this.navCtrl.pop();
          }
        }
    
          this.toastController.create({
            message: "Cart Updated.",
            duration: 2000
          }).present();

          this.getshipping();
      }


      // Get Shipping Cost From Server

      getshipping(){
       this.postData.amount = this.finalamount;
        let zest = this.loadingCtrl.create({
          content: "Updating Cart..",
          duration:20000,
          spinner:'crescent'
        });  
      
        zest.present();
          this.auth.postData(this.postData, "getshipping").then((result) => {
              this.resposeData = result;
              this.shippingcost = this.resposeData.shipCost;
              this.coupons = this.resposeData.coupons;
              this.calculatecart();
              zest.dismiss();
          }, (err) => {
            zest.dismiss();
          });
      }


      applycoupon(code, rate){
        this.couponcode = code;
        this.couponprice = rate;
        HomePage.orderinfo.couponcode = code;
        HomePage.orderinfo.couponprice = rate;
        this.calculatecart();
      }

}
