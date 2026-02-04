import React from 'react';

function LoadingSpinner({ size = 'md', color = '#001a47' }) {
    const sizeClass = {
        sm: 'spinner-border-sm',
        md: '',
        lg: 'spinner-border-lg'
    }[size];

    return (
        <div className="text-center py-4">
            <div className={`spinner-border ${sizeClass}`} style={{ color }} role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );
}

export default LoadingSpinner;
