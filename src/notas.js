// src/notas.js
// Lógica de las notas. No toca el disco: usa almacen.js

import objectHash from 'object-hash';
import { leerNotas, guardarNotas } from './almacen.js';
import { getTimestamp } from './fechas.js';

// Regla 1: id = primeros 8 caracteres del hash del texto
function generarId(texto) {
    return objectHash(texto).slice(0, 8);
}

// Regla 1: el texto ya existe si hay una nota con el mismo id
function buscarDuplicado(notas, id) {
    return notas.find((nota) => nota.id === id);
}

export function agregarNota(texto, etiqueta = 'general') {
    const notas = leerNotas();
    const id = generarId(texto);

    const duplicado = buscarDuplicado(notas, id);
    if (duplicado) {
        return { ok: false, id: duplicado.id };
    }

    const nota = {
        id,
        texto,
        etiqueta,
        fecha: getTimestamp(),
    };

    notas.push(nota);
    guardarNotas(notas);

    return { ok: true, nota };
}

export function listarNotas(cantidad = 5) {
    const notas = leerNotas();
    // Las últimas N: slice(-N) toma desde el final
    return notas.slice(-cantidad);
}

export function buscarNotas(termino) {
    const notas = leerNotas();
    const busqueda = termino.toLowerCase();

    return notas.filter((nota) =>
        nota.texto.toLowerCase().includes(busqueda)
    );
}

export function borrarNota(id) {
    const notas = leerNotas();
    const restantes = notas.filter((nota) => nota.id !== id);

    // Si no cambió el largo, ese id no existía
    if (restantes.length === notas.length) {
        return { ok: false };
    }

    guardarNotas(restantes);
    return { ok: true };
}

export function contarNotas() {
    return leerNotas().length;
}
