import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(import.meta.dirname, '..', 'data');
const NOTAS_PATH = path.join(DATA_DIR, 'notas.json');
const BITACORA_PATH = path.join(DATA_DIR, 'bitacora.log');

function asegurarCarpeta() {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function leerNotas() {
    asegurarCarpeta();

    if (!fs.existsSync(NOTAS_PATH)) {
        return [];
    }

    const contenido = fs.readFileSync(NOTAS_PATH, 'utf-8');

    if (contenido.trim() === '') {
        return [];
    }

    try {
        const datos = JSON.parse(contenido);

        if (!Array.isArray(datos)) {
        throw new Error('El contenido no es un arreglo');
        }

        return datos;
    } catch (error) {
        console.error('⚠️  No se pudo leer data/notas.json: el archivo está dañado.');
        console.error(`   Detalle: ${error.message}`);
        console.error('   Revisa el archivo o bórralo para empezar de cero.');
        process.exit(1);
    }
}

export function guardarNotas(notas) {
    asegurarCarpeta();

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

export function respaldarNotas() {
    asegurarCarpeta();

    const RESPALDOS_DIR = path.join(import.meta.dirname, '..', 'respaldos');
    fs.mkdirSync(RESPALDOS_DIR, { recursive: true });


    const marca = new Date().toISOString().replace(/[:.]/g, '-');
    const destino = path.join(RESPALDOS_DIR, `notas_${marca}.json`);

    fs.copyFileSync(NOTAS_PATH, destino);
    return destino;
}

export function exportarNotas(notas, carpetaDestino) {
    const SALIDA_DIR = path.join(import.meta.dirname, '..', 'salida');
    fs.mkdirSync(SALIDA_DIR, { recursive: true });

    const origen = path.join(SALIDA_DIR, 'exportacion.txt');

    const lineas = notas.map(
        (nota) => `[${nota.id}] (${nota.etiqueta}) ${nota.texto}`
    );
    const contenido = lineas.join('\n') + '\n';
    fs.writeFileSync(origen, contenido, 'utf-8');

    const destino = path.join(carpetaDestino, 'exportacion.txt');
    try {
        fs.renameSync(origen, destino);
    } catch (error) {
        if (error.code === 'EXDEV') {
        fs.copyFileSync(origen, destino);
        fs.unlinkSync(origen);
        } else {
        throw error;
        }
    }

    return destino;
}
