import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservas-paso4',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas-paso4.html',
  styleUrls: ['./reservas-paso4.scss']
})
export class ReservasPaso4 {
  @Output() finalizado = new EventEmitter<{fecha: string, hora: string}>();
  @Output() regresar = new EventEmitter<void>();

  fecha: string = '';
  horas: string[] = ['09:00', '11:00', '14:00', '16:00'];
  horaSeleccionada: number | null = null;

  seleccionarHora(idx: number) {
    this.horaSeleccionada = idx;
  }

  finalizarReserva() {
    if (this.fecha && this.horaSeleccionada !== null) {
      this.finalizado.emit({
        fecha: this.fecha,
        hora: this.horas[this.horaSeleccionada]
      });
    }
  }

  irAdelante() {
    if (this.fecha && this.horaSeleccionada !== null) {
      this.finalizado.emit({
        fecha: this.fecha,
        hora: this.horas[this.horaSeleccionada]
      });
    }
  }

  irAtras() {
    this.regresar.emit();
  }
}

