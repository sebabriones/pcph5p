# Ejemplos de Mapas para H5P.Blockly

Esta guía proporciona diferentes ejemplos de mapas que puedes usar para crear distintos niveles de dificultad.

## Leyenda

- `0` = Muro (negro/gris oscuro) - No se puede pasar
- `1` = Camino (blanco) - Se puede pasar
- `2` = Inicio (verde) - Punto A
- `3` = Meta (rojo) - Punto B

---

## Nivel 1 - Básico (L simple)

**Dificultad**: ⭐  
**Bloques necesarios**: 11  
**Objetivo**: Camino en forma de L, ideal para principiantes.

```json
[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,3,0,0,0],[0,0,0,0,0,0,1,0,0,0],[0,0,0,0,0,0,1,0,0,0],[0,0,0,2,1,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]
```

**Solución**: Avanzar 3 veces, girar izquierda, avanzar 3 veces

---

## Nivel 2 - Camino en S

**Dificultad**: ⭐⭐  
**Bloques necesarios**: 15  
**Objetivo**: Camino con curvas múltiples.

```json
[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,2,1,1,1,0,0,0,0],[0,0,0,0,0,1,0,0,0,0],[0,0,0,0,0,1,0,0,0,0],[0,0,0,1,1,1,0,0,0,0],[0,0,0,1,0,0,0,0,0,0],[0,0,0,3,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]
```

**Características**: Requiere girar a la derecha 2 veces y a la izquierda 1 vez.

---

## Nivel 3 - Zigzag

**Dificultad**: ⭐⭐⭐  
**Bloques necesarios**: 23  
**Objetivo**: Camino en zigzag que requiere múltiples giros.

```json
[[0,0,0,0,0,0,0,0,0,0],[0,2,1,1,1,1,1,0,0,0],[0,0,0,0,0,0,1,0,0,0],[0,0,0,0,0,0,1,0,0,0],[0,0,1,1,1,1,1,0,0,0],[0,0,1,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,0],[0,0,1,1,1,1,3,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]
```

**Características**: Patrón de zigzag que desarrolla planificación secuencial.

---

## Nivel 4 - Escalera

**Dificultad**: ⭐⭐  
**Bloques necesarios**: 18  
**Objetivo**: Subir una escalera diagonal.

```json
[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,3,0,0],[0,0,0,0,0,0,1,1,0,0],[0,0,0,0,0,1,1,0,0,0],[0,0,0,0,1,1,0,0,0,0],[0,0,0,1,1,0,0,0,0,0],[0,0,1,1,0,0,0,0,0,0],[0,2,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]
```

**Características**: Patrón diagonal, excelente para practicar giros alternados.

---

## Nivel 5 - Espiral

**Dificultad**: ⭐⭐⭐⭐  
**Bloques necesarios**: 32  
**Objetivo**: Navegar una espiral hacia el centro.

```json
[[0,0,0,0,0,0,0,0,0,0],[0,2,1,1,1,1,1,1,1,0],[0,0,0,0,0,0,0,0,1,0],[0,0,1,1,1,1,1,0,1,0],[0,0,1,0,0,0,1,0,1,0],[0,0,1,0,3,0,1,0,1,0],[0,0,1,0,0,0,1,0,1,0],[0,0,1,1,1,1,1,0,1,0],[0,0,0,0,0,0,0,0,1,0],[0,1,1,1,1,1,1,1,1,0]]
```

**Características**: Requiere 4 giros completos, ideal para estudiantes avanzados.

---

## Nivel 6 - Dos Caminos (Fácil)

**Dificultad**: ⭐⭐  
**Bloques necesarios**: 9  
**Objetivo**: El camino más corto tiene 2 opciones válidas.

```json
[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,1,1,1,0,0,0,0],[0,0,0,1,0,1,0,0,0,0],[0,0,0,2,0,3,0,0,0,0],[0,0,0,1,0,1,0,0,0,0],[0,0,0,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]
```

**Características**: Introduce el concepto de múltiples soluciones.

---

## Nivel 7 - Línea Recta

**Dificultad**: ⭐  
**Bloques necesarios**: 8  
**Objetivo**: El más simple, ideal para primera introducción.

```json
[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,2,1,1,1,1,1,3,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]
```

**Características**: Solo requiere avanzar, sin giros. Perfecto para prueba inicial.

---

## Nivel 8 - Cruz

**Dificultad**: ⭐⭐⭐  
**Bloques necesarios**: 17  
**Objetivo**: Navegar por una cruz, 4 opciones de camino.

```json
[[0,0,0,0,1,0,0,0,0,0],[0,0,0,0,1,0,0,0,0,0],[0,0,0,0,1,0,0,0,0,0],[0,0,0,0,1,0,0,0,0,0],[0,2,1,1,1,1,1,1,3,0],[0,0,0,0,1,0,0,0,0,0],[0,0,0,0,1,0,0,0,0,0],[0,0,0,0,1,0,0,0,0,0],[0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]
```

**Características**: Camino recto simple pero hay distractores (caminos que no llevan a la meta).

---

## Nivel 9 - Laberinto Complejo

**Dificultad**: ⭐⭐⭐⭐⭐  
**Bloques necesarios**: 45  
**Objetivo**: Laberinto con múltiples caminos, solo uno correcto.

```json
[[0,2,1,1,1,0,0,0,0,0],[0,0,0,0,1,0,0,0,0,0],[0,1,1,0,1,1,1,1,1,0],[0,1,0,0,0,0,0,0,1,0],[0,1,1,1,1,1,1,0,1,0],[0,0,0,0,0,0,1,0,1,0],[0,1,1,1,1,1,1,0,1,0],[0,1,0,0,0,0,0,0,1,0],[0,1,1,1,1,1,1,1,3,0],[0,0,0,0,0,0,0,0,0,0]]
```

**Características**: Máxima complejidad, requiere planificación avanzada.

---

## Nivel 10 - U invertida

**Dificultad**: ⭐⭐  
**Bloques necesarios**: 15  
**Objetivo**: Camino en forma de U para practicar giros de 180°.

```json
[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,2,0,0,0,3,0,0,0],[0,0,1,0,0,0,1,0,0,0],[0,0,1,0,0,0,1,0,0,0],[0,0,1,0,0,0,1,0,0,0],[0,0,1,0,0,0,1,0,0,0],[0,0,1,1,1,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]
```

**Características**: Forma de U, útil para entender giros consecutivos.

---

## Consejos para Crear Mapas Personalizados

### 1. Nivel de Dificultad

- **Fácil (⭐)**: 5-12 bloques, camino directo o una curva
- **Medio (⭐⭐)**: 13-20 bloques, 2-3 curvas
- **Difícil (⭐⭐⭐)**: 21-30 bloques, múltiples curvas
- **Muy Difícil (⭐⭐⭐⭐)**: 31-40 bloques, caminos complejos
- **Experto (⭐⭐⭐⭐⭐)**: 41-50 bloques, laberintos con decisiones

### 2. Reglas de Diseño

1. **Siempre incluye exactamente UN inicio (2) y UNA meta (3)**
2. **Asegúrate de que existe un camino válido del 2 al 3**
3. **Usa 0 para muros y 1 para caminos**
4. **El array debe ser exactamente 10x10**
5. **Considera el límite de bloques al diseñar el camino**

### 3. Dirección Inicial

Ajusta `initialDirection` según tu diseño:
- `"0"` = Norte (↑) - Útil para laberintos verticales
- `"1"` = Este (→) - Más común, natural para lectura occidental
- `"2"` = Sur (↓) - Útil para diseños descendentes
- `"3"` = Oeste (←) - Útil para desafíos especiales

### 4. Progresión Pedagógica

**Secuencia Recomendada**:

1. Línea recta (solo avanzar)
2. Una curva simple (L)
3. Dos curvas (S o U)
4. Tres curvas (Zigzag)
5. Camino largo con múltiples curvas
6. Introducir giros de 180°
7. Laberintos con opciones incorrectas
8. Laberintos complejos

### 5. Herramientas

Puedes usar este patrón para visualizar tu mapa antes de usarlo:

```
Remplaza:
0 = ⬛ (muro)
1 = ⬜ (camino)
2 = 🟢 (inicio)
3 = 🔴 (meta)
```

Ejemplo visual del Nivel 1:
```
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬛⬛⬛⬛⬛🔴⬛⬛⬛
⬛⬛⬛⬛⬛⬛⬜⬛⬛⬛
⬛⬛⬛⬛⬛⬛⬜⬛⬛⬛
⬛⬛⬛🟢⬜⬜⬜⬛⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
```

---

## Cómo Usar los Mapas

1. Copia el array JSON del nivel deseado
2. En el editor H5P, pega el array en el campo "Mapa del laberinto"
3. Ajusta el "Máximo de bloques" según lo recomendado
4. Configura la dirección inicial apropiada
5. Guarda y prueba tu ejercicio

¡Diviértete creando tus propios laberintos! 🎮


