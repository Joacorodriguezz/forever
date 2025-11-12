import * as Yup from "yup";

export const entradaSchema = Yup.object().shape({
  cantidad: Yup.number()
    .min(1, "La cantidad debe ser al menos 1")
    .required("La cantidad es obligatoria"),
  comprobante: Yup.mixed()
    .required("Debes adjuntar el comprobante")
    .test("fileSize", "El archivo es demasiado grande", (value) =>
      !value || (value && value[0]?.size <= 5 * 1024 * 1024) 
    )
    .test("fileType", "Formato no soportado", (value) =>
      !value ||
      ["image/jpeg", "image/png", "application/pdf"].includes(value[0]?.type)
    ),
}); 
