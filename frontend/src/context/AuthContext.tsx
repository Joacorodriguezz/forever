import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'deportista' | 'admin';

export interface AuthUser {
    /** DNI para deportista, 'admin' para administrador */
    loginId: string;
    role: UserRole;
    deportistaId?: number;
}

const AUTH_KEY = 'forever_auth';
const DEPORTISTA_ACCOUNTS_KEY = 'forever_deportista_accounts';
const ADMIN_ACCOUNTS_KEY = 'forever_admin_accounts';

export interface DeportistaAccount {
    dni: string;
    password: string;
    deportistaId: number;
}

/** Credenciales por defecto del primer admin (documento + contraseña) */
export const ADMIN_CREDENTIALS = {
    dni: 'admin',
    password: 'admin123',
};

export interface AdminAccount {
    documento: string;
    password: string;
}

function getAdminAccounts(): AdminAccount[] {
    try {
        const raw = localStorage.getItem(ADMIN_ACCOUNTS_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as AdminAccount[];
    } catch {
        return [];
    }
}

function getOrSeedAdminAccounts(): AdminAccount[] {
    let accounts = getAdminAccounts();
    if (accounts.length === 0) {
        const seed: AdminAccount[] = [
            { documento: ADMIN_CREDENTIALS.dni, password: ADMIN_CREDENTIALS.password },
        ];
        localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(seed));
        return seed;
    }
    return accounts;
}

function getStoredAuth(): AuthUser | null {
    try {
        const raw = localStorage.getItem(AUTH_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}

function getDeportistaAccounts(): DeportistaAccount[] {
    try {
        const raw = localStorage.getItem(DEPORTISTA_ACCOUNTS_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as DeportistaAccount[];
    } catch {
        return [];
    }
}

/** Cuentas iniciales para deportistas mock (simulación): DNI + contraseña por defecto */
const SEED_ACCOUNTS: DeportistaAccount[] = [
    { dni: '12345678', password: 'deportista123', deportistaId: 1 },
    { dni: '23456789', password: 'deportista123', deportistaId: 2 },
    { dni: '34567890', password: 'deportista123', deportistaId: 3 },
];

function getOrSeedDeportistaAccounts(): DeportistaAccount[] {
    let accounts = getDeportistaAccounts();
    if (accounts.length === 0) {
        localStorage.setItem(DEPORTISTA_ACCOUNTS_KEY, JSON.stringify(SEED_ACCOUNTS));
        accounts = SEED_ACCOUNTS;
    }
    return accounts;
}

interface AuthContextValue {
    user: AuthUser | null;
    login: (dni: string, password: string) => boolean;
    logout: () => void;
    isAdmin: boolean;
    registerDeportistaAccount: (dni: string, password: string, deportistaId: number) => void;
    /** Restablecer contraseña de un deportista (por DNI). Solo admin. */
    resetDeportistaPassword: (dni: string, newPassword: string) => boolean;
    /** Restablecer contraseña de un admin (por documento). Solo admin. */
    resetAdminPassword: (documento: string, newPassword: string) => boolean;
    /** Guardar/actualizar contraseña de un admin (al crear o editar en Gestión admin). */
    setAdminPassword: (documento: string, password: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(getStoredAuth);

    const login = useCallback((dni: string, password: string): boolean => {
        const normalizedDni = dni.trim();
        const adminAccounts = getOrSeedAdminAccounts();
        const adminAccount = adminAccounts.find((a) => a.documento === normalizedDni);
        if (adminAccount && adminAccount.password === password) {
            const authUser: AuthUser = { loginId: normalizedDni, role: 'admin' };
            setUser(authUser);
            localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
            return true;
        }
        const accounts = getOrSeedDeportistaAccounts();
        const account = accounts.find((a) => a.dni === normalizedDni);
        if (account && account.password === password) {
            const authUser: AuthUser = { loginId: normalizedDni, role: 'deportista', deportistaId: account.deportistaId };
            setUser(authUser);
            localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(AUTH_KEY);
    }, []);

    const registerDeportistaAccount = useCallback((dni: string, password: string, deportistaId: number) => {
        const accounts = getOrSeedDeportistaAccounts();
        const normalizedDni = dni.trim();
        const updated = accounts.filter((a) => a.dni !== normalizedDni);
        updated.push({ dni: normalizedDni, password, deportistaId });
        localStorage.setItem(DEPORTISTA_ACCOUNTS_KEY, JSON.stringify(updated));
    }, []);

    const resetDeportistaPassword = useCallback((dni: string, newPassword: string): boolean => {
        const accounts = getOrSeedDeportistaAccounts();
        const normalizedDni = dni.trim();
        const account = accounts.find((a) => a.dni === normalizedDni);
        if (!account) return false;
        const updated = accounts.map((a) =>
            a.dni === normalizedDni ? { ...a, password: newPassword } : a
        );
        localStorage.setItem(DEPORTISTA_ACCOUNTS_KEY, JSON.stringify(updated));
        return true;
    }, []);

    const resetAdminPassword = useCallback((documento: string, newPassword: string): boolean => {
        const accounts = getOrSeedAdminAccounts();
        const doc = documento.trim();
        const account = accounts.find((a) => a.documento === doc);
        if (!account) return false;
        const updated = accounts.map((a) =>
            a.documento === doc ? { ...a, password: newPassword } : a
        );
        localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(updated));
        return true;
    }, []);

    const setAdminPassword = useCallback((documento: string, password: string) => {
        const accounts = getOrSeedAdminAccounts();
        const doc = documento.trim();
        const updated = accounts.filter((a) => a.documento !== doc);
        updated.push({ documento: doc, password });
        localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(updated));
    }, []);

    const value: AuthContextValue = {
        user,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        registerDeportistaAccount,
        resetDeportistaPassword,
        resetAdminPassword,
        setAdminPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
