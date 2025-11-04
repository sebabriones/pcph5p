# Ejemplo de Implementación: Formatear Nombre de Usuario

## 📝 Enunciado Original

> Escribe un programa que pregunte el nombre completo del usuario en la consola y que después muestre por pantalla su nombre completo del usuario tres veces, una con todas las letras minúsculas, otra con todas las letras mayúsculas y otra solo con la primera letra del nombre y de los apellidos en mayúscula. El usuario puede introducir su nombre combinando mayúsculas y minúsculas como quiera.

---

## 🎯 Configuración en el Editor H5P

### Paso 1: Configuración General

En el editor H5P, configura los siguientes campos:

| Campo | Valor |
|-------|-------|
| **Título de la Terminal** | `Ejercicio: Formatear Nombre de Usuario` |
| **Instrucciones** | Ver HTML abajo |
| **Código Inicial en Editor** | Ver código abajo |
| **Código Pre-cargado** | (dejar vacío) |
| **Mostrar números de línea** | ✓ Activado |
| **Tema de color** | Oscuro |
| **Permitir entrada de usuario (input)** | ✓ **ACTIVADO** (Muy importante) |
| **Máximo de líneas en salida** | 1000 |

---

### Paso 2: Instrucciones (HTML)

En el campo **"Instrucciones"**, pega este HTML:

```html
<p><strong>Objetivo:</strong> Escribir un programa que solicite el nombre completo del usuario y muestre diferentes formatos del nombre.</p>

<p><strong>Requisitos:</strong></p>
<ol>
  <li>Pedir el nombre completo usando <code>input()</code> (tipo: <strong>string</strong>)</li>
  <li>Mostrar el nombre en minúsculas usando <code>.lower()</code> (tipo de salida: <strong>string</strong>)</li>
  <li>Mostrar el nombre en mayúsculas usando <code>.upper()</code> (tipo de salida: <strong>string</strong>)</li>
  <li>Mostrar el nombre con formato título usando <code>.title()</code> (tipo de salida: <strong>string</strong>)</li>
</ol>

<p><em>Nota: El usuario puede escribir el nombre en cualquier combinación de mayúsculas y minúsculas.</em></p>
```

---

### Paso 3: Código Inicial

En el campo **"Código Inicial en Editor"**, pega este código:

```python
# Ejercicio: Formatear Nombre de Usuario
#
# Escribe un programa que:
# 1. Pregunte el nombre completo del usuario usando input()
#    → Tipo de entrada: string (texto)
# 2. Muestre el nombre en minúsculas usando .lower()
#    → Tipo de salida: string
# 3. Muestre el nombre en mayúsculas usando .upper()
#    → Tipo de salida: string
# 4. Muestre el nombre con formato título usando .title()
#    → Tipo de salida: string
#
# Ejemplo de ejecución:
# Ingresa tu nombre completo: jUaN pÉrEz GaRcÍa
# minúsculas: juan pérez garcía
# MAYÚSCULAS: JUAN PÉREZ GARCÍA
# Título: Juan Pérez García

# Escribe tu código aquí:
```

---

### Paso 4: Habilitar Calificación

1. Marca la casilla: **☑ Habilitar Calificación**
2. Esto activará los campos de ejercicios requeridos

---

### Paso 5: Configurar Ejercicios Requeridos

Haz clic en **"Agregar"** para crear **4 ejercicios**:

---

#### 📝 Ejercicio 1: "Solicitar nombre con input()"

**Campos a completar:**

1. **Nombre del ejercicio:**
   ```
   Solicitar nombre con input()
   ```

2. **Descripción (HTML):**
   ```html
   <p><strong>Ejercicio 1:</strong> El programa debe solicitar el nombre completo del usuario.</p>
   <p><strong>Requisitos:</strong></p>
   <ul>
     <li>Usar la función <code>input()</code> para pedir datos</li>
     <li>Asignar el resultado a una variable usando <code>=</code></li>
     <li><strong>Tipo de dato de entrada:</strong> <code>string</code> (texto) - por defecto de input()</li>
   </ul>
   ```

3. **Validación:**
   - **Tipo de validación:** `Código contiene palabras clave`
   - **Palabras clave requeridas:** Agregar 2 palabras clave:
     - `input`
     - `=`
   - **Tipo de dato de entrada:** `String (texto) - por defecto de input()`
   - **Tipo de dato de salida:** `No especificar`

**Código que cumple este ejercicio:**
```python
nombre = input("Ingresa tu nombre completo: ")
```

---

#### 📝 Ejercicio 2: "Mostrar nombre en minúsculas"

**Campos a completar:**

1. **Nombre del ejercicio:**
   ```
   Mostrar nombre en minúsculas
   ```

2. **Descripción (HTML):**
   ```html
   <p><strong>Ejercicio 2:</strong> Mostrar el nombre en minúsculas.</p>
   <p><strong>Requisitos:</strong></p>
   <ul>
     <li>Usar el método <code>.lower()</code></li>
     <li>Mostrar el resultado con <code>print()</code></li>
     <li><strong>Tipo de dato de salida:</strong> <code>string</code> (texto)</li>
   </ul>
   ```

3. **Validación:**
   - **Tipo de validación:** `Código contiene palabras clave`
   - **Palabras clave requeridas:** Agregar 2 palabras clave:
     - `lower`
     - `print`
   - **Tipo de dato de entrada:** `No especificar`
   - **Tipo de dato de salida:** `String (texto)`

**Código que cumple este ejercicio:**
```python
print(nombre.lower())
# o también:
print("minúsculas:", nombre.lower())
```

---

#### 📝 Ejercicio 3: "Mostrar nombre en mayúsculas"

**Campos a completar:**

1. **Nombre del ejercicio:**
   ```
   Mostrar nombre en mayúsculas
   ```

2. **Descripción (HTML):**
   ```html
   <p><strong>Ejercicio 3:</strong> Mostrar el nombre en mayúsculas.</p>
   <p><strong>Requisitos:</strong></p>
   <ul>
     <li>Usar el método <code>.upper()</code></li>
     <li>Mostrar el resultado con <code>print()</code></li>
     <li><strong>Tipo de dato de salida:</strong> <code>string</code> (texto)</li>
   </ul>
   ```

3. **Validación:**
   - **Tipo de validación:** `Código contiene palabras clave`
   - **Palabras clave requeridas:** Agregar 2 palabras clave:
     - `upper`
     - `print`
   - **Tipo de dato de entrada:** `No especificar`
   - **Tipo de dato de salida:** `String (texto)`

**Código que cumple este ejercicio:**
```python
print(nombre.upper())
# o también:
print("MAYÚSCULAS:", nombre.upper())
```

---

#### 📝 Ejercicio 4: "Mostrar nombre con formato título"

**Campos a completar:**

1. **Nombre del ejercicio:**
   ```
   Mostrar nombre con formato título
   ```

2. **Descripción (HTML):**
   ```html
   <p><strong>Ejercicio 4:</strong> Mostrar el nombre con formato título (primera letra de cada palabra en mayúscula).</p>
   <p><strong>Requisitos:</strong></p>
   <ul>
     <li>Usar el método <code>.title()</code></li>
     <li>Mostrar el resultado con <code>print()</code></li>
     <li><strong>Tipo de dato de salida:</strong> <code>string</code> (texto)</li>
   </ul>
   ```

3. **Validación:**
   - **Tipo de validación:** `Código contiene palabras clave`
   - **Palabras clave requeridas:** Agregar 2 palabras clave:
     - `title`
     - `print`
   - **Tipo de dato de entrada:** `No especificar`
   - **Tipo de dato de salida:** `String (texto)`

**Código que cumple este ejercicio:**
```python
print(nombre.title())
# o también:
print("Título:", nombre.title())
```

---

### Paso 6: Porcentaje para Aprobar

En el campo **"Porcentaje para aprobar"**, ingresa:
```
75
```

Esto significa que el estudiante necesita completar al menos el **75%** de los ejercicios (3 de 4 ejercicios = 75%).

---

## ✅ Código de Solución Completo

Una vez configurado todo, el estudiante debería escribir código similar a este:

```python
# Solicitar el nombre completo del usuario
# Tipo de entrada: string (por defecto de input())
nombre = input("Ingresa tu nombre completo: ")

# Mostrar en minúsculas
# Tipo de salida: string
print("minúsculas:", nombre.lower())

# Mostrar en mayúsculas
# Tipo de salida: string
print("MAYÚSCULAS:", nombre.upper())

# Mostrar con formato título
# Tipo de salida: string
print("Título:", nombre.title())
```

---

## 🧪 Ejemplo de Ejecución

Cuando el estudiante ejecute el código:

**Entrada del usuario:**
```
Ingresa tu nombre completo: jUaN pÉrEz GaRcÍa
```

**Salida esperada en la consola:**
```
minúsculas: juan pérez garcía
MAYÚSCULAS: JUAN PÉREZ GARCÍA
Título: Juan Pérez García
```

---

## 📊 Validación Automática

Cuando el estudiante ejecuta el código y presiona "Guardar", el sistema validará:

### ✅ Ejercicio 1: Solicitar nombre con input()
- ✅ Contiene `input` ✓
- ✅ Contiene `=` ✓
- ✅ Tipo de entrada: `str` (por defecto de input())
- **Resultado:** ✅ Ejercicio completado! +1 punto

### ✅ Ejercicio 2: Mostrar nombre en minúsculas
- ✅ Contiene `lower` ✓
- ✅ Contiene `print` ✓
- ✅ Tipo de salida: `str` (`.lower()` devuelve string)
- **Resultado:** ✅ Ejercicio completado! +1 punto

### ✅ Ejercicio 3: Mostrar nombre en mayúsculas
- ✅ Contiene `upper` ✓
- ✅ Contiene `print` ✓
- ✅ Tipo de salida: `str` (`.upper()` devuelve string)
- **Resultado:** ✅ Ejercicio completado! +1 punto

### ✅ Ejercicio 4: Mostrar nombre con formato título
- ✅ Contiene `title` ✓
- ✅ Contiene `print` ✓
- ✅ Tipo de salida: `str` (`.title()` devuelve string)
- **Resultado:** ✅ Ejercicio completado! +1 punto

**Puntuación final:** 4/4 (100%) ✅ **Aprobado**

---

## 💬 Feedback en la Consola

Durante la ejecución, el estudiante verá mensajes como:

```
✅ Ejercicio completado: Solicitar nombre con input()
   Puntuación actual: 1/4 (25%)

✅ Ejercicio completado: Mostrar nombre en minúsculas
   Puntuación actual: 2/4 (50%)

✅ Ejercicio completado: Mostrar nombre en mayúsculas
   Puntuación actual: 3/4 (75%)

✅ Ejercicio completado: Mostrar nombre con formato título
   Puntuación actual: 4/4 (100%)

📊 Resumen de calificación:
   Ejercicios completados: 4/4
   Puntuación: 4/4 (100%)
   Estado: ✅ Aprobado
```

---

## 📁 Archivo JSON Completo

Si prefieres importar la configuración directamente, usa el archivo:

**`content-ejemplo-nombre-usuario-completo.json`**

Este archivo contiene toda la configuración lista para usar.

---

## 🔍 Puntos Clave

1. **Permitir entrada de usuario:** ✅ Debe estar ACTIVADO para que `input()` funcione
2. **Tipo de entrada en Ejercicio 1:** `str` (por defecto de input(), no requiere conversión)
3. **Tipos de salida en Ejercicios 2-4:** `str` (los métodos `.lower()`, `.upper()`, `.title()` devuelven strings)
4. **Palabras clave:** Cada ejercicio valida palabras clave específicas
5. **Porcentaje para aprobar:** 75% = 3 de 4 ejercicios

---

## ✅ Checklist Final

Antes de publicar, verifica:

- [ ] Título configurado
- [ ] Instrucciones HTML claras
- [ ] Código inicial con comentarios
- [ ] Habilitar Calificación: ✓ Activado
- [ ] 4 ejercicios configurados correctamente
- [ ] Ejercicio 1: `inputType: str`, keywords: `input`, `=`
- [ ] Ejercicio 2: `outputType: str`, keywords: `lower`, `print`
- [ ] Ejercicio 3: `outputType: str`, keywords: `upper`, `print`
- [ ] Ejercicio 4: `outputType: str`, keywords: `title`, `print`
- [ ] Porcentaje para aprobar: 75%
- [ ] Permitir entrada de usuario: ✓ Activado
- [ ] Probar ejecutando el código de ejemplo

---

¡Listo! Tu actividad está configurada para evaluar automáticamente el ejercicio del enunciado. 🚀



