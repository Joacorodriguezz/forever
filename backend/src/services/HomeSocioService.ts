import { GetSocioResponse, GetEstadoCuota, GetAccesosResponse, Acceso } from '../types/HomeSocioTypes';

// Datos mock. Despues se cambia por DB.
const socios = [
    { id: 1, nombre: 'Juan', apellido: 'Perez', emial: 'JuanPerez@gmail.com', fechaNacimiento: '2005-08-23', pais: 'Argentina', sexo: 'Masculino', cuotaAlDia: true, montoAdeudado: 0 },
    { id: 2, nombre: 'Ana', apellido: 'Gomez', emial: 'AnaGomez@gmail.com', fechaNacimiento: '1990-05-15', pais: 'Argentina', sexo: 'Femenino', cuotaAlDia: false, montoAdeudado: 500 },
    { id: 3, nombre: 'Carlos', apellido: 'Lopez', emial: 'CarlosLopez@gmail.com', fechaNacimiento: '1985-12-01', pais: 'Argentina', sexo: 'Masculino', cuotaAlDia: true, montoAdeudado: 0 }
];

function toDDMMYYYY(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function tienePagosVencidos(id: number): boolean {
  const socio = socios.find(s => s.id === id);
  if (!socio) return false;
  return !socio.cuotaAlDia;
}

export async function getSocioById(id: number): Promise<GetSocioResponse> {
  // 1) Buscar en DB o en `socios` por id.
    const socio = socios.find(s => s.id === id);
  // 2) Si no existe → throw { statusCode:404, message:'Socio no encontrado' }.
    if (!socio) {
        throw { statusCode: 404, message: 'Socio no encontrado' };
    }
  throw Object.assign(new Error('implementar getSocioById'), { statusCode: 501 });
}

export async function getEstadoCuota(id: number): Promise<GetEstadoCuota> {
  // 1) Calcular si el socio tiene la cuota al día (consultá cuotas/pagos).
    function isCuotaAlDia(id: number): boolean {
        const socio = socios.find(s => s.id === id);
        return socio ? socio.cuotaAlDia : false; 
    }
 // 2) Si NO está al día → incluir fechaVencimiento y montoAdeudado.
  function isCuotaVencida(id: number) {
    if (isCuotaAlDia(id)) {
        const socio = socios.find(s => s.id === id);
        if (!socio) throw new Error('Socio no encontrado');
        return {
            cuotaAlDia: false,
            fechaVencimiento: toDDMMYYYY(new Date()), // Fecha actual como ejemplo
            montoAdeudado: socio.montoAdeudado 
        }
  }
  }
  // Si tiene pagos vencidos, no puede reservar cancha, inscribirse o participar en eventos
  

  // En el mock, usamos directamente el campo cuotaAlDia:
  tienePagosVencidos(id);

  throw Object.assign(new Error('implementar getEstadoCuota'), { statusCode: 501 });
}

export async function getAccesos(id: number): Promise<GetAccesosResponse> {
  // Regla del PDF: con pagos vencidos no puede reservar cancha / inscribirse / eventos.
  const pagosVencidos = tienePagosVencidos(id);
  const accesos: Acceso[] = [];

  accesos.push({
    nombre: 'Reservar Cancha',
    habilitado: !pagosVencidos,
    motivo: pagosVencidos ? 'Cuota vencida' : undefined
  });

  accesos.push({
    nombre: 'Mis entradas',
    habilitado: !pagosVencidos,
    motivo: pagosVencidos ? 'Cuota vencida' : undefined
  });

  accesos.push({
    nombre: 'Modificar perfil',
    habilitado: true
  });

  accesos.push({
    nombre: 'Pagar cuota',
    habilitado: true
  });

  return { accesos };
}

