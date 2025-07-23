import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
  duracion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private serviciosSubject = new BehaviorSubject<Servicio[]>([]);
  public servicios$ = this.serviciosSubject.asObservable();

  private readonly STORAGE_KEY = 'servicios_data';

  constructor() {
    this.inicializarServicios();
  }

  private inicializarServicios() {
    // Intentar cargar datos del localStorage
    const datosGuardados = localStorage.getItem(this.STORAGE_KEY);
    if (datosGuardados) {
      try {
        const servicios = JSON.parse(datosGuardados);
        this.serviciosSubject.next(servicios);
        return;
      } catch (error) {
        console.warn('Error al cargar servicios del localStorage:', error);
      }
    }

    // Si no hay datos guardados, usar datos iniciales
    const serviciosIniciales: Servicio[] = [
      {
        id: 1,
        nombre: 'Cambio de aceite',
        descripcion: 'Cambio completo de aceite del motor con filtro incluido',
        imagen: '/img/cambio-aceite.jpg',
        precio: 45.00,
        duracion: '30 minutos'
      },
      {
        id: 2,
        nombre: 'Revisión general',
        descripcion: 'Inspección completa del vehículo incluyendo frenos, luces y motor',
        imagen: '/img/revision-general.jpg',
        precio: 80.00,
        duracion: '2 horas'
      },
      {
        id: 3,
        nombre: 'Reparación de frenos',
        descripcion: 'Reparación completa del sistema de frenos',
        imagen: '/img/frenos.jpg',
        precio: 120.00,
        duracion: '2.5 horas'
      },
      {
        id: 4,
        nombre: 'Cambio de pastillas',
        descripcion: 'Cambio de pastillas de freno delanteras y traseras',
        imagen: '/img/pastillas.jpg',
        precio: 80.00,
        duracion: '1 hora'
      },
      {
        id: 5,
        nombre: 'Alineación',
        descripcion: 'Alineación y balanceo de ruedas',
        imagen: '/img/alineacion.jpg',
        precio: 50.00,
        duracion: '1 hora'
      },
      {
        id: 6,
        nombre: 'Diagnóstico computarizado',
        descripcion: 'Diagnóstico completo con scanner automotriz',
        imagen: '/img/diagnostico.jpg',
        precio: 35.00,
        duracion: '45 minutos'
      }
    ];

    this.serviciosSubject.next(serviciosIniciales);
    this.guardarEnStorage(serviciosIniciales);
  }

  private guardarEnStorage(servicios: Servicio[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(servicios));
    } catch (error) {
      console.error('Error al guardar servicios en localStorage:', error);
    }
  }

  getServicios(): Observable<Servicio[]> {
    return this.servicios$;
  }

  getServiciosSync(): Servicio[] {
    return this.serviciosSubject.value;
  }

  agregarServicio(servicio: Omit<Servicio, 'id'>): Servicio {
    const serviciosActuales = this.serviciosSubject.value;
    const nuevoId = Math.max(...serviciosActuales.map(s => s.id), 0) + 1;
    const nuevoServicio: Servicio = { ...servicio, id: nuevoId };
    
    const serviciosActualizados = [...serviciosActuales, nuevoServicio];
    this.serviciosSubject.next(serviciosActualizados);
    this.guardarEnStorage(serviciosActualizados);
    
    return nuevoServicio;
  }

  actualizarServicio(servicio: Servicio): void {
    const serviciosActuales = this.serviciosSubject.value;
    const index = serviciosActuales.findIndex(s => s.id === servicio.id);
    
    if (index !== -1) {
      serviciosActuales[index] = servicio;
      const serviciosActualizados = [...serviciosActuales];
      this.serviciosSubject.next(serviciosActualizados);
      this.guardarEnStorage(serviciosActualizados);
    }
  }

  eliminarServicio(id: number): void {
    const serviciosActuales = this.serviciosSubject.value;
    const serviciosFiltrados = serviciosActuales.filter(s => s.id !== id);
    this.serviciosSubject.next(serviciosFiltrados);
    this.guardarEnStorage(serviciosFiltrados);
  }

  obtenerServicioPorId(id: number): Servicio | undefined {
    return this.serviciosSubject.value.find(s => s.id === id);
  }

  obtenerServiciosPorIds(ids: number[]): Servicio[] {
    const serviciosActuales = this.serviciosSubject.value;
    return serviciosActuales.filter(s => ids.includes(s.id));
  }
}
