import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MecanicosService, Mecanico } from '../../servicios/mecanicos.service';
import { ServiciosService, Servicio } from '../../servicios/servicios.service';

@Component({
  selector: 'app-admin-mecanicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-mecanicos">
      <div class="header-section">
        <h2>Gestión de Mecánicos</h2>
        <button class="btn-primary" (click)="abrirModalNuevo()">
          <i class="fas fa-plus"></i> Nuevo Mecánico
        </button>
      </div>

      <div class="mecanicos-grid">
        <div class="mecanico-card" *ngFor="let mecanico of mecanicos">
          <div class="mecanico-header">
            <h3>{{mecanico.nombre}} {{mecanico.apellido}}</h3>
            <div class="estado-badge" [class.activo]="mecanico.activo" [class.inactivo]="!mecanico.activo">
              {{mecanico.activo ? 'Activo' : 'Inactivo'}}
            </div>
          </div>
          
          <div class="mecanico-info">
            <p><i class="fas fa-envelope"></i> {{mecanico.email}}</p>
            <p><i class="fas fa-phone"></i> {{mecanico.telefono}}</p>
            <p><i class="fas fa-wrench"></i> {{mecanico.especialidad}}</p>
            <p><i class="fas fa-calendar"></i> {{mecanico.experiencia}} años de experiencia</p>
          </div>

          <div class="servicios-section" *ngIf="mecanico.serviciosNombres && mecanico.serviciosNombres.length > 0">
            <h4>Servicios que realiza:</h4>
            <div class="servicios-tags">
              <span class="servicio-tag" *ngFor="let servicio of mecanico.serviciosNombres">
                {{servicio}}
              </span>
            </div>
          </div>

          <!-- Sección de Horarios -->
          <div class="horarios-section" *ngIf="mecanico.horarios && mecanico.horarios.length > 0">
            <h4><i class="fas fa-clock"></i> Horarios de Trabajo:</h4>
            <div class="horarios-grid">
              <div class="horario-item" *ngFor="let horario of mecanico.horarios" 
                   [class.disponible]="horario.disponible" [class.no-disponible]="!horario.disponible">
                <div class="dia">{{horario.dia | titlecase}}</div>
                <div class="horas" *ngIf="horario.disponible">
                  {{horario.horaInicio}} - {{horario.horaFin}}
                </div>
                <div class="no-disponible-text" *ngIf="!horario.disponible">
                  No disponible
                </div>
              </div>
            </div>
          </div>

          <div class="mecanico-actions">
            <button class="btn-icon btn-edit" (click)="editarMecanico(mecanico)" title="Editar">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon" (click)="toggleEstado(mecanico)" 
                    [class.btn-activate]="!mecanico.activo" [class.btn-deactivate]="mecanico.activo"
                    [title]="mecanico.activo ? 'Desactivar' : 'Activar'">
              <i class="fas" [class.fa-play]="!mecanico.activo" [class.fa-pause]="mecanico.activo"></i>
            </button>
            <button class="btn-icon btn-delete" (click)="eliminarMecanico(mecanico)" title="Eliminar">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal para crear/editar mecánico -->
      <div class="modal-overlay" *ngIf="mostrarModal" (click)="cerrarModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{mecanicoEditando ? 'Editar Mecánico' : 'Nuevo Mecánico'}}</h3>
            <button class="btn-close" (click)="cerrarModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form class="modal-body" (ngSubmit)="guardarMecanico()">
            <div class="form-row">
              <div class="form-group">
                <label for="nombre">Nombre *</label>
                <input type="text" id="nombre" [(ngModel)]="mecanicoForm.nombre" 
                       name="nombre" required class="form-control">
              </div>
              <div class="form-group">
                <label for="apellido">Apellido *</label>
                <input type="text" id="apellido" [(ngModel)]="mecanicoForm.apellido" 
                       name="apellido" required class="form-control">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" [(ngModel)]="mecanicoForm.email" 
                       name="email" required class="form-control">
              </div>
              <div class="form-group">
                <label for="telefono">Teléfono *</label>
                <input type="tel" id="telefono" [(ngModel)]="mecanicoForm.telefono" 
                       name="telefono" required class="form-control">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="especialidad">Especialidad *</label>
                <input type="text" id="especialidad" [(ngModel)]="mecanicoForm.especialidad" 
                       name="especialidad" required class="form-control">
              </div>
              <div class="form-group">
                <label for="experiencia">Años de Experiencia *</label>
                <input type="number" id="experiencia" [(ngModel)]="mecanicoForm.experiencia" 
                       name="experiencia" required min="0" class="form-control">
              </div>
            </div>

            <div class="form-group">
              <label>
                <input type="checkbox" [(ngModel)]="mecanicoForm.activo" name="activo">
                Mecánico activo
              </label>
            </div>

            <div class="form-group">
              <label>Servicios que puede realizar:</label>
              <div class="servicios-grid">
                <div class="servicio-checkbox" *ngFor="let servicio of serviciosDisponibles">
                  <label>
                    <input type="checkbox" 
                           [checked]="isServicioSelected(servicio.id)"
                           (change)="toggleServicio(servicio.id, $event)">
                    <span class="servicio-info">
                      <strong>{{servicio.nombre}}</strong>
                      <small>\${{servicio.precio}}</small>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Horarios de Trabajo:</label>
              <div class="horarios-section">
                <div class="horario-item" *ngFor="let horario of mecanicoForm.horarios; let i = index">
                  <div class="horario-row">
                    <select [(ngModel)]="horario.dia" name="dia_{{i}}" class="form-control dia-select">
                      <option value="Lunes">Lunes</option>
                      <option value="Martes">Martes</option>
                      <option value="Miércoles">Miércoles</option>
                      <option value="Jueves">Jueves</option>
                      <option value="Viernes">Viernes</option>
                      <option value="Sábado">Sábado</option>
                      <option value="Domingo">Domingo</option>
                    </select>
                    
                    <select [(ngModel)]="horario.turno" name="turno_{{i}}" class="form-control turno-select">
                      <option value="mañana">Mañana</option>
                      <option value="tarde">Tarde</option>
                      <option value="noche">Noche</option>
                    </select>
                    
                    <input type="time" [(ngModel)]="horario.horaInicio" name="horaInicio_{{i}}" 
                           class="form-control time-input" placeholder="Hora inicio">
                    
                    <input type="time" [(ngModel)]="horario.horaFin" name="horaFin_{{i}}" 
                           class="form-control time-input" placeholder="Hora fin">
                    
                    <label class="disponible-check">
                      <input type="checkbox" [(ngModel)]="horario.disponible" name="disponible_{{i}}">
                      <span>Disponible</span>
                    </label>
                    
                    <button type="button" class="btn-remove-horario" (click)="eliminarHorario(i)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                
                <button type="button" class="btn-add-horario" (click)="agregarHorario()">
                  <i class="fas fa-plus"></i> Agregar Horario
                </button>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-secondary" (click)="cerrarModal()">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                {{mecanicoEditando ? 'Actualizar' : 'Crear'}} Mecánico
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-mecanicos {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
    }

    .header-section h2 {
      color: white;
      margin: 0;
      font-size: 2rem;
      font-weight: 600;
    }

    .mecanicos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .mecanico-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e9ecef;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .mecanico-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    }

    .mecanico-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e9ecef;
    }

    .mecanico-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.3rem;
    }

    .estado-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .estado-badge.activo {
      background: #d4edda;
      color: #155724;
    }

    .estado-badge.inactivo {
      background: #f8d7da;
      color: #721c24;
    }

    .mecanico-info {
      margin-bottom: 15px;
    }

    .mecanico-info p {
      margin: 8px 0;
      color: #6c757d;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mecanico-info i {
      width: 16px;
      color: #007bff;
    }

    .servicios-section {
      margin-bottom: 15px;
    }

    .servicios-section h4 {
      margin: 0 0 10px 0;
      color: #495057;
      font-size: 1rem;
    }

    .servicios-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .servicio-tag {
      background: #e3f2fd;
      color: #1565c0;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .mecanico-actions {
      display: flex;
      gap: 8px;
      margin-top: 20px;
      justify-content: flex-end;
    }

    /* Sección de Horarios */
    .horarios-section {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #007bff;
    }

    .horarios-section h4 {
      margin: 0 0 15px 0;
      color: #495057;
      font-size: 1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .horarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 8px;
    }

    .horario-item {
      padding: 8px 10px;
      border-radius: 6px;
      text-align: center;
      font-size: 0.85rem;
      transition: all 0.2s;
    }

    .horario-item.disponible {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }

    .horario-item.no-disponible {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    .horario-item .dia {
      font-weight: 600;
      margin-bottom: 2px;
    }

    .horario-item .horas {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    .horario-item .no-disponible-text {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    /* Botones de Iconos como en la referencia */
    .btn-icon {
      width: 35px;
      height: 35px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-icon.btn-edit {
      background: #e3f2fd;
      color: #1976d2;
    }

    .btn-icon.btn-edit:hover {
      background: #1976d2;
      color: white;
      transform: translateY(-1px);
    }

    .btn-icon.btn-activate {
      background: #e8f5e8;
      color: #4caf50;
    }

    .btn-icon.btn-activate:hover {
      background: #4caf50;
      color: white;
      transform: translateY(-1px);
    }

    .btn-icon.btn-deactivate {
      background: #fff3e0;
      color: #ff9800;
    }

    .btn-icon.btn-deactivate:hover {
      background: #ff9800;
      color: white;
      transform: translateY(-1px);
    }

    .btn-icon.btn-delete {
      background: #ffebee;
      color: #f44336;
    }

    .btn-icon.btn-delete:hover {
      background: #f44336;
      color: white;
      transform: translateY(-1px);
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #764ba2, #667eea);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }



    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    }

    .modal-header h3 {
      margin: 0;
      color: #2c3e50;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #6c757d;
      padding: 5px;
    }

    .btn-close:hover {
      color: #dc3545;
    }

    .modal-body {
      padding: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #495057;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .servicios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 10px;
      max-height: 200px;
      overflow-y: auto;
      padding: 10px;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      background: #f8f9fa;
    }

    .servicio-checkbox {
      display: flex;
      align-items: center;
    }

    .servicio-checkbox label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: background-color 0.2s;
      margin: 0;
    }

    .servicio-checkbox label:hover {
      background: #e9ecef;
    }

    .servicio-info {
      display: flex;
      flex-direction: column;
    }

    .servicio-info small {
      color: #28a745;
      font-weight: 600;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 20px;
      border-top: 1px solid #e9ecef;
      background: #f8f9fa;
    }

    /* Horarios Styles */
    .horarios-section {
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 15px;
      background: #f8f9fa;
      max-height: 300px;
      overflow-y: auto;
    }

    .horario-item {
      margin-bottom: 10px;
      padding: 10px;
      background: white;
      border-radius: 6px;
      border: 1px solid #dee2e6;
    }

    .horario-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr auto auto;
      gap: 10px;
      align-items: center;
    }

    .dia-select, .turno-select {
      min-width: 100px;
    }

    .time-input {
      min-width: 80px;
    }

    .disponible-check {
      display: flex;
      align-items: center;
      gap: 5px;
      margin: 0;
      font-size: 0.9rem;
      white-space: nowrap;
    }

    .disponible-check input[type="checkbox"] {
      width: auto;
      margin: 0;
    }

    .btn-remove-horario {
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 8px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: background-color 0.2s;
    }

    .btn-remove-horario:hover {
      background: #c82333;
    }

    .btn-add-horario {
      background: #28a745;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 10px;
      transition: background-color 0.2s;
    }

    .btn-add-horario:hover {
      background: #218838;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .mecanicos-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .mecanico-actions {
        flex-direction: column;
      }

      .modal-content {
        width: 95%;
        margin: 10px;
      }

      .servicios-grid {
        grid-template-columns: 1fr;
      }

      .horario-row {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .horario-row > * {
        width: 100%;
      }

      .disponible-check {
        justify-content: center;
      }
    }
  `]
})
export class AdminMecanicosComponent implements OnInit, OnDestroy {
  mecanicos: Mecanico[] = [];
  serviciosDisponibles: Servicio[] = [];
  mostrarModal = false;
  mecanicoEditando: Mecanico | null = null;
  mecanicoForm: Partial<Mecanico> = {};
  private subscription = new Subscription();

  constructor(
    private mecanicosService: MecanicosService,
    private serviciosService: ServiciosService
  ) {}

  ngOnInit() {
    this.cargarMecanicos();
    this.cargarServicios();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cargarMecanicos() {
    this.subscription.add(
      this.mecanicosService.getMecanicos().subscribe(mecanicos => {
        this.mecanicos = mecanicos;
      })
    );
  }

  cargarServicios() {
    this.subscription.add(
      this.serviciosService.getServicios().subscribe(servicios => {
        this.serviciosDisponibles = servicios;
      })
    );
  }

  abrirModalNuevo() {
    this.mecanicoEditando = null;
    this.mecanicoForm = {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      especialidad: '',
      experiencia: 0,
      activo: true,
      servicios: [],
      serviciosNombres: [],
      horarios: [
        { dia: 'Lunes', turno: 'mañana', horaInicio: '08:00', horaFin: '12:00', disponible: true },
        { dia: 'Lunes', turno: 'tarde', horaInicio: '14:00', horaFin: '18:00', disponible: true }
      ]
    };
    this.mostrarModal = true;
  }

  editarMecanico(mecanico: Mecanico) {
    this.mecanicoEditando = mecanico;
    this.mecanicoForm = { ...mecanico };
    this.mostrarModal = true;
  }

  guardarMecanico() {
    // Generar nombres de servicios
    const serviciosNombres = this.getServiciosNombres(this.mecanicoForm.servicios || []);
    const mecanicoConNombres = {
      ...this.mecanicoForm,
      serviciosNombres,
      horarios: this.mecanicoForm.horarios || []
    } as Mecanico;
    
    if (this.mecanicoEditando) {
      // Actualizar mecánico existente
      this.mecanicosService.actualizarMecanico({ ...mecanicoConNombres, id: this.mecanicoEditando.id });
      alert('Mecánico actualizado correctamente');
    } else {
      // Crear nuevo mecánico
      this.mecanicosService.agregarMecanico(mecanicoConNombres);
      alert('Mecánico creado correctamente');
    }
    
    this.cerrarModal();
  }

  eliminarMecanico(mecanico: Mecanico) {
    if (confirm(`¿Estás seguro de eliminar al mecánico ${mecanico.nombre} ${mecanico.apellido}?`)) {
      this.mecanicosService.eliminarMecanico(mecanico.id);
      alert('Mecánico eliminado correctamente');
    }
  }

  toggleEstado(mecanico: Mecanico) {
    this.mecanicosService.toggleEstadoMecanico(mecanico.id);
    const estado = !mecanico.activo ? 'activado' : 'desactivado';
    alert(`Mecánico ${estado} correctamente`);
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.mecanicoEditando = null;
  }

  toggleServicio(servicioId: number, event: any) {
    if (!this.mecanicoForm.servicios) {
      this.mecanicoForm.servicios = [];
    }
    
    if (event.target.checked) {
      this.mecanicoForm.servicios.push(servicioId);
    } else {
      this.mecanicoForm.servicios = this.mecanicoForm.servicios.filter(id => id !== servicioId);
    }
  }

  isServicioSelected(servicioId: number): boolean {
    return this.mecanicoForm.servicios?.includes(servicioId) || false;
  }

  private getServiciosNombres(serviciosIds: number[]): string[] {
    return serviciosIds.map(id => {
      const servicio = this.serviciosDisponibles.find(s => s.id === id);
      return servicio ? servicio.nombre : '';
    }).filter(nombre => nombre !== '');
  }

  agregarHorario() {
    if (!this.mecanicoForm.horarios) {
      this.mecanicoForm.horarios = [];
    }
    this.mecanicoForm.horarios.push({
      dia: 'Lunes',
      turno: 'mañana',
      horaInicio: '08:00',
      horaFin: '12:00',
      disponible: true
    });
  }

  eliminarHorario(index: number) {
    if (this.mecanicoForm.horarios) {
      this.mecanicoForm.horarios.splice(index, 1);
    }
  }
}
