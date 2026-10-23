# bitacora-cli

Aplicación de consola para llevar un registro diario de lo que aprendes,
sin salir de la terminal. Guarda notas en un archivo, evita duplicados,
genera respaldos y exporta a texto plano.

## Instalación

    npm install

## Comandos

| Comando | Qué hace | Ejemplo |
|---|---|---|
| `agregar "texto" [etiqueta]` | Guarda una nota (etiqueta opcional, por defecto `general`) | `npm start -- agregar "Hoy aprendí a usar fs" nodejs` |
| `listar [N]` | Muestra las últimas N notas (por defecto 5) | `npm start -- listar 3` |
| `buscar <palabra>` | Busca notas que contengan la palabra | `npm start -- buscar fs` |
| `borrar <id>` | Elimina la nota con ese id | `npm start -- borrar aa30e7f6` |
| `respaldar` | Copia `notas.json` a `respaldos/` | `npm start -- respaldar` |
| `exportar [carpeta]` | Exporta las notas a un `.txt` y lo mueve | `npm start -- exportar "C:/Users/tu-usuario/Desktop"` |
| `ayuda` | Muestra la ayuda | `npm start -- ayuda` |

## Reflexión

### 1. ¿Por qué elegiste CommonJS o ES Modules?

Usé ES Modules porque es lo que vengo manejando y me siento mas comodo y con (`"type": "module"`) en el `package.json` ya queda todo listo. También porque necesitaba `import.meta.dirname` para las rutas, y eso en CommonJS no existe.

### 2. ¿Por qué `fs`, `object-hash` y `fechas` se importan distinto?

Porque cada uno viene de un lado distinto. `fs` es de Node, `object-hash` lo instalé con npm y `fechas` era un archivo mío. Cuando lo pasé a paquete aparte le quité el `./` y quedó igual que `object-hash`.

### 3. ¿Por qué `data/notas.json` se resuelve distinto según desde dónde se ejecute?

Porque la ruta relativa se mide desde donde estás en la terminal, no desde el archivo. Si ejecutaba desde otra carpeta, apuntaba a cualquier lado. Lo arreglé con `path.join(import.meta.dirname, '..', 'data')`. 

### 4. ¿Por qué `node_modules/` no se sube a Git y cómo se recupera?

Porque pesa mucho y se puede volver a bajar. Lo que subo es el `package.json`, y con un `npm install` cualquiera recupera todo..

### 5. ¿Qué diferencia viste al importar tu paquete CommonJS desde ESM?

Que funcionó igual, el `import` no dio problema aunque el paquete esté en CommonJS. Lo que sí entendí es que al revés no sirve: desde CommonJS no puedo usar `import`.
