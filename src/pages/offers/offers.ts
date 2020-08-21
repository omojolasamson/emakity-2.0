import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, ModalController, AlertController, ToastController, NavParams } from 'ionic-angular';
import { HkApiproviderProvider } from '../../providers/hk-apiprovider/hk-apiprovider';
import { CartPage } from "../cart/cart";
import { HomePage } from '../home/home';
import { ProductDescPage } from '../product-desc/product-desc';

@IonicPage()
@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html',
})
export class OffersPage {

  public resposeData : any;
  public userDetails:any;

  chkckt = HomePage.checkCart;
  
  postData={
    token:"",
    user_id:""
  }

  public baseUrlImage:String;
  
  public dataSetitems : any;
  public offersFullData : any = [];

  products:any[];
  category:any="";
  iteminfo:any="";
  itemdatafull:any="";
  itemFullArray:any=[];

  itemsuperqty : Number;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public auth:HkApiproviderProvider,
    public toastController:ToastController,
    public loadingCtrl : LoadingController
	) {
    this.postData.token = HkApiproviderProvider.gettoken();
    this.itemsuperqty = 1;
    this.baseUrlImage = auth.getimage();

    if(localStorage.getItem('userData')){
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
    }

    this.getofferdata();
	}

  gotocart(){
    this.navCtrl.push(CartPage);
  }

  public getofferdata()
{
  let zest = this.loadingCtrl.create({
    content: "Getting Data..",
    duration:20000,
    spinner:'crescent'
  });  

  zest.present();

    this.auth.postData(this.postData, "offers").then((result) => {
        this.resposeData = result;
        this.offersFullData = this.resposeData.offersData;
        zest.dismiss();
    }, (err) => {
      zest.dismiss();
    });
  }

  openProductDetailPage(itemId:String,itemName:String, itemImage:String,itemDesc:String,itemQuantity:String, itemQuantityType:String, itemPrice:String, itemMrp:String, itemStock: String){
    this.navCtrl.push(ProductDescPage,{
      itemId : itemId,
      itemName : itemName,
      itemDesc : itemDesc,
      itemQuantity :itemQuantity,
      itemQuantityType:itemQuantityType,
      itemPrice : itemPrice,
      itemImage : itemImage,
      itemMrp: itemMrp,
      itemStock : itemStock
    });
  }


  addToCart(itemid:any, itemname:any, itemquantity:any, itemquantitytype:any, itemprice:any, itemimage:any) {
    HomePage.storeToCart(itemid,itemname,itemquantity,itemquantitytype,itemprice, itemimage, this.itemsuperqty);
    this.showAddCartMsg();
  }

  showAddCartMsg(){
    let toast = this.toastController.create({
      message: "Product Added to Cart!",
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  cartCounterManager(){
    return HomePage.cartData.length
  }
  

  getitemQuantity(itemid){
    for(let item of HomePage.cartData){
      if(item.itemid == itemid)
      return item.Mquantity;
    }
    return 0;
  }

  public static checkCart(itemid){

    let result;

    for (var val of HomePage.cartData) {
      if(val.itemid == itemid){
          result = true;
          break;
      }
      else{
        result = false
      }
    }
  }

  changeProductQty(itemid, change){
    let i = 0;
    for(let item of HomePage.cartData){
      if(item.itemid == itemid){
        let qty = parseInt(item.Mquantity);
        qty += parseInt(change);
        if(qty != 0){
          item.Mquantity = qty.toString();
        }else if(qty == 0){
          console.log(item);
          HomePage.cartData.splice(i, 1);
        }
          this.toastController.create({
            message: "Cart Updated.",
            duration: 2000
          }).present();
    }
    i++;
  }
}

}

