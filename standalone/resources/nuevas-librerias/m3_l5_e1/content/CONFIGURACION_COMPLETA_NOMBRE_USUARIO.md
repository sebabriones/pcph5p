# Configuración Completa: Formatear Nombre de Usuario

## 📋 Enunciado

Escribe un programa que pregunte el nombre completo del usuario en la consola y que después muestre por pantalla su nombre completo del usuario tres veces:
- Una con todas las letras minúsculas
- Otra con todas las letras mayúsculas  
- Otra solo con la primera letra del nombre y de los apellidos en mayúscula

El usuario puede introducir su nombre combinando mayúsculas y minúsculas como quiera.

---

## 🎯 Configuración Paso a Paso en el Editor H5P

### Paso 1: Configuración Básica

| Campo | Valor |
|-------|-------|
| **Título de la Terminal** | `Ejercicio: Formatear Nombre de Usuario` |
| **Instrucciones** | Ver más abajo |
| **Código Inicial en Editor** | Ver más abajo |
| **Mostrar números de línea** | ✓ (activado) |
| **Permitir entrada de usuario (input)** | ✓ **ACTIVADO (MUY IMPORTANTE)** |
| **Tema de color** | Oscuro (o el que prefieras) |
| **Máximo de líneas en salida** | 1000 (default) |

### Paso 2: Instrucciones (HTML)

En el campo **"Instrucciones"**, coloca:

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

### Paso 3: Código Inicial

En el campo **"Código Inicial en Editor"**, coloca:

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

### Paso 4: Habilitar Calificación

```
☑ Habilitar Calificación: ✓ (activado)
```

### Paso 5: Configurar Ejercicios Requeridos

Agrega **4 ejercicios** con la siguiente configuración detallada:

---

#### 📝 Ejercicio 1: "Solicitar nombre con input()"

**En el editor H5P, configura:**

| Campo | Valor |
|-------|-------|
| **Nombre del ejercicio** | `Solicitar nombre con input()` |
| **Descripción** | Ver HTML abajo |
| **Tipo de validación** | `Código contiene palabras clave` |
| **Palabras clave requeridas** | `input`, `=` |
| **Tipo de dato de entrada** | `String (texto) - por defecto de input()` |
| **Tipo de dato de salida** | `No especificar` |

**Descripción (HTML):**
```html
<p><strong>Ejercicio 1:</strong> El programa debe solicitar el nombre completo del usuario.</p>
<p><strong>Requisitos:</strong></p>
<ul>
  <li>Usar la función <code>input()</code> para pedir datos</li>
  <li>Asignar el resultado a una variable usando <code>=</code></li>
  <li><strong>Tipo de dato de entrada:</strong> <code>string</code> (texto) - por defecto de input()</li>
</ul>
```

**Validación:**
- Palabras clave: `input`, `=`
- Tipo de entrada: `str`
- Tipo de salida: (vacío)

**Código que cumple:**
```python
nombre = input("Ingresa tu nombre completo: ")
```

---

#### 📝 Ejercicio 2: "Mostrar nombre en minúsculas"

| Campo | Valor |
|-------|-------|
| **Nombre del ejercicio** | `Mostrar nombre en minúsculas` |
| **Descripción** | Ver HTML abajo |
| **Tipo de validación** | `Código contiene palabras clave` |
| **Palabras clave requeridas** | `lower`, `print` |
| **Tipo de dato de entrada** | `No especificar` |
| **Tipo de dato de salida** | `String (texto)` |

**Descripción (HTML):**
```html
<p><strong>Ejercicio 2:</strong> Mostrar el nombre en minúsculas.</p>
<p><strong>Requisitos:</strong></p>
<ul>
  <li>Usar el método <code>.lower()</code></li>
  <li>Mostrar el resultado con <code>print()</code></li>
  <li><strong>Tipo de dato de salida:</strong> <code>string</code> (texto)</li>
</ul>
```

**Validación:**
- Palabras clave: `lower`, `print`
- Tipo de entrada: (vacío)
- Tipo de salida: `str`

**Código que cumple:**
```python
print(nombre.lower())
# o
print("minúsculas:", nombre.lower())
```

---

#### 📝 Ejercicio 3: "Mostrar nombre en mayúsculas"

| Campo | Valor |
|-------|-------|
| **Nombre del ejercicio** | `Mostrar nombre en mayúsculas` |
| **Descripción** | Ver HTML abajo |
| **Tipo de validación** | `Código contiene palabras clave` |
| **Palabras clave requeridas** | `upper`, `print` |
| **Tipo de dato de entrada** | `No especificar` |
| **Tipo de dato de salida** | `String (texto)` |

**Descripción (HTML):**
```html
<p><strong>Ejercicio 3:</strong> Mostrar el nombre en mayúsculas.</p>
<p><strong>Requisitos:</strong></p>
<ul>
  <li>Usar el método <code>.upper()</code></li>
  <li>Mostrar el resultado con <code>print()</code></li>
  <li><strong>Tipo de dato de salida:</strong> <code>string</code> (texto)</li>
</ul>
```

**Validación:**
- Palabras clave: `upper`, `print`
- Tipo de entrada: (vacío)
- Tipo de salida: `str`

**Código que cumple:**
```python
print(nombre.upper())
# o
print("MAYÚSCULAS:", nombre.upper())
```

---

#### 📝 Ejercicio 4: "Mostrar nombre con formato título"

| Campo | Valor |
|-------|-------|
| **Nombre del ejercicio** | `Mostrar nombre con formato título` |
| **Descripción** | Ver HTML abajo |
| **Tipo de validación** | `Código contiene palabras clave` |
| **Palabras clave requeridas** | `title`, `print` |
| **Tipo de dato de entrada** | `No especificar` |
| **Tipo de dato de salida** | `String (texto)` |

**Descripción (HTML):**
```html
<p><strong>Ejercicio 4:</strong> Mostrar el nombre con formato título (primera letra de cada palabra en mayúscula).</p>
<p><strong>Requisitos:</strong></p>
<ul>
  <li>Usar el método <code>.title()</code></li>
  <li>Mostrar el resultado con <code>print()</code></li>
  <li><strong>Tipo de dato de salida:</strong> <code>string</code> (texto)</li>
</ul>
```

**Validación:**
- Palabras clave: `title`, `print`
- Tipo de entrada: (vacío)
- Tipo de salida: `str`

**Código que cumple:**
```python
print(nombre.title())
# o
print("Título:", nombre.title())
```

---

### Paso 6: Configurar Porcentaje para Aprobar

```
Porcentaje para aprobar: 75
```

Esto significa que el estudiante necesita completar al menos el 75% de los ejercicios (3 de 4 ejercicios = 75%).

---

## ✅ Código de Solución Completo

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

### Ejemplo de Ejecución:

**Entrada del usuario:**
```
Ingresa tu nombre completo: jUaN pÉrEz GaRcÍa
```

**Salida esperada:**
```
minúsculas: juan pérez garcía
MAYÚSCULAS: JUAN PÉREZ GARCÍA
Título: Juan Pérez García
```

---

## 📊 Validación de Ejercicios con Tipos de Datos

### Ejercicio 1: Solicitar nombre con input()
**Validación:**
- ✅ Contiene `input` ✓
- ✅ Contiene `=` ✓
- ✅ Tipo de entrada: `str` (por defecto, no requiere `str(input())`)
- **Resultado:** ✅ Ejercicio completado! +1 punto

### Ejercicio 2: Mostrar nombre en minúsculas
**Validación:**
- ✅ Contiene `lower` ✓
- ✅ Contiene `print` ✓
- ✅ Tipo de salida: `str` (`.lower()` devuelve string)
- **Resultado:** ✅ Ejercicio completado! +1 punto

### Ejercicio 3: Mostrar nombre en mayúsculas
**Validación:**
- ✅ Contiene `upper` ✓
- ✅ Contiene `print` ✓
- ✅ Tipo de salida: `str` (`.upper()` devuelve string)
- **Resultado:** ✅ Ejercicio completado! +1 punto

### Ejercicio 4: Mostrar nombre con formato título
**Validación:**
- ✅ Contiene `title` ✓
- ✅ Contiene `print` ✓
- ✅ Tipo de salida: `str` (`.title()` devuelve string)
- **Resultado:** ✅ Ejercicio completado! +1 punto

**Puntuación final:** 4/4 (100%) ✅ Aprobado

---

## 🔍 Diferencias con Validación de Tipos

### Sin especificar tipos (método anterior):
- Solo valida palabras clave: `input`, `=`, `lower`, `print`, etc.
- No valida si el código maneja correctamente los tipos de datos

### Con especificación de tipos (método nuevo):
- ✅ Valida palabras clave
- ✅ Valida que el tipo de entrada sea correcto (ej: `str` para input sin conversión)
- ✅ Valida que el tipo de salida sea correcto (ej: `str` para métodos de string)

---

## 💡 Ejemplo: Si Requirieras Número Entero

Si el ejercicio fuera "Pedir edad como número entero", la configuración sería:

**Ejercicio: "Pedir edad como número entero"**

| Campo | Valor |
|-------|-------|
| **Palabras clave** | `input`, `=`, `int` |
| **Tipo de dato de entrada** | `Entero (int) - requiere int(input())` |
| **Tipo de dato de salida** | (vacío) |

**Código válido:**
```python
edad = int(input("Ingresa tu edad: "))
```
✅ Contiene `input`, `=` y `int`
✅ Tiene conversión a `int`: `int(input(...))`

**Código inválido:**
```python
edad = input("Ingresa tu edad: ")
```
❌ Falta conversión a `int`

---

## 📝 Resumen de Configuración

### Ejercicio 1: Input String
- **inputType:** `str` (por defecto de input())
- **outputType:** (vacío)
- **Keywords:** `input`, `=`

### Ejercicio 2: Output String (minúsculas)
- **inputType:** (vacío)
- **outputType:** `str`
- **Keywords:** `lower`, `print`

### Ejercicio 3: Output String (mayúsculas)
- **inputType:** (vacío)
- **outputType:** `str`
- **Keywords:** `upper`, `print`

### Ejercicio 4: Output String (título)
- **inputType:** (vacío)
- **outputType:** `str`
- **Keywords:** `title`, `print`

---

## ✅ Checklist Final

- [ ] Título configurado
- [ ] Instrucciones HTML claras con tipos de datos
- [ ] Código inicial con comentarios sobre tipos
- [ ] Habilitar Calificación activado
- [ ] 4 ejercicios configurados
- [ ] Ejercicio 1: `inputType: str`, keywords: `input`, `=`
- [ ] Ejercicio 2: `outputType: str`, keywords: `lower`, `print`
- [ ] Ejercicio 3: `outputType: str`, keywords: `upper`, `print`
- [ ] Ejercicio 4: `outputType: str`, keywords: `title`, `print`
- [ ] Porcentaje para aprobar: 75%
- [ ] Permitir entrada de usuario: ✓ (activado)
- [ ] Probar la actividad ejecutando código de ejemplo

---

¡Listo! Ahora tu actividad valida no solo las palabras clave, sino también los tipos de datos de entrada y salida. 🚀



