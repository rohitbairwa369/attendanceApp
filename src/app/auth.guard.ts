import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  var router = inject(Router)
  if (localStorage.getItem('token')) {
    const res = JSON.parse(localStorage.getItem('token'))
      if(res && res['auth'] && res['role']=='user'){
        const currentRoute:any = window.location.pathname;
        if(currentRoute[0].path=='admin'){
          router.navigate(['no-permission'])
        }
        if(currentRoute[0].path =='login'){
          router.navigate(['dashboard'])
        }
      }else{
        router.navigate(['login']);
      }
    return true;
  } else {
    return true;
  }
};
