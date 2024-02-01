import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { NoPermissionComponent } from './shared/no-permission/no-permission.component';
import { authGuard } from './auth.guard';
import { UserComponent } from './user/user.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';

export const routes: Routes = [
    {
        redirectTo:"login",
        pathMatch:"full",
        path:""
    },
    {
        path: "login",
        loadComponent:()=>import('./login/login.component').then(mod=>mod.LoginComponent),
        canMatch:[authGuard]
    },
    {
        path: "",
        component: UserComponent,
        children:[
            {
                path:'dashboard', 
                loadComponent:()=>import('./user/dashboard/dashboard.component').then(mod=>mod.DashboardComponent)
            },
            {
                path:'profile', 
                loadComponent:()=>import('./user/user-profile/user-profile.component').then(mod=>mod.UserProfileComponent)
            },
        ],
        canMatch:[authGuard]
    },
    {
        path: "admin",
        loadComponent:()=>import('./admin/admin.component').then(mod=>mod.AdminComponent),
        canMatch:[authGuard]
    },
    {
        path:'no-permission',
        loadComponent:()=>import('./shared/no-permission/no-permission.component').then(mod=>mod.NoPermissionComponent)
    }


];
