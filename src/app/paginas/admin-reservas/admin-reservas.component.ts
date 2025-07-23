import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReservasService, Reserva } from '../../servicios/reservas.service';
import { ServiciosService, Servicio } from '../../servicios/servicios.service';
import { MecanicosService, Mecanico } from '../../servicios/mecanicos.service';

@Component({
  selector: 'app-admin-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reservas-container">
      <div class="reservas-header">
        <h1>Gestión de Reservas</h1>
        <div class="filtros">
          <select [(ngModel)]="filtroEstado" (change)="filtrarReservas()">
            <option value="todas">Todas las reservas</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmada">Confirmadas</option>
            <option value="completada">Completadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      <div class="tabla-container">
        <table class="reservas-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Mecánico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let reserva of reservasFiltradas">
              <td>#{{ reserva.id }}</td>
              <td>{{ obtenerNombreCliente(reserva) }}</td>
              <td>{{ obtenerNombreServicio(reserva.servicioId) }}</td>
              <td>{{ formatearFecha(reserva.fecha) }}</td>
              <td>{{ reserva.horario }}</td>
              <td>
                <span class="estado-badge" [class]="'estado-' + reserva.estado">
                  {{ reserva.estado | titlecase }}
                </span>
              </td>
              <td>{{ obtenerNombreMecanico(reserva.mecanicoId) }}</td>
              <td>
                <div class="acciones">
                  <button class="btn-accion editar" (click)="editarReserva(reserva)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-accion eliminar" (click)="eliminarReserva(reserva)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .reservas-container {
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .reservas-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      
      h1 {
        color: #2c3e50;
        font-size: 2rem;
        font-weight: 700;
        margin: 0;
      }
      
      select {
        padding: 0.8rem 1rem;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        background: white;
        font-size: 1rem;
        
        &:focus {
          outline: none;
          border-color: #667eea;
        }
      }
    }

    .tabla-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .reservas-tabla {
      width: 100%;
      border-collapse: collapse;
      
      thead {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        
        th {
          padding: 1.5rem 1rem;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.9rem;
        }
      }
      
      tbody {
        tr {
          border-bottom: 1px solid #e9ecef;
          transition: all 0.3s ease;
          
          &:hover {
            background: #f8f9fa;
          }
          
          td {
            padding: 1.5rem 1rem;
            vertical-align: middle;
          }
        }
      }
    }

    .estado-badge {
      padding: 0.4rem 0.8rem;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      
      &.estado-pendiente {
        background: #fff3cd;
        color: #856404;
      }
      
      &.estado-confirmada {
        background: #d4edda;
        color: #155724;
      }
      
      &.estado-completada {
        background: #cce5ff;
        color: #004085;
      }
      
      &.estado-cancelada {
        background: #f8d7da;
        color: #721c24;
      }
    }

    .acciones {
      display: flex;
      gap: 0.5rem;
      
      .btn-accion {
        width: 35px;
        height: 35px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.editar {
          background: #e3f2fd;
          color: #1976d2;
          
          &:hover {
            background: #1976d2;
            color: white;
          }
        }
        
        &.eliminar {
          background: #ffebee;
          color: #d32f2f;
          
          &:hover {
            background: #d32f2f;
            color: white;
          }
        }
      }
    }
  `]
})
export class AdminReservasComponent implements OnInit, OnDestroy {
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  servicios: Servicio[] = [];
  mecanicos: Mecanico[] = [];
  filtroEstado: string = 'todas';
  private subscription = new Subscription();

  constructor(
    private reservasService: ReservasService,
    private serviciosService: ServiciosService,
    private mecanicosService: MecanicosService
  ) {}

  ngOnInit() {
    this.cargarReservas();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cargarReservas() {
    // Cargar reservas del servicio
    this.subscription.add(
      this.reservasService.getReservas().subscribe(reservas => {
        this.reservas = reservas;
        this.filtrarReservas();
      })
    );

    // Cargar servicios
    this.subscription.add(
      this.serviciosService.getServicios().subscribe(servicios => {
        this.servicios = servicios;
      })
    );

    // Cargar mecánicos
    this.subscription.add(
      this.mecanicosService.getMecanicos().subscribe(mecanicos => {
        this.mecanicos = mecanicos;
      })
    );
  }

  filtrarReservas() {
    if (this.filtroEstado === 'todas') {
      this.reservasFiltradas = [...this.reservas];
    } else {
      this.reservasFiltradas = this.reservas.filter(r => r.estado === this.filtroEstado);
    }
  }

  editarReserva(reserva: Reserva) {
    const nuevosEstados = ['pendiente', 'confirmada', 'en_proceso', 'completada', 'cancelada'];
    const estadoActual = reserva.estado;
    const opcionesEstado = nuevosEstados.filter(estado => estado !== estadoActual);
    
    const mensaje = `Estado actual: ${estadoActual}\n\nSelecciona el nuevo estado:\n` +
      opcionesEstado.map((estado, index) => `${index + 1}. ${estado}`).join('\n');
    
    const seleccion = prompt(mensaje);
    
    if (seleccion && !isNaN(Number(seleccion))) {
      const indice = Number(seleccion) - 1;
      if (indice >= 0 && indice < opcionesEstado.length) {
        const nuevoEstado = opcionesEstado[indice] as 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';
        if (reserva.id) {
          this.reservasService.actualizarEstadoReserva(reserva.id, nuevoEstado);
          alert(`Estado actualizado a: ${nuevoEstado}`);
        }
      } else {
        alert('Selección inválida');
      }
    }
  }

  eliminarReserva(reserva: Reserva) {
    if (confirm(`¿Eliminar la reserva #${reserva.id}?`)) {
      if (reserva.id) {
        this.reservasService.eliminarReserva(reserva.id);
      }
    }
  }

  // Métodos auxiliares para mostrar datos
  obtenerNombreCliente(reserva: Reserva): string {
    return `${reserva.datosCliente.nombre} ${reserva.datosCliente.apellido}`;
  }

  obtenerNombreServicio(servicioId: number): string {
    const servicio = this.servicios.find(s => s.id === servicioId);
    return servicio ? servicio.nombre : 'Servicio no encontrado';
  }

  obtenerNombreMecanico(mecanicoId: number): string {
    const mecanico = this.mecanicos.find(m => m.id === mecanicoId);
    return mecanico ? `${mecanico.nombre} ${mecanico.apellido}` : 'Sin asignar';
  }

  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}
