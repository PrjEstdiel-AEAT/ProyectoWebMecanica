import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService, UsuarioLogueado } from '../../servicios/auth.service';

@Component({
  selector: 'app-cliente-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './cliente-layout.component.html',
  styleUrls: ['./cliente-layout.component.scss']
})
export class ClienteLayoutComponent implements OnInit {
  usuario: UsuarioLogueado | null = null;
  isSidebarOpen = true;
  showDropdown: boolean = false;

  constructor(
    private router: Router, 
    private el: ElementRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isSidebarOpen = window.innerWidth > 800;
    
    // Cargar usuario desde AuthService
    this.authService.usuarioLogueado$.subscribe(usuario => {
      this.usuario = usuario;
    });
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
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

