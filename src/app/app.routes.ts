import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { NuestrosServicios } from './paginas/nuestros-servicios/nuestros-servicios';
import { Nosotros } from './paginas/nosotros/nosotros';
import { Contacto } from './paginas/contacto/contacto';
import { Login } from './paginas/login/login';
import { Registro } from './paginas/registro/registro';
import { ReservasComponent } from './paginas/cliente-reservas/reservas';
import { AuthGuard } from './auth.guard';

import { DashboardAdminComponent } from './paginas/dashboard-admin/dashboard-admin.component';
import { AdminLayoutComponent } from './paginas/admin-layout/admin-layout.component';



import { ClienteHistorialComponent } from './paginas/cliente-historial/cliente-historial.component';
import { ClientePerfilComponent } from './paginas/cliente-perfil/cliente-perfil.component';
import { ClienteLayoutComponent } from './paginas/cliente-layout/cliente-layout.component';

export const routes: Routes = [
    {
        path:'',
        component: Inicio
    }
    ,
    {
        path:'nuestros-servicios',
        component: NuestrosServicios
    }
    ,
    {
        path: 'nosotros',
        component: Nosotros
    }
    ,
    {
        path: 'contacto',
        component: Contacto
    }
    ,
    {
        path: 'login',
        component: Login
    }
    ,
    {
        path: 'registro',
        component: Registro
    }
    ,
    {
        path: 'reservas',
        component: ReservasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'dashboard-admin',
        component: DashboardAdminComponent
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadComponent: () => import('./paginas/dashboard-admin/dashboard-admin.component').then(m => m.DashboardAdminComponent) },
            { path: 'usuarios', loadComponent: () => import('./paginas/admin-usuarios/admin-usuarios.component').then(m => m.AdminUsuariosComponent) },
            { path: 'reservas', loadComponent: () => import('./paginas/admin-reservas/admin-reservas.component').then(m => m.AdminReservasComponent) },
            { path: 'servicios', loadComponent: () => import('./paginas/admin-servicios/admin-servicios.component').then(m => m.AdminServiciosComponent) },
            { path: 'mecanicos', loadComponent: () => import('./paginas/admin-mecanicos/admin-mecanicos.component').then(m => m.AdminMecanicosComponent) },
            { path: 'configuracion', loadComponent: () => import('./paginas/admin-configuracion/admin-configuracion.component').then(m => m.AdminConfiguracionComponent) }
        ]
    },
    {
        path: 'cliente',
        canActivate: [AuthGuard],
        component: ClienteLayoutComponent,
        children: [
            { path: '', redirectTo: 'perfil', pathMatch: 'full' },
            { path: 'reservar-servicio', loadComponent: () => import('./paginas/reservar-servicio/reservar-servicio.component').then(m => m.ReservarServicioComponent) },
            { path: 'historial', component: ClienteHistorialComponent },
            { path: 'perfil', component: ClientePerfilComponent }
        ]
    },
    {
        path: 'mecanico',
        loadComponent: () => import('./paginas/mecanico-layout/mecanico-layout.component').then(m => m.MecanicoLayoutComponent),
        children: [
            { path: '', redirectTo: 'perfil', pathMatch: 'full' },
            { path: 'perfil', loadComponent: () => import('./paginas/mecanico-perfil/mecanico-perfil.component').then(m => m.MecanicoPerfilComponent) },
            { path: 'reservas', loadComponent: () => import('./paginas/mecanico-reservas/mecanico-reservas.component').then(m => m.MecanicoReservasComponent) }
        ]
    },
    {
        path: '**',
        redirectTo: ''  
    }
];