-- CreateEnum
CREATE TYPE "EstadoDeportista" AS ENUM ('En deuda', 'Al dia', 'Morosa', 'Inactiva');

-- CreateEnum
CREATE TYPE "EstadoCuota" AS ENUM ('Pagada', 'Pendiente', 'Vencida');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('Aprobado', 'Rechazado', 'Pendiente');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('Admin', 'Administrativo', 'Deportista');

-- CreateEnum
CREATE TYPE "Vinculo" AS ENUM ('Padre', 'Madre', 'Hijo', 'Hermano', 'Otro');

-- CreateEnum
CREATE TYPE "Periodicidad" AS ENUM ('Mensual', 'Anual');

-- CreateTable
CREATE TABLE "localidades" (
    "id_localidad" SERIAL NOT NULL,
    "codigo_postal" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "localidades_pkey" PRIMARY KEY ("id_localidad")
);

-- CreateTable
CREATE TABLE "domicilios" (
    "id_domicilio" SERIAL NOT NULL,
    "calle" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "piso" TEXT,
    "departamento" TEXT,
    "id_localidad" INTEGER NOT NULL,

    CONSTRAINT "domicilios_pkey" PRIMARY KEY ("id_domicilio")
);

-- CreateTable
CREATE TABLE "enfermedades" (
    "id_enfermedad" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "enfermedades_pkey" PRIMARY KEY ("id_enfermedad")
);

-- CreateTable
CREATE TABLE "telefonos" (
    "id_telefono" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "tipo" TEXT DEFAULT 'celular',

    CONSTRAINT "telefonos_pkey" PRIMARY KEY ("id_telefono")
);

-- CreateTable
CREATE TABLE "disciplinas" (
    "id_disciplina" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio_mensual" DECIMAL(10,2) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disciplinas_pkey" PRIMARY KEY ("id_disciplina")
);

-- CreateTable
CREATE TABLE "cuentas_usuario" (
    "id_cuenta" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'Deportista',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "intentos_fallidos" INTEGER NOT NULL DEFAULT 0,
    "bloqueado_hasta" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cuentas_usuario_pkey" PRIMARY KEY ("id_cuenta")
);

-- CreateTable
CREATE TABLE "administrativos" (
    "id_administrativo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "id_cuenta" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "administrativos_pkey" PRIMARY KEY ("id_administrativo")
);

-- CreateTable
CREATE TABLE "deportistas" (
    "id_deportista" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "fecha_nac" TIMESTAMP(3) NOT NULL,
    "categoria" TEXT,
    "obra_social" TEXT,
    "estado" "EstadoDeportista" NOT NULL DEFAULT 'Al dia',
    "id_disciplina" INTEGER NOT NULL,
    "id_cuenta" INTEGER NOT NULL,
    "id_domicilio" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deportistas_pkey" PRIMARY KEY ("id_deportista")
);

-- CreateTable
CREATE TABLE "deportistas_enfermedades" (
    "id_deportista" INTEGER NOT NULL,
    "id_enfermedad" INTEGER NOT NULL,

    CONSTRAINT "deportistas_enfermedades_pkey" PRIMARY KEY ("id_deportista","id_enfermedad")
);

-- CreateTable
CREATE TABLE "deportistas_telefonos" (
    "id_deportista" INTEGER NOT NULL,
    "id_telefono" INTEGER NOT NULL,

    CONSTRAINT "deportistas_telefonos_pkey" PRIMARY KEY ("id_deportista","id_telefono")
);

-- CreateTable
CREATE TABLE "grupos_familiares" (
    "id_grupo_familiar" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grupos_familiares_pkey" PRIMARY KEY ("id_grupo_familiar")
);

-- CreateTable
CREATE TABLE "grupo_familiar_integrantes" (
    "id_grupo_familiar" INTEGER NOT NULL,
    "id_deportista" INTEGER NOT NULL,
    "vinculo" "Vinculo" NOT NULL,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "grupo_familiar_integrantes_pkey" PRIMARY KEY ("id_grupo_familiar","id_deportista")
);

-- CreateTable
CREATE TABLE "cuotas" (
    "id_cuota" SERIAL NOT NULL,
    "nro_cuota" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL,
    "fecha_vencimiento" TIMESTAMP(3) NOT NULL,
    "estado_cuota" "EstadoCuota" NOT NULL DEFAULT 'Pendiente',
    "periodicidad" "Periodicidad" NOT NULL DEFAULT 'Mensual',
    "id_disciplina" INTEGER NOT NULL,
    "id_deportista" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cuotas_pkey" PRIMARY KEY ("id_cuota")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id_pago" SERIAL NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "estado_pago" "EstadoPago" NOT NULL DEFAULT 'Pendiente',
    "medio_pago" TEXT,
    "link_comprobante" TEXT,
    "mercado_pago_id" TEXT,
    "mercado_pago_status" TEXT,
    "id_cuota" INTEGER NOT NULL,
    "id_deportista" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "auditoria_accesos" (
    "id" SERIAL NOT NULL,
    "id_cuenta" INTEGER NOT NULL,
    "accion" TEXT NOT NULL,
    "ip" TEXT,
    "user_agent" TEXT,
    "exitoso" BOOLEAN NOT NULL DEFAULT true,
    "mensaje" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_accesos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria_cambios" (
    "id" SERIAL NOT NULL,
    "id_cuenta" INTEGER NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidad_id" INTEGER NOT NULL,
    "accion" TEXT NOT NULL,
    "datos_antes" TEXT,
    "datos_despues" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_cambios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "enfermedades_nombre_key" ON "enfermedades"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "disciplinas_nombre_key" ON "disciplinas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "cuentas_usuario_email_key" ON "cuentas_usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "administrativos_dni_key" ON "administrativos"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "administrativos_id_cuenta_key" ON "administrativos"("id_cuenta");

-- CreateIndex
CREATE UNIQUE INDEX "deportistas_dni_key" ON "deportistas"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "deportistas_id_cuenta_key" ON "deportistas"("id_cuenta");

-- CreateIndex
CREATE UNIQUE INDEX "cuotas_id_deportista_nro_cuota_id_disciplina_key" ON "cuotas"("id_deportista", "nro_cuota", "id_disciplina");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_mercado_pago_id_key" ON "pagos"("mercado_pago_id");

-- AddForeignKey
ALTER TABLE "domicilios" ADD CONSTRAINT "domicilios_id_localidad_fkey" FOREIGN KEY ("id_localidad") REFERENCES "localidades"("id_localidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "administrativos" ADD CONSTRAINT "administrativos_id_cuenta_fkey" FOREIGN KEY ("id_cuenta") REFERENCES "cuentas_usuario"("id_cuenta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deportistas" ADD CONSTRAINT "deportistas_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "disciplinas"("id_disciplina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deportistas" ADD CONSTRAINT "deportistas_id_cuenta_fkey" FOREIGN KEY ("id_cuenta") REFERENCES "cuentas_usuario"("id_cuenta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deportistas" ADD CONSTRAINT "deportistas_id_domicilio_fkey" FOREIGN KEY ("id_domicilio") REFERENCES "domicilios"("id_domicilio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deportistas_enfermedades" ADD CONSTRAINT "deportistas_enfermedades_id_deportista_fkey" FOREIGN KEY ("id_deportista") REFERENCES "deportistas"("id_deportista") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deportistas_enfermedades" ADD CONSTRAINT "deportistas_enfermedades_id_enfermedad_fkey" FOREIGN KEY ("id_enfermedad") REFERENCES "enfermedades"("id_enfermedad") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deportistas_telefonos" ADD CONSTRAINT "deportistas_telefonos_id_deportista_fkey" FOREIGN KEY ("id_deportista") REFERENCES "deportistas"("id_deportista") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deportistas_telefonos" ADD CONSTRAINT "deportistas_telefonos_id_telefono_fkey" FOREIGN KEY ("id_telefono") REFERENCES "telefonos"("id_telefono") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo_familiar_integrantes" ADD CONSTRAINT "grupo_familiar_integrantes_id_grupo_familiar_fkey" FOREIGN KEY ("id_grupo_familiar") REFERENCES "grupos_familiares"("id_grupo_familiar") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo_familiar_integrantes" ADD CONSTRAINT "grupo_familiar_integrantes_id_deportista_fkey" FOREIGN KEY ("id_deportista") REFERENCES "deportistas"("id_deportista") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuotas" ADD CONSTRAINT "cuotas_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "disciplinas"("id_disciplina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuotas" ADD CONSTRAINT "cuotas_id_deportista_fkey" FOREIGN KEY ("id_deportista") REFERENCES "deportistas"("id_deportista") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_cuota_fkey" FOREIGN KEY ("id_cuota") REFERENCES "cuotas"("id_cuota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_deportista_fkey" FOREIGN KEY ("id_deportista") REFERENCES "deportistas"("id_deportista") ON DELETE CASCADE ON UPDATE CASCADE;
