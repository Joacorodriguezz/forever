import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

/** Contenido alineado con la pantalla 05 – Noticias de forever-mobile.pen */
const NOTICIAS = [
  {
    titulo: 'Torneo de verano: resultados finales y premiación',
    fecha: '2025-04-05',
    resumen:
      'El club celebró el cierre de la temporada con la premiación de los deportistas más destacados.',
    contenido: `El pasado fin de semana se realizó la ceremonia de cierre del Torneo de Verano 2025 en nuestras instalaciones. Cientos de familias acompañaron a los deportistas en una jornada que combinó competencia, integración y reconocimiento al esfuerzo de todo el año.

Durante la premiación se destacaron a los equipos campeones de fútbol, hockey y natación, junto con menciones especiales a deportistas que mostraron compromiso, regularidad y fair play.

Desde la comisión directiva agradecemos a entrenadores, colaboradores y familias por el apoyo sostenido. La próxima temporada comienza en mayo con nuevas propuestas formativas para todas las categorías.`,
    imagenes: [
      'https://images.unsplash.com/photo-1602025285376-8e0d723b82f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
  },
  {
    titulo: 'Nuevas inscripciones: temporada 2025',
    fecha: '2025-03-28',
    resumen: 'Abíndan los cupos para las disciplinas de futbol y hockey.',
    contenido: `Ya está abierta la inscripción para la temporada 2025 de fútbol y hockey. El club habilitó cupos limitados por categoría para mantener la calidad de entrenamiento y la atención personalizada de cada grupo.

Quienes renueven su lugar antes del 15 de abril acceden a un 10% de descuento en la cuota de marzo. Para nuevos ingresos, el equipo administrativo realizará una entrevista inicial y derivará al deportista a la categoría correspondiente según edad y experiencia.

Podés consultar horarios, aranceles y requisitos en secretaría o a través de los canales oficiales del club. Te esperamos para sumarte a una nueva temporada de actividad, formación y pertenencia institucional.`,
    imagenes: [
      'https://images.unsplash.com/photo-1762742228148-f38c34ea7f1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
  },
] as const;

async function main() {
  console.log('🌱 Seed 2 noticias (formato forever-mobile.pen)...');

  const autor = await prisma.administrativo.findFirst({
    orderBy: { id: 'asc' },
  });

  if (!autor) {
    throw new Error(
      'No hay administrativos en la base. Ejecutá primero: npm run prisma:seed'
    );
  }

  let creadas = 0;
  let existentes = 0;

  for (const noticia of NOTICIAS) {
    const yaExiste = await prisma.noticia.findFirst({
      where: { titulo: noticia.titulo },
    });

    if (yaExiste) {
      existentes += 1;
      console.log(`   ↷ Ya existe: "${noticia.titulo}"`);
      continue;
    }

    await prisma.noticia.create({
      data: {
        titulo: noticia.titulo,
        fecha: new Date(noticia.fecha),
        resumen: noticia.resumen,
        contenido: noticia.contenido,
        autorId: autor.id,
        imagenes: {
          create: noticia.imagenes.map((url, index) => ({
            url,
            orden: index + 1,
          })),
        },
      },
    });

    creadas += 1;
    console.log(`   ✓ Creada: "${noticia.titulo}"`);
  }

  console.log(`✅ Noticias listas (${creadas} nuevas, ${existentes} ya existían).`);
  if (autor) {
    console.log(`   Autor: ${autor.nombre} ${autor.apellido}`);
  }
}

main()
  .catch((error) => {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
