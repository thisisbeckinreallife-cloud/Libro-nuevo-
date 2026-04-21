# workbook-files/

Coloca aquí los PDFs del Workbook Oficial. La página `/workbook` detecta automáticamente cuáles existen y los muestra como descargables; los que falten aparecen como *"Disponible próximamente"*.

Nombres exactos (no renombrar):

- `hoja-ejercicios-1.pdf`
- `hoja-ejercicios-2.pdf`
- `plantilla.pdf`
- `checklist.pdf`

Los archivos se sirven a través de `/workbook/file/<slug>` tras verificar sesión del usuario, por lo que no son accesibles públicamente sin haber pasado por el registro.

## Para añadir/actualizar un PDF

1. Copia el PDF con el nombre exacto en este directorio.
2. Commit + push. Railway rehace el build y los usuarios lo ven sin cambios de código.
3. Si quieres añadir una pieza nueva (más allá de las 4), edita `src/lib/workbook.ts` (array `DEFS`) y `src/i18n/dictionaries.ts` (clave `workbook.items`).

## Límite razonable

Cada PDF < 5 MB para que el repositorio no se engorde. Si algún archivo pesa más, muévelo a un volumen de Railway y sírvelo por URL externa.
