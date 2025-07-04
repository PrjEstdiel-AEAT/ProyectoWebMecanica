import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { NuestrosServicios } from './paginas/nuestros-servicios/nuestros-servicios';
import { Nosotros } from './paginas/nosotros/nosotros';
import { Contacto } from './paginas/contacto/contacto';
import { Login } from './paginas/login/login';
import { Registro } from './paginas/registro/registro';
import { ReservasComponent } from './paginas/reservas/reservas';
import { AuthGuard } from './auth.guard';

import { DashboardAdminComponent } from './paginas/dashboard-admin/dashboard-admin.component';

import { ClienteDashboardComponent } from './paginas/cliente-dashboard/cliente-dashboard.component';
import { ClienteServiciosComponent } from './paginas/cliente-servicios/cliente-servicios.component';
import { ClienteReservarComponent } from './paginas/cliente-reservar/cliente-reservar.component';
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
        path: 'cliente',
        canActivate: [AuthGuard],
        component: ClienteLayoutComponent,
        children: [
            { path: '', component: ClienteDashboardComponent },
            { path: 'servicios', component: ClienteServiciosComponent },
            { path: 'reservar', component: ClienteReservarComponent },
            { path: 'historial', component: ClienteHistorialComponent },
            { path: 'perfil', component: ClientePerfilComponent }
        ]
    },
    {
        path: '**',
        redirectTo: ''  
    }
];