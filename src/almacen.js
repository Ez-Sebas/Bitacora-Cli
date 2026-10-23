// src/almacen.js
// Única capa que habla con el disco: notas.json y bitacora.log

import fs from 'node:fs';
import path from 'node:path';

// import.meta.dirname = carpeta donde vive ESTE archivo (src/)
// '..' sube a la raíz del proyecto, y de ahí entramos a data/
const DATA_DIR = path.join(import.meta.dirname, '..', 'data');
const NOTAS_PATH = path.join(DATA_DIR, 'notas.json');
const BITACORA_PATH = path.join(DATA_DIR, 'bitacora.log');

// Crea data/ si no existe. recursive:true evita error si ya está.
function asegurarCarpeta() {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function leerNotas() {
    asegurarCarpeta();

    // Si el archivo no existe, arrancamos con un arreglo vacío
    if (!fs.existsSync(NOTAS_PATH)) {
        return [];
    }

    const contenido = fs.readFileSync(NOTAS_PATH, 'utf-8');

    // Archivo vacío o solo espacios -> tratar como arreglo vacío
    if (contenido.trim() === '') {
        return [];
    }

    try {
        const datos = JSON.parse(contenido);

        // El JSON puede ser válido pero no ser un arreglo
        if (!Array.isArray(datos)) {
        throw new Error('El contenido no es un arreglo');
        }

        return datos;
    } catch (error) {
        // Regla 6: nunca romperse con un error sin explicar
        console.error('⚠️  No se pudo leer data/notas.json: el archivo está dañado.');
        console.error(`   Detalle: ${error.message}`);
        console.error('   Revisa el archivo o bórralo para empezar de cero.');
        process.exit(1);
    }
}

export function guardarNotas(notas) {
    asegurarCarpeta();
    // null, 2 -> indentación de 2 espacios, para que sea legible a ojo
    fs.writeFileSync(NOTAS_PATH, JSON.stringify(notas, null, 2), 'utf-8');
}

export function registrarAccion(comando, resultado) {
    asegurarCarpeta();
    const fecha = new Date().toISOString();
    const linea = `${fecha} | ${comando} | ${resultado}\n`;
    fs.appendFileSync(BITACORA_PATH, linea, 'utf-8');
}

export function obtenerRutas() {
    return { DATA_DIR, NOTAS_PATH, BITACORA_PATH };
}
