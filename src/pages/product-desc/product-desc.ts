import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { CartPage } from "../cart/cart";
import { HomePage } from "../home/home";
import { HkApiproviderProvider } from "../../providers/hk-apiprovider/hk-apiprovider";

@IonicPage()
@Component({
  selector: "page-product-desc",
  templateUrl: "product-desc.html"
})
export class ProductDescPage {


  postData = {
    "token" : "",
    "itemid" : ""
  };

  chkckt = HomePage.checkCart;
  
  userDetails:any;
  resposeData:any;
  releatedData:any;

  itemId: String;
  itemName: String;
  itemDesc: String;
  itemQuantity: String;
  itemQuantityType: String;
  itemPrice: String;
  itemMrp: String;
  itemStock: String;
  itemImage: String;
  itemsuperqty : Number;

  public baseUrlImage: String;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastController: ToastController,
    private auth: HkApiproviderProvider
  ) {

    if(localStorage.getItem('userData')){
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
    }

    this.itemsuperqty = 1;
    this.baseUrlImage = auth.getimage();
    this.itemId = navParams.get("itemId");
    this.itemName = navParams.get("itemName");
    this.itemDesc = navParams.get("itemDesc");
    this.itemQuantity = navParams.get("itemQuantity");
    this.itemQuantityType = navParams.get("itemQuantityType");
    this.itemPrice = navParams.get("itemPrice");
    this.itemMrp = navParams.get("itemMrp");
    this.itemStock = navParams.get("itemStock");
    this.itemImage = navParams.get("itemImage");
    this.fetchProduct(this.itemId);
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

  ionViewDidLoad() {}

  openCartPage() {
    this.navCtrl.push(CartPage);
  }

  addtocart(itemid:any, itemname:any, itemquantity:any, itemquantitytype:any, itemprice:any, itemimage:any) {
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

  cartCounterManager(){
    return HomePage.cartData.length
  }

  changeQty(change){
    if(this.itemsuperqty != 0 && this.itemsuperqty + change != 0){
      this.itemsuperqty += change;
    }
  }
  

  public fetchProduct(itemid){
    this.postData.token = HkApiproviderProvider.gettoken();
    this.postData.itemid = itemid;
    this.auth.postData(this.postData, "getmatch").then(
      result => {
        this.resposeData = result;
        this.releatedData = this.resposeData.Data;
        console.log(this.releatedData)
      },
      err => {
      }
    );
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

  addToCart(itemid:any, itemname:any, itemquantity:any, itemquantitytype:any, itemprice:any, itemimage:any) {
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
}
