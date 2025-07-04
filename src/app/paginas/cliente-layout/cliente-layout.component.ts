import { Component, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-cliente-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, NgIf],
  templateUrl: './cliente-layout.component.html',
  styleUrls: ['./cliente-layout.component.scss']
})
export class ClienteLayoutComponent {
  usuario = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  isSidebarOpen = true;
  showDropdown: boolean = false;

  constructor(private router: Router, private el: ElementRef) {}

  ngOnInit() {
    // Por defecto, el menú está abierto en desktop y cerrado en móvil
    this.isSidebarOpen = window.innerWidth > 800;
    const usuariosStr = localStorage.getItem('usuarios') || '[]';
    const usuarios = JSON.parse(usuariosStr);
    const email = localStorage.getItem('user') || '';
    const usuario = usuarios.find((u: any) => u.email === email);
    if (usuario) {
      this.usuario = {
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        email: usuario.email || '',
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || ''
      };
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Solo cierra el menú si el clic es fuera del dropdown
    if (this.showDropdown && this.el && !this.el.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    localStorage.removeItem('userLogged');
    localStorage.removeItem('user');
    localStorage.removeItem('nombre');
    localStorage.removeItem('apellido');
    this.router.navigate(['/login']);
  }
}

