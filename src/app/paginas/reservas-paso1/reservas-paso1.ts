import { Component, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservas-paso1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas-paso1.html',
  styleUrls: ['./reservas-paso1.scss']
})
export class ReservasPaso1 {
  @Output() completado = new EventEmitter<any>();
  @Output() regresar = new EventEmitter<void>();

  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  telefono: string = '';
  errores: { [key: string]: string } = {};

  finalizarPaso() {
    this.errores = {};
    let valido = true;
    if (!this.nombre) {
      this.errores['nombre'] = 'El nombre es obligatorio';
      valido = false;
    }
    if (!this.apellidos) {
      this.errores['apellidos'] = 'Los apellidos son obligatorios';
      valido = false;
    }
    if (!this.email) {
      this.errores['email'] = 'El email es obligatorio';
      valido = false;
    } else if (!/^\S+@\S+\.\S+$/.test(this.email)) {
      this.errores['email'] = 'El email no es válido';
      valido = false;
    }
    if (!this.telefono) {
      this.errores['telefono'] = 'El teléfono es obligatorio';
      valido = false;
    }
    if (valido) {
      this.completado.emit({
        nombre: this.nombre,
        apellidos: this.apellidos,
        email: this.email,
        telefono: this.telefono
      });
    }
  }

  irAtras() {
    this.regresar.emit();
  }
}

