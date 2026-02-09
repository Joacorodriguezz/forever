/** Opciones para crear/editar deportista (misma lógica que ProfileEdit) */
export const DISCIPLINAS = ['Futbol', 'Hockey'] as const;
export const GENEROS = ['Masculino', 'Femenino'] as const;
export const CATEGORIAS_GENERALES = ['Mayores', 'Juveniles', 'Infantiles'] as const;

const SUBCATEGORIAS_FUTBOL: Record<string, string[]> = {
    'Mayores-Masculino': ['Cuarta', 'Reserva', 'Senior', 'Primera'],
    'Mayores-Femenino': ['Cuarta', 'Tercera', '+35', 'Primera'],
    'Juveniles-Masculino': ['Pre-novena', 'Novena', 'Octava', 'Séptima', 'Sexta', 'Quinta'],
    'Infantiles-Masculino': ['6 años', '7 años', '8 años', '9 años', '10 años', '11 años'],
    'Juveniles-Femenino': ['Sub 10', 'Sub 11', 'Sub 12', 'Sub 13', 'Sub 14'],
    'Infantiles-Femenino': ['Sub 10', 'Sub 11', 'Sub 12', 'Sub 13', 'Sub 14'],
};

const SUBCATEGORIAS_HOCKEY: Record<string, string[]> = {
    Infantiles: ['10ma', '9na', '8va'],
    Juveniles: ['Sub 14', 'Sub 17'],
    Mayores: ['Intermedia', 'Primera'],
};

export function getCategoriasGeneralesOptions(disciplina: string, genero: string): readonly string[] {
    if (disciplina === 'Hockey' && genero === 'Masculino') return ['Mayores'];
    return CATEGORIAS_GENERALES;
}

export function getSubcategoriaOptions(disciplina: string, genero: string, categoriaGeneral: string): string[] {
    if (!disciplina || !categoriaGeneral) return [];
    if (disciplina === 'Hockey') {
        if (genero === 'Masculino') return SUBCATEGORIAS_HOCKEY['Mayores'] ?? [];
        return SUBCATEGORIAS_HOCKEY[categoriaGeneral] ?? [];
    }
    if (disciplina === 'Futbol' && genero) {
        const key = `${categoriaGeneral}-${genero}`;
        return SUBCATEGORIAS_FUTBOL[key] ?? [];
    }
    return [];
}
