import * as yup from 'yup';

const LoginSchema = yup.object().shape({
  emailOdni: yup
    .string()
    .min(3, 'Debe ingresar un email o DNI'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export default LoginSchema;
