import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReservasPaso1 } from '../reservas-paso1/reservas-paso1';
import { ReservasPaso2 } from '../reservas-paso2/reservas-paso2';
import { ReservasPaso3 } from '../reservas-paso3/reservas-paso3';
import { ReservasPaso4 } from '../reservas-paso4/reservas-paso4';
import { ReservasPaso5 } from '../reservas-paso5/reservas-paso5';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, ReservasPaso1, ReservasPaso2, ReservasPaso3, ReservasPaso4, ReservasPaso5],
  templateUrl: './reservas.html',
  styleUrls: ['./reservas.scss']
})
export class ReservasComponent {
  pasoActual = 1;
  pasosCompletados = [false, false, false, false, false];
  user: string | null = null;

  // Datos de la reserva
  cliente: string = '';
  email: string = '';
  telefono: string = '';
  servicio: string = '';
  trabajador: string = '';
  fecha: string = '';
  hora: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.user = localStorage.getItem('user');
  }

  avanzarPaso(paso: number) {
    if (paso === 1 || this.pasosCompletados[paso - 2]) {
      this.pasoActual = paso;
    }
  }

  completarPaso(paso: number, datos?: any) {
    this.pasosCompletados[paso - 1] = true;
    if (paso < 5) {
      this.pasoActual = paso + 1;
    }
    // Guardar datos de cada paso
    if (paso === 1 && datos) {
      this.cliente = datos.nombre + ' ' + datos.apellidos;
      this.email = datos.email;
      this.telefono = datos.telefono;
    }
    if (paso === 2 && datos) {
      this.servicio = datos;
    }
    if (paso === 3 && datos) {
      this.trabajador = datos;
    }
    if (paso === 4 && datos) {
      this.fecha = datos.fecha;
      this.hora = datos.hora;
    }
  }

  onReservaFinalizada() {
    // Guardar la reserva en localStorage
    const reservasStr = localStorage.getItem('reservas') || '[]';
    const reservas = JSON.parse(reservasStr);
    // Buscar usuarioId por email
    let usuarioId = 0;
    const usuariosStr = localStorage.getItem('usuarios') || '[]';
    const usuarios = JSON.parse(usuariosStr);
    const usuario = usuarios.find((u: any) => u.email === this.email);
    if (usuario) {
      usuarioId = usuario.id || usuarios.indexOf(usuario) + 1;
    }
    reservas.push({
      id: Date.now(),
      usuarioId: usuarioId,
      fecha: this.fecha,
      hora: this.hora,
      estado: 'confirmada',
      cliente: this.cliente,
      servicio: this.servicio,
      trabajador: this.trabajador
    });
    localStorage.setItem('reservas', JSON.stringify(reservas));
    alert('¡Reserva confirmada! Se enviará un correo de confirmación.');
    this.router.navigate(['/inicio']);
  }
}
