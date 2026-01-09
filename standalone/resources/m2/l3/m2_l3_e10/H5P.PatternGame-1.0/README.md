# H5P.PatternGame-1.0

Librería H5P para crear ejercicios interactivos de reconocimiento de patrones.

## Descripción

Esta librería permite crear ejercicios donde los estudiantes deben analizar tres elementos de referencia con diferentes patrones de colores y ajustar un cuarto elemento interactivo para que coincida con el patrón correcto.

## Características

- **3 elementos de referencia**: Imágenes estáticas con patrones de colores configurables
- **Elemento interactivo**: El estudiante puede ajustar cada parte del cuarto elemento
- **4 colores configurables**: Rojo, Azul, Verde y Amarillo (personalizables)
- **Cálculo automático**: El código calcula automáticamente el patrón correcto
- **Integración H5P**: Compatible con H5P.Question y sistemas de puntuación

## Estructura de Archivos

```
H5P.PatternGame-1.0/
├── library.json          # Metadatos de la librería
├── semantics.json        # Configuración del editor
├── icon.svg              # Icono de la librería
├── js/
│   └── PatternGame.js   # Lógica principal del juego
├── css/
│   └── PatternGame.css  # Estilos
└── README.md            # Este archivo
```

## Configuración

### Elementos de Referencia

Cada elemento de referencia requiere:
- **Imagen**: Archivo de imagen (PNG, JPG, etc.)
- **Patrón**: Cadena de texto con formato `0,1,2,3` donde:
  - `0` = Rojo
  - `1` = Azul
  - `2` = Verde
  - `3` = Amarillo

### Ejemplo de Patrones

- **Elemento 1**: `0,1,2,3` (Rojo, Azul, Verde, Amarillo)
- **Elemento 2**: `1,2,3,0` (Azul, Verde, Amarillo, Rojo)
- **Elemento 3**: `2,3,0,1` (Verde, Amarillo, Rojo, Azul)
- **Elemento 4 (correcto)**: `3,0,1,2` (Amarillo, Rojo, Azul, Verde)

### Regla del Juego

El elemento 4 debe tener en cada parte (fila) un color que NO esté en esa misma parte en los otros 3 elementos. El código calcula automáticamente cuál es el patrón correcto.

## Uso en Lumi o Plataformas H5P

1. Copia la carpeta `H5P.PatternGame-1.0` a tu directorio de librerías H5P
2. En el editor H5P, selecciona "Pattern Game" como tipo de contenido
3. Configura:
   - Instrucciones del ejercicio
   - Imágenes de los 3 elementos de referencia
   - Patrones de colores para cada elemento
   - Colores personalizados (opcional)
   - Mensajes de éxito/fallo
4. Guarda y previsualiza tu ejercicio

## Requisitos

- H5P.Question 1.5 o superior
- H5P.JoubelUI 1.3 o superior
- Navegador con soporte para JavaScript moderno

## Versión

- **Versión actual**: 1.0.0
- **Licencia**: MIT
- **Autor**: sbriones

## Notas de Desarrollo

- La librería usa jQuery (incluido en H5P)
- Las imágenes se cargan usando `H5P.getPath()` para manejar rutas correctamente
- Si no se proporciona imagen, se genera un elemento visual con colores como fallback
- El sistema de puntuación se integra con H5P.Question

## Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

