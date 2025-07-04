import { Component } from '@angular/core';

@Component({
  selector: 'app-cliente-perfil',
  templateUrl: './cliente-perfil.component.html',
  styleUrls: ['./cliente-perfil.component.scss']
})
export class ClientePerfilComponent {
  usuario = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  ngOnInit() {
    // Obtener datos del usuario logueado desde localStorage
    const usuariosStr = localStorage.getItem('usuarios') || '[]';
    const usuarios = JSON.parse(usuariosStr);
    const email = localStorage.getItem('user') || '';
    const usuario = usuarios.find((u: any) => u.email === email);
    if (usuario) {
      this.usuario = {
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        email: usuario.email || '',
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || ''
      };
    }
  }
}
