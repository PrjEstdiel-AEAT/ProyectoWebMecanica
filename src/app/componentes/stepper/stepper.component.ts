import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StepperStep {
  numero: number;
  titulo: string;
  completado: boolean;
  activo: boolean;
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stepper-container">
      <div class="stepper">
        <div 
          *ngFor="let step of steps; let i = index" 
          class="step-item"
          [class.completed]="step.completado"
          [class.active]="step.activo"
        >
          <div class="step-circle">
            <span *ngIf="!step.completado" class="step-number">{{ step.numero }}</span>
            <span *ngIf="step.completado" class="step-check">✓</span>
          </div>
          <div class="step-label">{{ step.titulo }}</div>
          <div 
            *ngIf="i < steps.length - 1" 
            class="step-connector"
            [class.completed]="step.completado"
          ></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stepper-container {
      padding: 2rem 0;
      background: #f8f9fa;
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .stepper {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      max-width: 800px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      flex: 1;
      min-width: 120px;
    }

    .step-circle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      border: 3px solid #e9ecef;
      background: white;
      color: #6c757d;
      margin-bottom: 0.5rem;
      z-index: 2;
      position: relative;
    }

    .step-item.active .step-circle {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
      color: white;
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .step-item.completed .step-circle {
      background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
      border-color: #00b894;
      color: white;
    }

    .step-label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #6c757d;
      text-align: center;
      transition: all 0.3s ease;
    }

    .step-item.active .step-label {
      color: #667eea;
      font-weight: 600;
    }

    .step-item.completed .step-label {
      color: #00b894;
      font-weight: 600;
    }

    .step-connector {
      position: absolute;
      top: 25px;
      left: 50%;
      width: 100%;
      height: 3px;
      background: #e9ecef;
      z-index: 1;
      transition: all 0.3s ease;
    }

    .step-connector.completed {
      background: linear-gradient(90deg, #00b894 0%, #00a085 100%);
    }

    .step-check {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .step-number {
      font-size: 1.1rem;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .stepper {
        padding: 0 1rem;
      }
      
      .step-item {
        min-width: 80px;
      }
      
      .step-circle {
        width: 40px;
        height: 40px;
        font-size: 0.9rem;
      }
      
      .step-label {
        font-size: 0.8rem;
      }
      
      .step-connector {
        top: 20px;
      }
    }
  `]
})
export class StepperComponent implements OnInit {
  @Input() pasoActual: number = 1;
  @Input() totalPasos: number = 4;

  steps: StepperStep[] = [];

  ngOnInit() {
    this.inicializarPasos();
  }

  ngOnChanges() {
    this.actualizarPasos();
  }

  private inicializarPasos() {
    const titulos = [
      'Datos del Cliente',
      'Información del Vehículo', 
      'Detalles Adicionales',
      'Confirmación'
    ];

    this.steps = Array.from({ length: this.totalPasos }, (_, i) => ({
      numero: i + 1,
      titulo: titulos[i] || `Paso ${i + 1}`,
      completado: i + 1 < this.pasoActual,
      activo: i + 1 === this.pasoActual
    }));
  }

  private actualizarPasos() {
    if (this.steps.length > 0) {
      this.steps.forEach((step, index) => {
        step.completado = index + 1 < this.pasoActual;
        step.activo = index + 1 === this.pasoActual;
      });
    }
  }
}
