import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Footer } from "./paginas/footer/footer";
import { Header } from "./paginas/header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'front-mecanica';

  constructor(private router: Router) {}

  esRutaCliente(): boolean {
    return this.router.url.startsWith('/cliente');
  }
}
