import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  rol: 'CLIENTE' | 'MECANICO' | 'ADMIN';
  password?: string;
  activo: boolean;
}

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.scss']
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  filtroRol: string = 'todos';
  mostrarModal: boolean = false;
  usuarioEditando: Usuario | null = null;
  
  usuarioForm: Usuario = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    rol: 'CLIENTE',
    password: '',
    activo: true
  };

  // Campos para validación
  confirmarPassword: string = '';
  errores: any = {};
  emailExiste: boolean = false;

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    // Cargar usuarios desde localStorage
    const usuariosStr = localStorage.getItem('usuarios') || '[]';
    this.usuarios = JSON.parse(usuariosStr).map((u: any, index: number) => ({
      id: index + 1,
      nombre: u.nombre || '',
      apellido: u.apellido || '',
      email: u.email,
      telefono: u.telefono || '',
      direccion: u.direccion || '',
      rol: u.rol || 'CLIENTE',
      activo: u.activo !== false
    }));
    
    this.filtrarUsuarios();
  }

  filtrarPorRol(rol: string) {
    this.filtroRol = rol;
    this.filtrarUsuarios();
  }

  filtrarUsuarios() {
    if (this.filtroRol === 'todos') {
      this.usuariosFiltrados = [...this.usuarios];
    } else {
      this.usuariosFiltrados = this.usuarios.filter(u => u.rol === this.filtroRol);
    }
  }

  getUsuariosPorRol(rol: string): Usuario[] {
    return this.usuarios.filter(u => u.rol === rol);
  }

  getTotalUsuarios(): number {
    return this.usuarios.length;
  }

  abrirModalNuevo() {
    this.usuarioEditando = null;
    this.usuarioForm = {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      rol: 'CLIENTE',
      password: '',
      activo: true
    };
    this.confirmarPassword = '';
    this.errores = {};
    this.emailExiste = false;
    this.mostrarModal = true;
  }

  editarUsuario(usuario: Usuario) {
    this.usuarioEditando = usuario;
    this.usuarioForm = { ...usuario, password: '' };
    this.confirmarPassword = '';
    this.errores = {};
    this.emailExiste = false;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.usuarioEditando = null;
    this.confirmarPassword = '';
    this.errores = {};
    this.emailExiste = false;
  }

  // Métodos de validación
  validarFormulario(): boolean {
    this.errores = {};
    let esValido = true;

    // Validar nombre
    if (!this.usuarioForm.nombre || this.usuarioForm.nombre.trim().length < 2) {
      this.errores.nombre = 'El nombre debe tener al menos 2 caracteres';
      esValido = false;
    }

    // Validar apellido
    if (!this.usuarioForm.apellido || this.usuarioForm.apellido.trim().length < 2) {
      this.errores.apellido = 'El apellido debe tener al menos 2 caracteres';
      esValido = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.usuarioForm.email || !emailRegex.test(this.usuarioForm.email)) {
      this.errores.email = 'Ingrese un email válido';
      esValido = false;
    } else {
      // Verificar si el email ya existe (solo para nuevos usuarios o si cambió el email)
      const emailExistente = this.usuarios.find(u => 
        u.email.toLowerCase() === this.usuarioForm.email.toLowerCase() && 
        (!this.usuarioEditando || u.email !== this.usuarioEditando.email)
      );
      if (emailExistente) {
        this.errores.email = 'Este email ya está registrado';
        this.emailExiste = true;
        esValido = false;
      }
    }

    // Validar teléfono (opcional pero si se ingresa debe ser válido)
    if (this.usuarioForm.telefono && this.usuarioForm.telefono.trim()) {
      const telefonoRegex = /^[0-9+\-\s()]{8,15}$/;
      if (!telefonoRegex.test(this.usuarioForm.telefono.trim())) {
        this.errores.telefono = 'Ingrese un teléfono válido (8-15 dígitos)';
        esValido = false;
      }
    }

    // Validar contraseña
    if (!this.usuarioEditando) {
      // Para nuevos usuarios, la contraseña es obligatoria
      if (!this.usuarioForm.password || this.usuarioForm.password.length < 6) {
        this.errores.password = 'La contraseña debe tener al menos 6 caracteres';
        esValido = false;
      }
    } else {
      // Para usuarios existentes, solo validar si se ingresó una nueva contraseña
      if (this.usuarioForm.password && this.usuarioForm.password.length < 6) {
        this.errores.password = 'La contraseña debe tener al menos 6 caracteres';
        esValido = false;
      }
    }

    // Validar confirmación de contraseña
    if (this.usuarioForm.password) {
      if (!this.confirmarPassword) {
        this.errores.confirmarPassword = 'Confirme la contraseña';
        esValido = false;
      } else if (this.usuarioForm.password !== this.confirmarPassword) {
        this.errores.confirmarPassword = 'Las contraseñas no coinciden';
        esValido = false;
      }
    }

    return esValido;
  }

  // Validación en tiempo real para email
  validarEmail() {
    if (this.usuarioForm.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.usuarioForm.email)) {
        this.errores.email = 'Formato de email inválido';
      } else {
        const emailExistente = this.usuarios.find(u => 
          u.email.toLowerCase() === this.usuarioForm.email.toLowerCase() && 
          (!this.usuarioEditando || u.email !== this.usuarioEditando.email)
        );
        if (emailExistente) {
          this.errores.email = 'Este email ya está registrado';
          this.emailExiste = true;
        } else {
          delete this.errores.email;
          this.emailExiste = false;
        }
      }
    }
  }

  // Validación en tiempo real para confirmación de contraseña
  validarConfirmarPassword() {
    if (this.confirmarPassword && this.usuarioForm.password) {
      if (this.usuarioForm.password !== this.confirmarPassword) {
        this.errores.confirmarPassword = 'Las contraseñas no coinciden';
      } else {
        delete this.errores.confirmarPassword;
      }
    }
  }

  guardarUsuario() {
    // Validar formulario antes de guardar
    if (!this.validarFormulario()) {
      return; // No guardar si hay errores
    }

    const usuariosStr = localStorage.getItem('usuarios') || '[]';
    let usuarios = JSON.parse(usuariosStr);

    if (this.usuarioEditando) {
      // Actualizar usuario existente
      const index = usuarios.findIndex((u: any) => u.email === this.usuarioEditando!.email);
      if (index !== -1) {
        usuarios[index] = {
          ...usuarios[index],
          nombre: this.usuarioForm.nombre,
          apellido: this.usuarioForm.apellido,
          email: this.usuarioForm.email,
          telefono: this.usuarioForm.telefono,
          direccion: this.usuarioForm.direccion,
          rol: this.usuarioForm.rol,
          activo: this.usuarioForm.activo
        };
        
        // Solo actualizar contraseña si se proporcionó una nueva
        if (this.usuarioForm.password) {
          usuarios[index].password = this.usuarioForm.password;
        }
      }
    } else {
      // Crear nuevo usuario
      const nuevoUsuario = {
        nombre: this.usuarioForm.nombre,
        apellido: this.usuarioForm.apellido,
        email: this.usuarioForm.email,
        telefono: this.usuarioForm.telefono,
        direccion: this.usuarioForm.direccion,
        rol: this.usuarioForm.rol,
        password: this.usuarioForm.password,
        activo: this.usuarioForm.activo
      };
      usuarios.push(nuevoUsuario);
    }

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    this.cargarUsuarios();
    this.cerrarModal();
    
    const accion = this.usuarioEditando ? 'actualizado' : 'creado';
    alert(`Usuario ${accion} correctamente`);
  }

  eliminarUsuario(usuario: Usuario) {
    if (confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`)) {
      const usuariosStr = localStorage.getItem('usuarios') || '[]';
      let usuarios = JSON.parse(usuariosStr);
      
      usuarios = usuarios.filter((u: any) => u.email !== usuario.email);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      this.cargarUsuarios();
      alert('Usuario eliminado correctamente');
    }
  }

  toggleEstadoUsuario(usuario: Usuario) {
    const usuariosStr = localStorage.getItem('usuarios') || '[]';
    let usuarios = JSON.parse(usuariosStr);
    
    const index = usuarios.findIndex((u: any) => u.email === usuario.email);
    if (index !== -1) {
      usuarios[index].activo = !usuarios[index].activo;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      this.cargarUsuarios();
      
      const estado = usuarios[index].activo ? 'activado' : 'desactivado';
      alert(`Usuario ${estado} correctamente`);
    }
  }
}
