import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';


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
        loadComponent:()=>import('./user/user.component').then(mod=>mod.UserComponent),
        children:[
            {
                path:'dashboard', 
                loadComponent:()=>import('./user/dashboard/dashboard.component').then(mod=>mod.DashboardComponent)
            },
            {
                path:'profile', 
                loadComponent:()=>import('./user/user-profile/user-profile.component').then(mod=>mod.UserProfileComponent)
            },
            {
                path:'notice', 
                loadComponent:()=>import('./user/notice/notice.component').then(mod=>mod.NoticeComponent)
            },
            {
                path:'attendance', 
                loadComponent:()=>import('./user/attendance-report/attendance-report.component').then(mod=>mod.AttendanceReportComponent)
            },
            {
                path:'requestleave', 
                loadComponent:()=>import('./user/request-leave/request-leave.component').then(mod=>mod.RequestLeaveComponent)
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
