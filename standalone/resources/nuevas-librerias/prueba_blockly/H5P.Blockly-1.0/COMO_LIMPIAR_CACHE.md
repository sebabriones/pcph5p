# 🔄 Cómo Limpiar Cache del Navegador para Ver los Cambios

## 🎯 Problema

Hiciste cambios en `blockly.js` o `blockly.css` pero **los errores 404 siguen apareciendo** porque el navegador usa archivos antiguos guardados en cache.

---

## ✅ Solución: Recarga Forzada

### **Windows/Linux:**
```
Ctrl + F5
```
O también:
```
Ctrl + Shift + R
```

### **Mac:**
```
Cmd + Shift + R
```

---

## 🔍 Verificación en DevTools

### Método 1: Deshabilitar Cache (Recomendado para desarrollo)

1. Abre **DevTools** (F12)
2. Ve a la pestaña **Network**
3. Marca la opción **"Disable cache"**
4. Mantén DevTools abierto
5. Recarga la página (F5)

![Disable Cache](https://i.imgur.com/example.png)

---

### Método 2: Vaciar Cache Manualmente

**Chrome/Edge:**
1. Presiona `Ctrl + Shift + Delete`
2. Selecciona:
   - ✅ Imágenes y archivos en caché
   - ✅ (Opcional) Archivos y datos de sitios web
3. Rango de tiempo: **Última hora** o **Todo**
4. Clic en **Borrar datos**

**Firefox:**
1. Presiona `Ctrl + Shift + Delete`
2. Selecciona:
   - ✅ Cache
3. Rango de tiempo: **Todo**
4. Clic en **Limpiar ahora**

---

### Método 3: Modo Incógnito/Privado

Abre una **ventana privada** (siempre sin cache):
- Chrome: `Ctrl + Shift + N`
- Firefox: `Ctrl + Shift + P`
- Edge: `Ctrl + Shift + N`

---

## 🧪 Verificar que Funcionó

Después de limpiar cache y recargar:

### En la Consola (F12 → Console) deberías ver:

```javascript
✅ Ruta detectada desde script: ...
✅ Base path para Blockly: ...
✅ Cargando scripts secuencialmente: ...
✅ Script 1 cargado: blockly.min.js
✅ Script 2 cargado: javascript_compressed.js
✅ Todos los scripts de Blockly cargados secuencialmente
✅ Generadores registrados (Blockly 11.0.0+ formato)
```

### Ya NO deberías ver:
```
❌ GET .../click.mp3 404 (Not Found)
❌ GET .../disconnect.wav 404 (Not Found)
❌ GET .../delete.mp3 404 (Not Found)
❌ GET .../handdelete.cur 404 (Not Found)
```

---

## 🔧 Si Aún No Funciona

### 1. Verificar que el archivo se guardó

Abre `blockly.js` y busca la línea 447:
```javascript
sounds: false, // Debe estar presente
```

### 2. Verificar en Network Tab

1. Abre DevTools (F12)
2. Ve a **Network**
3. Marca **Disable cache**
4. Recarga (F5)
5. Busca el archivo `blockly.js`
6. Verifica el **Status**: debe ser `200` (no `304 Not Modified`)
7. Si es `304`, significa que usa cache → Forzar recarga con `Ctrl + F5`

### 3. Verificar versión del archivo

En la Network tab, busca:
```
blockly.js?version=1.0.0
```

El parámetro `?version=X` puede estar cacheado. Si ves que carga pero los errores persisten, verifica que el contenido del archivo descargado tenga `sounds: false`.

---

## 📊 Comparación

| Método | Velocidad | Efectividad | Cuándo Usar |
|--------|-----------|-------------|-------------|
| **Ctrl + F5** | ⚡ Rápido | ✅ Alta | Primera opción |
| **Disable cache + F5** | ⚡ Rápido | ✅ Muy alta | Desarrollo |
| **Vaciar cache manual** | ⏱️ Medio | ✅✅ Completa | Si lo anterior no funciona |
| **Modo incógnito** | ⚡ Rápido | ✅✅ Garantizada | Verificación rápida |

---

## ⚠️ Notas Importantes

### Cache en Producción
Si estás viendo el sitio en **producción** (no localhost):
- El servidor puede tener cache adicional
- El CDN puede tener cache
- Puede tardar más en actualizarse

### Parámetro de Versión
Para evitar cache en producción, puedes cambiar:
```
blockly.js?version=1.0.0
```
A:
```
blockly.js?version=1.0.1
```

Esto fuerza al navegador a descargar la nueva versión.

---

## ✅ Checklist

- [ ] Guardé los cambios en `blockly.js`
- [ ] Hice recarga forzada con `Ctrl + F5`
- [ ] Abrí DevTools y verifiqué la consola
- [ ] No veo errores 404 de archivos de audio/cursores
- [ ] El juego funciona correctamente

---

## 🎯 Resumen

**Para ver tus cambios:**
1. ✅ Guarda `blockly.js` (Ctrl + S)
2. ✅ Recarga forzada (Ctrl + F5)
3. ✅ Verifica consola (F12)
4. ✅ Confirma que no hay errores 404

Si sigues viendo errores después de esto, algo más está mal. En ese caso, usa **Modo Incógnito** para confirmar que el problema es de cache.

