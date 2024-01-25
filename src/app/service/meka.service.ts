import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MekaService {
  token = JSON.parse(localStorage.getItem('token'));
  apiUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  userLogin(credentials){
   return this.http.post(this.apiUrl + '/user/login',credentials);
  }
  adminRegister(credentials){
    return this.http.post(this.apiUrl + '/admin/register', credentials)
  }
  getAttendance(month,year){
    return this.http.get(this.apiUrl + `/user/attendance/${month}/${year}`,{headers:{'x-access-token':this.token.token}})
  }
  userClockIn(logdetail){
    return this.http.put(this.apiUrl + `/user/attendance`,logdetail,{headers:{'x-access-token':this.token.token}})
  }
  userClockOut(tdate,logdetail){
    return this.http.put(this.apiUrl + `/user/attendance/out/${tdate}`,logdetail,{headers:{'x-access-token':this.token.token}})
  }
}
