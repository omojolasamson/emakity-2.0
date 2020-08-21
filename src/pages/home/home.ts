import { Component } from "@angular/core";
import { NavController, NavParams, LoadingController,ToastController, MenuController } from "ionic-angular";
import { CartPage } from "../cart/cart";
import { ProductsPage } from "../products/products";
import { HkApiproviderProvider } from "../../providers/hk-apiprovider/hk-apiprovider";
import { ProductDescPage } from "../product-desc/product-desc";
import { ProductSearchPage } from "../product-search/product-search";
import { OffersPage } from '../offers/offers';
import { CategoryPage } from "../category/category";
import { Events } from 'ionic-angular';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  public resposeData: any;
  userDetails:any;

  responseData:any;
  areaData:any;

  postData = {
    token : ""
  };

  static cartData = [];
  static orderinfo = {"couponcode":"NO", "couponprice":"0", "shiping" :"", "total":""};

  cartCounter  = 0;

  loginstatus = "Client";

  public baseUrlImage:String;
  public baseUrlBanner:String;

  public homeproductdataSet: any;
  public categoryFullData: any;
  public bannerFullData: any;

  public productFullData: any = [];
  moreProducts: any[];
  page: number;
  searchQuery: string = "";
  categoryList: any = "";

  itemsuperqty: Number;

  chkckt = HomePage.checkCart;


  constructor(
    public events: Events,
    public navCtrl: NavController,
    private auth: HkApiproviderProvider,
    public navPram: NavParams,
    public toastCtrl : ToastController,
    public loadingCtrl : LoadingController,
    public menuCtrl : MenuController
  ) {

    this.postData.token = HkApiproviderProvider.gettoken();
    this.itemsuperqty = 1;

    if(localStorage.getItem('userData')){
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      this.loginstatus = this.userDetails.fname;
      this.events.publish('userinfo', this.userDetails.fname);
    }
    else{
      this.loginstatus = "Client";
      this.events.publish('userinfo', 'Client');
    }

    this.menuCtrl.enable(true);
    this.baseUrlImage = auth.getimage();
    this.baseUrlBanner = auth.getbanner();
    this.getField();
    this.homepageproducts();

  }

  itemSelected(id, category) {
    this.navCtrl.push(ProductsPage, { category: id, categoryname: category });
  }

  gotocart(){
    this.navCtrl.push(CartPage);
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
          this.toastCtrl.create({
            message: "Cart Updated.",
            duration: 2000
          }).present();
    }
    i++;
  }
}

  homepageproducts() {
    let zest = this.loadingCtrl.create({
      content: "Fetching Data..",
      duration:20000,
      spinner:'crescent'
    });  
    zest.present();

    this.auth.postData(this.postData, "gethomepage").then(
      result => {
        this.resposeData = result;
        this.homeproductdataSet = this.resposeData.HomeData;
        this.categoryFullData = this.resposeData.CateData;
        this.bannerFullData = this.resposeData.BannData;
        zest.dismiss();
      },
      err => {
        console.log(err);
        zest.dismiss();
      }
    );
  }


  

  openProductDetailPage(
    itemId: String,
    itemName: String,
    itemImage: String,
    itemDesc: String,
    itemQuantity: String,
    itemQuantityType: String,
    itemPrice: String,
    itemMrp: String,
    itemStock: String
  ) {
    this.navCtrl.push(ProductDescPage, {
      itemId: itemId,
      itemName: itemName,
      itemDesc: itemDesc,
      itemQuantity: itemQuantity,
      itemQuantityType: itemQuantityType,
      itemPrice: itemPrice,
      itemImage: itemImage,
      itemMrp: itemMrp,
      itemStock: itemStock
    });
  }

  gotoproducts(category: string, cname:string) {
    this.navCtrl.push(ProductsPage, {
      category: category,
      cname: cname
    });
  }

  addToCart(itemid:any, itemname:any, itemquantity:any, itemquantitytype:any, itemprice:any, itemImage:any) {
    if(HomePage.checkCart(itemid) != true){
      HomePage.storeToCart(itemid,itemname,itemquantity,itemquantitytype,itemprice, itemImage, this.itemsuperqty);
      let toast = this.toastCtrl.create({
        message: "Product Added to Cart!",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }else{
      let toast = this.toastCtrl.create({
        message: "Product Already in Cart!",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  public static storeToCart(itemid, itemname, itemquantity, itemquantitytype, itemprice, itemImage, itemsuperqty) {
    console.log(itemsuperqty);
    var Mquantity  = itemsuperqty;
    var itemtotal = itemprice;
    HomePage.cartData.push({itemid, itemname, itemquantity, itemquantitytype, itemprice, itemtotal, itemImage, Mquantity});
  }

  getitemQuantity(itemid){
    for(let item of HomePage.cartData){
      if(item.itemid == itemid)
      return item.Mquantity;
    }
    return 0;
  }

  public static checkCart(itemid){

    var result;

    for (var val of HomePage.cartData) {
      if(val.itemid == itemid){
          result = true;
          break;
      }
      else{
        result = false
      }
    }

    return result;
  }

  gotoSearch(){
    this.navCtrl.push(ProductSearchPage);
  }

  cartCounterManager(){
    return HomePage.cartData.length
  }

  gotoOffer(){
    this.navCtrl.push(OffersPage);
  }

  opencategory(){
    this.navCtrl.push(CategoryPage);
  }

  getField() {
    let zest = this.loadingCtrl.create({
      content: "Please Wait..",
      duration: 8000,
      spinner: "crescent"
    });

    zest.present();
    this.auth.postData(this.postData, "getarea").then(
      result => {
        this.responseData = result;
        this.areaData = this.responseData.Data;
        console.log(this.areaData);
        zest.dismiss();
      },
      err => {
        zest.dismiss();
      }
    );
  }

}
