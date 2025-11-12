import * as yup from 'yup';

const TODAY_YYYYMMDD = new Date().toISOString().slice(0, 10);

export const generarCuotaSchema = yup.object({
  actividadId: yup
    .string()
    .trim()
    .required('Debes seleccionar una actividad'),
  montoBase: yup
    .number()
    .typeError('El monto base debe ser un número')
    .min(0, 'El monto base no puede ser negativo')
    .max(1000000, 'El monto base es demasiado alto')
    .nullable()
    .transform((val, original) => (original === '' || original === null ? 0 : val)),
  mes: yup
    .string()
    .oneOf(
      [
        'ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO',
        'JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'
      ],
      'Mes inválido'
    )
    .required('Debes seleccionar un mes'),
  fechaVenc: yup
    .string()
    .required('Debes seleccionar una fecha de vencimiento')
    .test('no-pasado', 'La fecha de vencimiento no puede ser pasada', (value) => {
      if (!value) return false;
      // Comparo YYYY-MM-DD lexicográficamente
      return value >= TODAY_YYYYMMDD;
    }),
});
