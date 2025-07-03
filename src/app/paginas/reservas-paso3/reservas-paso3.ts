import { Component, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas-paso3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-paso3.html',
  styleUrls: ['./reservas-paso3.scss']
})
export class ReservasPaso3 {
  @Output() completado = new EventEmitter<string>();
  @Output() regresar = new EventEmitter<void>();

  trabajadores = [
    { nombre: 'Juan Pérez' },
    { nombre: 'María López' },
    { nombre: 'Carlos Gómez' },
    { nombre: 'Ana Torres' }
  ];

  trabajadorSeleccionado: number | null = null;

  seleccionarTrabajador(idx: number) {
    this.trabajadorSeleccionado = idx;
  }

  finalizarPaso() {
    if (this.trabajadorSeleccionado !== null) {
      this.completado.emit(this.trabajadores[this.trabajadorSeleccionado].nombre);
    }
  }

  irAtras() {
    this.regresar.emit();
  }
}

