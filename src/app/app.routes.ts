import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { NuestrosServicios } from './paginas/nuestros-servicios/nuestros-servicios';
import { Nosotros } from './paginas/nosotros/nosotros';
import { Contacto } from './paginas/contacto/contacto';
import { Login } from './paginas/login/login';
import { Registro } from './paginas/registro/registro';

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
        path: '**',
        redirectTo: ''  
    }
];