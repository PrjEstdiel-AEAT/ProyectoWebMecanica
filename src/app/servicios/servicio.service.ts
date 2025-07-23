import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
}

@Injectable({ providedIn: 'root' })
export class ServicioService {
  private apiUrl = '/api/servicios';

  constructor(private http: HttpClient) {}

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  getServicio(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/${id}`);
  }

  crearServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.apiUrl, servicio);
  }

  actualizarServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/${servicio.id}`, servicio);
  }

  eliminarServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getServiciosPorMecanico(idMecanico: number): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/mecanico/${idMecanico}`);
  }

  asignarServiciosAMecanico(idMecanico: number, servicios: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignar`, { idMecanico, servicios });
  }
}
