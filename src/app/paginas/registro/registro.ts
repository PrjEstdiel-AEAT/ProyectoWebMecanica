import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  
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

  register() {
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
    } else if (this.password.length < 6) {
      this.errors['password'] = 'La contraseña debe tener al menos 6 caracteres';
      hasErrors = true;
    }

    if (!this.confirmPassword) {
      this.errors['confirmPassword'] = 'Debes confirmar tu contraseña';
      hasErrors = true;
    } else if (this.password !== this.confirmPassword) {
      this.errors['confirmPassword'] = 'Las contraseñas no coinciden';
      hasErrors = true;
    }

    // Si hay errores, mostrar modal con el primer error
    if (hasErrors) {
      const firstError = Object.values(this.errors)[0];
      this.showErrorModal(firstError);
      return;
    }

    // Si todo está bien, crear la cuenta
    this.showErrorModal('¡Cuenta creada exitosamente!');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
