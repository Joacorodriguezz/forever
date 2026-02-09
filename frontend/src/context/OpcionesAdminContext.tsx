import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import type { Disciplina } from '../types/admin';
import { MOCK_DISCIPLINAS } from '../data/admin';

/** Categorías por disciplina|genero (excepción). Ej: "Hockey|Masculino" -> ['Mayores'] */
type CategoriasExcepcion = Record<string, string[]>;
/** Subcategorías por key: "Disciplina|Categoria|Genero" o "Disciplina|Categoria" para Hockey */
type SubcategoriasPorKey = Record<string, string[]>;

type OpcionesAdminState = {
    disciplinas: Disciplina[];
    generos: string[];
    categorias: string[];
    categoriasExcepcion: CategoriasExcepcion;
    subcategoriasPorKey: SubcategoriasPorKey;
};

type OpcionesAdminContextValue = OpcionesAdminState & {
    setDisciplinas: React.Dispatch<React.SetStateAction<Disciplina[]>>;
    setGeneros: React.Dispatch<React.SetStateAction<string[]>>;
    setCategorias: React.Dispatch<React.SetStateAction<string[]>>;
    setCategoriasExcepcion: React.Dispatch<React.SetStateAction<CategoriasExcepcion>>;
    setSubcategoriasPorKey: React.Dispatch<React.SetStateAction<SubcategoriasPorKey>>;
    /** Nombres de disciplinas activas (para dropdowns) */
    disciplinasNombres: string[];
    getCategoriasOptions: (disciplina: string, genero: string) => string[];
    getSubcategoriaOptions: (disciplina: string, genero: string, categoria: string) => string[];
};

const subcategoriasInicial: SubcategoriasPorKey = {
    'Futbol|Mayores|Masculino': ['Cuarta', 'Reserva', 'Senior', 'Primera'],
    'Futbol|Mayores|Femenino': ['Cuarta', 'Tercera', '+35', 'Primera'],
    'Futbol|Juveniles|Masculino': ['Pre-novena', 'Novena', 'Octava', 'Séptima', 'Sexta', 'Quinta'],
    'Futbol|Infantiles|Masculino': ['6 años', '7 años', '8 años', '9 años', '10 años', '11 años'],
    'Futbol|Juveniles|Femenino': ['Sub 10', 'Sub 11', 'Sub 12', 'Sub 13', 'Sub 14'],
    'Futbol|Infantiles|Femenino': ['Sub 10', 'Sub 11', 'Sub 12', 'Sub 13', 'Sub 14'],
    'Hockey|Mayores': ['Intermedia', 'Primera'],
    'Hockey|Juveniles': ['Sub 14', 'Sub 17'],
    'Hockey|Infantiles': ['10ma', '9na', '8va'],
};

const categoriasExcepcionInicial: CategoriasExcepcion = {
    'Hockey|Masculino': ['Mayores'],
};

const OpcionesAdminContext = createContext<OpcionesAdminContextValue | null>(null);

export const OpcionesAdminProvider = ({ children }: { children: ReactNode }) => {
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>(() => [...MOCK_DISCIPLINAS]);
    const [generos, setGeneros] = useState<string[]>(['Masculino', 'Femenino']);
    const [categorias, setCategorias] = useState<string[]>(['Mayores', 'Juveniles', 'Infantiles']);
    const [categoriasExcepcion, setCategoriasExcepcion] = useState<CategoriasExcepcion>(() => ({ ...categoriasExcepcionInicial }));
    const [subcategoriasPorKey, setSubcategoriasPorKey] = useState<SubcategoriasPorKey>(() => ({ ...subcategoriasInicial }));

    const disciplinasNombres = useMemo(
        () => disciplinas.filter((d) => d.activo).map((d) => d.nombre),
        [disciplinas]
    );

    const getCategoriasOptions = useMemo(
        () => (disciplina: string, genero: string) => {
            const key = `${disciplina}|${genero}`;
            if (categoriasExcepcion[key]) return categoriasExcepcion[key];
            return categorias;
        },
        [categoriasExcepcion, categorias]
    );

    const getSubcategoriaOptions = useMemo(
        () => (disciplina: string, genero: string, categoria: string) => {
            const keyTriple = `${disciplina}|${categoria}|${genero}`;
            const keyDoble = `${disciplina}|${categoria}`;
            if (subcategoriasPorKey[keyTriple]) return subcategoriasPorKey[keyTriple];
            if (subcategoriasPorKey[keyDoble]) return subcategoriasPorKey[keyDoble];
            return [];
        },
        [subcategoriasPorKey]
    );

    const value: OpcionesAdminContextValue = useMemo(
        () => ({
            disciplinas,
            setDisciplinas,
            generos,
            setGeneros,
            categorias,
            setCategorias,
            categoriasExcepcion,
            setCategoriasExcepcion,
            subcategoriasPorKey,
            setSubcategoriasPorKey,
            disciplinasNombres,
            getCategoriasOptions,
            getSubcategoriaOptions,
        }),
        [
            disciplinas,
            generos,
            categorias,
            categoriasExcepcion,
            subcategoriasPorKey,
            disciplinasNombres,
            getCategoriasOptions,
            getSubcategoriaOptions,
        ]
    );

    return (
        <OpcionesAdminContext.Provider value={value}>
            {children}
        </OpcionesAdminContext.Provider>
    );
};

export function useOpcionesAdmin(): OpcionesAdminContextValue {
    const ctx = useContext(OpcionesAdminContext);
    if (!ctx) throw new Error('useOpcionesAdmin must be used within OpcionesAdminProvider');
    return ctx;
}
