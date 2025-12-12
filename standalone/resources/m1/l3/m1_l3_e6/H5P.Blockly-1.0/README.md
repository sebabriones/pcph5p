# H5P.Blockly-1.0

Librería H5P para crear ejercicios interactivos de laberintos usando Blockly con soporte completo de xAPI.

## Descripción

Esta librería permite crear ejercicios de programación visual donde los estudiantes deben usar bloques de Blockly para guiar a un personaje a través de un laberinto desde el punto A hasta el punto B.

**✨ Incluye soporte completo de xAPI** para reportar resultados, intentos y estadísticas detalladas a sistemas LMS (Moodle, Canvas, Blackboard, etc.).

## Características

- **Cuadrícula configurable**: 10x10 cuadros
- **Bloques de programación**: Avanzar, Girar a la derecha, Girar a la izquierda
- **Límite de bloques configurable**: Controla la complejidad del ejercicio
- **Mapa personalizable**: Define tu propio laberinto mediante un array JSON
- **Animaciones visuales**: Sprites animados del personaje
- **Mensajes personalizables**: Configura mensajes de éxito, fallo y colisión
- **Velocidad de animación ajustable**: Controla la velocidad de ejecución
- **✨ Soporte xAPI completo**: Reporta automáticamente a LMS
  - Puntuación (0 o 1 punto)
  - Número de intentos
  - Tiempo empleado
  - Bloques utilizados
  - Estado de progreso guardado/restaurado

## Configuración del Mapa

El mapa del laberinto se define mediante un array 10x10 donde cada valor representa:

- **0**: Muro (no se puede pasar)
- **1**: Camino (se puede pasar)
- **2**: Inicio (punto A - donde comienza el personaje)
- **3**: Meta (punto B - objetivo a alcanzar)

### Ejemplo de mapa:

```json
[
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,3,0,0,0],
  [0,0,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,0,1,0,0,0],
  [0,0,0,2,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0]
]
```

En este ejemplo:
- El personaje inicia en la posición (3, 6) - marcado con **2**
- Debe llegar a la posición (6, 3) - marcado con **3**
- Solo puede moverse por las celdas marcadas con **1** (camino)

## Dirección Inicial

La dirección inicial del personaje se configura con:
- **0**: Norte (↑)
- **1**: Este (→)
- **2**: Sur (↓)
- **3**: Oeste (←)

## Bloques Disponibles

Puedes habilitar o deshabilitar los siguientes bloques:
- **Avanzar**: Mueve el personaje una casilla hacia adelante
- **Girar a la derecha**: Rota el personaje 90° a la derecha
- **Girar a la izquierda**: Rota el personaje 90° a la izquierda

## Parámetros Configurables

| Parámetro | Tipo | Descripción | Valor por defecto |
|-----------|------|-------------|-------------------|
| taskDescription | Texto | Descripción de la tarea | "Ayuda al personaje..." |
| levelName | Texto | Nombre del nivel | "Nivel 1 - Básico" |
| maxBlocks | Número | Máximo de bloques permitidos | 11 |
| mazeMap | JSON | Mapa del laberinto | Ver ejemplo arriba |
| initialDirection | Select | Dirección inicial (0-3) | 1 (Este) |
| availableBlocks | Grupo | Bloques disponibles | Todos habilitados |
| successMessage | Texto | Mensaje de éxito | "¡Excelente!..." |
| failureMessage | Texto | Mensaje de fallo | "El personaje no..." |
| crashMessage | Texto | Mensaje de colisión | "El personaje chocó..." |
| animationSpeed | Número | Velocidad en ms | 300 |

## Imágenes Incluidas

La librería incluye los siguientes recursos gráficos:
- `idle.png` - Sprite del personaje en reposo (4 direcciones)
- `front_jump.png` - Animación de salto hacia adelante
- `back_jump.png` - Animación de salto hacia atrás
- `right_jump.png` - Animación de salto a la derecha
- `left_jump.png` - Animación de salto a la izquierda
- `turn.png` - Animación de giro
- `level1.png` - Fondo del laberinto
- `success.png` - Imagen de éxito
- `fail.png` - Imagen de fallo

## Uso en H5P

1. Copia la carpeta `H5P.Blockly-1.0` en tu directorio de librerías H5P
2. En el editor H5P, selecciona "Blockly Maze" como tipo de contenido
3. Configura los parámetros según tus necesidades:
   - Define el mapa del laberinto
   - Establece el límite de bloques
   - Personaliza los mensajes
   - Ajusta la velocidad de animación
4. Guarda y previsualiza tu ejercicio

## Requisitos

- **H5P.Question 1.5 o superior** (incluido como dependencia)
- Navegador con soporte para Canvas y JavaScript moderno
- Blockly 11.0.0 (cargado automáticamente desde CDN)
- Sistema LMS con soporte H5P (opcional, para aprovechar xAPI)

## Versión

- **Versión actual**: 1.0.0
- **Licencia**: MIT
- **Autor**: Your Organization

## Estructura de Archivos

```
H5P.Blockly-1.0/
├── library.json              # Metadatos de la librería
├── semantics.json            # Definición de campos configurables
├── blockly.js               # Lógica principal (con xAPI)
├── blockly.css              # Estilos
├── icon.svg                 # Icono de la librería
├── README.md                # Este archivo
├── INSTALACION.md           # Guía de instalación
├── EJEMPLOS_MAPAS.md        # 10 ejemplos de mapas
├── XAPI_DOCUMENTATION.md    # Documentación completa de xAPI ✨
├── content-example.json     # Ejemplo de configuración
└── images/                  # Recursos gráficos
    ├── idle.png
    ├── front_jump.png
    ├── back_jump.png
    ├── right_jump.png
    ├── left_jump.png
    ├── turn.png
    ├── level1.png
    ├── success.png
    └── fail.png
```

## Notas de Desarrollo

- La librería usa Blockly 11.0.0 desde CDN de unpkg
- El código generado se ejecuta de forma segura usando eval en un contexto controlado
- Las animaciones se ejecutan paso a paso con delays configurables
- El canvas es de 500x500 píxeles con celdas de 50x50

## Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.


