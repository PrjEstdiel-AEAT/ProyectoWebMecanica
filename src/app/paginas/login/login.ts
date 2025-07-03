import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email: string = '';
  password: string = '';
  
  // Propiedades para manejar errores
  errors: { [key: string]: string } = {};
  showModal: boolean = false;
  modalMessage: string = '';

  constructor(private router: Router) {}

  // Función para validar email
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Función para mostrar modal
  showErrorModal(message: string) {
    this.modalMessage = message;
    this.showModal = true;
    
    // Auto-cerrar el modal después de 3 segundos
    setTimeout(() => {
      this.showModal = false;
    }, 3000);
  }

  // Función para cerrar modal manualmente
  closeModal() {
    this.showModal = false;
  }

  login() {
    // Limpiar errores previos
    this.errors = {};

    // Validar cada campo
    let hasErrors = false;

    if (!this.email) {
      this.errors['email'] = 'El correo electrónico es obligatorio';
      hasErrors = true;
    } else if (!this.validateEmail(this.email)) {
      this.errors['email'] = 'Por favor, ingresa un correo electrónico válido';
      hasErrors = true;
    }

    if (!this.password) {
      this.errors['password'] = 'La contraseña es obligatoria';
      hasErrors = true;
    }

    // Si hay errores, mostrar modal con el primer error
    if (hasErrors) {
      const firstError = Object.values(this.errors)[0];
      this.showErrorModal(firstError);
      return;
    }

    // Validar usuario contra la lista en localStorage
    const usuariosStr = localStorage.getItem('usuarios') || '[]';
    const usuarios = JSON.parse(usuariosStr);
    const usuario = usuarios.find((u: any) => u.email === this.email && u.password === this.password);
    if (!usuario) {
      this.showErrorModal('Correo o contraseña incorrectos');
      return;
    }
    localStorage.setItem('userLogged', 'true');
    localStorage.setItem('user', this.email);
    localStorage.setItem('nombre', usuario.nombre);
    localStorage.setItem('apellido', usuario.apellido);
    // Redirección inteligente
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      this.router.navigate([redirect]);
    } else {
      this.router.navigate(['/inicio']);
    }
  }

  // Método estático para obtener el usuario autenticado
  static getAuthenticatedUser(): string | null {
    return localStorage.getItem('user');
  }
}
