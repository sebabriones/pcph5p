# Validación de Formato de Strings

## Versión 1.1.29

### Descripción

Esta mejora permite validar el formato del contenido de los strings cuando se especifica que la entrada o salida debe ser de tipo `str`. Puedes restringir que los strings contengan solo letras, solo números, o letras y números.

---

## Configuración en Lumi

### Campos Nuevos en la Validación

1. **Formato del string de entrada (`inputStringFormat`)**
   - Solo aparece cuando `inputType` es `"str"`
   - Opciones:
     - No especificar (cualquier string)
     - Solo letras (a-z, A-Z, espacios, acentos)
     - Solo números (0-9)
     - Letras y números (a-z, A-Z, 0-9, espacios, acentos)

2. **Formato del string de salida (`outputStringFormat`)**
   - Solo aparece cuando `outputType` es `"str"`
   - Opciones:
     - No especificar (cualquier string)
     - Solo letras (a-z, A-Z, espacios, acentos)
     - Solo números (0-9)
     - Letras y números (a-z, A-Z, 0-9, espacios, acentos)

---

## Ejemplos de Configuración

### Ejemplo 1: Validar Nombre (Solo Letras)

**Configuración en Lumi:**
- Tipo de validación: `contains`
- Palabras clave: `["input"]`
- Tipo de dato de entrada: `str`
- Formato del string de entrada: `Solo letras`
- Validación estricta: `Sí`

**JSON equivalente:**
```json
{
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
nombre = input("Ingrese su nombre: ")
```

**Código inválido:**
```python
codigo = input("Código: ")  # Si contiene números, no cumple
```

---

### Ejemplo 2: Validar Código (Solo Números)

**Configuración en Lumi:**
- Tipo de validación: `contains`
- Palabras clave: `["input"]`
- Tipo de dato de entrada: `str`
- Formato del string de entrada: `Solo números`
- Validación estricta: `Sí`

**JSON equivalente:**
```json
{
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
codigo = input("Código: ")
```

**Código inválido:**
```python
nombre = input("Nombre: ")  # Si contiene letras, no cumple
```

---

### Ejemplo 3: Validar Identificador (Letras y Números)

**Configuración en Lumi:**
- Tipo de validación: `contains`
- Palabras clave: `["print"]`
- Tipo de dato de salida: `str`
- Formato del string de salida: `Letras y números`
- Validación estricta: `Sí`

**JSON equivalente:**
```json
{
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
print("Usuario123")
print(f"Ejercicio m3_l5_e1 completado")
```

**Código inválido:**
```python
print("Solo letras")  # No tiene números
print("123")  # No tiene letras
```

---

### Ejemplo 4: Validar Entrada y Salida

**Configuración en Lumi:**
- Tipo de validación: `contains`
- Palabras clave: `["input", "print", "="]`
- Tipo de dato de entrada: `str`
- Formato del string de entrada: `Solo letras`
- Tipo de dato de salida: `str`
- Formato del string de salida: `Letras y números`
- Validación estricta: `Sí`

**JSON equivalente:**
```json
{
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
nombre = input("Nombre: ")  # Entrada: solo letras
print(f"Usuario: {nombre}123")  # Salida: letras y números
```

---

## Casos de Uso Comunes

### 1. Validar Nombre de Usuario
- **Formato:** `letters_only`
- **Uso:** Asegurar que el nombre solo contenga letras

### 2. Validar Código de Producto
- **Formato:** `numbers_only` o `letters_and_numbers`
- **Uso:** Asegurar que el código tenga el formato correcto

### 3. Validar Identificador de Ejercicio
- **Formato:** `letters_and_numbers`
- **Uso:** Asegurar que el identificador tenga letras y números (ej: `m3_l5_e1`)

### 4. Validar Mensaje de Salida
- **Formato:** `letters_only` o `letters_and_numbers`
- **Uso:** Asegurar que el mensaje tenga el formato correcto

---

## Limitaciones y Comportamiento

1. **Validación de entrada (`inputStringFormat`) - Validación en tiempo de ejecución (v1.1.31):** 
   - ✅ **NUEVO:** La validación ahora captura los valores ingresados por el usuario cuando se ejecuta `input()`.
   - ✅ **NUEVO:** Valida el formato del valor real ingresado, no solo el código fuente.
   - El valor se captura automáticamente cuando el usuario ingresa datos en el prompt.
   - Si el código contiene `input()` pero no se ha ejecutado aún, se acepta automáticamente (fallback).

2. **Validación de salida (`outputStringFormat`) - Validación en tiempo de ejecución (v1.1.31):**
   - ✅ **NUEVO:** La validación ahora captura la salida real del programa cuando se ejecuta.
   - ✅ **NUEVO:** Valida el formato de la salida capturada, no solo strings literales en el código.
   - La salida se captura automáticamente de `stdout` y del resultado de la ejecución.
   - Si el código usa métodos de string (`.lower()`, `.upper()`, etc.) o variables, se valida la salida real.

3. **Fallback a validación de código fuente:**
   - Si no hay valores capturados (código no ejecutado), se valida strings literales en el código.
   - Si hay strings literales que cumplen el formato, se acepta automáticamente.

4. **Espacios permitidos:** Los espacios se permiten en todos los formatos y se ignoran durante la validación.

---

## Compatibilidad

- ✅ Compatible con validación estricta (`strictValidation: true`)
- ✅ Compatible con validación de salida (`type: "output"`)
- ✅ Compatible con todas las versiones anteriores
- ✅ Opcional: Si no especificas el formato, no se aplica ninguna restricción

---

## Notas Técnicas

1. **Extracción de strings:** Los strings se extraen del código usando expresiones regulares que manejan escapes básicos.

2. **Validación de formato:** Se usan expresiones regulares para validar el contenido:
   - `letters_only`: `/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/`
   - `numbers_only`: `/^[0-9]+$/`
   - `letters_and_numbers`: `/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]+$/`

3. **Acentos:** Los caracteres con acentos (á, é, í, ó, ú, ñ, ü) se consideran letras válidas en todos los formatos que incluyen letras.

---

¡La validación de formato de strings está lista para usar! 🚀

