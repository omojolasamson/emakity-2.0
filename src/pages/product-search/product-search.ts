import { Component } from "@angular/core";
import {
  IonicPage,
  LoadingController,
  NavController,
  ModalController,
  AlertController,
  ToastController,
  NavParams
} from "ionic-angular";
import { CartPage } from "../cart/cart";
import { ProductDescPage } from "../product-desc/product-desc";
import { HomePage } from "../home/home";
import { HkApiproviderProvider } from "../../providers/hk-apiprovider/hk-apiprovider";

@IonicPage()
@Component({
  selector: "page-product-search",
  templateUrl: "product-search.html"
})
export class ProductSearchPage {

  public resposeData: any;
  public userDetails: any;

  postData = {
    token: "",
    user_id:"",
    squery: ""
  };
  public searchFullData: any = [];
  public baseUrlImage:String;

  itemsuperqty: Number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public auth: HkApiproviderProvider,
    public toastController: ToastController,
    public loadingCtrl: LoadingController
  ) {
    this.itemsuperqty = 1;
    this.baseUrlImage = auth.getimage();
    if(localStorage.getItem('userData')){
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
    }
    this.postData.token = HkApiproviderProvider.gettoken();
  }

  openCartPage() {
    this.navCtrl.push(CartPage);
  }

  public searchProduct(){

    let zest = this.loadingCtrl.create({
      content: "Getting Data..",
      duration: 20000,
      spinner: "crescent"
    });

    zest.present();

    this.auth.postData(this.postData, "searchproduct").then(
      result => {
        this.resposeData = result;
        this.searchFullData = this.resposeData.SearchData;
        zest.dismiss();
      },
      err => {
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
    itemPrice: String
  ) {
    this.navCtrl.push(ProductDescPage, {
      itemId: itemId,
      itemName: itemName,
      itemDesc: itemDesc,
      itemQuantity: itemQuantity,
      itemQuantityType: itemQuantityType,
      itemPrice: itemPrice,
      itemImage: itemImage
    });
  }

  addToCartProd(itemid:any, itemname:any, itemquantity:any, itemquantitytype:any, itemprice:any, itemimage:any) {
    if(HomePage.checkCart(itemid) != true){
      HomePage.storeToCart(itemid,itemname,itemquantity,itemquantitytype,itemprice, itemimage, this.itemsuperqty);
      let toast = this.toastController.create({
        message: "Product Added to Cart!",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }else{
      let toast = this.toastController.create({
        message: "Product Already in Cart!",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  buynow(itemid:any, itemname:any, itemquantity:any, itemquantitytype:any, itemprice:any, itemimage:any) {
    if(HomePage.checkCart(itemid) != true){
      HomePage.storeToCart(itemid,itemname,itemquantity,itemquantitytype,itemprice, itemimage, this.itemsuperqty);
    }
    this.navCtrl.push(CartPage)
  }

  showAddCartMsg() {
    let toast = this.toastController.create({
      message: "Product Added to Cart!",
      duration: 3000,
      position: "bottom"
    });

    toast.present();
  }

  cartCounterManager(){
    return HomePage.cartData.length
  }
}
