import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas.html',
  styleUrls: ['./reservas.scss']
})
export class ReservasComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    // Componente simplificado
  }

  irANuevoSistema() {
    this.router.navigate(['/cliente/reservar-servicio']);
  }
}
