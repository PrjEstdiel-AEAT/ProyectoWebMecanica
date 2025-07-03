import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas-paso5',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-paso5.html',
  styleUrls: ['./reservas-paso5.scss']
})
export class ReservasPaso5 {
  @Input() cliente: string = '';
  @Input() email: string = '';
  @Input() telefono: string = '';
  @Input() servicio: string = '';
  @Input() trabajador: string = '';
  @Input() fecha: string = '';
  @Input() hora: string = '';

  @Output() citaConfirmada: EventEmitter<void> = new EventEmitter<void>();
  @Output() citaCancelada: EventEmitter<void> = new EventEmitter<void>();

  confirmarCita(): void {
    this.citaConfirmada.emit();
    // Aquí puedes llamar a un servicio para enviar el correo real
    // Ejemplo: this.emailService.sendConfirmation(this.email, ...)
  }

  cancelar(): void {
    this.citaCancelada.emit();
  }
}
