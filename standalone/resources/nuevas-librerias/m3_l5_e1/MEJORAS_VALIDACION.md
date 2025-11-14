# Mejoras en Validación y Calificación Automática

## Versión 1.1.31 - Validación en Tiempo de Ejecución

### ✅ Mejora 6: Validación de Formato en Tiempo de Ejecución

**Nueva funcionalidad:** La validación de formato de strings ahora valida los valores reales ingresados por el usuario y la salida real del programa, no solo el código fuente.

#### Características:

1. **Captura de valores de entrada:**
   - Los valores ingresados en `input()` se capturan automáticamente cuando el usuario los ingresa.
   - Se validan en tiempo de ejecución usando el formato especificado en `inputStringFormat`.

2. **Captura de salida:**
   - La salida del programa se captura automáticamente de `stdout` y del resultado de la ejecución.
   - Se valida en tiempo de ejecución usando el formato especificado en `outputStringFormat`.

3. **Fallback inteligente:**
   - Si el código no se ha ejecutado aún, se valida strings literales en el código fuente.
   - Si hay valores capturados, se prioriza la validación en tiempo de ejecución.

#### Ejemplo de Validación de Entrada:

**Configuración:**
```json
{
  "validation": {
    "inputType": "str",
    "inputStringFormat": "letters_only"
  }
}
```

**Código:**
```python
nombre = input("Ingresa tu nombre: ")
```

**Comportamiento:**
- Si el usuario ingresa "Juan" → ✅ Válido (solo letras)
- Si el usuario ingresa "Juan123" → ❌ Inválido (contiene números)
- Si el usuario ingresa "Juan Pérez" → ✅ Válido (letras y espacios)

#### Ejemplo de Validación de Salida:

**Configuración:**
```json
{
  "validation": {
    "outputType": "str",
    "outputStringFormat": "letters_only"
  }
}
```

**Código:**
```python
nombre = input("Nombre: ")
print(nombre.lower())
```

**Comportamiento:**
- Si el usuario ingresa "Juan" y se imprime "juan" → ✅ Válido (solo letras)
- Si el usuario ingresa "Juan123" y se imprime "juan123" → ❌ Inválido (contiene números)
- Si el usuario ingresa "Juan Pérez" y se imprime "juan pérez" → ✅ Válido (letras y espacios)

---

## Versión 1.1.27 - Mejoras Implementadas

### ✅ Mejora 1: Validación de Salida (Output Validation)

**Nueva funcionalidad:** Ahora puedes validar la salida real del programa, no solo el código.

#### Configuración:

```json
{
  "name": "Mostrar mensaje correcto",
  "validation": {
    "type": "output",
    "expectedOutput": "Debes tributar"
  }
}
```

#### Opciones disponibles:

1. **expectedOutput**: Texto único que debe aparecer en la salida
   ```json
   "expectedOutput": "Tu índice de masa corporal es:"
   ```

2. **expectedOutputs**: Lista de textos que deben aparecer
   ```json
   "expectedOutputs": ["minúsculas:", "MAYÚSCULAS:", "Título:"]
   ```

3. **outputPattern**: Patrón regex para validación flexible
   ```json
   "outputPattern": "Tu índice.*es:.*\\d+\\.\\d{2}"
   ```

#### Ejemplo de uso:

**Ejercicio: Verificar contraseña**
```json
{
  "name": "Mostrar mensaje de coincidencia",
  "validation": {
    "type": "output",
    "expectedOutputs": ["La contraseña coincide", "La contraseña no coincide"]
  }
}
```

**Ejercicio: Cálculo de IMC**
```json
{
  "name": "Mostrar IMC con formato correcto",
  "validation": {
    "type": "output",
    "outputPattern": "Tu índice de masa corporal es:.*\\d+\\.\\d{2}"
  }
}
```

---

### ✅ Mejora 2: Lista Expandida de Funciones con Validación Estricta

**Nuevas funciones agregadas:**

#### Funciones matemáticas:
- `round` - Redondeo de números
- `sum` - Suma de elementos
- `min`, `max` - Mínimo y máximo
- `abs` - Valor absoluto

#### Métodos de lista:
- `append` - Agregar elemento
- `extend` - Extender lista
- `index` - Índice de elemento
- `insert` - Insertar elemento
- `pop` - Eliminar y retornar
- `remove` - Eliminar elemento
- `reverse` - Invertir lista
- `sort` - Ordenar lista
- `count` - Contar elementos

#### Funciones de estructura:
- `set` - Crear conjunto
- `list` - Crear lista
- `dict` - Crear diccionario
- `tuple` - Crear tupla

#### Funciones de iteración:
- `zip` - Combinar iterables
- `enumerate` - Enumerar elementos
- `map` - Aplicar función
- `filter` - Filtrar elementos

#### Métodos de string adicionales:
- `count` - Contar ocurrencias

**Beneficio:** Ahora estas funciones se validan estrictamente, detectando que se usen como funciones y no como strings.

---

### ✅ Mejora 3: Captura de Salida Mejorada

**Nuevas variables:**
- `currentExecutionOutput`: Captura la salida de cada ejecución
- `lastOutput`: Mantiene historial de salida

**Beneficio:** Permite validar la salida real del programa, no solo el código fuente.

---

## Ejemplos de Uso con las Mejoras

### Ejemplo 1: Ejercicio de IMC (Cálculo con validación de salida)

```json
{
  "name": "Calcular y mostrar IMC",
  "validation": {
    "type": "output",
    "outputPattern": "Tu índice de masa corporal es:.*\\d+\\.\\d{2}"
  }
}
```

**Código válido:**
```python
peso = float(input("Peso: "))
estatura = float(input("Estatura: "))
imc = peso / (estatura ** 2)
print(f"Tu índice de masa corporal es: {round(imc, 2)}")
```

---

### Ejemplo 2: Ejercicio de Contraseña (Validación de mensaje)

```json
{
  "name": "Verificar contraseña",
  "validation": {
    "type": "contains",
    "keywords": ["input", "=", "lower", "==", "if", "else", "print"],
    "strictValidation": true
  }
},
{
  "name": "Mostrar mensaje correcto",
  "validation": {
    "type": "output",
    "expectedOutputs": ["La contraseña coincide", "La contraseña no coincide"]
  }
}
```

---

### Ejemplo 3: Ejercicio con Listas (Validación estricta de métodos)

```json
{
  "name": "Eliminar duplicados",
  "validation": {
    "type": "contains",
    "keywords": ["set", "list"],
    "strictValidation": true
  }
}
```

**Código válido:**
```python
objetos = ["libro", "libro", "lápiz"]
objetos_unicos = list(set(objetos))  # ✅ set() y list() validados estrictamente
```

**Código inválido:**
```python
objetos = ["libro", "libro", "lápiz"]
objetos_unicos = 'set(objetos)'  # ❌ Rechazado por validación estricta
```

---

### Ejemplo 4: Ejercicio con zip (Validación estricta)

```json
{
  "name": "Iterar con zip",
  "validation": {
    "type": "contains",
    "keywords": ["for", "in", "zip"],
    "strictValidation": true
  }
}
```

**Código válido:**
```python
for nombre, tareas in zip(nombres, tareas):  # ✅ zip() validado estrictamente
    print(nombre, tareas)
```

---

## Comparación: Antes vs Después

### Antes (v1.1.26):
- ❌ No validaba salida del programa
- ❌ Solo 15 funciones con validación estricta
- ❌ No podía validar resultados numéricos
- ❌ No podía validar mensajes de salida

### Después (v1.1.27):
- ✅ Validación de salida implementada
- ✅ 30+ funciones con validación estricta
- ✅ Puede validar resultados y mensajes
- ✅ Soporte para patrones regex
- ✅ Validación de múltiples salidas

---

## Guía de Migración

### Para ejercicios existentes:
No se requiere cambios. Los ejercicios con `type: "contains"` siguen funcionando igual.

### Para nuevos ejercicios:
Puedes usar `type: "output"` cuando necesites validar la salida del programa.

---

## Notas Técnicas

1. **Captura de salida:** La salida se captura de `stdout` y del `result` de la ejecución
2. **Normalización:** La validación de salida es case-insensitive por defecto
3. **Regex:** Los patrones regex son case-insensitive (`'i'` flag)
4. **Historial:** La salida se guarda en `executionHistory` para cada ejecución

---

---

### ✅ Mejora 4: Validación Mejorada de Palabras, Números y Operadores (v1.1.28)

**Nueva funcionalidad:** La validación estricta ahora verifica que las palabras clave sean palabras completas, números válidos o palabras con números, evitando falsos positivos.

#### Características:

1. **Validación de números:**
   - Detecta números completos (no parte de otros números)
   - Ejemplo: Si busca `18`, acepta `edad = 18` pero rechaza `edad = 180`

2. **Validación de palabras:**
   - Detecta palabras completas con límites de palabra
   - Ejemplo: Si busca `nombre`, acepta `nombre = "Juan"` pero rechaza `nombre_completo` si solo busca `nombre`

3. **Validación de identificadores:**
   - Detecta identificadores de Python válidos (variables, funciones)
   - Ejemplo: `area_rectangulo`, `m3_l5_e1`, `num1`

4. **Validación de operadores:**
   - Distingue entre operadores simples y compuestos
   - Ejemplo: Si busca `==`, no acepta `=` solo
   - Ejemplo: Si busca `=`, no acepta `==`

#### Ejemplos de Validación:

**Números:**
```python
# Keyword: "18"
edad = 18        # ✅ Válido (número completo)
edad = 180       # ❌ Inválido (18 es parte de 180)
if edad > 18:    # ✅ Válido (18 como número independiente)
```

**Palabras:**
```python
# Keyword: "nombre"
nombre = "Juan"        # ✅ Válido (palabra completa)
nombre_completo = ""   # ✅ Válido (nombre como parte de identificador válido)
mi_nombre = ""         # ✅ Válido (nombre como parte de identificador)
```

**Operadores:**
```python
# Keyword: "=="
if x == 10:    # ✅ Válido (== como operador completo)
if x = 10:     # ❌ Inválido (no es ==)
if x != 10:    # ❌ Inválido (no es ==)

# Keyword: "="
edad = 18      # ✅ Válido (= como asignación)
if edad == 18: # ❌ Inválido (== no es =)
```

**Identificadores con números:**
```python
# Keyword: "m3_l5_e1"
ejercicio = "m3_l5_e1"     # ✅ Válido (identificador completo)
ejercicio = "m3_l5_e10"   # ❌ Inválido (e1 es parte de e10)
path = "m3_l5_e1"          # ✅ Válido (identificador completo)
```

---

### ✅ Mejora 5: Validación de Formato de Strings (v1.1.29)

**Nueva funcionalidad:** Ahora puedes especificar el formato esperado para strings de entrada y salida (solo letras, solo números, o letras y números).

#### Características:

1. **Validación de formato de entrada (`inputStringFormat`):**
   - Se aplica cuando `inputType` es `"str"`
   - Valida el contenido de los strings literales en el código
   - Opciones: `letters_only`, `numbers_only`, `letters_and_numbers`

2. **Validación de formato de salida (`outputStringFormat`):**
   - Se aplica cuando `outputType` es `"str"`
   - Valida el contenido de los strings literales en el código
   - Opciones: `letters_only`, `numbers_only`, `letters_and_numbers`

#### Formatos Disponibles:

- **`letters_only`**: Solo letras (a-z, A-Z, espacios, acentos: áéíóú, ñ, ü)
- **`numbers_only`**: Solo números (0-9)
- **`letters_and_numbers`**: Letras y números (a-z, A-Z, 0-9, espacios, acentos)

#### Ejemplos de Uso:

**Ejemplo 1: Validar entrada de nombre (solo letras)**
```json
{
  "name": "Solicitar nombre del usuario",
  "validation": {
    "type": "contains",
    "keywords": ["input"],
    "inputType": "str",
    "inputStringFormat": "letters_only",
    "strictValidation": true
  }
}
```

**Código válido:**
```python
nombre = input("Ingrese su nombre: ")  # ✅ String con solo letras
```

**Código inválido:**
```python
codigo = input("Código: ")  # ❌ Si el string contiene números, no cumple
```

---

**Ejemplo 2: Validar entrada de código (solo números)**
```json
{
  "name": "Solicitar código numérico",
  "validation": {
    "type": "contains",
    "keywords": ["input"],
    "inputType": "str",
    "inputStringFormat": "numbers_only",
    "strictValidation": true
  }
}
```

**Código válido:**
```python
codigo = input("Código: ")  # ✅ String con solo números
```

**Código inválido:**
```python
nombre = input("Nombre: ")  # ❌ Si el string contiene letras, no cumple
```

---

**Ejemplo 3: Validar salida con identificador (letras y números)**
```json
{
  "name": "Mostrar identificador",
  "validation": {
    "type": "contains",
    "keywords": ["print"],
    "outputType": "str",
    "outputStringFormat": "letters_and_numbers",
    "strictValidation": true
  }
}
```

**Código válido:**
```python
print(f"Ejercicio m3_l5_e1 completado")  # ✅ String con letras y números
print("Usuario123")  # ✅ String con letras y números
```

**Código inválido:**
```python
print("Solo letras")  # ❌ Si requiere letras y números, no cumple
print("123")  # ❌ Si requiere letras y números, no cumple
```

---

**Ejemplo 4: Validar entrada y salida con formato**
```json
{
  "name": "Formatear nombre de usuario",
  "validation": {
    "type": "contains",
    "keywords": ["input", "print", "="],
    "inputType": "str",
    "inputStringFormat": "letters_only",
    "outputType": "str",
    "outputStringFormat": "letters_and_numbers",
    "strictValidation": true
  }
}
```

**Código válido:**
```python
nombre = input("Nombre: ")  # ✅ Entrada: solo letras
print(f"Usuario: {nombre}123")  # ✅ Salida: letras y números
```

---

#### Notas Importantes:

1. **Validación de entrada (`inputStringFormat`) - Validación en tiempo de ejecución (v1.1.31):** 
   - ✅ **NUEVO:** La validación ahora captura y valida los valores reales ingresados por el usuario.
   - ✅ **NUEVO:** Cuando el código se ejecuta y el usuario ingresa datos en `input()`, se captura el valor y se valida su formato.
   - **Ejemplo:** Si configuras `inputStringFormat: "letters_only"` y el usuario ingresa "Juan123", la validación rechazará porque contiene números.
   - **Ejemplo:** Si el usuario ingresa "Juan Pérez", la validación aceptará porque solo contiene letras y espacios.
   - Si el código contiene `input()` pero no se ha ejecutado aún, se acepta automáticamente (fallback).

2. **Validación de salida (`outputStringFormat`) - Validación en tiempo de ejecución (v1.1.31):**
   - ✅ **NUEVO:** La validación ahora captura y valida la salida real del programa.
   - ✅ **NUEVO:** Cuando el código se ejecuta y produce salida (con `print()` o métodos de string), se captura y se valida su formato.
   - **Ejemplo:** Si configuras `outputStringFormat: "letters_only"` y el código imprime "Usuario123", la validación rechazará porque contiene números.
   - **Ejemplo:** Si el código imprime "Juan Pérez", la validación aceptará porque solo contiene letras y espacios.
   - La salida se captura automáticamente de `stdout` y del resultado de la ejecución.

3. **Fallback a validación de código fuente:**
   - Si no hay valores capturados (código no ejecutado), se valida strings literales en el código.
   - Si hay strings literales que cumplen el formato, se acepta automáticamente.

4. **Espacios:** Los espacios se permiten en todos los formatos y se ignoran durante la validación.

5. **Acentos:** Los caracteres con acentos (á, é, í, ó, ú, ñ, ü) se consideran letras válidas.

6. **Compatibilidad:** Esta validación es opcional. Si no especificas `inputStringFormat` o `outputStringFormat`, no se aplica ninguna restricción de formato.

---

## Próximas Mejoras Sugeridas

1. Validación de valores numéricos específicos (ej: `> 18`, `> 10000000`)
2. Validación de estructuras de datos (contenido de listas)
3. Validación de orden de operaciones
4. Validación de patrones complejos (fórmulas matemáticas)

---

¡Las mejoras están listas para usar! 🚀

