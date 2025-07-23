import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReservasService, Reserva } from '../../servicios/reservas.service';
import { ServiciosService, Servicio } from '../../servicios/servicios.service';
import { MecanicosService, Mecanico } from '../../servicios/mecanicos.service';

@Component({
  selector: 'app-cliente-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-historial.component.html',
  styleUrls: ['./cliente-historial.component.scss']
})
export class ClienteHistorialComponent implements OnInit, OnDestroy {
  reservas: Reserva[] = [];
  servicios: Servicio[] = [];
  mecanicos: Mecanico[] = [];
  private subscription = new Subscription();
  
  // Estados para modales
  mostrarModalCancelar = false;
  mostrarModalModificar = false;
  reservaSeleccionada: Reserva | null = null;
  
  // Formulario de modificación
  formularioModificacion = {
    servicioId: 0,
    mecanicoId: 0,
    fecha: '',
    horario: '',
    datosVehiculo: {
      marca: '',
      modelo: '',
      anio: 0,
      placa: '',
      color: '',
      kilometraje: 0
    },
    informacionAdicional: ''
  };
  
  horariosDisponibles: string[] = [];

  constructor(
    private reservasService: ReservasService,
    private serviciosService: ServiciosService,
    private mecanicosService: MecanicosService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cargarDatos() {
    // Cargar reservas
    this.subscription.add(
      this.reservasService.getReservas().subscribe(reservas => {
        this.reservas = reservas;
      })
    );

    // Cargar servicios para mostrar nombres
    this.subscription.add(
      this.serviciosService.getServicios().subscribe(servicios => {
        this.servicios = servicios;
      })
    );

    // Cargar mecánicos para mostrar nombres
    this.subscription.add(
      this.mecanicosService.getMecanicos().subscribe(mecanicos => {
        this.mecanicos = mecanicos;
      })
    );
  }

  obtenerNombreServicio(servicioId: number): string {
    const servicio = this.servicios.find(s => s.id === servicioId);
    return servicio ? servicio.nombre : 'Servicio no encontrado';
  }

  obtenerNombreMecanico(mecanicoId: number): string {
    const mecanico = this.mecanicos.find(m => m.id === mecanicoId);
    return mecanico ? `${mecanico.nombre} ${mecanico.apellido}` : 'Mecánico no encontrado';
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'confirmada': return 'estado-confirmada';
      case 'pendiente': return 'estado-pendiente';
      case 'completada': return 'estado-completada';
      case 'cancelada': return 'estado-cancelada';
      default: return 'estado-pendiente';
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearHorario(horario: string): string {
    switch (horario) {
      case 'mañana': return 'Mañana (08:00 - 12:00)';
      case 'tarde': return 'Tarde (14:00 - 18:00)';
      case 'noche': return 'Noche (18:00 - 22:00)';
      default: return horario;
    }
  }

  contarReservasPorEstado(estado: string): number {
    return this.reservas.filter(reserva => reserva.estado === estado).length;
  }

  // Métodos para modificar y cancelar reservas
  abrirModalCancelar(reserva: Reserva) {
    this.reservaSeleccionada = reserva;
    this.mostrarModalCancelar = true;
  }

  abrirModalModificar(reserva: Reserva) {
    this.reservaSeleccionada = reserva;
    this.cargarDatosEnFormulario(reserva);
    this.cargarHorariosDisponibles(reserva.mecanicoId, reserva.fecha);
    this.mostrarModalModificar = true;
  }

  cerrarModales() {
    this.mostrarModalCancelar = false;
    this.mostrarModalModificar = false;
    this.reservaSeleccionada = null;
  }

  confirmarCancelacion() {
    if (this.reservaSeleccionada && this.reservaSeleccionada.id) {
      this.reservasService.cancelarReservaExistente(this.reservaSeleccionada.id);
      alert('Reserva cancelada exitosamente');
      this.cerrarModales();
    }
  }

  cargarDatosEnFormulario(reserva: Reserva) {
    this.formularioModificacion = {
      servicioId: reserva.servicioId,
      mecanicoId: reserva.mecanicoId,
      fecha: reserva.fecha,
      horario: reserva.horario,
      datosVehiculo: { ...reserva.datosVehiculo },
      informacionAdicional: reserva.informacionAdicional || ''
    };
  }

  cargarHorariosDisponibles(mecanicoId: number, fecha: string) {
    const mecanico = this.mecanicos.find(m => m.id === mecanicoId);
    if (mecanico && mecanico.horarios) {
      const fechaObj = new Date(fecha);
      const diaSemana = fechaObj.getDay();
      const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const nombreDia = diasSemana[diaSemana];
      
      const horarioDelDia = mecanico.horarios.find(h => h.dia.toLowerCase() === nombreDia);
      if (horarioDelDia && horarioDelDia.disponible) {
        this.horariosDisponibles = this.generarHorarios(horarioDelDia.horaInicio, horarioDelDia.horaFin);
      } else {
        this.horariosDisponibles = [];
      }
    }
  }

  generarHorarios(inicio: string, fin: string): string[] {
    const horarios = [];
    const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
    const [horaFin, minutoFin] = fin.split(':').map(Number);
    
    let horaActual = horaInicio;
    let minutoActual = minutoInicio;
    
    while (horaActual < horaFin || (horaActual === horaFin && minutoActual < minutoFin)) {
      const horaStr = horaActual.toString().padStart(2, '0');
      const minutoStr = minutoActual.toString().padStart(2, '0');
      horarios.push(`${horaStr}:${minutoStr}`);
      
      minutoActual += 30;
      if (minutoActual >= 60) {
        minutoActual = 0;
        horaActual++;
      }
    }
    
    return horarios;
  }

  onMecanicoChange() {
    if (this.formularioModificacion.mecanicoId && this.formularioModificacion.fecha) {
      this.cargarHorariosDisponibles(this.formularioModificacion.mecanicoId, this.formularioModificacion.fecha);
    }
  }

  onFechaChange() {
    if (this.formularioModificacion.mecanicoId && this.formularioModificacion.fecha) {
      this.cargarHorariosDisponibles(this.formularioModificacion.mecanicoId, this.formularioModificacion.fecha);
    }
  }

  guardarModificacion() {
    if (this.reservaSeleccionada && this.validarFormulario()) {
      const reservaActualizada: Reserva = {
        ...this.reservaSeleccionada,
        servicioId: this.formularioModificacion.servicioId,
        mecanicoId: this.formularioModificacion.mecanicoId,
        fecha: this.formularioModificacion.fecha,
        horario: this.formularioModificacion.horario,
        datosVehiculo: { ...this.formularioModificacion.datosVehiculo },
        informacionAdicional: this.formularioModificacion.informacionAdicional,
        estado: 'pendiente' // Resetear a pendiente al modificar
      };
      
      this.reservasService.actualizarReserva(reservaActualizada);
      alert('Reserva modificada exitosamente');
      this.cerrarModales();
    }
  }

  validarFormulario(): boolean {
    if (!this.formularioModificacion.servicioId || 
        !this.formularioModificacion.mecanicoId ||
        !this.formularioModificacion.fecha ||
        !this.formularioModificacion.horario ||
        !this.formularioModificacion.datosVehiculo.marca ||
        !this.formularioModificacion.datosVehiculo.modelo) {
      alert('Por favor completa todos los campos obligatorios');
      return false;
    }
    return true;
  }
}
