# Código de Solución: Formatear Nombre de Usuario

## 📝 Enunciado

Escribe un programa que pregunte el nombre completo del usuario en la consola y que después muestre por pantalla su nombre completo del usuario tres veces:
- Una con todas las letras minúsculas
- Otra con todas las letras mayúsculas  
- Otra solo con la primera letra del nombre y de los apellidos en mayúscula

El usuario puede introducir su nombre combinando mayúsculas y minúsculas como quiera.

---

## ✅ Solución Completa

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

---

## 🎯 Solución Alternativa (más detallada)

```python
# Solicitar el nombre completo del usuario
nombre_completo = input("Ingresa tu nombre completo: ")

# Convertir a minúsculas
nombre_minusculas = nombre_completo.lower()
print("minúsculas:", nombre_minusculas)

# Convertir a mayúsculas
nombre_mayusculas = nombre_completo.upper()
print("MAYÚSCULAS:", nombre_mayusculas)

# Convertir a formato título
nombre_titulo = nombre_completo.title()
print("Título:", nombre_titulo)
```

---

## 📊 Ejemplo de Ejecución

**Entrada del usuario:**
```
Ingresa tu nombre completo: juan pérez garcía
```

**Salida esperada:**
```
minúsculas: juan pérez garcía
MAYÚSCULAS: JUAN PÉREZ GARCÍA
Título: Juan Pérez García
```

---

## ✅ Validación de Ejercicios

### Ejercicio 1: Solicitar nombre con input()
- ✅ Contiene `input`
- ✅ Contiene `=` (asignación)

### Ejercicio 2: Mostrar nombre en minúsculas
- ✅ Contiene `lower`
- ✅ Contiene `print`

### Ejercicio 3: Mostrar nombre en mayúsculas
- ✅ Contiene `upper`
- ✅ Contiene `print`

### Ejercicio 4: Mostrar nombre con formato título
- ✅ Contiene `title`
- ✅ Contiene `print`

**Resultado:** 4/4 ejercicios completados (100%) ✅ Aprobado

---

## 💡 Variaciones Válidas

### Opción 1: Todo en una línea
```python
nombre = input("Nombre: ")
print(nombre.lower(), nombre.upper(), nombre.title())
```

### Opción 2: Con mensajes descriptivos
```python
nombre = input("Ingresa tu nombre completo: ")
print("En minúsculas:", nombre.lower())
print("En mayúsculas:", nombre.upper())
print("Con formato título:", nombre.title())
```

### Opción 3: Guardando en variables
```python
nombre = input("Nombre completo: ")
minusculas = nombre.lower()
mayusculas = nombre.upper()
titulo = nombre.title()
print(minusculas)
print(mayusculas)
print(titulo)
```

Todas estas variaciones cumplirán con los ejercicios requeridos.

---

## 🔍 Verificación Manual

Para verificar que tu código funciona:

1. **Ejecuta el programa**
2. **Ingresa un nombre** cuando se solicite (ej: "jUaN pÉrEz")
3. **Verifica la salida:**
   - Debe mostrar el nombre en minúsculas
   - Debe mostrar el nombre en mayúsculas
   - Debe mostrar el nombre con formato título

---

## 📝 Notas Importantes

- El método `.lower()` convierte todas las letras a minúsculas
- El método `.upper()` convierte todas las letras a mayúsculas
- El método `.title()` convierte la primera letra de cada palabra a mayúscula
- `input()` siempre devuelve un string, así que puedes usar los métodos directamente
- El usuario puede escribir el nombre en cualquier formato (mayúsculas/minúsculas mixtas)




