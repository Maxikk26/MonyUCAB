import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    public http: HttpClient
  ){

   }

  // GET

  getRerport1(){
    let url = URL_SERVICIOS + '/Reporte1';
    return this.http.get(url);
  }

  getReport2_1() {
    let url = URL_SERVICIOS + '/Reporte2_1';
    return this.http.get(url);
  }

  getReport2_2() {
    let url = URL_SERVICIOS + '/Reporte2_2';
    return this.http.get(url);
  }

  //POST

  postReport5_1(json){
    let url = URL_SERVICIOS + '/Reporte5_1';
    return this.http.post(url,json);
  }

  postReport5_2(json){
    let url = URL_SERVICIOS + '/Reporte5_2';
    return this.http.post(url,json);
  }

}
