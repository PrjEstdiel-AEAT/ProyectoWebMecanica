import { Component, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas-paso2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-paso2.html',
  styleUrls: ['./reservas-paso2.scss']
})
export class ReservasPaso2 {
  @Output() completado = new EventEmitter<string>();
  @Output() regresar = new EventEmitter<void>();

  servicios = [
    { titulo: 'Planchado' },
    { titulo: 'Revisión de Frenos' },
    { titulo: 'Cambio de Aceite' },
    { titulo: 'Computarizado' }
  ];

  servicioSeleccionado: number | null = null;

  seleccionarServicio(idx: number) {
    this.servicioSeleccionado = idx;
  }

  finalizarPaso() {
    if (this.servicioSeleccionado !== null) {
      this.completado.emit(this.servicios[this.servicioSeleccionado].titulo);
    }
  }

  irAtras() {
    this.regresar.emit();
  }
}

