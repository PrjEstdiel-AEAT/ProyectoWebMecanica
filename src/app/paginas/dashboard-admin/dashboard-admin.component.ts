import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface EstadisticaDashboard {
  totalUsuarios: number;
  totalMecanicos: number;
  totalClientes: number;
  totalReservas: number;
  reservasPendientes: number;
  reservasConfirmadas: number;
  reservasCanceladas: number;
  reservasHoy: number;
  ingresosMes: number;
  serviciosCompletados: number;
}

interface ReservaReciente {
  id: number;
  cliente: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  mecanico?: string;
}

interface ServicioPopular {
  nombre: string;
  cantidad: number;
  porcentaje: number;
}

interface IngresoDiario {
  fecha: string;
  monto: number;
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit, OnDestroy {
  estadisticas: EstadisticaDashboard = {
    totalUsuarios: 0,
    totalMecanicos: 0,
    totalClientes: 0,
    totalReservas: 0,
    reservasPendientes: 0,
    reservasConfirmadas: 0,
    reservasCanceladas: 0,
    reservasHoy: 0,
    ingresosMes: 0,
    serviciosCompletados: 0
  };

  reservasRecientes: ReservaReciente[] = [];
  serviciosPopulares: ServicioPopular[] = [];
  ingresosSemana: IngresoDiario[] = [];
  
  // Datos para gráficos
  chartReservas = {
    labels: ['Pendientes', 'Confirmadas', 'Canceladas', 'Completadas'],
    data: [0, 0, 0, 0],
    colors: ['#ffc107', '#28a745', '#dc3545', '#6f42c1']
  };

  chartIngresos = {
    labels: [] as string[],
    data: [] as number[]
  };

  fechaActual = new Date().toLocaleDateString('es-CO', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  ngOnInit() {
    this.cargarDatosReales();
    this.configurarListenerStorage();
  }

  ngOnDestroy() {
    // Limpiar listener al destruir el componente
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.onStorageChange.bind(this));
    }
  }

  configurarListenerStorage() {
    // Escuchar cambios en localStorage
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.onStorageChange.bind(this));
    }
    
    // También verificar cambios cada 2 segundos (para cambios en la misma pestaña)
    setInterval(() => {
      this.verificarCambiosLocales();
    }, 2000);
  }

  private ultimaActualizacion = Date.now();
  
  onStorageChange(event: StorageEvent) {
    // Solo recargar si cambiaron datos relevantes
    if (event.key === 'usuarios' || event.key === 'reservas' || event.key === 'mecanicos') {
      console.log('Detectado cambio en localStorage:', event.key);
      this.refrescarDatos();
    }
  }

  verificarCambiosLocales() {
    // Verificar si los datos han cambiado comparando timestamps
    const usuariosStr = localStorage.getItem('usuarios') || '[]';
    const reservasStr = localStorage.getItem('reservas') || '[]';
    const mecanicosStr = localStorage.getItem('mecanicos') || '[]';
    
    const hashActual = this.generarHashDatos(usuariosStr + reservasStr + mecanicosStr);
    
    if (this.hashAnterior && this.hashAnterior !== hashActual) {
      console.log('Detectados cambios locales en los datos');
      this.refrescarDatos();
    }
    
    this.hashAnterior = hashActual;
  }

  private hashAnterior: string = '';
  
  generarHashDatos(data: string): string {
    // Generar un hash simple para detectar cambios
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32bit integer
    }
    return hash.toString();
  }

  // Método público para refrescar datos (se puede llamar desde otros componentes)
  refrescarDatos() {
    console.log('Refrescando datos del dashboard...');
    this.cargarDatosReales();
  }

  cargarDatosReales() {
    // Cargar usuarios reales
    const usuariosStr = localStorage.getItem('usuarios') || '[]';
    const usuarios = JSON.parse(usuariosStr);
    
    // Cargar reservas reales
    const reservasStr = localStorage.getItem('reservas') || '[]';
    const reservas = JSON.parse(reservasStr);
    
    // Cargar mecánicos reales
    const mecanicosStr = localStorage.getItem('mecanicos') || '[]';
    const mecanicos = JSON.parse(mecanicosStr);
    
    console.log('=== DEBUG DATOS ===');
    console.log('Usuarios cargados:', usuarios);
    console.log('Reservas cargadas:', reservas);
    console.log('Mecánicos cargados:', mecanicos);
    console.log('Cantidad - usuarios:', usuarios.length, 'reservas:', reservas.length, 'mecánicos:', mecanicos.length);
    
    this.calcularEstadisticasReales(usuarios, reservas, mecanicos);
    this.cargarReservasRecientes(reservas, usuarios, mecanicos);
    this.calcularServiciosPopulares(reservas);
    this.calcularIngresosSemana(reservas);
  }

  calcularEstadisticasReales(usuarios: any[], reservas: any[], mecanicos: any[]) {
    const hoy = new Date().toISOString().split('T')[0];
    
    // Contar correctamente los roles
    const clientesCount = usuarios.filter(u => 
      u.rol === 'CLIENTE' || u.rol === 'cliente' || !u.rol
    ).length;
    
    const mecanicosCount = usuarios.filter(u => 
      u.rol === 'MECANICO' || u.rol === 'mecanico' || u.rol === 'MECÁNICO'
    ).length;
    
    const adminsCount = usuarios.filter(u => 
      u.rol === 'ADMIN' || u.rol === 'admin' || u.rol === 'ADMINISTRADOR'
    ).length;
    
    console.log('Conteo de roles:', { clientesCount, mecanicosCount, adminsCount, totalUsuarios: usuarios.length });
    console.log('Usuarios con roles:', usuarios.map(u => ({ nombre: u.nombre, rol: u.rol })));
    
    // Calcular estadísticas con datos reales
    this.estadisticas = {
      totalUsuarios: usuarios.length,
      totalMecanicos: mecanicosCount,
      totalClientes: clientesCount,
      totalReservas: reservas.length,
      reservasPendientes: reservas.filter(r => r.estado === 'pendiente').length,
      reservasConfirmadas: reservas.filter(r => r.estado === 'confirmada').length,
      reservasCanceladas: reservas.filter(r => r.estado === 'cancelada').length,
      reservasHoy: reservas.filter(r => r.fecha === hoy).length,
      ingresosMes: this.calcularIngresosMes(reservas),
      serviciosCompletados: reservas.filter(r => r.estado === 'completada').length
    };

    console.log('Estadísticas calculadas:', this.estadisticas);

    // Datos para gráfico de reservas
    this.chartReservas.data = [
      this.estadisticas.reservasPendientes,
      this.estadisticas.reservasConfirmadas,
      this.estadisticas.reservasCanceladas,
      this.estadisticas.serviciosCompletados
    ];

    // Si no hay servicios populares, mostrar mensaje
    if (this.serviciosPopulares.length === 0) {
      this.serviciosPopulares = [
        { nombre: 'No hay servicios registrados aún', cantidad: 0, porcentaje: 0 }
      ];
    }

    // Si no hay reservas recientes, mostrar mensaje
    if (this.reservasRecientes.length === 0) {
      this.reservasRecientes = [
        {
          id: 0,
          cliente: 'No hay reservas registradas',
          servicio: 'Aún no se han creado reservas en el sistema',
          fecha: hoy,
          hora: '--:--',
          estado: 'pendiente'
        }
      ];
    }
  }

  calcularIngresosMes(reservas: any[]): number {
    const mesActual = new Date().getMonth();
    const añoActual = new Date().getFullYear();
    
    return reservas
      .filter(r => {
        const fechaReserva = new Date(r.fecha);
        return fechaReserva.getMonth() === mesActual && 
               fechaReserva.getFullYear() === añoActual &&
               (r.estado === 'confirmada' || r.estado === 'completada');
      })
      .reduce((total, r) => total + (r.precio || 50000), 0); // Precio promedio $50,000
  }

  cargarReservasRecientes(reservas: any[], usuarios: any[], mecanicos: any[]) {
    console.log('=== DEBUG RESERVAS RECIENTES ===');
    console.log('Total reservas:', reservas.length);
    
    if (reservas.length === 0) {
      console.log('No hay reservas para mostrar');
      return;
    }
    
    // Tomar las últimas 5 reservas y mapear con datos reales
    this.reservasRecientes = reservas
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5)
      .map((reserva, index) => {
        console.log(`Procesando reserva ${index + 1}:`, reserva);
        
        // Buscar usuario por diferentes campos posibles
        let usuario = null;
        if (reserva.usuarioId) {
          usuario = usuarios.find(u => u.id === reserva.usuarioId);
        }
        if (!usuario && reserva.clienteEmail) {
          usuario = usuarios.find(u => u.email === reserva.clienteEmail);
        }
        if (!usuario && reserva.cliente) {
          // Si viene el nombre del cliente directamente
          usuario = { nombre: reserva.cliente, apellido: '' };
        }
        if (!usuario && reserva.nombreCliente) {
          usuario = { nombre: reserva.nombreCliente, apellido: reserva.apellidoCliente || '' };
        }
        
        // Buscar mecánico
        let mecanico = null;
        if (reserva.mecanicoId) {
          mecanico = mecanicos.find(m => m.id === reserva.mecanicoId);
        }
        if (!mecanico && reserva.mecanico) {
          mecanico = { nombre: reserva.mecanico, apellido: '' };
        }
        
        const clienteNombre = usuario ? `${usuario.nombre} ${usuario.apellido || ''}`.trim() : 'Cliente no encontrado';
        const mecanicoNombre = mecanico ? `${mecanico.nombre} ${mecanico.apellido || ''}`.trim() : 'Sin asignar';
        
        console.log(`Cliente encontrado: ${clienteNombre}, Mecánico: ${mecanicoNombre}`);
        
        return {
          id: reserva.id,
          cliente: clienteNombre,
          servicio: reserva.servicio || reserva.tipoServicio || reserva.servicioSeleccionado || 'Servicio general',
          fecha: reserva.fecha,
          hora: reserva.hora,
          estado: reserva.estado || 'pendiente',
          mecanico: mecanicoNombre
        };
      });
      
    console.log('Reservas recientes procesadas:', this.reservasRecientes);
  }

  calcularServiciosPopulares(reservas: any[]) {
    // Contar servicios reales
    const serviciosCount: { [key: string]: number } = {};
    const totalReservas = reservas.length;
    
    reservas.forEach(reserva => {
      const servicio = reserva.servicio || reserva.tipoServicio || 'Servicio general';
      serviciosCount[servicio] = (serviciosCount[servicio] || 0) + 1;
    });
    
    // Convertir a array y ordenar por cantidad
    this.serviciosPopulares = Object.entries(serviciosCount)
      .map(([nombre, cantidad]) => ({
        nombre,
        cantidad,
        porcentaje: totalReservas > 0 ? Math.round((cantidad / totalReservas) * 100) : 0
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 6); // Top 6 servicios
  }

  calcularIngresosSemana(reservas: any[]) {
    const fechas = this.obtenerUltimos7Dias();
    
    this.ingresosSemana = fechas.map(fecha => {
      const reservasDia = reservas.filter(r => 
        r.fecha === fecha && 
        (r.estado === 'confirmada' || r.estado === 'completada')
      );
      
      const monto = reservasDia.reduce((total, r) => {
        return total + (r.precio || r.costo || 50000); // Precio por defecto si no está definido
      }, 0);
      
      return { fecha, monto };
    });
    
    this.chartIngresos.labels = this.ingresosSemana.map(i => 
      new Date(i.fecha).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' })
    );
    this.chartIngresos.data = this.ingresosSemana.map(i => i.monto);
  }

  // Método eliminado - Solo usamos datos reales del sistema

  obtenerUltimos7Dias(): string[] {
    const fechas = [];
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      fechas.push(fecha.toISOString().split('T')[0]);
    }
    return fechas;
  }

  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(monto);
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'estado-pendiente';
      case 'confirmada': return 'estado-confirmada';
      case 'cancelada': return 'estado-cancelada';
      case 'completada': return 'estado-completada';
      default: return '';
    }
  }

  obtenerIconoEstado(estado: string): string {
    switch (estado) {
      case 'pendiente': return '⏳';
      case 'confirmada': return '✅';
      case 'cancelada': return '❌';
      case 'completada': return '🏁';
      default: return '📋';
    }
  }
}
