import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss'
})
export class Contacto {
  nombre: string = '';
  celular: string = '';
  email: string = '';
  mensaje: string = '';

  errors: { [key: string]: string } = {};
  showModal: boolean = false;
  modalMessage: string = '';
  mensajeEnviado: boolean = false;

  constructor() { }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateCelular(cel: string): boolean {
    const celularRegex = /^[0-9]{9}$/;
    return celularRegex.test(cel);
  }

  closeModal() {
    this.showModal = false;
    this.mensajeEnviado = false;
  }

  enviarMensaje() {
    this.errors = {};
    let hasErrors = false;

    if (!this.nombre.trim()) {
      this.errors['nombre'] = 'El nombre es obligatorio';
      hasErrors = true;
    }

    if (!this.celular.trim()) {
      this.errors['celular'] = 'El celular es obligatorio';
      hasErrors = true;
    } else if (!this.validateCelular(this.celular)) {
      this.errors['celular'] = 'El celular debe tener 9 dígitos';
      hasErrors = true;
    }

    if (!this.email.trim()) {
      this.errors['email'] = 'El correo electrónico es obligatorio';
      hasErrors = true;
    } else if (!this.validateEmail(this.email)) {
      this.errors['email'] = 'Correo electrónico no válido';
      hasErrors = true;
    }

    if (!this.mensaje.trim()) {
      this.errors['mensaje'] = 'El mensaje no puede estar vacío';
      hasErrors = true;
    }

    if (hasErrors) {
      const firstError = Object.values(this.errors)[0];
      this.showModal = true;
      this.modalMessage = firstError;
      return;
    }

    // Mostrar mensaje de éxito con los datos
    this.modalMessage = 'Mensaje enviado exitosamente';
    this.showModal = true;
    this.mensajeEnviado = true;

    // Resetear formulario después de unos segundos si deseas
    setTimeout(() => {
      this.nombre = '';
      this.celular = '';
      this.email = '';
      this.mensaje = '';
    }, 3000);
  }
}
