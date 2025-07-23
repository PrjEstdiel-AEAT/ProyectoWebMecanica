import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-perfil.component.html',
  styleUrls: ['./cliente-perfil.component.scss']
})
export class ClientePerfilComponent {
  editMode = false;
  confirmarPassword = '';
  
  usuario = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  };
  
  usuarioEdit = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    password: ''
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
  
  activarEdicion() {
    this.editMode = true;
    this.usuarioEdit = { ...this.usuario, password: '' };
    this.confirmarPassword = '';
  }
  
  cancelarEdicion() {
    this.editMode = false;
    this.usuarioEdit = { nombre: '', apellido: '', email: '', telefono: '', direccion: '', password: '' };
    this.confirmarPassword = '';
  }
  
  guardarCambios() {
    // Validar contraseñas si se está cambiando
    if (this.usuarioEdit.password && this.usuarioEdit.password !== this.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    // Actualizar datos en localStorage
    const usuariosStr = localStorage.getItem('usuarios') || '[]';
    const usuarios = JSON.parse(usuariosStr);
    const index = usuarios.findIndex((u: any) => u.email === this.usuario.email);
    
    if (index !== -1) {
      usuarios[index] = {
        ...usuarios[index],
        nombre: this.usuarioEdit.nombre,
        apellido: this.usuarioEdit.apellido,
        email: this.usuarioEdit.email,
        telefono: this.usuarioEdit.telefono,
        direccion: this.usuarioEdit.direccion
      };
      
      // Solo actualizar contraseña si se proporcionó una nueva
      if (this.usuarioEdit.password) {
        usuarios[index].password = this.usuarioEdit.password;
      }
      
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      // Actualizar usuario actual
      this.usuario = {
        nombre: this.usuarioEdit.nombre,
        apellido: this.usuarioEdit.apellido,
        email: this.usuarioEdit.email,
        telefono: this.usuarioEdit.telefono,
        direccion: this.usuarioEdit.direccion
      };
      
      // Actualizar email en localStorage si cambió
      if (this.usuarioEdit.email !== this.usuario.email) {
        localStorage.setItem('user', this.usuarioEdit.email);
      }
      
      this.editMode = false;
      alert('Perfil actualizado correctamente');
    }
  }
}
