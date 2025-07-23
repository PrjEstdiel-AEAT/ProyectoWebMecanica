import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from "./paginas/header/header";
import { Footer } from "./paginas/footer/footer";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'front-mecanica';

  constructor(private router: Router) {}

  esRutaCliente(): boolean {
    return this.router.url.startsWith('/cliente');
  }

  esRutaAdmin(): boolean {
    return this.router.url.startsWith('/admin');
  }

  esRutaMecanico(): boolean {
    return this.router.url.startsWith('/mecanico');
  }
}
