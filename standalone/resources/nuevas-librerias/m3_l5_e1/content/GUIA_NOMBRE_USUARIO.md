# Guía: Configurar Actividad "Formatear Nombre de Usuario"

## 📋 Enunciado Original

Escribe un programa que pregunte el nombre completo del usuario en la consola y que después muestre por pantalla su nombre completo del usuario tres veces:
- Una con todas las letras minúsculas
- Otra con todas las letras mayúsculas  
- Otra solo con la primera letra del nombre y de los apellidos en mayúscula

El usuario puede introducir su nombre combinando mayúsculas y minúsculas como quiera.

---

## 🎯 Configuración Paso a Paso

### Paso 1: Configuración Básica

En el editor H5P, configura:

| Campo | Valor |
|-------|-------|
| **Título de la Terminal** | `Ejercicio: Formatear Nombre de Usuario` |
| **Instrucciones** | `<p><strong>Objetivo:</strong> Escribir un programa que solicite el nombre completo del usuario y muestre diferentes formatos del nombre.</p><p><strong>Requisitos:</strong></p><ol><li>Pedir el nombre completo usando <code>input()</code></li><li>Mostrar el nombre en minúsculas</li><li>Mostrar el nombre en mayúsculas</li><li>Mostrar el nombre con formato título (primera letra de cada palabra en mayúscula)</li></ol>` |
| **Código Inicial en Editor** | Ver código más abajo |
| **Mostrar números de línea** | ✓ (activado) |
| **Permitir entrada de usuario (input)** | ✓ (activado - **IMPORTANTE**) |
| **Tema de color** | El que prefieras |

### Paso 2: Código Inicial

En el campo **"Código Inicial en Editor"**, coloca:

```python
# Ejercicio: Formatear Nombre de Usuario
#
# Escribe un programa que:
# 1. Pregunte el nombre completo del usuario usando input()
# 2. Muestre el nombre en minúsculas (usando .lower())
# 3. Muestre el nombre en mayúsculas (usando .upper())
# 4. Muestre el nombre con formato título (usando .title())
#
# Ejemplo de salida esperada:
# Ingresa tu nombre completo: Juan Pérez García
# minúsculas: juan pérez garcía
# MAYÚSCULAS: JUAN PÉREZ GARCÍA
# Título: Juan Pérez García

# Escribe tu código aquí:
```

### Paso 3: Habilitar Calificación

```
☑ Habilitar Calificación: ✓ (activado)
```

### Paso 4: Configurar Ejercicios Requeridos

Agrega **4 ejercicios** con la siguiente configuración:

---

#### Ejercicio 1: "Solicitar nombre con input()"

**Nombre del ejercicio:**
```
Solicitar nombre con input()
```

**Descripción (HTML):**
```html
<p><strong>Ejercicio 1:</strong> El programa debe solicitar el nombre completo del usuario.</p>
<p><strong>Requisitos:</strong></p>
<ul>
  <li>Usar la función <code>input()</code> para pedir datos</li>
  <li>Asignar el resultado a una variable</li>
</ul>
```

**Validación:**
- **Tipo de validación:** "Código contiene palabras clave"
- **Palabras clave requeridas:**
  1. `input`
  2. `=`

---

#### Ejercicio 2: "Mostrar nombre en minúsculas"

**Nombre del ejercicio:**
```
Mostrar nombre en minúsculas
```

**Descripción (HTML):**
```html
<p><strong>Ejercicio 2:</strong> Mostrar el nombre en minúsculas.</p>
<p><strong>Requisitos:</strong></p>
<ul>
  <li>Usar el método <code>.lower()</code></li>
  <li>Mostrar el resultado con <code>print()</code></li>
</ul>
```

**Validación:**
- **Tipo de validación:** "Código contiene palabras clave"
- **Palabras clave requeridas:**
  1. `lower`
  2. `print`

---

#### Ejercicio 3: "Mostrar nombre en mayúsculas"

**Nombre del ejercicio:**
```
Mostrar nombre en mayúsculas
```

**Descripción (HTML):**
```html
<p><strong>Ejercicio 3:</strong> Mostrar el nombre en mayúsculas.</p>
<p><strong>Requisitos:</strong></p>
<ul>
  <li>Usar el método <code>.upper()</code></li>
  <li>Mostrar el resultado con <code>print()</code></li>
</ul>
```

**Validación:**
- **Tipo de validación:** "Código contiene palabras clave"
- **Palabras clave requeridas:**
  1. `upper`
  2. `print`

---

#### Ejercicio 4: "Mostrar nombre con formato título"

**Nombre del ejercicio:**
```
Mostrar nombre con formato título
```

**Descripción (HTML):**
```html
<p><strong>Ejercicio 4:</strong> Mostrar el nombre con formato título (primera letra de cada palabra en mayúscula).</p>
<p><strong>Requisitos:</strong></p>
<ul>
  <li>Usar el método <code>.title()</code></li>
  <li>Mostrar el resultado con <code>print()</code></li>
</ul>
```

**Validación:**
- **Tipo de validación:** "Código contiene palabras clave"
- **Palabras clave requeridas:**
  1. `title`
  2. `print`

---

### Paso 5: Configurar Porcentaje para Aprobar

```
Porcentaje para aprobar: 75
```

Esto significa que el estudiante necesita completar al menos el 75% de los ejercicios (3 de 4 ejercicios = 75%).

---

## ✅ Código de Solución Esperado

El estudiante debería escribir algo como esto:

```python
# Solicitar el nombre completo del usuario
nombre = input("Ingresa tu nombre completo: ")

# Mostrar en minúsculas
print("minúsculas:", nombre.lower())

# Mostrar en mayúsculas
print("MAYÚSCULAS:", nombre.upper())

# Mostrar con formato título
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

## 📊 Validación de Ejercicios

Cuando el estudiante ejecuta el código:

### ✅ Ejercicio 1: Solicitar nombre con input()
- ✅ Contiene `input` ✓
- ✅ Contiene `=` ✓
- **Resultado:** ✅ Ejercicio completado! +1 punto

### ✅ Ejercicio 2: Mostrar nombre en minúsculas
- ✅ Contiene `lower` ✓
- ✅ Contiene `print` ✓
- **Resultado:** ✅ Ejercicio completado! +1 punto

### ✅ Ejercicio 3: Mostrar nombre en mayúsculas
- ✅ Contiene `upper` ✓
- ✅ Contiene `print` ✓
- **Resultado:** ✅ Ejercicio completado! +1 punto

### ✅ Ejercicio 4: Mostrar nombre con formato título
- ✅ Contiene `title` ✓
- ✅ Contiene `print` ✓
- **Resultado:** ✅ Ejercicio completado! +1 punto

**Puntuación final:** 4/4 (100%) ✅ Aprobado

---

## 💡 Variaciones Válidas del Código

El sistema aceptará diferentes formas de escribir el código, siempre que contenga las palabras clave requeridas:

### Opción 1: Todo directo
```python
nombre = input("Nombre: ")
print(nombre.lower())
print(nombre.upper())
print(nombre.title())
```

### Opción 2: Con variables intermedias
```python
nombre = input("Ingresa tu nombre completo: ")
minusculas = nombre.lower()
mayusculas = nombre.upper()
titulo = nombre.title()
print("minúsculas:", minusculas)
print("MAYÚSCULAS:", mayusculas)
print("Título:", titulo)
```

### Opción 3: Con mensajes personalizados
```python
nombre_completo = input("Escribe tu nombre completo: ")
print("En minúsculas:", nombre_completo.lower())
print("En MAYÚSCULAS:", nombre_completo.upper())
print("Formato título:", nombre_completo.title())
```

Todas estas variaciones cumplirán con los 4 ejercicios.

---

## ⚠️ Puntos Importantes

1. **Permitir entrada de usuario (input)**: Debe estar activado para que `input()` funcione
2. **Palabras clave exactas**: El sistema busca las palabras exactas (case-sensitive)
3. **Métodos de string**: `.lower()`, `.upper()`, `.title()` son métodos de string en Python
4. **Orden no importa**: Las palabras clave pueden aparecer en cualquier orden en el código

---

## 📝 Checklist de Configuración

- [ ] Título descriptivo configurado
- [ ] Instrucciones HTML claras
- [ ] Código inicial con ejemplo
- [ ] Habilitar Calificación activado
- [ ] 4 ejercicios requeridos configurados
- [ ] Palabras clave correctas para cada ejercicio:
  - [ ] Ejercicio 1: `input`, `=`
  - [ ] Ejercicio 2: `lower`, `print`
  - [ ] Ejercicio 3: `upper`, `print`
  - [ ] Ejercicio 4: `title`, `print`
- [ ] Porcentaje para aprobar: 75%
- [ ] Permitir entrada de usuario: ✓ (activado)
- [ ] Probar la actividad antes de publicarla

---

## 🎯 Resultado Esperado

Cuando el estudiante complete correctamente la actividad:

1. **Al ejecutar código:**
   - ✅ Ejercicio completado: Solicitar nombre con input()! +1 punto
   - ✅ Ejercicio completado: Mostrar nombre en minúsculas! +1 punto
   - ✅ Ejercicio completado: Mostrar nombre en mayúsculas! +1 punto
   - ✅ Ejercicio completado: Mostrar nombre con formato título! +1 punto
   - 📊 Puntuación actual: 4/4 (100%)

2. **Al completar todos:**
   - 🎉 ¡Has completado todos los ejercicios!
   - 📊 Puntuación final: 4/4 (100%)
   - ✅ ¡Aprobado! (Mínimo requerido: 75%)

3. **Al guardar:**
   - 📊 Resumen de calificación:
   -    Ejercicios completados: 4/4
   -    Puntuación: 4/4 (100%)
   -    Estado: ✅ Aprobado

---

¡Listo para usar! 🚀




