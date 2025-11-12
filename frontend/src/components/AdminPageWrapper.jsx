import React from 'react';

/**
 * Wrapper component para páginas de administración con estilos del club
 */
export default function AdminPageWrapper({ children }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8f9fa 0%, #f5f5f5 50%, #e3f2fd 100%)',
      minHeight: '100vh',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      <div style={{
        content: '',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 15% 25%, rgba(0, 26, 71, 0.02) 0%, transparent 50%),
                    radial-gradient(circle at 85% 75%, rgba(74, 144, 226, 0.03) 0%, transparent 50%)`,
        pointerEvents: 'none'
      }}></div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
