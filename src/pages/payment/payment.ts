import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';


/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  customer_id: any;
  token_url: any;

  country: any;
  countryOpts: { title: string, subTitle: string }

  state: any;
  stateOpts: { title: string, subTitle: string }

  address1: string;
  address2: string;
  city: string;
  zipcode: string;

  form : FormGroup;

  validation_messages = {
    'address1': [{ type: 'required', message: 'Please enter a billing address1.' }],
    'address2': [{ type: 'required', message: 'Please enter a billing address2.' }],
    'country': [{ type: 'required', message: 'Please select a  country.' }],
    'city': [{ type: 'required', message: 'Please enter a  city.' }],
    'state': [{ type: 'required', message: 'Please select a  state.' }],
    'zipcode': [{ type: 'required', message: 'Please enter a  Zip code.' }]

}
  amount : any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private storage: Storage, public formBuilder: FormBuilder) {
    this.amount = this.navParams.get("amount");
    this.countryOpts = {
      title: 'Country',
      subTitle: 'Select any one please'
    };
    this.stateOpts = {
      title: 'State',
      subTitle: 'Select any one please'
    };

    this.form = this.formBuilder.group({
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required]
    });

    // Initial value for the field.
    // this.form.get('address1').setValue(!null);
    

    // console.log(this.address1, this.address2, this.city, this.zipcode);
    this.storage.get("customer_id").then(val => {
      if (val) {
        this.token_url = "http://localhost:3000/api/gettoken?customer_id=" + val;
        this.customer_id = val;

      }
      else {
        this.customer_id = null;
      }
    })
      .catch(error => {
        this.customer_id = null;
      })

  }

  ionViewDidLoad() {

  }
  stpSelect() {
    console.log('STP selected');
  }
  stateSelect() {
    console.log('State selected');
  }

  pay() {
    console.log(this.customer_id);
    console.log(this.country, this.address1, this.address2, this.city, this.state, this.zipcode);
    if (this.country && this.address1 && this.address2 && this.city && this.state && this.zipcode) {
      this.http.get('http://localhost:3000/api/validation/?customer_id=' + this.customer_id +
        "&country=" + this.country + "&address1=" + this.address1 + "&address2=" + this.address2 +
        "&city=" + this.city + "&state=" + this.state + "&zipcode=" + this.zipcode)
        .pipe(map(res => res.json())
        ).subscribe(response => {
          if (!response.error) {
            console.log("success");
          }
          else {
            console.log("error");
          }
        });
    }
    else {
      console.log("Input numbers please....");
    }

  }

  


  /*
   * Save form values.
   */
  save() {
    if (this.form.valid) {
      // Save your values, using this.form.get('address1').value;
    }
  }

  onPaymentStatus(event) {
    console.log(event);
    location.reload();
  }

}
