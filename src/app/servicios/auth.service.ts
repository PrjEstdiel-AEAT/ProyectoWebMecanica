import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UsuarioLogueado {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  rol: 'CLIENTE' | 'MECANICO' | 'ADMIN';
  activo: boolean;
  ultimoAcceso?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioLogueadoSubject = new BehaviorSubject<UsuarioLogueado | null>(null);
  public usuarioLogueado$ = this.usuarioLogueadoSubject.asObservable();

  constructor() {
    this.cargarUsuarioLogueado();
  }

  private cargarUsuarioLogueado() {
    const emailLogueado = localStorage.getItem('user');
    if (emailLogueado) {
      const usuariosStr = localStorage.getItem('usuarios') || '[]';
      const usuarios = JSON.parse(usuariosStr);
      const usuario = usuarios.find((u: any) => u.email === emailLogueado);
      
      if (usuario) {
        const usuarioLogueado: UsuarioLogueado = {
          id: usuario.id,
          nombre: usuario.nombre || '',
          apellido: usuario.apellido || '',
          email: usuario.email,
          telefono: usuario.telefono || '',
          direccion: usuario.direccion || '',
          rol: usuario.rol || 'CLIENTE',
          activo: usuario.activo !== false,
          ultimoAcceso: usuario.ultimoAcceso ? new Date(usuario.ultimoAcceso) : new Date()
        };
        this.usuarioLogueadoSubject.next(usuarioLogueado);
      }
    }
  }

  getUsuarioLogueado(): UsuarioLogueado | null {
    return this.usuarioLogueadoSubject.value;
  }

  actualizarUsuarioLogueado(usuario: UsuarioLogueado) {
    // Actualizar en localStorage
    const usuariosStr = localStorage.getItem('usuarios') || '[]';
    let usuarios = JSON.parse(usuariosStr);
    
    const index = usuarios.findIndex((u: any) => u.email === usuario.email);
    if (index !== -1) {
      usuarios[index] = {
        ...usuarios[index],
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        ultimoAcceso: new Date().toISOString()
      };
      
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      this.usuarioLogueadoSubject.next(usuario);
    }
  }

  actualizarPassword(nuevaPassword: string): boolean {
    const usuario = this.getUsuarioLogueado();
    if (usuario) {
      const usuariosStr = localStorage.getItem('usuarios') || '[]';
      let usuarios = JSON.parse(usuariosStr);
      
      const index = usuarios.findIndex((u: any) => u.email === usuario.email);
      if (index !== -1) {
        usuarios[index].password = nuevaPassword;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        return true;
      }
    }
    return false;
  }

  logout() {
    localStorage.removeItem('userLogged');
    localStorage.removeItem('user');
    this.usuarioLogueadoSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.usuarioLogueadoSubject.value !== null;
  }

  isAdmin(): boolean {
    const usuario = this.getUsuarioLogueado();
    return usuario?.rol === 'ADMIN';
  }

  isMecanico(): boolean {
    const usuario = this.getUsuarioLogueado();
    return usuario?.rol === 'MECANICO';
  }

  isCliente(): boolean {
    const usuario = this.getUsuarioLogueado();
    return usuario?.rol === 'CLIENTE';
  }
}
