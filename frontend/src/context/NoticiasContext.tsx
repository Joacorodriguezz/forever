import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Noticia } from '../types/noticia';
import { MOCK_NOTICIAS } from '../data/noticias';

interface NoticiasContextValue {
    noticias: Noticia[];
    addNoticia: (n: Omit<Noticia, 'id'>) => void;
    getNoticiaById: (id: number) => Noticia | undefined;
}

const NoticiasContext = createContext<NoticiasContextValue | null>(null);

export function NoticiasProvider({ children }: { children: ReactNode }) {
    const [noticias, setNoticias] = useState<Noticia[]>(() => [...MOCK_NOTICIAS]);

    const addNoticia = useCallback((n: Omit<Noticia, 'id'>) => {
        setNoticias((prev) => {
            const id = prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1;
            return [...prev, { ...n, id }];
        });
    }, []);

    const getNoticiaById = useCallback(
        (id: number) => noticias.find((n) => n.id === id),
        [noticias]
    );

    const value: NoticiasContextValue = { noticias, addNoticia, getNoticiaById };
    return <NoticiasContext.Provider value={value}>{children}</NoticiasContext.Provider>;
}

export function useNoticias() {
    const ctx = useContext(NoticiasContext);
    if (!ctx) throw new Error('useNoticias must be used within NoticiasProvider');
    return ctx;
}
