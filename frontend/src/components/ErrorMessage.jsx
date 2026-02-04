import React from 'react';

function ErrorMessage({ message, onRetry }) {
    if (!message) return null;

    return (
        <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
            <div>
                <strong>⚠️ Error:</strong> {message}
            </div>
            {onRetry && (
                <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
                    🔄 Reintentar
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;
