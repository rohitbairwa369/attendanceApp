import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

export const authGuard: CanMatchFn = (route, state) => {
  var router = inject(Router)
  if (localStorage.getItem('token')) {
    const res = JSON.parse(localStorage.getItem('token'))
      if(res && res['auth'] && res['role']=='user'){
        if(route.path=='admin'){
          router.navigate(['no-permission'])
        }
        if(route.path =='login'){
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
