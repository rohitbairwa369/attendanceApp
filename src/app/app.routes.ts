import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { NoPermissionComponent } from './shared/no-permission/no-permission.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {
        redirectTo:"login",
        pathMatch:"full",
        path:""
    },
    {
        path: "login",
        component: LoginComponent,
        canActivate:[authGuard]
    },
    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate:[authGuard]
    },
    {
        path: "admin",
        component: AdminComponent,
        canActivate:[authGuard]
    },
    {
        path:'no-permission',
        component: NoPermissionComponent
    }


];
