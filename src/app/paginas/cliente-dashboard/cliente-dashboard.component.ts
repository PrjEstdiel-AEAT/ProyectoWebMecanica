import { Component } from '@angular/core';

@Component({
  selector: 'app-cliente-dashboard',
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.scss']
})
export class ClienteDashboardComponent {
  usuario = { nombre: 'Usuario Ejemplo' };
  // TODO: Reemplazar por obtención real de usuario autenticado
}
