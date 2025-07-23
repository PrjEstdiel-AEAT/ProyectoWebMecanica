import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';

interface ReservaMecanico {
  id: number;
  cliente: string;
  fecha: string;
  hora: string;
  servicio: string;
  estado: string;
  telefono?: string;
  vehiculo?: string;
  comentarios?: string;
  clienteEmail?: string;
}

@Component({
  selector: 'app-mecanico-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mecanico-reservas.component.html',
  styleUrls: ['./mecanico-reservas.component.scss']
})
export class MecanicoReservasComponent implements OnInit {
  reservas: ReservaMecanico[] = [];
  mecanicoLogueado: any = null;
  estadosDisponibles = ['pendiente', 'confirmada', 'en_proceso', 'completada', 'cancelada'];
  filtroEstado = 'todas';
  reservasFiltradas: ReservaMecanico[] = [];
  
  // Modal para detalles
  mostrarModal = false;
  reservaSeleccionada: ReservaMecanico | null = null;
  
  constructor(
    private authService: AuthService
  ) {}
  
  ngOnInit() {
    this.cargarMecanicoLogueado();
    this.cargarReservasDelMecanico();
  }
  
  cargarMecanicoLogueado() {
    this.authService.usuarioLogueado$.subscribe(usuario => {
      this.mecanicoLogueado = usuario;
      console.log('Mecánico logueado:', this.mecanicoLogueado);
      if (usuario) {
        this.cargarReservasDelMecanico();
      }
    });
  }
  
  cargarReservasDelMecanico() {
    if (!this.mecanicoLogueado) return;
    
    // Cargar todas las reservas
    const reservasStr = localStorage.getItem('reservas') || '[]';
    const todasLasReservas = JSON.parse(reservasStr);
    
    // Cargar usuarios para mapear nombres
    const usuariosStr = localStorage.getItem('usuarios') || '[]';
    const usuarios = JSON.parse(usuariosStr);
    
    console.log('Todas las reservas:', todasLasReservas);
    console.log('Mecánico ID:', this.mecanicoLogueado.id);
    console.log('Mecánico email:', this.mecanicoLogueado.email);
    
    // Filtrar reservas asignadas a este mecánico
    this.reservas = todasLasReservas
      .filter((reserva: any) => {
        // Buscar por ID o por nombre del mecánico
        const coincideId = reserva.mecanicoId === this.mecanicoLogueado.id;
        const coincideNombre = reserva.mecanico === `${this.mecanicoLogueado.nombre} ${this.mecanicoLogueado.apellido || ''}`.trim();
        const coincideEmail = reserva.mecanicoEmail === this.mecanicoLogueado.email;
        
        return coincideId || coincideNombre || coincideEmail;
      })
      .map((reserva: any) => {
        // Buscar datos del cliente
        const cliente = usuarios.find((u: any) => 
          u.id === reserva.usuarioId || 
          u.email === reserva.clienteEmail ||
          u.email === reserva.email
        );
        
        return {
          id: reserva.id,
          cliente: cliente ? `${cliente.nombre} ${cliente.apellido || ''}`.trim() : 
                   reserva.cliente || reserva.nombreCliente || 'Cliente no encontrado',
          fecha: reserva.fecha,
          hora: reserva.hora,
          servicio: reserva.servicio || reserva.tipoServicio || 'Servicio general',
          estado: reserva.estado || 'pendiente',
          telefono: cliente?.telefono || reserva.telefono,
          vehiculo: reserva.vehiculo ? `${reserva.vehiculo.marca} ${reserva.vehiculo.modelo} ${reserva.vehiculo.año}` : '',
          comentarios: reserva.comentarios,
          clienteEmail: cliente?.email || reserva.clienteEmail
        };
      })
      .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    
    console.log('Reservas del mecánico:', this.reservas);
    this.aplicarFiltro();
  }
  
  aplicarFiltro() {
    if (this.filtroEstado === 'todas') {
      this.reservasFiltradas = [...this.reservas];
    } else {
      this.reservasFiltradas = this.reservas.filter((r: ReservaMecanico) => r.estado === this.filtroEstado);
    }
  }
  
  cambiarEstado(reserva: ReservaMecanico, nuevoEstado: string) {
    // Actualizar en el array local
    reserva.estado = nuevoEstado;
    
    // Actualizar en localStorage
    const reservasStr = localStorage.getItem('reservas') || '[]';
    const todasLasReservas = JSON.parse(reservasStr);
    
    const index = todasLasReservas.findIndex((r: any) => r.id === reserva.id);
    if (index !== -1) {
      todasLasReservas[index].estado = nuevoEstado;
      localStorage.setItem('reservas', JSON.stringify(todasLasReservas));
      console.log(`Estado de reserva ${reserva.id} cambiado a: ${nuevoEstado}`);
    }
    
    this.aplicarFiltro();
  }
  
  verDetalles(reserva: ReservaMecanico) {
    this.reservaSeleccionada = reserva;
    this.mostrarModal = true;
  }
  
  cerrarModal() {
    this.mostrarModal = false;
    this.reservaSeleccionada = null;
  }
  
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'estado-pendiente';
      case 'confirmada': return 'estado-confirmada';
      case 'en_proceso': return 'estado-proceso';
      case 'completada': return 'estado-completada';
      case 'cancelada': return 'estado-cancelada';
      default: return 'estado-pendiente';
    }
  }
  
  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'confirmada': return 'Confirmada';
      case 'en_proceso': return 'En Proceso';
      case 'completada': return 'Completada';
      case 'cancelada': return 'Cancelada';
      default: return 'Pendiente';
    }
  }
  
  getReservasPorEstado(estado: string): ReservaMecanico[] {
    return this.reservas.filter(r => r.estado === estado);
  }
}
