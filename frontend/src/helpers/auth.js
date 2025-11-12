export function setAuth(token, role, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('usuario', JSON.stringify(user));
}


export function getToken() {
  return localStorage.getItem('token');
}

export function getRole() {
  return localStorage.getItem('role');
}

export function getUser() {
  const data = localStorage.getItem('usuario');
  return data ? JSON.parse(data) : null;
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('usuario');
}

export function parseJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error al parsear el token:", error);
    return null;
  }
}

export function getUserDataFromToken() {
  const token = getToken();
  return token ? parseJWT(token) : null;
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) {
    return false;
  }

  const userData = parseJWT(token);
  if (!userData || !userData.exp) {
    return false;
  }

  const isExpired = userData.exp * 1000 < Date.now();
  if (isExpired) {
    clearAuth();
    return false;
  }

  return true;
}

// Alias para guardar sólo token (intenta extraer role/usuario desde el JWT)
export function setToken(token) {
  if (!token) return;
  localStorage.setItem('token', token);
  const payload = parseJWT(token);
  if (!payload) return;
  if (payload.role) localStorage.setItem('role', payload.role);
  // Si el payload trae un objeto user, lo guardamos como 'usuario'
  if (payload.user) {
    localStorage.setItem('usuario', JSON.stringify(payload.user));
  } else {
    // intentamos armar un usuario mínimo desde claims comunes
    const maybeUser = {};
    if (payload.sub) maybeUser.id = payload.sub;
    if (payload.email) maybeUser.email = payload.email;
    if (payload.name) maybeUser.nombre = payload.name;
    if (Object.keys(maybeUser).length) {
      localStorage.setItem('usuario', JSON.stringify(maybeUser));
    }
  }
}

export function clearToken() {
  clearAuth();
}

export function getUserData() {
  return getUserDataFromToken();
}

export function isTokenExpired() {
  const token = getToken();
  if (!token) return true;
  const data = parseJWT(token);
  if (!data || !data.exp) return true;
  return data.exp * 1000 < Date.now();
}