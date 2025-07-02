import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-nuestros-servicios',
  imports: [RouterModule, CommonModule],
  templateUrl: './nuestros-servicios.html',
  styleUrl: './nuestros-servicios.scss'
})
export class NuestrosServicios {
  servicios = [
    {
      titulo: 'Planchado',
      descripcion: 'Servicio de planchado profesional para tu vehículo.',
      imagen: '/img/Planchado.jpg'
    },
    {
      titulo: 'Revisión de Frenos',
      descripcion: 'Inspección y mantenimiento de frenos y sistemas de seguridad.',
      imagen: '/img/RevFrenos.jpg'
    },
    {
      titulo: 'Cambio de Aceite',
      descripcion: 'Revisión completa y reparación de motor y piezas.',
      imagen: '/img/CambAceite.jpg'
    },
    {
      titulo: 'Computarizado',
      descripcion: 'Revisión completa y reparación de motor y piezas.',
      imagen: '/img/Computarizado.jpg'
    }
  ];
}
