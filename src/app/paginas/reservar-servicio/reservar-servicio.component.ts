import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ServiciosService, Servicio } from '../../servicios/servicios.service';
import { MecanicosService, Mecanico, HorarioMecanico } from '../../servicios/mecanicos.service';
import { ReservasService, ReservaEnProceso, DatosCliente, DatosVehiculo } from '../../servicios/reservas.service';
import { StepperComponent } from '../../componentes/stepper/stepper.component';

@Component({
  selector: 'app-reservar-servicio',
  standalone: true,
  imports: [CommonModule, FormsModule, StepperComponent],
  templateUrl: './reservar-servicio.component.html',
  styleUrls: ['./reservar-servicio.component.scss']
})
export class ReservarServicioComponent implements OnInit, OnDestroy {
  // Estados de la vista
  vistaActual: 'servicios' | 'mecanicos' | 'proceso' | 'exito' = 'servicios';
  mostrarModal = false;
  pasoActual = 1;

  // Datos
  servicios: Servicio[] = [];
  mecanicosFiltrados: Mecanico[] = [];
  horariosDisponibles: HorarioMecanico[] = [];

  // Selecciones
  servicioSeleccionado: Servicio | null = null;
  mecanicoSeleccionado: Mecanico | null = null;
  horarioSeleccionado: HorarioMecanico | null = null;

  // Formularios
  datosCliente: DatosCliente = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  datosVehiculo: DatosVehiculo = {
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    placa: '',
    color: '',
    kilometraje: 0
  };

  informacionAdicional = '';
  reservaCreada: any = null;

  private subscription = new Subscription();

  constructor(
    private serviciosService: ServiciosService,
    private mecanicosService: MecanicosService,
    private reservasService: ReservasService
  ) {}

  ngOnInit() {
    this.cargarServicios();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cargarServicios() {
    this.subscription.add(
      this.serviciosService.getServicios().subscribe(servicios => {
        this.servicios = servicios;
      })
    );
  }

  seleccionarServicio(servicio: Servicio) {
    this.servicioSeleccionado = servicio;
    this.mecanicosFiltrados = this.mecanicosService.getMecanicosPorServicio(servicio.id);
    this.vistaActual = 'mecanicos';
  }

  volverAServicios() {
    this.vistaActual = 'servicios';
    this.servicioSeleccionado = null;
    this.mecanicoSeleccionado = null;
    this.horarioSeleccionado = null;
  }

  seleccionarMecanico(mecanico: Mecanico) {
    this.mecanicoSeleccionado = mecanico;
    this.horariosDisponibles = this.mecanicosService.getHorariosDisponibles(mecanico.id);
    this.horarioSeleccionado = null;
  }

  seleccionarHorario(horario: HorarioMecanico) {
    this.horarioSeleccionado = horario;
  }

  mostrarModalConfirmacion() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  iniciarProcesoreserva() {
    this.mostrarModal = false;
    this.vistaActual = 'proceso';
    this.pasoActual = 1;
    
    this.reservasService.iniciarReserva(
      this.servicioSeleccionado,
      this.mecanicoSeleccionado,
      this.horarioSeleccionado
    );
  }

  siguientePaso() {
    if (this.puedeAvanzar()) {
      this.pasoActual++;
      this.actualizarReserva();
    }
  }

  pasoAnterior() {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  puedeAvanzar(): boolean {
    switch (this.pasoActual) {
      case 1:
        return !!(this.datosCliente.nombre && this.datosCliente.apellido && 
                 this.datosCliente.email && this.datosCliente.telefono);
      case 2:
        return !!(this.datosVehiculo.marca && this.datosVehiculo.modelo && 
                 this.datosVehiculo.anio && this.datosVehiculo.placa);
      case 3:
        return true; // Información adicional es opcional
      default:
        return false;
    }
  }

  actualizarReserva() {
    const datos: any = {};
    
    if (this.pasoActual >= 2) {
      datos.datosCliente = this.datosCliente;
    }
    if (this.pasoActual >= 3) {
      datos.datosVehiculo = this.datosVehiculo;
    }
    if (this.pasoActual >= 4) {
      datos.informacionAdicional = this.informacionAdicional;
    }

    this.reservasService.actualizarPaso(this.pasoActual, datos);
  }

  finalizarReserva() {
    this.actualizarReserva();
    this.reservaCreada = this.reservasService.finalizarReserva();
    this.vistaActual = 'exito';
  }

  nuevaReserva() {
    this.vistaActual = 'servicios';
    this.pasoActual = 1;
    this.servicioSeleccionado = null;
    this.mecanicoSeleccionado = null;
    this.horarioSeleccionado = null;
    this.reservaCreada = null;
    
    // Limpiar formularios
    this.datosCliente = {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: ''
    };
    
    this.datosVehiculo = {
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      placa: '',
      color: '',
      kilometraje: 0
    };
    
    this.informacionAdicional = '';
  }
}
