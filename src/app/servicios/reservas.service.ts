import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Reserva {
  id?: number;
  clienteId: number;
  servicioId: number;
  mecanicoId: number;
  fecha: string;
  horario: string;
  estado: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';
  datosCliente: DatosCliente;
  datosVehiculo: DatosVehiculo;
  informacionAdicional: string;
  fechaCreacion: string;
  total: number;
}

export interface DatosCliente {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface DatosVehiculo {
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  color: string;
  kilometraje: number;
}

export interface ReservaEnProceso {
  paso: number;
  servicioSeleccionado?: any;
  mecanicoSeleccionado?: any;
  horarioSeleccionado?: any;
  datosCliente?: DatosCliente;
  datosVehiculo?: DatosVehiculo;
  informacionAdicional?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private reservasSubject = new BehaviorSubject<Reserva[]>([]);
  public reservas$ = this.reservasSubject.asObservable();

  private reservaEnProcesoSubject = new BehaviorSubject<ReservaEnProceso>({ paso: 1 });
  public reservaEnProceso$ = this.reservaEnProcesoSubject.asObservable();

  private readonly STORAGE_KEY = 'reservas_data';

  constructor() {
    this.inicializarReservas();
  }

  private inicializarReservas() {
    // Intentar cargar datos del localStorage
    const datosGuardados = localStorage.getItem(this.STORAGE_KEY);
    if (datosGuardados) {
      try {
        const reservas = JSON.parse(datosGuardados);
        this.reservasSubject.next(reservas);
        return;
      } catch (error) {
        console.warn('Error al cargar reservas del localStorage:', error);
      }
    }

    // Si no hay datos guardados, usar datos iniciales
    const reservasIniciales: Reserva[] = [
      {
        id: 1,
        clienteId: 1,
        servicioId: 1,
        mecanicoId: 1,
        fecha: '2024-01-15',
        horario: 'mañana',
        estado: 'confirmada',
        datosCliente: {
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@email.com',
          telefono: '555-1234',
          direccion: 'Calle 123, Ciudad'
        },
        datosVehiculo: {
          marca: 'Toyota',
          modelo: 'Corolla',
          anio: 2020,
          placa: 'ABC-123',
          color: 'Blanco',
          kilometraje: 50000
        },
        informacionAdicional: 'Cambio de aceite regular',
        fechaCreacion: '2024-01-10',
        total: 45.00
      }
    ];

    this.reservasSubject.next(reservasIniciales);
    this.guardarEnStorage(reservasIniciales);
  }

  private guardarEnStorage(reservas: Reserva[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reservas));
    } catch (error) {
      console.error('Error al guardar reservas en localStorage:', error);
    }
  }

  getReservas(): Observable<Reserva[]> {
    return this.reservas$;
  }

  getReservaEnProceso(): Observable<ReservaEnProceso> {
    return this.reservaEnProceso$;
  }

  iniciarReserva(servicio: any, mecanico: any, horario: any) {
    const reservaEnProceso: ReservaEnProceso = {
      paso: 1,
      servicioSeleccionado: servicio,
      mecanicoSeleccionado: mecanico,
      horarioSeleccionado: horario
    };
    this.reservaEnProcesoSubject.next(reservaEnProceso);
  }

  actualizarPaso(paso: number, datos: any) {
    const reservaActual = this.reservaEnProcesoSubject.value;
    const reservaActualizada = { ...reservaActual, paso, ...datos };
    this.reservaEnProcesoSubject.next(reservaActualizada);
  }

  finalizarReserva(): Reserva {
    const reservaEnProceso = this.reservaEnProcesoSubject.value;
    const reservasActuales = this.reservasSubject.value;
    
    const nuevaReserva: Reserva = {
      id: reservasActuales.length + 1,
      clienteId: 1, // En producción obtener del usuario logueado
      servicioId: reservaEnProceso.servicioSeleccionado.id,
      mecanicoId: reservaEnProceso.mecanicoSeleccionado.id,
      fecha: new Date().toISOString().split('T')[0],
      horario: reservaEnProceso.horarioSeleccionado.turno,
      estado: 'pendiente',
      datosCliente: reservaEnProceso.datosCliente!,
      datosVehiculo: reservaEnProceso.datosVehiculo!,
      informacionAdicional: reservaEnProceso.informacionAdicional || '',
      fechaCreacion: new Date().toISOString(),
      total: reservaEnProceso.servicioSeleccionado.precio
    };

    const reservasActualizadas = [...reservasActuales, nuevaReserva];
    this.reservasSubject.next(reservasActualizadas);
    this.guardarEnStorage(reservasActualizadas);

    // Limpiar reserva en proceso
    this.reservaEnProcesoSubject.next({ paso: 1 });

    return nuevaReserva;
  }

  cancelarReserva() {
    this.reservaEnProcesoSubject.next({ paso: 1 });
  }

  // Métodos para gestionar reservas existentes
  actualizarEstadoReserva(id: number, nuevoEstado: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada'): void {
    const reservasActuales = this.reservasSubject.value;
    const index = reservasActuales.findIndex(r => r.id === id);
    
    if (index !== -1) {
      reservasActuales[index].estado = nuevoEstado;
      const reservasActualizadas = [...reservasActuales];
      this.reservasSubject.next(reservasActualizadas);
      this.guardarEnStorage(reservasActualizadas);
    }
  }

  cancelarReservaExistente(id: number): void {
    this.actualizarEstadoReserva(id, 'cancelada');
  }

  eliminarReserva(id: number): void {
    const reservasActuales = this.reservasSubject.value;
    const reservasFiltradas = reservasActuales.filter(r => r.id !== id);
    this.reservasSubject.next(reservasFiltradas);
    this.guardarEnStorage(reservasFiltradas);
  }

  obtenerReservaPorId(id: number): Reserva | undefined {
    return this.reservasSubject.value.find(r => r.id === id);
  }

  actualizarReserva(reservaActualizada: Reserva): void {
    const reservasActuales = this.reservasSubject.value;
    const index = reservasActuales.findIndex(r => r.id === reservaActualizada.id);
    
    if (index !== -1) {
      reservasActuales[index] = reservaActualizada;
      const reservasActualizadas = [...reservasActuales];
      this.reservasSubject.next(reservasActualizadas);
      this.guardarEnStorage(reservasActualizadas);
    }
  }
}
