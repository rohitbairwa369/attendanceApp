import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MekaService {
  token = JSON.parse(localStorage.getItem('token'));
  apiUrl = environment.apiUrl;

  public UserSubject = new BehaviorSubject<Object>({});
  myUserData$ = this.UserSubject.asObservable();

  constructor(private http:HttpClient) {
    if(!this.token){
      return;
    }
  }

  updateUserData(newData: string): void {
    this.UserSubject.next(newData);
  }
  userLogin(credentials){
   return this.http.post(this.apiUrl + '/user/login',credentials);
  }
  adminRegister(credentials){
    return this.http.post(this.apiUrl + '/admin/register', credentials)
  }
  getUserData(token){
    return this.http.get(this.apiUrl + '/user',{headers:{'x-access-token':token.token}})
  }
  // verifytoken(){
  //   var result = {}
  //   this.http.get(this.apiUrl + '/verify/token',{headers:{'x-access-token':this.token.token}}).subscribe(res=>{
  //     result = res;
  //   })
  //   return result;
  // }
  getAttendance(month,year){
    return this.http.get(this.apiUrl + `/user/attendance/${month}/${year}`,{headers:{'x-access-token':this.token.token}})
  }
  userClockIn(logdetail,timeStamp){
    return this.http.put(this.apiUrl + `/user/attendance/clockin/${timeStamp.month}/${timeStamp.year}`,logdetail,{headers:{'x-access-token':this.token.token}})
  }
  userClockOut(timeStamp,logdetail){
    return this.http.put(this.apiUrl + `/user/attendance/out/${timeStamp.month}/${timeStamp.year}/${timeStamp.tdate}`,logdetail,{headers:{'x-access-token':this.token.token}})
  }
  //get notice 
  getNotice(token){
    return this.http.get(this.apiUrl + `/messages`,{headers:{'x-access-token':token.token}})
  }

  getAbsentDates(data,token){
    return this.http.get(this.apiUrl + `/user/attendance/${data.month}/${data.year}/absent`,{headers:{'x-access-token':token.token}})
  }
  requestLeave(requestedDates,token){
    return this.http.put(this.apiUrl + `/user/attendance/requestleave`,requestedDates,{headers:{'x-access-token':token.token}})
  }
}
