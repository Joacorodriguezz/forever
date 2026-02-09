import type { Noticia } from '../types/noticia';

/**
 * Lista de noticias (luego vendrá del backend).
 * Para el admin: misma estructura al crear/editar (titulo, fecha, resumen, contenido, imagenes).
 */
export const MOCK_NOTICIAS: Noticia[] = [
    {
        id: 1,
        titulo: 'Inicio de temporada 2026',
        fecha: '2026-02-01',
        resumen: 'El club da la bienvenida a la nueva temporada con actividades para todas las disciplinas.',
        contenido: 'Este año arrancamos con muchas novedades. Fútbol, hockey y las escuelas deportivas ya tienen sus cronogramas definidos. Los invitamos a acercarse a la sede para más información. La temporada incluye torneos locales, encuentros amistosos y las habituales escuelas de formación para las categorías infantiles y juveniles.',
        imagenes: ['/club-background.PNG'],
    },
    {
        id: 2,
        titulo: 'Mantenimiento del predio de entrenamiento',
        fecha: '2026-01-15',
        resumen: 'Se realizaron mejoras en las instalaciones del predio de Calle 485.',
        contenido: 'Durante la primera quincena de enero se llevó a cabo el mantenimiento programado del predio de entrenamiento y localía. Las canchas y vestuarios quedaron en óptimas condiciones para el inicio de la temporada. Se renovaron redes, se pintaron líneas y se revisaron las instalaciones eléctricas y de agua.',
        imagenes: ['/club-background.PNG'],
    },
    {
        id: 3,
        titulo: 'Cuota social: vencimiento febrero',
        fecha: '2026-01-10',
        resumen: 'Recordatorio del vencimiento de la cuota correspondiente a febrero.',
        contenido: 'La cuota social de febrero vence el día 15. Podés abonar en sede, por transferencia o a través del portal de deportistas. Mantené tu situación al día para seguir disfrutando de todas las actividades del club.',
        imagenes: [],
    },
];

/**
 * Obtiene una noticia por id (luego reemplazar por API).
 */
export function getNoticiaById(id: number): Noticia | undefined {
    return MOCK_NOTICIAS.find((n) => n.id === id);
}
