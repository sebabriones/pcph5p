# Ejemplo: Especificar Tipos de Datos en PythonTerminal

## 📋 ¿Se Pueden Especificar Tipos de Datos?

**Sí**, ahora puedes especificar:
1. **Tipo de dato de entrada** (`inputType`): El tipo que se espera recibir con `input()`
2. **Tipo de dato de salida** (`outputType`): El tipo que se espera mostrar con `print()`

---

## 🎯 Ejemplo: Formatear Nombre de Usuario

### Ejercicio 1: Solicitar nombre (input string)

**Configuración:**
- **Tipo de dato de entrada:** `str` (String - por defecto de input())
- **Palabras clave:** `input`, `=`

**Código válido:**
```python
nombre = input("Ingresa tu nombre: ")
```
✅ Contiene `input` y `=`
✅ El tipo de entrada es `str` (por defecto de input(), no requiere conversión)

---

### Ejercicio 2: Mostrar en minúsculas (output string)

**Configuración:**
- **Tipo de dato de salida:** `str` (String)
- **Palabras clave:** `lower`, `print`

**Código válido:**
```python
print(nombre.lower())
```
✅ Contiene `lower` y `print`
✅ El tipo de salida es `str` (el método `.lower()` devuelve string)

---

## 📚 Ejemplos con Diferentes Tipos de Datos

### Ejemplo 1: Pedir un número entero

**Ejercicio:** "Solicitar edad como número entero"

**Configuración:**
- **Tipo de dato de entrada:** `int` (Entero)
- **Palabras clave:** `input`, `=`, `int`

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
❌ No tiene conversión a `int`

---

### Ejemplo 2: Pedir un número decimal

**Ejercicio:** "Solicitar precio como decimal"

**Configuración:**
- **Tipo de dato de entrada:** `float` (Decimal)
- **Palabras clave:** `input`, `=`, `float`

**Código válido:**
```python
precio = float(input("Ingresa el precio: "))
```
✅ Contiene `input`, `=`, `float`
✅ Tiene conversión a `float`: `float(input(...))`

---

### Ejemplo 3: Mostrar resultado numérico

**Ejercicio:** "Calcular y mostrar área como número"

**Configuración:**
- **Tipo de dato de salida:** `int` o `float`
- **Palabras clave:** `print`, `*`

**Código válido:**
```python
base = 5
altura = 3
area = base * altura
print(area)
```
✅ Contiene `print` y `*`
✅ El resultado de la multiplicación es numérico (int o float)

---

## 🔍 Cómo Funciona la Validación de Tipos

### Validación de Tipo de Entrada (`inputType`)

El sistema busca:
1. Si `inputType` es `str`: No requiere validación especial (es el default de input())
2. Si `inputType` es `int`: Busca `int(input` en el código
3. Si `inputType` es `float`: Busca `float(input` en el código
4. Si `inputType` es `bool`: Busca conversión a booleano

**Ejemplo:**
```python
# inputType = "int"
edad = int(input("Edad: "))  ✅ Válido
edad = input("Edad: ")        ❌ No válido (falta int())
```

---

### Validación de Tipo de Salida (`outputType`)

El sistema busca:
1. Si `outputType` es `str`: No requiere validación especial
2. Si `outputType` es `int`, `float`, `bool`: Busca que el tipo aparezca en el código

**Ejemplo:**
```python
# outputType = "int"
resultado = base * altura
print(resultado)  ✅ Válido (resultado es int)
print(str(resultado))  ❌ No válido (se convierte a string)
```

---

## 📝 Ejemplo Completo: Calculadora Simple

### Configuración de Ejercicios:

#### Ejercicio 1: "Pedir dos números enteros"
```json
{
  "name": "Pedir dos números enteros",
  "validation": {
    "type": "contains",
    "keywords": ["input", "=", "int"],
    "inputType": "int",
    "outputType": ""
  }
}
```

**Código válido:**
```python
num1 = int(input("Primer número: "))
num2 = int(input("Segundo número: "))
```

---

#### Ejercicio 2: "Calcular y mostrar suma"
```json
{
  "name": "Calcular y mostrar suma",
  "validation": {
    "type": "contains",
    "keywords": ["+", "print"],
    "inputType": "",
    "outputType": "int"
  }
}
```

**Código válido:**
```python
suma = num1 + num2
print(suma)
```

---

## ⚠️ Limitaciones Actuales

La validación de tipos de datos es **basada en análisis estático del código**, no en ejecución:

1. ✅ **Verifica presencia de conversiones**: `int(input())`, `float(input())`
2. ✅ **Verifica palabras clave**: `int`, `float`, `str`, etc.
3. ❌ **NO verifica ejecución real**: No comprueba si el código realmente produce el tipo correcto al ejecutarse
4. ❌ **NO valida salida real**: No analiza la salida de print() en tiempo de ejecución

---

## 💡 Recomendaciones

### Para Entrada (inputType):

1. **String (str)**: No es necesario especificarlo (es el default)
   ```python
   nombre = input("Nombre: ")  ✅
   ```

2. **Entero (int)**: Especifica `inputType: "int"` y agrega `"int"` a keywords
   ```python
   edad = int(input("Edad: "))  ✅
   ```

3. **Decimal (float)**: Especifica `inputType: "float"` y agrega `"float"` a keywords
   ```python
   precio = float(input("Precio: "))  ✅
   ```

### Para Salida (outputType):

1. **String (str)**: No es necesario especificarlo (es común)
   ```python
   print(nombre.lower())  ✅
   ```

2. **Números (int/float)**: Especifica el tipo y agrega el tipo a keywords
   ```python
   resultado = 5 * 3
   print(resultado)  ✅ Si outputType es "int"
   ```

---

## 🎯 Ejemplo Actualizado: Nombre de Usuario

Para el ejercicio de formatear nombre de usuario, la configuración es:

### Ejercicio 1: Input String
- **inputType:** `str` (por defecto, no requiere conversión)
- **Keywords:** `input`, `=`

### Ejercicios 2-4: Output String
- **outputType:** `str` (los métodos de string devuelven string)
- **Keywords:** `lower`/`upper`/`title`, `print`

**Código completo:**
```python
nombre = input("Nombre: ")  # inputType: str
print(nombre.lower())       # outputType: str
print(nombre.upper())       # outputType: str
print(nombre.title())       # outputType: str
```

---

## ✅ Resumen

| Tipo | Cómo Especificarlo | Ejemplo de Código |
|------|-------------------|-------------------|
| **Input String** | `inputType: "str"` | `nombre = input("...")` |
| **Input Int** | `inputType: "int"` + keyword `"int"` | `edad = int(input("..."))` |
| **Input Float** | `inputType: "float"` + keyword `"float"` | `precio = float(input("..."))` |
| **Output String** | `outputType: "str"` | `print(texto)` |
| **Output Int** | `outputType: "int"` + keyword `"int"` | `print(numero)` |
| **Output Float** | `outputType: "float"` + keyword `"float"` | `print(decimal)` |

---

¡Ahora puedes especificar tipos de datos en tus ejercicios! 🚀




