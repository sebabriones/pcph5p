# 🖱️ Cursores Personalizados Deshabilitados

## ✅ Problema Resuelto

Se eliminó el error 404 del cursor personalizado `handdelete.cur` sobrescribiendo los estilos CSS de Blockly para usar **cursores estándar del sistema** en lugar de archivos personalizados.

---

## 🐛 Error Original

```
❌ GET .../handdelete.cur 404 (Not Found)
```

**Causa:** Blockly intenta cargar un cursor personalizado cuando arrastras bloques para eliminarlos, pero el archivo no existe en la carpeta `media/`.

---

## 🔧 Solución Implementada

**Archivo:** `blockly.css` (líneas 212-233)

Se agregaron reglas CSS que **sobrescriben** los cursores personalizados de Blockly:

```css
/* Sobrescribir cursores personalizados de Blockly para evitar errores 404 */

/* Cursor al arrastrar bloques */
.blocklyDraggable,
.blocklyDraggable *,
.blocklyBlockDragSurface,
.blocklyBlockDragSurface * {
  cursor: default !important;
  cursor: -webkit-grab !important;  /* Mano abierta */
  cursor: grab !important;
}

/* Cursor al sostener bloques */
.blocklyDraggable:active,
.blocklyDraggable:active * {
  cursor: default !important;
  cursor: -webkit-grabbing !important;  /* Mano cerrada */
  cursor: grabbing !important;
}

/* Cursor sobre la papelera y bloques del flyout */
.blocklyTrash,
.blocklyFlyout .blocklyDraggable {
  cursor: pointer !important;  /* Puntero estándar */
}
```

---

## 🎯 Resultado

### Antes:
- ❌ Error 404: `handdelete.cur`
- ❌ Intenta cargar cursor personalizado
- ⚠️ Fallback a cursor por defecto del navegador

### Después:
- ✅ **Sin errores 404**
- ✅ Usa cursores estándar del sistema
- ✅ Mejor rendimiento (no intenta descargar archivos)
- ✅ Funciona en todos los navegadores

---

## 🖱️ Cursores Utilizados Ahora

| Acción | Cursor | Descripción |
|--------|--------|-------------|
| **Arrastrar bloque** | `grab` (✋) | Mano abierta |
| **Sosteniendo bloque** | `grabbing` (✊) | Mano cerrada |
| **Sobre papelera** | `pointer` (👆) | Puntero estándar |
| **Sobre bloque flyout** | `pointer` (👆) | Puntero estándar |

**Ventaja:** Son cursores nativos del navegador, no requieren archivos externos.

---

## 📊 Impacto

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Error 404 cursor** | ❌ Sí | ✅ No |
| **Archivos requeridos** | ⚠️ handdelete.cur | ✅ Ninguno |
| **Feedback visual** | ✅ Funciona | ✅ Funciona |
| **Compatibilidad** | ⚠️ Solo si archivo existe | ✅ 100% navegadores |
| **Rendimiento** | ⚠️ Intenta descargar | ✅ Instantáneo |

---

## 🎮 Experiencia de Usuario

### Lo que SIGUE funcionando:
- ✅ Cursor cambia al arrastrar bloques (mano abierta → mano cerrada)
- ✅ Cursor indica que puedes hacer clic (puntero)
- ✅ Feedback visual al eliminar bloques
- ✅ Arrastrar y soltar funciona perfectamente

### Lo que cambió:
- 🖱️ Usa cursor estándar del sistema en lugar de personalizado
- 🖱️ Más ligero (no descarga archivo .cur)
- 🖱️ Consistente en todos los navegadores

---

## 🔍 Detalles Técnicos

### `!important`
Se usa `!important` para sobrescribir los estilos inline que Blockly aplica dinámicamente.

### Fallbacks múltiples
```css
cursor: default !important;        /* Fallback 1 */
cursor: -webkit-grab !important;   /* Safari/Chrome antiguo */
cursor: grab !important;           /* Estándar moderno */
```

Esto asegura compatibilidad con navegadores antiguos.

### Selectores específicos
- `.blocklyDraggable` → Bloques arrastrables
- `.blocklyBlockDragSurface` → Superficie de arrastre
- `.blocklyTrash` → Papelera
- `.blocklyFlyout` → Área de bloques disponibles

---

## ✅ Verificación

Para confirmar que funciona:

1. **Recarga el navegador** (Ctrl + F5)
2. **Abre la consola** (F12)
3. ✅ **NO debe aparecer** error de `handdelete.cur`
4. **Arrastra un bloque** 
5. ✅ El cursor debe cambiar a "mano" (grab/grabbing)
6. **Pasa sobre la papelera**
7. ✅ El cursor debe cambiar a "puntero" (pointer)

---

## 📚 Archivos CSS Nativos vs Personalizados

### Cursores Nativos del Navegador (Usados ahora):
```css
cursor: grab;      /* ✋ Mano abierta */
cursor: grabbing;  /* ✊ Mano cerrada */
cursor: pointer;   /* 👆 Dedo apuntando */
cursor: default;   /* ➡️ Flecha */
```

**Ventajas:**
- ✅ No requieren archivos externos
- ✅ Instantáneos
- ✅ Funciona offline
- ✅ Sin errores 404

### Cursores Personalizados (Antes):
```css
cursor: url('handdelete.cur'), auto;
```

**Desventajas:**
- ❌ Requiere archivo .cur
- ❌ Genera error 404 si falta
- ❌ Más lento (descarga necesaria)
- ❌ Puede no funcionar en algunos navegadores

---

## 🔄 Revertir Cambios (Si Es Necesario)

Si en el futuro quieres usar cursores personalizados:

### Paso 1: Descargar archivo
```bash
cd blockly-lib/media/
Invoke-WebRequest -Uri "https://unpkg.com/blockly@11.0.0/media/handdelete.cur" -OutFile "handdelete.cur"
```

### Paso 2: Eliminar CSS
En `blockly.css`, eliminar las líneas 212-233:
```css
/* Eliminar estas reglas CSS */
.blocklyDraggable { ... }
```

---

## ✅ Estado Final

**Implementado:** 30 de octubre de 2025  
**Archivos modificados:** `blockly.css` (ambas ubicaciones)  
**Resultado:** ✅ Sin errores 404 de cursores  
**Experiencia:** ✅ Idéntica con cursores nativos

