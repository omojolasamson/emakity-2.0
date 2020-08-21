import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  ToastController
} from "ionic-angular";
import { HkApiproviderProvider } from "../../providers/hk-apiprovider/hk-apiprovider";
import { PaymenttypePage } from "../paymenttype/paymenttype";
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';

@IonicPage()
@Component({
  selector: "page-address",
  templateUrl: "address.html"
})
export class AddressPage {

  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy:number;
  geoAddress: string;

  responseData:any;
  areaData:any;

  //Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  postData={
    "user_id":"",
    "token":""
  }

  public userDetails:any;

  userData = {
    fname: "",
    city : "",
    area: "",
    address: "",
    mobile: "",
    dtype: "",
    lat : "",
    lng:""
  };

  constructor(
    private nativeGeocoder: NativeGeocoder, 
    private geolocation: Geolocation,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public auth: HkApiproviderProvider,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController
  ) {

    if(localStorage.getItem('userData')){
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      this.postData.token = this.userDetails.token;
      this.userData.mobile = this.userDetails.mobile;
      this.userData.fname = this.userDetails.fname;
      this.userData.address = this.userDetails.address;
      this.getgeolocation();
    }
    this.getField();
  }


  onSubmit(){
    if(this.userData.mobile != "" && this.userData.fname != "" && this.userData.address != "" && this.userData.area != "" && this.userData.city != "" && this.userData.dtype != ""){
      this.navCtrl.push(PaymenttypePage, {
        fullname : this.userData.fname,
        mobile : this.userData.mobile,
        area : this.userData.area,
        address : this.userData.address,
        city: this.userData.city,
        dtype : this.userData.dtype,
        lat : this.userData.lat,
        lng :  this.userData.lng,
      });
    }

    
    else{
      let alert = this.alertCtrl.create({
        title: 'Something Wrong',
        subTitle: 'Please fill all Details.',
        buttons: ['Dismiss']
      });
      alert.present();
    }


  }


  // Geo Location

  getgeolocation(){
    let toast = this.toastCtrl.create({
      message: "Getting Your Location....!",
      duration: 10000,
      position: 'bottom'
    });
    toast.present();
    var options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
      frequency : 30000
    };

    let me = this;

    this.geolocation.getCurrentPosition(options).then((resp) => {
        console.log(resp.coords);
        this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
        me.userData.lat = resp.coords.latitude.toString();
        me.userData.lng = resp.coords.longitude.toString();
        let toast = this.toastCtrl.create({
          message: "Your Location Fetch Success..!",
          duration: 5000,
          position: 'bottom'
        });
        toast.present();
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }


    //geocoder method to fetch address from coordinates passed as arguments
    getGeoencoder(latitude,longitude){
      this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.geoAddress = this.generateAddress(result[0]);
        this.userData.address = this.geoAddress;
        console.log(this.geoAddress);
      })
      .catch((error: any) => {
        alert('Error getting location'+ JSON.stringify(error));
      });
    }
  
    //Return Comma saperated address
    generateAddress(addressObj){
        let obj = [];
        let address = "";
        for (let key in addressObj) {
          obj.push(addressObj[key]);
        }
        obj.reverse();
        for (let val in obj) {
          if(obj[val].length)
          address += obj[val]+', ';
        }
      return address.slice(0, -2);
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

