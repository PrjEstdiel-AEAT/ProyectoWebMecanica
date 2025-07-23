import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService, UsuarioLogueado } from '../../servicios/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  admin: UsuarioLogueado | null = null;
  isSidebarOpen = true;
  showDropdown = false;

  constructor(
    private router: Router, 
    private el: ElementRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isSidebarOpen = window.innerWidth > 800;
    
    // Suscribirse al usuario logueado
    this.authService.usuarioLogueado$.subscribe(usuario => {
      this.admin = usuario;
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
    console.log('Dropdown toggled:', this.showDropdown);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
