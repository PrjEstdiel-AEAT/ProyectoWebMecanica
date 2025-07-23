import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mecanico-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="configuracion-container">
      <div class="configuracion-header">
        <h1>Mi Perfil</h1>
      </div>

      <div class="perfil-card">
        <div class="perfil-avatar">
          <img src="/img/mecanico-avatar.svg" alt="Mecánico">
          <button class="btn-cambiar-foto">
            <i class="fas fa-camera"></i>
          </button>
        </div>

        <div class="perfil-contenido">
          <div class="perfil-datos" *ngIf="!modoEdicion">
            <div class="dato-grupo">
              <label>Nombre completo</label>
              <span>{{ mecanico.nombre }} {{ mecanico.apellido }}</span>
            </div>
            
            <div class="dato-grupo">
              <label>Email</label>
              <span>{{ mecanico.email }}</span>
            </div>
            
            <div class="dato-grupo">
              <label>Teléfono</label>
              <span>{{ mecanico.telefono }}</span>
            </div>
            
            <div class="dato-grupo">
              <label>Especialidad</label>
              <span class="especialidad-badge">{{ mecanico.especialidad }}</span>
            </div>
            
            <div class="dato-grupo">
              <label>Años de experiencia</label>
              <span>{{ mecanico.experiencia }} años</span>
            </div>
            
            <div class="dato-grupo">
              <label>Estado</label>
              <span class="estado-badge" [class]="mecanico.activo ? 'activo' : 'inactivo'">
                {{ mecanico.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>

          <form class="perfil-form" *ngIf="modoEdicion" (ngSubmit)="guardarCambios()">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre *</label>
                <input type="text" [(ngModel)]="mecanicoForm.nombre" name="nombre" required>
              </div>
              <div class="form-group">
                <label>Apellido *</label>
                <input type="text" [(ngModel)]="mecanicoForm.apellido" name="apellido" required>
              </div>
            </div>
            
            <div class="form-group">
              <label>Email *</label>
              <input type="email" [(ngModel)]="mecanicoForm.email" name="email" required>
            </div>
            
            <div class="form-group">
              <label>Teléfono</label>
              <input type="tel" [(ngModel)]="mecanicoForm.telefono" name="telefono">
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Especialidad *</label>
                <select [(ngModel)]="mecanicoForm.especialidad" name="especialidad" required>
                  <option value="">Seleccionar especialidad</option>
                  <option value="Motor">Motor</option>
                  <option value="Frenos">Frenos</option>
                  <option value="Transmisión">Transmisión</option>
                  <option value="Electricidad">Electricidad</option>
                  <option value="Carrocería">Carrocería</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div class="form-group">
                <label>Años de Experiencia *</label>
                <input type="number" [(ngModel)]="mecanicoForm.experiencia" name="experiencia" min="0" max="50" required>
              </div>
            </div>
            
            <div class="form-group">
              <label>Nueva contraseña</label>
              <input type="password" [(ngModel)]="mecanicoForm.nuevaPassword" name="nuevaPassword">
            </div>
            
            <div class="form-group" *ngIf="mecanicoForm.nuevaPassword">
              <label>Confirmar contraseña *</label>
              <input type="password" [(ngModel)]="mecanicoForm.confirmarPassword" name="confirmarPassword">
            </div>
          </form>

          <div class="perfil-acciones">
            <button *ngIf="!modoEdicion" class="btn-editar" (click)="activarEdicion()">
              <i class="fas fa-edit"></i> Editar Perfil
            </button>
            
            <div *ngIf="modoEdicion" class="acciones-edicion">
              <button type="button" class="btn-cancelar" (click)="cancelarEdicion()">
                <i class="fas fa-times"></i> Cancelar
              </button>
              <button type="submit" class="btn-guardar" (click)="guardarCambios()">
                <i class="fas fa-save"></i> Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .configuracion-container {
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .configuracion-header {
      margin-bottom: 2rem;
      
      h1 {
        color: #2c3e50;
        font-size: 2rem;
        font-weight: 700;
        margin: 0;
      }
    }

    .perfil-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      overflow: hidden;
      display: flex;
    }

    .perfil-avatar {
      position: relative;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 250px;
      
      img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid rgba(255,255,255,0.3);
        margin-bottom: 1rem;
      }
      
      .btn-cambiar-foto {
        background: rgba(255,255,255,0.2);
        border: 2px solid rgba(255,255,255,0.3);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(255,255,255,0.3);
        }
      }
    }

    .perfil-contenido {
      flex: 1;
      padding: 2rem;
    }

    .perfil-datos {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      
      .dato-grupo {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        
        label {
          font-weight: 600;
          color: #6c757d;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        span {
          color: #2c3e50;
          font-size: 1.1rem;
          font-weight: 500;
        }
        
        .especialidad-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.3rem 1rem;
          border-radius: 15px;
          font-size: 0.9rem;
          font-weight: 600;
          width: fit-content;
        }
        
        .estado-badge {
          padding: 0.3rem 1rem;
          border-radius: 15px;
          font-size: 0.9rem;
          font-weight: 600;
          width: fit-content;
          
          &.activo {
            background: #e8f5e8;
            color: #2e7d32;
          }
          
          &.inactivo {
            background: #ffebee;
            color: #d32f2f;
          }
        }
      }
    }

    .perfil-form {
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
        
        input, select {
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
      }
    }

    .perfil-acciones {
      margin-top: 2rem;
      
      .btn-editar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
      }
      
      .acciones-edicion {
        display: flex;
        gap: 1rem;
        
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
      .configuracion-container {
        padding: 1rem;
      }
      
      .perfil-card {
        flex-direction: column;
        
        .perfil-avatar {
          min-width: auto;
        }
      }
      
      .perfil-form .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MecanicoPerfilComponent implements OnInit {
  modoEdicion: boolean = false;
  
  mecanico = {
    nombre: 'Carlos',
    apellido: 'López',
    email: 'carlos.lopez@taller.com',
    telefono: '+1234567890',
    especialidad: 'Motor',
    experiencia: 8,
    activo: true
  };
  
  mecanicoForm = { ...this.mecanico, nuevaPassword: '', confirmarPassword: '' };

  ngOnInit() {
    // Cargar datos del mecánico desde localStorage o API
    const mecanicoData = localStorage.getItem('mecanicoData');
    if (mecanicoData) {
      this.mecanico = JSON.parse(mecanicoData);
      this.mecanicoForm = { ...this.mecanico, nuevaPassword: '', confirmarPassword: '' };
    }
  }

  activarEdicion() {
    this.modoEdicion = true;
    this.mecanicoForm = { ...this.mecanico, nuevaPassword: '', confirmarPassword: '' };
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.mecanicoForm = { ...this.mecanico, nuevaPassword: '', confirmarPassword: '' };
  }

  guardarCambios() {
    if (this.mecanicoForm.nuevaPassword && this.mecanicoForm.nuevaPassword !== this.mecanicoForm.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    this.mecanico = {
      nombre: this.mecanicoForm.nombre,
      apellido: this.mecanicoForm.apellido,
      email: this.mecanicoForm.email,
      telefono: this.mecanicoForm.telefono,
      especialidad: this.mecanicoForm.especialidad,
      experiencia: this.mecanicoForm.experiencia,
      activo: this.mecanico.activo
    };
    
    // Guardar en localStorage
    localStorage.setItem('mecanicoData', JSON.stringify(this.mecanico));
    
    this.modoEdicion = false;
    alert('Perfil actualizado correctamente');
  }
}
