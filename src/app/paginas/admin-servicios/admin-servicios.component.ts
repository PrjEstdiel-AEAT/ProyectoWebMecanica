import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ServiciosService, Servicio } from '../../servicios/servicios.service';

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="servicios-container">
      <div class="servicios-header">
        <h1>Gestión de Servicios</h1>
        <button class="btn-nuevo" (click)="abrirModalNuevo()">
          <i class="fas fa-plus"></i> Nuevo Servicio
        </button>
      </div>

      <div class="servicios-grid">
        <div class="servicio-card" *ngFor="let servicio of servicios">
          <div class="servicio-imagen">
            <img [src]="servicio.imagen || '/img/servicio-default.jpg'" [alt]="servicio.nombre">
          </div>
          <div class="servicio-info">
            <h3>{{ servicio.nombre }}</h3>
            <p>{{ servicio.descripcion }}</p>
            <div class="servicio-detalles" *ngIf="servicio.precio || servicio.duracion">
              <span *ngIf="servicio.precio" class="precio">\${{ servicio.precio }}</span>
              <span *ngIf="servicio.duracion" class="duracion">{{ servicio.duracion }}</span>
            </div>
          </div>
          <div class="servicio-acciones">
            <button class="btn-accion editar" (click)="editarServicio(servicio)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-accion eliminar" (click)="eliminarServicio(servicio)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="mostrarModal" (click)="cerrarModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ servicioEditando ? 'Editar Servicio' : 'Nuevo Servicio' }}</h2>
            <button class="btn-cerrar" (click)="cerrarModal()">×</button>
          </div>
          
          <form class="servicio-form" (ngSubmit)="guardarServicio()">
            <div class="form-group">
              <label>Nombre del Servicio *</label>
              <input type="text" [(ngModel)]="servicioForm.nombre" name="nombre" required>
            </div>
            
            <div class="form-group">
              <label>Descripción *</label>
              <textarea [(ngModel)]="servicioForm.descripcion" name="descripcion" rows="3" required></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Precio (opcional)</label>
                <input type="number" [(ngModel)]="servicioForm.precio" name="precio" min="0" step="0.01">
              </div>
              <div class="form-group">
                <label>Duración (opcional)</label>
                <input type="text" [(ngModel)]="servicioForm.duracion" name="duracion" placeholder="ej: 2 horas">
              </div>
            </div>
            
            <div class="form-group">
              <label>URL de Imagen</label>
              <input type="url" [(ngModel)]="servicioForm.imagen" name="imagen" placeholder="https://ejemplo.com/imagen.jpg">
            </div>
            
            <div class="form-buttons">
              <button type="button" class="btn-cancelar" (click)="cerrarModal()">Cancelar</button>
              <button type="submit" class="btn-guardar">
                {{ servicioEditando ? 'Actualizar' : 'Crear' }} Servicio
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .servicios-container {
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .servicios-header {
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
      
      .btn-nuevo {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }
      }
    }

    .servicios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .servicio-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
      }
    }

    .servicio-imagen {
      height: 200px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .servicio-info {
      padding: 1.5rem;
      
      h3 {
        color: #2c3e50;
        font-size: 1.3rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
      }
      
      p {
        color: #6c757d;
        line-height: 1.5;
        margin: 0 0 1rem 0;
      }
    }

    .servicio-detalles {
      display: flex;
      gap: 1rem;
      
      .precio {
        background: #e8f5e8;
        color: #2e7d32;
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-weight: 600;
        font-size: 0.9rem;
      }
      
      .duracion {
        background: #e3f2fd;
        color: #1976d2;
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-weight: 600;
        font-size: 0.9rem;
      }
    }

    .servicio-acciones {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem;
      background: #f8f9fa;
      
      .btn-accion {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 8px;
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

    // Modal styles
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #e9ecef;
      
      h2 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.5rem;
      }
      
      .btn-cerrar {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6c757d;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          color: #d32f2f;
        }
      }
    }

    .servicio-form {
      padding: 2rem;
      
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      
      .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
        
        label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        input, textarea, select {
          padding: 0.8rem;
          border: 2px solid #e9ecef;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.3s ease;
          
          &:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
        }
        
        textarea {
          resize: vertical;
          min-height: 80px;
        }
      }
      
      .form-buttons {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
        
        button {
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-cancelar {
          background: #e9ecef;
          color: #6c757d;
          
          &:hover {
            background: #d6d9dc;
          }
        }
        
        .btn-guardar {
          background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
          color: white;
          
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
          }
        }
      }
    }

    @media (max-width: 768px) {
      .servicios-container {
        padding: 1rem;
      }
      
      .servicios-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .servicios-grid {
        grid-template-columns: 1fr;
      }
      
      .servicio-form .form-row {
      }

      .servicio-titulo {
        font-weight: 600;
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
      }

      .servicio-descripcion {
        font-size: 0.9rem;
        color: #6c757d;
      }

      .servicio-precio {
        font-weight: 600;
        font-size: 1.2rem;
        color: #2c3e50;
      }

      .servicio-duracion {
        font-size: 0.9rem;
        color: #6c757d;
      }

      .servicio-acciones {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem;
        background: #f8f9fa;
        
        .btn-accion {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 8px;
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

      // Modal styles
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #e9ecef;
        
        h2 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.5rem;
        }
        
        .btn-cerrar {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6c757d;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &:hover {
            color: #d32f2f;
          }
        }
      }

      .servicio-form {
        padding: 2rem;
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
          
          label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
          }
          
          input, textarea, select {
            padding: 0.8rem;
            border: 2px solid #e9ecef;
            border-radius: 6px;
            font-size: 1rem;
            transition: all 0.3s ease;
            
            &:focus {
              outline: none;
              border-color: #667eea;
              box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
          }
          
          textarea {
            resize: vertical;
            min-height: 80px;
          }
        }
        
        .form-buttons {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          
          button {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .btn-cancelar {
            background: #e9ecef;
            color: #6c757d;
            
            &:hover {
              background: #d6d9dc;
            }
          }
          
          .btn-guardar {
            background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
            color: white;
            
            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
            }
          }
        }
      }

      @media (max-width: 768px) {
        .servicios-container {
          padding: 1rem;
        }
        
        .servicios-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }
        
        .servicios-grid {
          grid-template-columns: 1fr;
        }
        
        .servicio-form .form-row {
          grid-template-columns: 1fr;
        }
      }
    }
  `]
})
export class AdminServiciosComponent implements OnInit, OnDestroy {
  servicios: Servicio[] = [];
  mostrarModal = false;
  servicioEditando: Servicio | null = null;
  servicioForm: Omit<Servicio, 'id'> = {
    nombre: '',
    descripcion: '',
    imagen: '',
    precio: 0,
    duracion: ''
  };
  private subscription: Subscription = new Subscription();

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit() {
    this.cargarServicios();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cargarServicios() {
    this.subscription.add(
      this.serviciosService.getServicios().subscribe(servicios => {
        this.servicios = servicios;
      })
    );
  }

  abrirModalNuevo() {
    this.servicioEditando = null;
    this.servicioForm = {
      nombre: '',
      descripcion: '',
      imagen: '',
      precio: 0,
      duracion: ''
    };
    this.mostrarModal = true;
  }

  editarServicio(servicio: Servicio) {
    this.servicioEditando = servicio;
    this.servicioForm = { ...servicio };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.servicioEditando = null;
  }

  guardarServicio() {
    if (this.servicioEditando) {
      // Actualizar servicio existente
      const servicioActualizado = { ...this.servicioForm, id: this.servicioEditando.id };
      this.serviciosService.actualizarServicio(servicioActualizado);
      alert('Servicio actualizado correctamente');
    } else {
      // Crear nuevo servicio
      this.serviciosService.agregarServicio(this.servicioForm);
      alert('Servicio creado correctamente');
    }
    
    this.cerrarModal();
  }

  eliminarServicio(servicio: Servicio) {
    if (confirm(`¿Estás seguro de eliminar el servicio "${servicio.nombre}"?`)) {
      this.serviciosService.eliminarServicio(servicio.id);
      alert('Servicio eliminado correctamente');
    }
  }
}
