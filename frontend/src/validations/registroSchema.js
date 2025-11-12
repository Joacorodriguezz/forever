import * as yup from 'yup';

const RegistroSchema = yup.object().shape({
    // Texto requerido con longitud
    nombre: yup
        .string("Ingrese solo texto")
        .min(3, "Minimo 3 caracteres")
        .max(50, "El nombre es demasiado largo")
        .required ('Campo obligatorio'),
    apellido: yup
        .string("Ingrese solo texto")
        .min(3, "Minimo 3 caracteres")
        .max(50, "El apellido es demasiado largo")
        .required ('Campo obligatorio'),
    dni: yup
        .number("Ingrese solo números")
        .typeError("El DNI debe ser un número")
        .test("len", "El DNI debe tener 8 dígitos", val => val && val.toString().length === 8)
        .required ('Campo obligatorio'),
    email: yup
        .string()
        .email('Email inválido' )
        .required ('Campo obligatorio'),
     // nacimiento
    fechaNacimiento : yup
        .date("Debe ingresar una fecha")
        .max(new Date(), "La fecha debe ser anterior a hoy")
        .required ('Campo obligatorio'),
    sexo: yup
        .string("Ingrese solo texto")
        .oneOf(['FEMENINO', 'MASCULINO', 'OTRO'])
        .required ('Campo obligatorio'),
    pais: yup
        .string("Elija su país de origen")
        .oneOf([
            'ARGENTINA',
            'BOLIVIA',
            'BRASIL',
            'CHILE',
            'COLOMBIA',
            'COSTA_RICA',
            'CUBA',
            'ECUADOR',
            'EL_SALVADOR',
            'GUATEMALA',
            'HONDURAS',
            'MEXICO',
            'NICARAGUA',
            'PANAMA',
            'PARAGUAY',
            'PERU',
            'PUERTO_RICO',
            'REPUBLICA_DOMINICANA',
            'URUGUAY',
            'VENEZUELA'])
        .required ('Campo obligatorio'),
    password: yup
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required ('Campo obligatorio')
    });
export default RegistroSchema;