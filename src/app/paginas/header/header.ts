import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  menuOpen = false;
  userLogged = false;
  userEmail: string | null = null;
  userFullName: string | null = null;

  constructor() {
    this.updateUserState();
  }

  updateUserState() {
    this.userLogged = localStorage.getItem('userLogged') === 'true';
    this.userEmail = localStorage.getItem('user');
    const nombre = localStorage.getItem('nombre');
    const apellido = localStorage.getItem('apellido');
    this.userFullName = nombre && apellido ? `${nombre} ${apellido}` : null;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userLogged');
    window.location.reload();
  }
}