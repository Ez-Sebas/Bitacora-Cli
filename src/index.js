#!/usr/bin/env node
// src/index.js
// Punto de entrada: lee process.argv y decide qué hacer

import { agregarNota, listarNotas, buscarNotas, borrarNota } from './notas.js';
import { getLongTime, getShortDate } from './fechas.js';
import { registrarAccion } from './almacen.js';

// process.argv = [ruta de node, ruta del script, ...lo que escribió el usuario]
const [, , comando, ...args] = process.argv;

function mostrarAyuda() {
    console.log(`
        bitacora-cli — tu registro de aprendizaje diario

        Uso:
        npm start -- agregar "texto" [etiqueta]   Guarda una nota
        npm start -- listar [N]                   Muestra las últimas N notas (por defecto 5)
        npm start -- buscar <palabra>             Busca notas que contengan la palabra
        npm start -- borrar <id>                  Elimina la nota con ese id
        npm start -- respaldar                    Copia las notas a respaldos/
        npm start -- exportar [carpeta]           Exporta las notas a un .txt
        npm start -- ayuda                        Muestra esta ayuda

        Ejemplos:
        npm start -- agregar "Hoy aprendí a usar fs" nodejs
        npm start -- listar 3
        npm start -- buscar fs
    `);
}

function comandoAgregar(args) {
    const texto = args[0];
    const etiqueta = args[1] || 'general';

    // Validación: texto vacío o ausente
    if (!texto || texto.trim() === '') {
        console.log('❌ Falta el texto de la nota.');
        console.log('   Uso: npm start -- agregar "texto" [etiqueta]');
        registrarAccion('agregar', 'error: texto vacío');
        return;
    }

    const resultado = agregarNota(texto, etiqueta);

    if (!resultado.ok) {
        console.log(`⚠️  Ya existe una nota igual (id ${resultado.id}). No se guardó.`);
        registrarAccion('agregar', `duplicado: ${resultado.id}`);
        return;
    }

    const { id, fecha } = resultado.nota;
    console.log(`✅ Nota guardada [${id}] (${etiqueta}) — ${getLongTime('es-ES', fecha)}`);
    registrarAccion('agregar', `ok: ${id}`);
}

function comandoListar(args) {
    let cantidad = parseInt(args[0], 10);

    // Validación: N no numérico o <= 0 -> valor por defecto e informar
    if (isNaN(cantidad) || cantidad <= 0) {
        if (args[0] !== undefined) {
        console.log(`⚠️  "${args[0]}" no es un número válido. Se usarán las últimas 5.`);
        }
        cantidad = 5;
    }

    const notas = listarNotas(cantidad);

    if (notas.length === 0) {
        console.log('📭 No hay notas guardadas todavía.');
        registrarAccion('listar', 'sin notas');
        return;
    }

    for (const nota of notas) {
        console.log(`[${nota.id}] (${nota.etiqueta}) ${getShortDate('es-ES', nota.fecha)} — ${nota.texto}`);
    }
    registrarAccion('listar', `${notas.length} notas`);
}

function comandoBuscar(args) {
    const termino = args[0];

    if (!termino || termino.trim() === '') {
        console.log('❌ Falta la palabra a buscar.');
        console.log('   Uso: npm start -- buscar <palabra>');
        registrarAccion('buscar', 'error: sin término');
        return;
    }

    const encontradas = buscarNotas(termino);

    if (encontradas.length === 0) {
        console.log(`🔍 No se encontraron notas con "${termino}".`);
        registrarAccion('buscar', `sin resultados: ${termino}`);
        return;
    }

    for (const nota of encontradas) {
        console.log(`[${nota.id}] (${nota.etiqueta}) ${getShortDate('es-ES', nota.fecha)} — ${nota.texto}`);
    }
    registrarAccion('buscar', `${encontradas.length} resultados: ${termino}`);
}

function comandoBorrar(args) {
    const id = args[0];

    if (!id) {
        console.log('❌ Falta el id de la nota a borrar.');
        console.log('   Uso: npm start -- borrar <id>');
        registrarAccion('borrar', 'error: sin id');
        return;
    }

    const resultado = borrarNota(id);

    if (!resultado.ok) {
        console.log(`❌ No existe una nota con el id "${id}".`);
        registrarAccion('borrar', `no encontrado: ${id}`);
        return;
    }

    console.log(`🗑️  Nota [${id}] eliminada.`);
    registrarAccion('borrar', `ok: ${id}`);
}

// --- Enrutador: decide qué comando ejecutar ---
switch (comando) {
    case 'agregar':
        comandoAgregar(args);
        break;
    case 'listar':
        comandoListar(args);
        break;
    case 'buscar':
        comandoBuscar(args);
        break;
    case 'borrar':
        comandoBorrar(args);
        break;
    case 'ayuda':
    case undefined:
        mostrarAyuda();
        break;
    default:
        console.log(`❌ Comando desconocido: "${comando}"`);
        console.log('   Escribe "npm start -- ayuda" para ver los comandos disponibles.');
        registrarAccion(comando, 'error: comando desconocido');
}
