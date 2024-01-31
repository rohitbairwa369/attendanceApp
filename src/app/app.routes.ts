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
        component: LoginComponent,
        canMatch:[authGuard]
    },
    {
        path: "",
        component: UserComponent,
        children:[
            {
                path:'dashboard', 
                component: DashboardComponent
            },
            {
                path:'profile', 
                component: UserProfileComponent
            },
        ],
        canMatch:[authGuard]
    },
    {
        path: "admin",
        component: AdminComponent,
        canMatch:[authGuard]
    },
    {
        path:'no-permission',
        component: NoPermissionComponent
    }


];
