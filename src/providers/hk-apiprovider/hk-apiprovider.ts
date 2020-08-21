import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http,Headers } from '@angular/http';

@Injectable()
export class HkApiproviderProvider {

/*   Thanks for Purchase */
/*   Buy App From Envato Get Lifetime Updates*/
/*   Tech Support : Skype : info@scurite.com */

  /*******************************
 * 
 *  Developer : Ajay randhawa
 *  Email : ajayrandhawartg@gmail.com
 *  
 *  Please don't share this script on nulled websites 
 *  Buy from Envato & appreciate Developer
 * 
 * ******************************/


 /*******  CHANGE URL HERE ***************/

  url = 'https://emakity.com/gnf';
  static token = 'dfd65117f5a90cf87c1664e5f6db4d68b2d1e70e6bc2e96f9a5e40e995b0c066';

  // GET ACTIVATION CODE FROM AUTHOR SKYPE : info@scurite.com

 /****************************************/


  baseUrl = this.url + '/app/';
  data: any;
  imagebaseurl = this.url + '/admin/itemimg/';
  bannerbaseurl = this.url + '/admin/banner/';

  /*********************************************** */

  constructor(public http: Http) {
  }

  
  postData(credentials, type){
    return new Promise((resolve, reject) =>{
      let headers = new Headers();
      this.http.post(this.baseUrl+type, JSON.stringify(credentials), {headers: headers}).
      subscribe(res =>{
        resolve(res.json());
      }, (err) =>{
        reject(err);
      });
    });
  }

  getimage(){
    return this.imagebaseurl;
  }

  getbanner(){
    return this.bannerbaseurl;
  }

  static gettoken(){
    return HkApiproviderProvider.token;
  }
  
}
