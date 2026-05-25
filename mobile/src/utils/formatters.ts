export const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export function getMonthName(monthNumber: number): string {
  if (monthNumber < 1 || monthNumber > 12) return `Cuota ${monthNumber}`;
  return MONTH_NAMES[monthNumber - 1];
}

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `$ ${formatted}`;
}

export function formatDni(dni: string): string {
  const digits = dni.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  const body = digits.slice(0, -3).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${body}.${digits.slice(-3)}`;
}

export function formatDateEs(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDateEs(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getInitials(nombre?: string, apellido?: string): string {
  const first = nombre?.trim().charAt(0) ?? '';
  const last = apellido?.trim().charAt(0) ?? '';
  return `${first}${last}`.toUpperCase() || '?';
}

export function getRelationLabel(
  disciplina: unknown,
  categoria: unknown,
  vinculo?: string,
  isTitular?: boolean
): string {
  const disciplinaName =
    typeof disciplina === 'string'
      ? disciplina
      : typeof disciplina === 'object' && disciplina !== null && 'nombre' in disciplina
        ? (disciplina as { nombre?: string }).nombre ?? ''
        : '';

  const categoriaName =
    typeof categoria === 'string'
      ? categoria
      : typeof categoria === 'object' && categoria !== null && 'nombre' in categoria
        ? (categoria as { nombre?: string }).nombre ?? ''
        : '';

  const role = isTitular ? 'Titular' : vinculo?.trim() || 'Integrante';
  const parts = [disciplinaName, categoriaName || role].filter(Boolean);
  return parts.join(' • ');
}
