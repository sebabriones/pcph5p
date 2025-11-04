# 🔍 Debug de Rutas - H5P.Blockly

## 🐛 Problema Actual

Al cargar en Lumi aparecen estos errores:
```
❌ Uncaught SyntaxError: Unexpected token '<' (at blockly.min.js:1:1)
❌ Uncaught SyntaxError: Unexpected token '<' (at javascript_compressed.js:1:1)
❌ Uncaught ReferenceError: Blockly is not defined
```

**Causa:** Los archivos JavaScript no se están encontrando. En lugar de recibir JS, el navegador recibe HTML (probablemente una página 404).

---

## ✅ Solución Implementada: Logging Detallado

Se agregó logging extenso para identificar exactamente qué ruta está intentando usar y por qué falla.

---

## 📊 Logs que Verás en Consola

Cuando recargues el contenido en Lumi, deberías ver estos mensajes en la consola (F12):

### 1. Detección de Ruta Base

Verás UNO de estos mensajes dependiendo de qué estrategia funcionó:

```javascript
// Opción A: Desde libraryInfo
"Ruta desde libraryInfo: /path/to/H5P.Blockly-1.0/blockly-lib/blockly.min.js"

// Opción B: Desde H5P.libraryPaths
"Ruta desde H5P.libraryPaths: /path/to/H5P.Blockly-1.0/blockly-lib/blockly.min.js"

// Opción C: Detectada desde scripts cargados
"Ruta detectada desde script: http://localhost:58325/path/to/H5P.Blockly-1.0/blockly-lib/blockly.min.js"

// Opción D: Fallback relativo
"Ruta fallback (relativa): ./H5P.Blockly-1.0/blockly-lib/blockly.min.js"
```

### 2. Base Path Completo

```javascript
"Base path para Blockly: http://localhost:58325/some/path/H5P.Blockly-1.0/"
```

### 3. Scripts a Cargar

```javascript
"Intentando cargar scripts: [
  'http://localhost:58325/path/H5P.Blockly-1.0/blockly-lib/blockly.min.js',
  'http://localhost:58325/path/H5P.Blockly-1.0/blockly-lib/javascript_compressed.js'
]"
```

### 4. Resultado de Carga

**Si tiene éxito:**
```javascript
"✅ Script cargado exitosamente: http://localhost:58325/.../blockly.min.js"
"✅ Script cargado exitosamente: http://localhost:58325/.../javascript_compressed.js"
"✅ Todos los scripts de Blockly cargados"
```

**Si falla:**
```javascript
"❌ Error cargando script: http://localhost:58325/.../blockly.min.js"
"❌ Error cargando script: http://localhost:58325/.../javascript_compressed.js"
"⚠️ Todos los scripts locales fallaron, intentando CDN..."
"Cargando Blockly desde CDN: ['https://unpkg.com/...']"
```

### 5. Media Path

```javascript
"Media path para Blockly: http://localhost:58325/.../H5P.Blockly-1.0/blockly-lib/media/"
```

---

## 🔧 Cómo Usar Esta Información

### Paso 1: Abrir Consola

1. En Lumi, presiona **F12**
2. Ve a la pestaña **Console**
3. Recarga el contenido H5P.Blockly

### Paso 2: Identificar el Problema

Busca los mensajes de log y verifica:

#### ¿Qué ruta se está usando?

```javascript
"Base path para Blockly: [RUTA_DETECTADA]"
```

Copia esta ruta y verifica:
- ¿Es correcta?
- ¿Apunta a la carpeta H5P.Blockly-1.0?
- ¿Tiene el formato correcto?

#### ¿Qué URL completa intenta cargar?

```javascript
"Intentando cargar scripts: [
  '[URL_COMPLETA_1]',
  '[URL_COMPLETA_2]'
]"
```

**Prueba manualmente:** Abre esas URLs en el navegador
- Si devuelve el archivo JS → La ruta es correcta pero hay otro problema
- Si devuelve 404 → La ruta está mal
- Si devuelve HTML → El servidor no encuentra el archivo

---

## 🛠️ Soluciones Según el Error

### Error Tipo 1: Ruta Relativa Incorrecta

**Síntoma:**
```
"Ruta fallback (relativa): ./H5P.Blockly-1.0/blockly-lib/..."
"❌ Error cargando script: ./H5P.Blockly-1.0/blockly-lib/blockly.min.js"
```

**Problema:** La detección automática falló y usa un fallback que no funciona en Lumi.

**Solución:** Ajustar la detección de rutas en `getLibraryFilePath()`

---

### Error Tipo 2: Puerto/Host Incorrecto

**Síntoma:**
```
"Base path para Blockly: http://localhost:58325/..."
"❌ Error cargando script: http://localhost:58325/H5P.Blockly-1.0/..."
```

**Problema:** Falta el path intermedio (resources, etc.)

**Solución:** La detección necesita incluir la estructura completa de directorios.

---

### Error Tipo 3: Archivos No Existen

**Síntoma:**
```
"✅ Base path detectado correctamente"
"❌ Error cargando script: [URL que parece correcta]"
```

**Problema:** Los archivos de `blockly-lib/` no están en esa ubicación.

**Solución:** Verificar que los archivos existan:
1. Navega a: `H5P.Blockly-1.0/blockly-lib/`
2. Verifica que existan:
   - `blockly.min.js`
   - `javascript_compressed.js`
   - `media/sprites.png`

---

## 🎯 Próximos Pasos

### Paso 1: Recopilar Información

1. Recarga el contenido en Lumi
2. Copia **TODOS** los mensajes de consola
3. Especialmente:
   - "Base path para Blockly: ..."
   - "Intentando cargar scripts: ..."
   - Mensajes de ✅ éxito o ❌ error

### Paso 2: Compartir los Logs

Envíame los logs completos y podré:
1. Identificar exactamente qué estrategia de detección usó
2. Ver qué ruta está intentando
3. Ajustar el código según sea necesario

### Paso 3: Ajustar si es Necesario

Según los logs, podré:
- Mejorar la detección de rutas para Lumi
- Agregar una estrategia específica para Lumi
- Ajustar el fallback

---

## 📝 Ejemplo de Log Completo

**Escenario Exitoso:**
```
Ruta detectada desde script: http://localhost:58325/h5p/content/2219790729/H5P.Blockly-1.0/
Base path para Blockly: http://localhost:58325/h5p/content/2219790729/H5P.Blockly-1.0/
Intentando cargar scripts: [
  "http://localhost:58325/h5p/content/2219790729/H5P.Blockly-1.0/blockly-lib/blockly.min.js",
  "http://localhost:58325/h5p/content/2219790729/H5P.Blockly-1.0/blockly-lib/javascript_compressed.js"
]
✅ Script cargado exitosamente: .../blockly.min.js
✅ Script cargado exitosamente: .../javascript_compressed.js
✅ Todos los scripts de Blockly cargados
Media path para Blockly: http://localhost:58325/h5p/content/.../media/
```

**Escenario con Fallback a CDN:**
```
Ruta fallback (relativa): ./H5P.Blockly-1.0/
Base path para Blockly: ./H5P.Blockly-1.0/
Intentando cargar scripts: [
  "./H5P.Blockly-1.0/blockly-lib/blockly.min.js",
  "./H5P.Blockly-1.0/blockly-lib/javascript_compressed.js"
]
❌ Error cargando script: ./H5P.Blockly-1.0/blockly-lib/blockly.min.js
❌ Error cargando script: ./H5P.Blockly-1.0/blockly-lib/javascript_compressed.js
⚠️ Todos los scripts locales fallaron, intentando CDN...
Cargando Blockly desde CDN: [...]
✅ Script CDN cargado: https://unpkg.com/blockly@11.0.0/blockly.min.js
✅ Script CDN cargado: https://unpkg.com/blockly@11.0.0/javascript_compressed.js
✅ Blockly cargado desde CDN
```

---

## 🔄 Fallback Automático

Si los archivos locales fallan, el sistema **automáticamente** intentará cargar desde CDN como respaldo:

```javascript
⚠️ Todos los scripts locales fallaron, intentando CDN...
```

Esto garantiza que el contenido funcione incluso si hay problemas con las rutas locales.

---

## ✅ Verificación Final

Una vez que funcione, deberías ver:

1. ✅ Ruta detectada correctamente
2. ✅ Scripts cargados sin errores
3. ✅ Blockly workspace visible
4. ✅ Bloques arrastrables
5. ✅ Botón "Iniciar" funcional

---

**📧 Copia y pega los logs completos de la consola para ayudarte mejor.**

