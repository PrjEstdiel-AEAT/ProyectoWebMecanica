import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Mecanico {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidad: string;
  experiencia: number;
  activo: boolean;
  servicios: number[]; // IDs de servicios que puede realizar
  serviciosNombres: string[];
  horarios: HorarioMecanico[];
}

export interface HorarioMecanico {
  dia: string;
  turno: 'mañana' | 'tarde' | 'noche';
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MecanicosService {
  private mecanicosSubject = new BehaviorSubject<Mecanico[]>([]);
  public mecanicos$ = this.mecanicosSubject.asObservable();

  private readonly STORAGE_KEY = 'mecanicos_data';

  constructor() {
    this.inicializarMecanicos();
  }

  private inicializarMecanicos() {
    // Intentar cargar datos del localStorage
    const datosGuardados = localStorage.getItem(this.STORAGE_KEY);
    if (datosGuardados) {
      try {
        const mecanicos = JSON.parse(datosGuardados);
        this.mecanicosSubject.next(mecanicos);
        return;
      } catch (error) {
        console.warn('Error al cargar mecánicos del localStorage:', error);
      }
    }

    // Si no hay datos guardados, usar datos iniciales
    const mecanicosIniciales: Mecanico[] = [
      {
        id: 1,
        nombre: 'Carlos',
        apellido: 'López',
        email: 'carlos.lopez@taller.com',
        telefono: '555-0101',
        especialidad: 'Motor y transmisión',
        experiencia: 8,
        activo: true,
        servicios: [1, 2], // Cambio de aceite, Revisión general
        serviciosNombres: ['Cambio de aceite', 'Revisión general'],
        horarios: [
          { dia: 'Lunes', turno: 'mañana', horaInicio: '08:00', horaFin: '12:00', disponible: true },
          { dia: 'Lunes', turno: 'tarde', horaInicio: '14:00', horaFin: '18:00', disponible: true },
          { dia: 'Martes', turno: 'mañana', horaInicio: '08:00', horaFin: '12:00', disponible: true },
          { dia: 'Martes', turno: 'tarde', horaInicio: '14:00', horaFin: '18:00', disponible: false },
          { dia: 'Miércoles', turno: 'mañana', horaInicio: '08:00', horaFin: '12:00', disponible: true },
          { dia: 'Miércoles', turno: 'tarde', horaInicio: '14:00', horaFin: '18:00', disponible: true }
        ]
      },
      {
        id: 2,
        nombre: 'Ana',
        apellido: 'Martínez',
        email: 'ana.martinez@taller.com',
        telefono: '555-0102',
        especialidad: 'Frenos y suspensión',
        experiencia: 5,
        activo: true,
        servicios: [3, 4], // Reparación de frenos, Cambio de pastillas
        serviciosNombres: ['Reparación de frenos', 'Cambio de pastillas'],
        horarios: [
          { dia: 'Lunes', turno: 'mañana', horaInicio: '08:00', horaFin: '12:00', disponible: true },
          { dia: 'Lunes', turno: 'tarde', horaInicio: '14:00', horaFin: '18:00', disponible: true },
          { dia: 'Martes', turno: 'mañana', horaInicio: '08:00', horaFin: '12:00', disponible: true },
          { dia: 'Martes', turno: 'tarde', horaInicio: '14:00', horaFin: '18:00', disponible: true },
          { dia: 'Miércoles', turno: 'mañana', horaInicio: '08:00', horaFin: '12:00', disponible: false },
          { dia: 'Miércoles', turno: 'tarde', horaInicio: '14:00', horaFin: '18:00', disponible: true }
        ]
      },
      {
        id: 3,
        nombre: 'Luis',
        apellido: 'García',
        email: 'luis.garcia@taller.com',
        telefono: '555-0103',
        especialidad: 'Alineación y diagnóstico',
        experiencia: 6,
        activo: true,
        servicios: [5, 6], // Alineación, Diagnóstico computarizado
        serviciosNombres: ['Alineación', 'Diagnóstico computarizado'],
        horarios: [
          { dia: 'Lunes', turno: 'mañana', horaInicio: '08:00', horaFin: '12:00', disponible: true },
          { dia: 'Lunes', turno: 'tarde', horaInicio: '14:00', horaFin: '18:00', disponible: false },
          { dia: 'Martes', turno: 'mañana', horaInicio: '08:00', horaFin: '12:00', disponible: true },
          { dia: 'Martes', turno: 'tarde', horaInicio: '14:00', horaFin: '18:00', disponible: true },
          { dia: 'Miércoles', turno: 'mañana', horaInicio: '08:00', horaFin: '12:00', disponible: true },
          { dia: 'Miércoles', turno: 'tarde', horaInicio: '14:00', horaFin: '18:00', disponible: true }
        ]
      }
    ];

    this.mecanicosSubject.next(mecanicosIniciales);
    this.guardarEnStorage(mecanicosIniciales);
  }

  private guardarEnStorage(mecanicos: Mecanico[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mecanicos));
    } catch (error) {
      console.error('Error al guardar mecánicos en localStorage:', error);
    }
  }

  getMecanicos(): Observable<Mecanico[]> {
    return this.mecanicos$;
  }

  getMecanicosPorServicio(servicioId: number): Mecanico[] {
    return this.mecanicosSubject.value.filter(mecanico => 
      mecanico.activo && mecanico.servicios.includes(servicioId)
    );
  }

  getMecanicoPorId(id: number): Mecanico | undefined {
    return this.mecanicosSubject.value.find(m => m.id === id);
  }

  getHorariosDisponibles(mecanicoId: number): HorarioMecanico[] {
    const mecanico = this.getMecanicoPorId(mecanicoId);
    return mecanico ? mecanico.horarios.filter(h => h.disponible) : [];
  }

  // Métodos CRUD para gestión de mecánicos
  agregarMecanico(mecanico: Omit<Mecanico, 'id'>): void {
    const mecanicos = this.mecanicosSubject.value;
    const nuevoId = Math.max(...mecanicos.map(m => m.id), 0) + 1;
    const nuevoMecanico: Mecanico = {
      ...mecanico,
      id: nuevoId,
      horarios: mecanico.horarios || []
    };
    const nuevosMetanicos = [...mecanicos, nuevoMecanico];
    this.mecanicosSubject.next(nuevosMetanicos);
    this.guardarEnStorage(nuevosMetanicos);
  }

  actualizarMecanico(mecanicoActualizado: Mecanico): void {
    const mecanicos = this.mecanicosSubject.value;
    const index = mecanicos.findIndex(m => m.id === mecanicoActualizado.id);
    if (index !== -1) {
      mecanicos[index] = mecanicoActualizado;
      const mecanicosActualizados = [...mecanicos];
      this.mecanicosSubject.next(mecanicosActualizados);
      this.guardarEnStorage(mecanicosActualizados);
    }
  }

  eliminarMecanico(id: number): void {
    const mecanicos = this.mecanicosSubject.value;
    const mecanicosFiltrados = mecanicos.filter(m => m.id !== id);
    this.mecanicosSubject.next(mecanicosFiltrados);
    this.guardarEnStorage(mecanicosFiltrados);
  }

  toggleEstadoMecanico(id: number): void {
    const mecanicos = this.mecanicosSubject.value;
    const mecanico = mecanicos.find(m => m.id === id);
    if (mecanico) {
      mecanico.activo = !mecanico.activo;
      const mecanicosActualizados = [...mecanicos];
      this.mecanicosSubject.next(mecanicosActualizados);
      this.guardarEnStorage(mecanicosActualizados);
    }
  }

  // Método para obtener mecánicos sincrónicamente
  getMecanicosSync(): Mecanico[] {
    return this.mecanicosSubject.value;
  }
}
