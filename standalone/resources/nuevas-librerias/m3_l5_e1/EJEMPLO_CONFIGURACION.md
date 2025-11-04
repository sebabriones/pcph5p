# Ejemplo de Configuración: H5P.PythonTerminal-1.1 con Evaluación

## 📋 Ejemplo: Calcular el Área de un Rectángulo

Este ejemplo muestra cómo configurar una actividad que evalúa si el estudiante puede crear una función que calcule el área de un rectángulo.

---

## 🎯 Configuración en el Editor H5P

### Paso 1: Configuración Básica

```
Título de la Terminal: "Ejercicio: Funciones en Python"
Tema de color: Oscuro (o el que prefieras)
Mostrar números de línea: ✓ (activado)
Permitir entrada de usuario: ✓ (activado)
```

### Paso 2: Código Inicial

En el campo **"Código Inicial en Editor"**, coloca:

```python
# Ejercicio: Crear una función para calcular el área de un rectángulo
# 
# INSTRUCCIONES:
# 1. Crea una función llamada "area_rectangulo" que reciba dos parámetros: base y altura
# 2. La función debe retornar el área (base * altura)
# 3. Prueba la función llamándola con base=5 y altura=3
# 4. Debe mostrar el resultado: 15

# Escribe tu código aquí:
```

### Paso 3: Habilitar Calificación

```
☑ Habilitar Calificación: ✓ (activado)
```

### Paso 4: Configurar Ejercicios Requeridos

Agrega **1 ejercicio** con la siguiente configuración:

#### Ejercicio 1: "Crear función area_rectangulo"

**Nombre del ejercicio:**
```
Crear función area_rectangulo
```

**Descripción (HTML):**
```html
<p><strong>Objetivo:</strong> Crear una función que calcule el área de un rectángulo.</p>
<p><strong>Requisitos:</strong></p>
<ul>
  <li>La función debe llamarse <code>area_rectangulo</code></li>
  <li>Debe recibir dos parámetros: <code>base</code> y <code>altura</code></li>
  <li>Debe retornar el resultado de la multiplicación</li>
</ul>
```

**Validación:**
- **Tipo de validación:** "Código contiene palabras clave"
- **Palabras clave requeridas:**
  1. `def`
  2. `area_rectangulo`
  3. `return`
  4. `*`

### Paso 5: Configurar Porcentaje para Aprobar

```
Porcentaje para aprobar: 70
```

Esto significa que el estudiante necesita completar al menos el 70% de los ejercicios (en este caso, 1 de 1 = 100%).

---

## ✅ Código Python que Cumple con el Ejercicio

El estudiante debería escribir algo como esto:

```python
# Ejercicio: Crear una función para calcular el área de un rectángulo
# 
# INSTRUCCIONES:
# 1. Crea una función llamada "area_rectangulo" que reciba dos parámetros: base y altura
# 2. La función debe retornar el área (base * altura)
# 3. Prueba la función llamándola con base=5 y altura=3
# 4. Debe mostrar el resultado: 15

# Escribe tu código aquí:

def area_rectangulo(base, altura):
    return base * altura

# Probar la función
resultado = area_rectangulo(5, 3)
print(resultado)
```

**Salida esperada:**
```
15
```

**Resultado:**
- ✅ El código contiene `def` ✓
- ✅ El código contiene `area_rectangulo` ✓
- ✅ El código contiene `return` ✓
- ✅ El código contiene `*` ✓
- ✅ **Ejercicio completado! +1 punto**

---

## 📊 Ejemplo Completo con Múltiples Ejercicios

### Configuración: 3 Ejercicios

#### Ejercicio 1: "Crear función area_rectangulo"
- **Palabras clave:** `def`, `area_rectangulo`, `return`, `*`

#### Ejercicio 2: "Usar bucle for"
- **Palabras clave:** `for`, `in`, `range`

#### Ejercicio 3: "Usar condicional if"
- **Palabras clave:** `if`, `else`, `==`

**Porcentaje para aprobar:** 70% (necesita completar al menos 2 de 3 ejercicios)

---

## 🎓 Ejemplo de Código para 3 Ejercicios

```python
# Ejercicio 1: Crear función para calcular área
def area_rectangulo(base, altura):
    return base * altura

print("Área:", area_rectangulo(5, 3))

# Ejercicio 2: Usar bucle for
for i in range(5):
    print(i)

# Ejercicio 3: Usar condicional if
numero = 10
if numero == 10:
    print("El número es 10")
else:
    print("El número no es 10")
```

**Resultado:**
- ✅ Ejercicio 1 completado! +1 punto
- ✅ Ejercicio 2 completado! +1 punto
- ✅ Ejercicio 3 completado! +1 punto
- 🎉 ¡Has completado todos los ejercicios!
- 📊 Puntuación: 3/3 (100%)
- ✅ ¡Aprobado!

---

## 📝 Ejemplo de JSON de Configuración Completo

```json
{
  "title": "Ejercicio: Funciones en Python",
  "description": "<p><strong>Objetivo:</strong> Aprender a crear funciones en Python.</p>",
  "initialCode": "# Crea una función llamada area_rectangulo que calcule el área\n# de un rectángulo recibiendo base y altura como parámetros\n\n# Escribe tu código aquí:",
  "showLineNumbers": true,
  "theme": "dark",
  "allowInput": true,
  "maxOutputLines": 1000,
  "enableScoring": true,
  "requiredExercises": [
    {
      "name": "Crear función area_rectangulo",
      "description": "<p><strong>Requisitos:</strong></p><ul><li>Función llamada <code>area_rectangulo</code></li><li>Parámetros: <code>base</code> y <code>altura</code></li><li>Retornar el resultado</li></ul>",
      "validation": {
        "type": "contains",
        "keywords": [
          "def",
          "area_rectangulo",
          "return",
          "*"
        ]
      }
    }
  ],
  "passingScore": 70
}
```

---

## 💡 Consejos para Crear Ejercicios Efectivos

### 1. Palabras Clave Estratégicas
- Usa palabras clave que sean **esenciales** para el concepto
- Evita palabras muy comunes que puedan aparecer por accidente
- Ejemplo: Para funciones, usa `def`, `return`, y el nombre de la función

### 2. Descripción Clara
- Proporciona instrucciones claras en la descripción
- Usa HTML para formato (negrita, listas, código)
- Ejemplo: `<p><strong>Objetivo:</strong> Crear una función...</p>`

### 3. Código Inicial Útil
- Proporciona un template o comentarios guía
- No des la solución completa, solo pistas
- Ejemplo: `# Crea una función llamada...`

### 4. Múltiples Ejercicios
- Divide conceptos complejos en ejercicios pequeños
- Permite que el estudiante complete algunos ejercicios y aún así apruebe
- Ejemplo: 3 ejercicios con 70% = necesita completar 2

---

## 🔍 Validación de Ejercicios

### Tipo de Validación: "contains"

El sistema busca que el código **contenga** todas las palabras clave especificadas.

**Ejemplo:**
- Palabras clave: `["def", "suma", "return"]`
- Código válido: `def suma(a, b): return a + b` ✓
- Código inválido: `def resta(a, b): return a - b` ✗ (no contiene "suma")

### Nota Importante
- La validación es **case-sensitive** (distingue mayúsculas/minúsculas)
- Todas las palabras clave deben estar presentes
- El orden no importa

---

## 🎯 Ejemplo Avanzado: Validar Salida de Código

Aunque actualmente solo está implementado "contains", el sistema está preparado para validar también la salida del código (tipo "output"). Esto se puede implementar en el futuro.

---

## 📚 Recursos Adicionales

### Ejercicios Sugeridos para Principiantes:
1. **Variables y tipos de datos**
   - Palabras clave: `int`, `str`, `print`

2. **Operadores matemáticos**
   - Palabras clave: `+`, `-`, `*`, `/`, `%`

3. **Listas y bucles**
   - Palabras clave: `list`, `for`, `in`, `append`

4. **Condicionales**
   - Palabras clave: `if`, `elif`, `else`, `==`

5. **Funciones**
   - Palabras clave: `def`, `return`, parámetros específicos

---

## ✅ Checklist de Configuración

- [ ] Título descriptivo
- [ ] Código inicial con instrucciones claras
- [ ] Habilitar Calificación activado
- [ ] Ejercicios requeridos configurados
- [ ] Palabras clave apropiadas para cada ejercicio
- [ ] Porcentaje para aprobar configurado
- [ ] Descripción HTML para cada ejercicio
- [ ] Probar la actividad antes de publicarla

---

## 🐛 Debugging

Si los ejercicios no se detectan:

1. Abre la consola del navegador (F12)
2. Verifica que aparezca: `Calificación habilitada`
3. Revisa los logs: `Ejercicios requeridos: [...]`
4. Asegúrate de que el código contenga todas las palabras clave
5. Verifica que las palabras clave sean exactas (mayúsculas/minúsculas)

---

¡Listo para crear actividades evaluables con PythonTerminal!

