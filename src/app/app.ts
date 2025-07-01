import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./paginas/footer/footer";
import { Header } from "./paginas/header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'front-mecanica';
}
