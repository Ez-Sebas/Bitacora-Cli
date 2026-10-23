// src/fechas.js
// Funciones de fecha. Por ahora viven aquí; en la Parte 4
// este archivo se reemplaza por un paquete npm propio.

export function getTimestamp() {
    return Date.now();
}

export function getLongTime(locale = 'es-ES', timestamp = Date.now()) {
    return new Date(timestamp).toLocaleString(locale);
}

export function getShortDate(locale = 'es-ES', timestamp = Date.now()) {
    return new Date(timestamp).toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}
