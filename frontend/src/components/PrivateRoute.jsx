import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getToken, parseJWT } from '../helpers/auth';

export function PrivateRoute({ children, allowedRoles = [] }) {
  // Verificar si está autenticado
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  // Verificar roles si se especifican
  if (allowedRoles.length > 0) {
    const token = getToken();
    const userData = parseJWT(token);
    const userRole = userData?.role || userData?.rol;

    if (!userRole || !allowedRoles.map(r => r.toUpperCase()).includes(userRole.toUpperCase())) {
      // Redirigir según el rol del usuario
      if (userRole === 'DEPORTISTA') {
        return <Navigate to="/inicioDeportista" replace />;
      } else if (['ADMIN', 'ADMINISTRATIVO'].includes(userRole)) {
        return <Navigate to="/inicio" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return children;
}