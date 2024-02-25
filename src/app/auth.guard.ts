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
      }else if(res && res['auth'] && res['role']=='admin'){
        if(route.path =='login'){
          router.navigate(['admin'])
        }
        if(state[0].path=='dashboard'){
          router.navigate(['no-permission'])
        }
      }
    return true;
  } else {
    if(route.path !='login'){
    router.navigate(['login'])
    }
    return true
  }
};
