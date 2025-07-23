import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService, UsuarioLogueado } from '../../servicios/auth.service';

@Component({
  selector: 'app-mecanico-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './mecanico-layout.component.html',
  styleUrls: ['./mecanico-layout.component.scss']
})
export class MecanicoLayoutComponent implements OnInit {
  mecanico: UsuarioLogueado | null = null;
  isSidebarOpen = true;
  showDropdown: boolean = false;

  constructor(
    private router: Router, 
    private el: ElementRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isSidebarOpen = window.innerWidth > 800;
    
    // Cargar mecánico desde AuthService
    this.authService.usuarioLogueado$.subscribe(usuario => {
      this.mecanico = usuario;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSidebarOpen = event.target.innerWidth > 800;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
