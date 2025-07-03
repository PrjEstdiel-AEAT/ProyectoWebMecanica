import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'empleado' | 'cliente';
}

interface Reserva {
  id: number;
  usuarioId: number;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  reservas: Reserva[] = [];

  // Formularios y flags para mostrar/ocultar
  showUsuarioForm = false;
  showReservaForm = false;
  nuevoUsuario: Usuario = { id: 0, nombre: '', email: '', rol: 'cliente' };
  nuevaReserva: Reserva = { id: 0, usuarioId: 3, fecha: '', hora: '', estado: 'pendiente' };

  // --- USUARIOS CRUD ---
  agregarUsuario(usuario: Usuario) {
    usuario.id = Date.now();
    this.usuarios.push({ ...usuario });
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
  }
  editarUsuario(usuario: Usuario) {
    const idx = this.usuarios.findIndex(u => u.id === usuario.id);
    if (idx !== -1) this.usuarios[idx] = { ...usuario };
  }
  eliminarUsuario(id: number) {
    this.usuarios = this.usuarios.filter(u => u.id !== id);
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
  }

  // --- RESERVAS CRUD ---
  agregarReserva(reserva: Reserva) {
    reserva.id = Date.now();
    this.reservas.push({ ...reserva });
    localStorage.setItem('reservas', JSON.stringify(this.reservas));
  }
  editarReserva(reserva: Reserva) {
    const idx = this.reservas.findIndex(r => r.id === reserva.id);
    if (idx !== -1) this.reservas[idx] = { ...reserva };
  }
  eliminarReserva(id: number) {
    this.reservas = this.reservas.filter(r => r.id !== id);
    localStorage.setItem('reservas', JSON.stringify(this.reservas));
  }

  ngOnInit() {
    // Cargar usuarios desde localStorage (registro)
    const usuariosStr = localStorage.getItem('usuarios') || '[]';
    const usuariosArr = JSON.parse(usuariosStr);
    // Adaptar usuarios a la interfaz (agregar id y rol si no existen)
    this.usuarios = usuariosArr.map((u: any, idx: number) => ({
      id: u.id || idx + 1,
      nombre: u.nombre + (u.apellido ? ' ' + u.apellido : ''),
      email: u.email,
      rol: u.rol || 'cliente',
    }));

    // Cargar reservas desde localStorage
    const reservasStr = localStorage.getItem('reservas') || '[]';
    this.reservas = JSON.parse(reservasStr);
  }
}
