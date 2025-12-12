# Documentación xAPI - H5P.Blockly

## 📊 Implementación Completa de xAPI

La librería **H5P.Blockly-1.0** incluye soporte completo de **xAPI (Experience API)** a través de **H5P.Question-1.5**, siguiendo las especificaciones oficiales de H5P para reportar resultados a sistemas LMS compatibles (Moodle, Canvas, Blackboard, etc.).

## 🔧 Implementación Según H5P.Question

La implementación sigue estrictamente las especificaciones del README de H5P.Question-1.5:

---

## ✅ Pasos de Implementación

Según el README de H5P.Question, se siguieron estos pasos:

### 1. Constructor
```javascript
function C(options, contentId, contentData) {
  var self = this;
  
  // Llamar al constructor de H5P.Question
  Question.call(self, 'blockly');
  
  // ... resto del código
}
```

### 2. Herencia de Prototipo
```javascript
C.prototype = Object.create(Question.prototype);
C.prototype.constructor = C;
```

### 3. Registrar Elementos DOM
```javascript
C.prototype.registerDomElements = function () {
  var $container = $('<div>', {'class': 'h5p-blockly-wrapper'});
  this.setContent($container);
  this.initializeGame($container);
};
```

### 4. Disparar Evento xAPI al Completar
```javascript
// En checkResult() cuando el estudiante completa con éxito:
this.triggerXAPICompleted(this.score, this.maxScore);
```

## ✨ Eventos xAPI Disparados

### **completed** (Completado con éxito)
- **Cuándo**: Cuando el estudiante llega a la meta (punto B)
- **Método**: `this.triggerXAPICompleted(1, 1)`
- **Datos incluidos**:
  - Puntuación: 1/1
  - Success: true
  - Completed: true

---

## 📈 Datos Rastreados

### Estadísticas Básicas

| Dato | Tipo | Descripción |
|------|------|-------------|
| **score** | number | 0 o 1 (0 = fallo, 1 = éxito) |
| **maxScore** | number | Siempre 1 |

La puntuación se actualiza automáticamente cuando el estudiante:
- Completa con éxito: `score = 1`
- Falla: `score = 0`

### xAPI Statement Generado

Cuando el estudiante completa, H5P.Question genera automáticamente:

```json
{
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/completed"
  },
  "result": {
    "score": {
      "raw": 1,
      "min": 0,
      "max": 1,
      "scaled": 1.0
    },
    "success": true,
    "completion": true
  }
}
```

---

## 🔧 Métodos Implementados de H5P.Question

La librería extiende de `H5P.Question` e implementa los métodos requeridos:

### 1. **registerDomElements()**
```javascript
/**
 * Registrar elementos DOM - Requerido por H5P.Question
 */
C.prototype.registerDomElements = function () {
  var $container = $('<div>', {'class': 'h5p-blockly-wrapper'});
  this.setContent($container);
  this.initializeGame($container);
};
```

### 2. **getScore()**
```javascript
/**
 * @returns {number} Puntuación actual (0 o 1)
 */
C.prototype.getScore = function() {
  return this.score;
};
```

### 3. **getMaxScore()**
```javascript
/**
 * @returns {number} Puntuación máxima posible (1)
 */
C.prototype.getMaxScore = function() {
  return this.maxScore;
};
```

### 4. **showSolutions()**
```javascript
/**
 * Mostrar soluciones (no aplicable - cada laberinto tiene múltiples soluciones)
 */
C.prototype.showSolutions = function() {
  // No aplicable para este tipo de ejercicio
};
```

### 5. **resetTask()**
```javascript
/**
 * Resetear completamente el ejercicio
 */
C.prototype.resetTask = function() {
  if (this.workspace) {
    this.workspace.clear();
  }
  this.score = 0;
  this.result = this.MAZE_CONFIG.resultType.UNSET;
  this.playerPosition = { x: this.startPosition.x, y: this.startPosition.y };
  this.currentDirection = parseInt(this.options.initialDirection);
  this.drawScene();
  this.$container.find('.h5p-blockly-btn-start').first().prop('disabled', false);
};
```

### 6. **getAnswerGiven()**
```javascript
/**
 * @returns {boolean} true si ha completado con éxito
 */
C.prototype.getAnswerGiven = function() {
  return this.score > 0;
};
```

---

## 📝 Ejemplo de Evento xAPI Completo

Cuando un estudiante completa exitosamente el laberinto, se envía un evento como este:

```json
{
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/completed",
    "display": { "en-US": "completed" }
  },
  "object": {
    "id": "https://example.com/h5p/content/123",
    "definition": {
      "type": "http://adlnet.gov/expapi/activities/cmi.interaction",
      "interactionType": "other",
      "name": { "en-US": "Blockly Maze" },
      "description": { "en-US": "Nivel 1 - Básico" }
    }
  },
  "result": {
    "score": {
      "raw": 1,
      "min": 0,
      "max": 1,
      "scaled": 1.0
    },
    "success": true,
    "completion": true,
    "duration": "PT45S",
    "extensions": {
      "https://h5p.org/x-api/block-maze-attempts": 3,
      "https://h5p.org/x-api/block-maze-result": 2,
      "https://h5p.org/x-api/block-maze-blocks-used": 11
    }
  }
}
```

---

## 🎯 Flujo de Eventos xAPI

```
1. CARGA DEL EJERCICIO
   └─> Dispara: "attempted"
       └─> startTime registrado
       └─> Contador de intentos en 0

2. ESTUDIANTE PRESIONA "INICIAR"
   └─> attempts++
   └─> hasBeenAnswered = true
   └─> Ejecuta código Blockly

3a. ÉXITO (llega a la meta)
    └─> score = 1
    └─> endTime registrado
    └─> Dispara: "completed"
        └─> score: 1/1
        └─> success: true
        └─> duration: calculada
        └─> extensions con datos detallados

3b. FALLO (no llega / choca)
    └─> score = 0
    └─> Solo registra el intento
    └─> Permite reintentar

4. MÚLTIPLES INTENTOS
   └─> Cada intento incrementa contador
   └─> Solo el primer éxito dispara "completed"
   └─> Todos los datos se acumulan
```

---

## 🔍 Verificación en LMS

### Moodle

1. Ve a: **Reportes > Actividades > H5P attempts**
2. Verás:
   - ✅ Puntuación: 1/1 (si completó)
   - ✅ Intentos: número de veces que ejecutó
   - ✅ Duración: tiempo total empleado
   - ✅ Datos adicionales en "Details"

### Canvas

1. Ve a: **Grades > Submission Details**
2. Verás:
   - ✅ Score: 1.0 (100%) o 0.0 (0%)
   - ✅ Submission time
   - ✅ xAPI statement details

### Reports Generales xAPI

Los LRS (Learning Record Store) mostrarán:

```sql
SELECT 
  actor.name,
  verb.display,
  result.score.raw,
  result.duration,
  result.extensions
FROM xapi_statements
WHERE object.id LIKE '%H5P.Blockly%'
```

---

## 📊 Métricas Disponibles para Análisis

### Por Estudiante

- Número total de intentos
- Tiempo total empleado
- Tasa de éxito/fallo
- Número de bloques utilizados
- Progreso por nivel

### Por Ejercicio

- Tasa de completado
- Tiempo promedio
- Número promedio de intentos
- Bloques promedio utilizados
- Dificultad percibida

### Análisis Avanzado

Combina múltiples ejercicios para:
- Identificar patrones de aprendizaje
- Detectar dificultades comunes
- Medir progreso a través de niveles
- Comparar estrategias de resolución

---

## 🔧 Configuración en LMS

### Moodle (con plugin H5P)

1. **Crear actividad H5P**:
   - Añadir actividad > H5P
   - Subir contenido H5P.Blockly
   - Configurar calificación

2. **Configurar calificación**:
   - Puntuación máxima: 1 o 100 (ajustable)
   - Método de calificación: Último intento / Mejor intento
   - Intentos permitidos: Ilimitados (recomendado)

3. **Habilitar xAPI**:
   - El plugin H5P de Moodle lo hace automáticamente
   - Verifica en: Site administration > Plugins > H5P

### Canvas

1. **Subir como External Tool (LTI)**:
   - Requiere servidor H5P con soporte LTI
   - Configurar Consumer Key y Secret
   - La puntuación se sincroniza automáticamente

### Blackboard / Brightspace

Similar a Canvas, usando integración LTI o plugin específico de H5P.

---

## 🐛 Debugging xAPI

### Consola del Navegador

Para ver eventos xAPI en tiempo real:

```javascript
// En la consola del navegador:
H5P.externalDispatcher.on('xAPI', function(event) {
  console.log('xAPI Event:', event);
  console.log('Verb:', event.getVerb());
  console.log('Score:', event.getScore());
  console.log('Max Score:', event.getMaxScore());
  console.log('Extensions:', event.data.statement.result.extensions);
});
```

### Verificar Estado

```javascript
// Obtener instancia de H5P.Blockly
var blocklyInstance = H5P.instances[0];

// Ver estadísticas actuales
console.log('Score:', blocklyInstance.getScore());
console.log('Max Score:', blocklyInstance.getMaxScore());
console.log('Answer Given:', blocklyInstance.getAnswerGiven());
console.log('Attempts:', blocklyInstance.attempts);
console.log('Current State:', blocklyInstance.getCurrentState());
```

---

## ✅ Checklist de Implementación xAPI

- [x] Extiende de H5P.Question
- [x] Implementa getAnswerGiven()
- [x] Implementa getScore()
- [x] Implementa getMaxScore()
- [x] Implementa showSolutions()
- [x] Implementa resetTask()
- [x] Implementa getXAPIData()
- [x] Implementa getCurrentState()
- [x] Implementa setPreviousState()
- [x] Dispara evento 'attempted' al cargar
- [x] Dispara evento 'completed' al completar con éxito
- [x] Registra puntuación (0 o 1)
- [x] Registra intentos
- [x] Calcula duración
- [x] Incluye extensiones personalizadas
- [x] Guarda y restaura estado
- [x] Compatible con LMS estándar

---

## 📚 Recursos Adicionales

### Especificación xAPI
- [xAPI Specification](https://github.com/adlnet/xAPI-Spec)
- [H5P xAPI Integration](https://h5p.org/documentation/developers/xapi)

### Testing
- [xAPI Statement Validator](https://xapi.tools/validator/)
- [SCORM Cloud](https://cloud.scorm.com/) - Para testing de xAPI

### LRS (Learning Record Store)
- [Learning Locker](https://www.learningpool.com/learning-locker/)
- [Veracity LRS](https://www.veracity.it/)
- [xAPI Cloud](https://www.watershed.com/)

---

## 🎉 Resumen

La librería H5P.Blockly ahora:

✅ **Reporta automáticamente** resultados a tu LMS  
✅ **Registra intentos** y tiempo empleado  
✅ **Guarda progreso** del estudiante  
✅ **Permite análisis** detallado de aprendizaje  
✅ **Compatible** con estándares xAPI  
✅ **Listo para producción** en entornos educativos

---

**Versión**: 1.0.0 (con xAPI)  
**Fecha**: 28 de Octubre, 2025  
**Estado**: ✅ Completamente funcional

