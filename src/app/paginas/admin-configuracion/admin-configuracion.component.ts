import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UsuarioLogueado } from '../../servicios/auth.service';

@Component({
  selector: 'app-admin-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="configuracion-container">
      <div class="configuracion-header">
        <h1>Configuración del Perfil</h1>
      </div>

      <div class="perfil-card">
        <div class="perfil-avatar">
          <img src="/img/admin-avatar.svg" alt="Admin">
          <button class="btn-cambiar-foto">
            <i class="fas fa-camera"></i>
          </button>
        </div>

        <div class="perfil-contenido">
          <div class="perfil-datos" *ngIf="!modoEdicion && admin">
            <div class="dato-grupo">
              <label>Nombre completo</label>
              <span>{{ admin.nombre }} {{ admin.apellido }}</span>
            </div>
            
            <div class="dato-grupo">
              <label>Email</label>
              <span>{{ admin.email }}</span>
            </div>
            
            <div class="dato-grupo">
              <label>Teléfono</label>
              <span>{{ admin.telefono || 'No especificado' }}</span>
            </div>
            
            <div class="dato-grupo">
              <label>Rol</label>
              <span class="rol-badge">{{ admin.rol === 'ADMIN' ? 'Administrador' : admin.rol }}</span>
            </div>
            
            <div class="dato-grupo">
              <label>Último acceso</label>
              <span>{{ admin.ultimoAcceso | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          </div>

          <form class="perfil-form" *ngIf="modoEdicion" (ngSubmit)="guardarCambios()">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre *</label>
                <input type="text" [(ngModel)]="adminForm.nombre" name="nombre" 
                       [class.error]="errores.nombre" required>
                <div class="error-message" *ngIf="errores.nombre">{{ errores.nombre }}</div>
              </div>
              <div class="form-group">
                <label>Apellido *</label>
                <input type="text" [(ngModel)]="adminForm.apellido" name="apellido" 
                       [class.error]="errores.apellido" required>
                <div class="error-message" *ngIf="errores.apellido">{{ errores.apellido }}</div>
              </div>
            </div>
            
            <div class="form-group">
              <label>Email *</label>
              <input type="email" [(ngModel)]="adminForm.email" name="email" 
                     [class.error]="errores.email" required>
              <div class="error-message" *ngIf="errores.email">{{ errores.email }}</div>
            </div>
            
            <div class="form-group">
              <label>Teléfono</label>
              <input type="tel" [(ngModel)]="adminForm.telefono" name="telefono"
                     [class.error]="errores.telefono" placeholder="Ej: +57 300 123 4567">
              <div class="error-message" *ngIf="errores.telefono">{{ errores.telefono }}</div>
            </div>
            
            <div class="password-section">
              <h4>🔒 Cambiar Contraseña (Opcional)</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Nueva contraseña</label>
                  <input type="password" [(ngModel)]="adminForm.nuevaPassword" name="nuevaPassword"
                         [class.error]="errores.nuevaPassword" placeholder="Mínimo 6 caracteres">
                  <div class="error-message" *ngIf="errores.nuevaPassword">{{ errores.nuevaPassword }}</div>
                </div>
                
                <div class="form-group" *ngIf="adminForm.nuevaPassword">
                  <label>Confirmar contraseña *</label>
                  <input type="password" [(ngModel)]="adminForm.confirmarPassword" name="confirmarPassword"
                         [class.error]="errores.confirmarPassword" placeholder="Repita la contraseña">
                  <div class="error-message" *ngIf="errores.confirmarPassword">{{ errores.confirmarPassword }}</div>
                </div>
              </div>
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

      <!-- Configuración del sistema -->
      <div class="sistema-card">
        <h2>Configuración del Sistema</h2>
        
        <div class="configuracion-opciones">
          <div class="opcion-grupo">
            <h3>Notificaciones</h3>
            <div class="opcion-item">
              <label class="switch">
                <input type="checkbox" [(ngModel)]="configuracion.notificacionesEmail">
                <span class="slider"></span>
              </label>
              <span>Recibir notificaciones por email</span>
            </div>
            <div class="opcion-item">
              <label class="switch">
                <input type="checkbox" [(ngModel)]="configuracion.notificacionesReservas">
                <span class="slider"></span>
              </label>
              <span>Notificar nuevas reservas</span>
            </div>
          </div>
          
          <div class="opcion-grupo">
            <h3>Horarios del Taller</h3>
            <div class="horarios-grid">
              <div class="horario-item">
                <label>Hora de apertura</label>
                <input type="time" [(ngModel)]="configuracion.horaApertura">
              </div>
              <div class="horario-item">
                <label>Hora de cierre</label>
                <input type="time" [(ngModel)]="configuracion.horaCierre">
              </div>
            </div>
          </div>
          
          <div class="opcion-grupo">
            <h3>Configuración de Reservas</h3>
            <div class="reservas-config">
              <div class="config-item">
                <label>Tiempo máximo de reserva (días)</label>
                <input type="number" [(ngModel)]="configuracion.maxDiasReserva" min="1" max="365">
              </div>
              <div class="config-item">
                <label>Tiempo mínimo entre reservas (horas)</label>
                <input type="number" [(ngModel)]="configuracion.minHorasEntreReservas" min="1" max="24">
              </div>
            </div>
          </div>
        </div>
        
        <div class="sistema-acciones">
          <button class="btn-guardar-config" (click)="guardarConfiguracion()">
            <i class="fas fa-cog"></i> Guardar Configuración
          </button>
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

    .perfil-card, .sistema-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .perfil-card {
      display: flex;
      
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
        
        .rol-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.3rem 1rem;
          border-radius: 15px;
          font-size: 0.9rem;
          font-weight: 600;
          width: fit-content;
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
        
        input {
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
          
          &.error {
            border-color: #dc3545;
            background-color: #fff5f5;
            
            &:focus {
              border-color: #dc3545;
              box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
            }
          }
        }
        
        .error-message {
          color: #dc3545;
          font-size: 0.8rem;
          margin-top: 0.3rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          
          &::before {
            content: '⚠';
            margin-right: 0.3rem;
            font-size: 0.9rem;
          }
        }
      }
    }
    
    .password-section {
      margin: 1.5rem 0;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      
      h4 {
        margin: 0 0 1rem 0;
        color: #2c3e50;
        font-size: 1.1rem;
        font-weight: 600;
        display: flex;
        align-items: center;
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

    .sistema-card {
      padding: 2rem;
      
      h2 {
        color: #2c3e50;
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 2rem 0;
      }
    }

    .configuracion-opciones {
      display: grid;
      gap: 2rem;
      
      .opcion-grupo {
        h3 {
          color: #2c3e50;
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e9ecef;
        }
        
        .opcion-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          
          span {
            color: #2c3e50;
            font-weight: 500;
          }
        }
      }
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
      
      input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 24px;
        
        &:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
      }
      
      input:checked + .slider {
        background-color: #667eea;
      }
      
      input:checked + .slider:before {
        transform: translateX(26px);
      }
    }

    .horarios-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      
      .horario-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        
        label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9rem;
        }
        
        input {
          padding: 0.8rem;
          border: 2px solid #e9ecef;
          border-radius: 6px;
          font-size: 1rem;
          
          &:focus {
            outline: none;
            border-color: #667eea;
          }
        }
      }
    }

    .reservas-config {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      
      .config-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        
        label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9rem;
        }
        
        input {
          padding: 0.8rem;
          border: 2px solid #e9ecef;
          border-radius: 6px;
          font-size: 1rem;
          
          &:focus {
            outline: none;
            border-color: #667eea;
          }
        }
      }
    }

    .sistema-acciones {
      margin-top: 2rem;
      text-align: center;
      
      .btn-guardar-config {
        background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
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
      
      .horarios-grid, .reservas-config {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminConfiguracionComponent implements OnInit {
  modoEdicion: boolean = false;
  admin: UsuarioLogueado | null = null;
  adminForm: any = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    nuevaPassword: '',
    confirmarPassword: ''
  };
  
  // Campos para validación
  errores: any = {};
  
  configuracion = {
    notificacionesEmail: true,
    notificacionesReservas: true,
    horaApertura: '08:00',
    horaCierre: '18:00',
    maxDiasReserva: 30,
    minHorasEntreReservas: 2
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Cargar datos del usuario logueado
    this.authService.usuarioLogueado$.subscribe(usuario => {
      if (usuario) {
        this.admin = usuario;
        this.adminForm = {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          telefono: usuario.telefono || '',
          nuevaPassword: '',
          confirmarPassword: ''
        };
      }
    });
  }

  activarEdicion() {
    this.modoEdicion = true;
    if (this.admin) {
      this.adminForm = {
        nombre: this.admin.nombre,
        apellido: this.admin.apellido,
        email: this.admin.email,
        telefono: this.admin.telefono || '',
        nuevaPassword: '',
        confirmarPassword: ''
      };
    }
    this.errores = {};
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    if (this.admin) {
      this.adminForm = {
        nombre: this.admin.nombre,
        apellido: this.admin.apellido,
        email: this.admin.email,
        telefono: this.admin.telefono || '',
        nuevaPassword: '',
        confirmarPassword: ''
      };
    }
    this.errores = {};
  }

  // Métodos de validación
  validarFormulario(): boolean {
    this.errores = {};
    let esValido = true;

    // Validar nombre
    if (!this.adminForm.nombre || this.adminForm.nombre.trim().length < 2) {
      this.errores.nombre = 'El nombre debe tener al menos 2 caracteres';
      esValido = false;
    }

    // Validar apellido
    if (!this.adminForm.apellido || this.adminForm.apellido.trim().length < 2) {
      this.errores.apellido = 'El apellido debe tener al menos 2 caracteres';
      esValido = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.adminForm.email || !emailRegex.test(this.adminForm.email)) {
      this.errores.email = 'Ingrese un email válido';
      esValido = false;
    }

    // Validar teléfono (opcional)
    if (this.adminForm.telefono && this.adminForm.telefono.trim()) {
      const telefonoRegex = /^[0-9+\-\s()]{8,15}$/;
      if (!telefonoRegex.test(this.adminForm.telefono.trim())) {
        this.errores.telefono = 'Ingrese un teléfono válido';
        esValido = false;
      }
    }

    // Validar contraseña si se ingresó
    if (this.adminForm.nuevaPassword) {
      if (this.adminForm.nuevaPassword.length < 6) {
        this.errores.nuevaPassword = 'La contraseña debe tener al menos 6 caracteres';
        esValido = false;
      }
      
      if (!this.adminForm.confirmarPassword) {
        this.errores.confirmarPassword = 'Confirme la contraseña';
        esValido = false;
      } else if (this.adminForm.nuevaPassword !== this.adminForm.confirmarPassword) {
        this.errores.confirmarPassword = 'Las contraseñas no coinciden';
        esValido = false;
      }
    }

    return esValido;
  }

  guardarCambios() {
    if (!this.validarFormulario()) {
      return;
    }

    if (!this.admin) {
      alert('Error: No se pudo cargar la información del usuario');
      return;
    }
    
    // Actualizar datos del usuario
    const usuarioActualizado: UsuarioLogueado = {
      ...this.admin,
      nombre: this.adminForm.nombre,
      apellido: this.adminForm.apellido,
      email: this.adminForm.email,
      telefono: this.adminForm.telefono
    };
    
    // Actualizar en el servicio de autenticación
    this.authService.actualizarUsuarioLogueado(usuarioActualizado);
    
    // Actualizar contraseña si se proporcionó
    if (this.adminForm.nuevaPassword) {
      this.authService.actualizarPassword(this.adminForm.nuevaPassword);
    }
    
    this.modoEdicion = false;
    this.errores = {};
    alert('Perfil actualizado correctamente');
  }

  guardarConfiguracion() {
    // Guardar configuración del sistema
    localStorage.setItem('sistemaConfig', JSON.stringify(this.configuracion));
    alert('Configuración guardada correctamente');
  }
}
