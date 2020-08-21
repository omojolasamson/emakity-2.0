import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { HkApiproviderProvider } from '../../providers/hk-apiprovider/hk-apiprovider';
import { ProductsPage } from '../products/products';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  
  postData={
    "user_id":"",
    "token":"",
  }
  
  baseUrlImage: any;
  itemsuperqty: number;
  userDetails: any;
  resposeData: any;
  categoryFullData: any;

  constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
    public alertCtrl: AlertController,
    public auth:HkApiproviderProvider,
    public toastController:ToastController,
    public loadingCtrl : LoadingController
	) {

    this.itemsuperqty = 1;
    this.baseUrlImage = auth.getimage();
    if(localStorage.getItem('userData')){
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
    }

    this.postData.token = HkApiproviderProvider.gettoken();
    this.getcategorydata();
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }


  public getcategorydata()
  {
    let zest = this.loadingCtrl.create({
      content: "Getting Data..",
      duration:20000,
      spinner:'crescent'
    });  
  
    zest.present();
  
      this.auth.postData(this.postData, "getcategory").then((result) => {
          this.resposeData = result;
          this.categoryFullData = this.resposeData.Data;
          console.log(this.categoryFullData);
          zest.dismiss();
      }, (err) => {
        zest.dismiss();
      });
  }

  opencategory(category, cname){
    this.navCtrl.push(ProductsPage,{
      category : category,
      cname : cname
    });
  }

}
