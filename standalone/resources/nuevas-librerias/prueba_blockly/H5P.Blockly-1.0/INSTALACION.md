# Guía de Instalación y Prueba - H5P.Blockly-1.0

## 📦 Instalación

La librería ya está instalada en:
```
public/h5p-standalone/resources/H5P.Blockly-1.0/
```

### Verificar la Instalación

Asegúrate de que la estructura de archivos sea correcta:

```
H5P.Blockly-1.0/
├── library.json          ✓ Metadatos
├── semantics.json        ✓ Configuración de campos
├── blockly.js           ✓ Lógica principal (743 líneas)
├── blockly.css          ✓ Estilos (200+ líneas)
├── icon.svg             ✓ Icono de la librería
├── README.md            ✓ Documentación
├── INSTALACION.md       ✓ Esta guía
├── EJEMPLOS_MAPAS.md    ✓ 10 ejemplos de mapas
├── content-example.json ✓ Ejemplo de contenido
└── images/              ✓ 9 imágenes PNG
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

---

## 🧪 Prueba Rápida con H5P Standalone

Si estás usando H5P standalone (como en este proyecto), sigue estos pasos:

### Paso 1: Crear archivo de contenido H5P

Crea un archivo en tu proyecto (por ejemplo `test-blockly.json`):

```json
{
  "library": "H5P.Blockly 1.0",
  "params": {
    "taskDescription": "Ayuda al personaje a llegar al punto B utilizando los bloques.",
    "levelName": "Nivel 1 - Básico",
    "maxBlocks": 11,
    "mazeMap": "[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,3,0,0,0],[0,0,0,0,0,0,1,0,0,0],[0,0,0,0,0,0,1,0,0,0],[0,0,0,2,1,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]",
    "initialDirection": "1",
    "availableBlocks": {
      "forward": true,
      "turnRight": true,
      "turnLeft": true
    },
    "successMessage": "¡Excelente! Has completado el laberinto.",
    "failureMessage": "El personaje no llegó al destino. Revisa tu secuencia de bloques.",
    "crashMessage": "El personaje chocó con un muro. Revisa tu secuencia de bloques.",
    "animationSpeed": 300
  }
}
```

### Paso 2: Crear página de prueba HTML

Crea `test-blockly.html` en la raíz de tu proyecto:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prueba H5P.Blockly</title>
    <link rel="stylesheet" href="public/h5p-standalone/styles/h5p.css">
</head>
<body>
    <div id="h5p-container"></div>
    
    <script src="public/h5p-standalone/main.bundle.js"></script>
    <script>
        const el = document.getElementById('h5p-container');
        const options = {
            h5pJsonPath: './test-blockly.json',
            frameJs: './public/h5p-standalone/frame.bundle.js',
            frameCss: './public/h5p-standalone/styles/h5p.css',
        };
        
        new H5PStandalone(el, options);
    </script>
</body>
</html>
```

### Paso 3: Ejecutar

```bash
# Si tienes un servidor local
npm run dev

# O usa un servidor simple
python -m http.server 8000

# Luego abre en el navegador
http://localhost:8000/test-blockly.html
```

---

## 🔧 Integración en Vue.js (Como en este proyecto)

### Opción 1: Crear una Vista Específica

Crea `src/views/BlocklyH5PView.vue`:

```vue
<template>
  <div class="blockly-h5p-view">
    <div ref="h5pContainer"></div>
  </div>
</template>

<script>
import { H5P } from 'h5p-standalone';

export default {
  name: 'BlocklyH5PView',
  mounted() {
    this.loadH5P();
  },
  methods: {
    async loadH5P() {
      const contentData = {
        library: 'H5P.Blockly 1.0',
        params: {
          taskDescription: 'Ayuda al personaje a llegar al punto B.',
          levelName: 'Nivel 1 - Básico',
          maxBlocks: 11,
          mazeMap: '[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,3,0,0,0],[0,0,0,0,0,0,1,0,0,0],[0,0,0,0,0,0,1,0,0,0],[0,0,0,2,1,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]',
          initialDirection: '1',
          availableBlocks: {
            forward: true,
            turnRight: true,
            turnLeft: true
          },
          successMessage: '¡Excelente! Has completado el laberinto.',
          failureMessage: 'El personaje no llegó al destino.',
          crashMessage: 'El personaje chocó con un muro.',
          animationSpeed: 300
        }
      };

      // Inicializar H5P
      const options = {
        h5pJsonPath: contentData,
        frameJs: '/h5p-standalone/frame.bundle.js',
        frameCss: '/h5p-standalone/styles/h5p.css',
      };

      new H5P.H5PStandalone(this.$refs.h5pContainer, options);
    }
  }
};
</script>

<style scoped>
.blockly-h5p-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
```

### Opción 2: Componente Reutilizable

Crea `src/components/BlocklyH5P.vue`:

```vue
<template>
  <div ref="h5pContainer" class="blockly-h5p-component"></div>
</template>

<script>
export default {
  name: 'BlocklyH5P',
  props: {
    levelName: {
      type: String,
      default: 'Nivel 1'
    },
    mazeMap: {
      type: String,
      required: true
    },
    maxBlocks: {
      type: Number,
      default: 11
    },
    initialDirection: {
      type: String,
      default: '1'
    }
  },
  mounted() {
    this.initBlockly();
  },
  methods: {
    initBlockly() {
      // Implementación de inicialización
      // Similar al ejemplo anterior
    }
  }
};
</script>
```

---

## 🎯 Ejemplos de Uso

### Ejemplo 1: Nivel Básico

```json
{
  "levelName": "Nivel 1 - Introducción",
  "maxBlocks": 11,
  "mazeMap": "[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,3,0,0,0],[0,0,0,0,0,0,1,0,0,0],[0,0,0,0,0,0,1,0,0,0],[0,0,0,2,1,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]",
  "initialDirection": "1"
}
```

### Ejemplo 2: Nivel Intermedio con Restricciones

```json
{
  "levelName": "Nivel 2 - Sin Giros a la Derecha",
  "maxBlocks": 20,
  "mazeMap": "[[0,0,0,0,0,0,0,0,0,0],[0,0,2,1,1,1,0,0,0,0],[0,0,0,0,0,1,0,0,0,0],[0,0,0,0,0,1,0,0,0,0],[0,0,0,1,1,1,0,0,0,0],[0,0,0,1,0,0,0,0,0,0],[0,0,0,3,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]",
  "initialDirection": "1",
  "availableBlocks": {
    "forward": true,
    "turnRight": false,
    "turnLeft": true
  }
}
```

### Ejemplo 3: Nivel Avanzado con Animación Rápida

```json
{
  "levelName": "Nivel 5 - Modo Experto",
  "maxBlocks": 45,
  "mazeMap": "[[0,2,1,1,1,0,0,0,0,0],[0,0,0,0,1,0,0,0,0,0],[0,1,1,0,1,1,1,1,1,0],[0,1,0,0,0,0,0,0,1,0],[0,1,1,1,1,1,1,0,1,0],[0,0,0,0,0,0,1,0,1,0],[0,1,1,1,1,1,1,0,1,0],[0,1,0,0,0,0,0,0,1,0],[0,1,1,1,1,1,1,1,3,0],[0,0,0,0,0,0,0,0,0,0]]",
  "initialDirection": "2",
  "animationSpeed": 150
}
```

---

## 🐛 Solución de Problemas

### Problema: No aparece la librería en el editor H5P

**Solución**:
1. Verifica que `library.json` existe y es válido
2. Verifica que la carpeta se llama exactamente `H5P.Blockly-1.0`
3. Reinicia tu sistema H5P
4. Borra la cache del navegador

### Problema: Los bloques de Blockly no aparecen

**Solución**:
1. Verifica la conexión a internet (Blockly se carga desde CDN)
2. Revisa la consola del navegador para errores
3. Asegúrate de que `blockly.js` se cargó correctamente

### Problema: Las imágenes no se muestran

**Solución**:
1. Verifica que todas las imágenes PNG están en `images/`
2. Revisa las rutas en `blockly.js`
3. Verifica los permisos de lectura de los archivos
4. El sistema tiene un fallback que muestra gráficos simples si fallan las imágenes

### Problema: El personaje no se mueve

**Solución**:
1. Verifica que el mapa JSON es válido
2. Asegúrate de que hay exactamente UN inicio (2) y UNA meta (3)
3. Verifica que existe un camino válido entre inicio y meta
4. Revisa la consola para errores de JavaScript

### Problema: "Error al parsear el mapa"

**Solución**:
1. El mapa debe ser un array 10x10 válido
2. Usa comillas dobles en JSON, no simples
3. No incluyas espacios extra o saltos de línea en el string JSON
4. Verifica que cada fila tiene exactamente 10 elementos

---

## 📊 Validar el Mapa

Usa este script simple para validar tu mapa antes de usarlo:

```javascript
function validarMapa(mapaJSON) {
  try {
    const mapa = JSON.parse(mapaJSON);
    
    // Verificar dimensiones
    if (mapa.length !== 10) {
      return { valido: false, error: "El mapa debe tener 10 filas" };
    }
    
    for (let i = 0; i < mapa.length; i++) {
      if (mapa[i].length !== 10) {
        return { valido: false, error: `La fila ${i} no tiene 10 columnas` };
      }
    }
    
    // Contar inicio y meta
    let inicios = 0;
    let metas = 0;
    
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (mapa[i][j] === 2) inicios++;
        if (mapa[i][j] === 3) metas++;
      }
    }
    
    if (inicios !== 1) {
      return { valido: false, error: `Debe haber exactamente 1 inicio, encontrados: ${inicios}` };
    }
    
    if (metas !== 1) {
      return { valido: false, error: `Debe haber exactamente 1 meta, encontrados: ${metas}` };
    }
    
    return { valido: true, error: null };
    
  } catch (e) {
    return { valido: false, error: "JSON inválido: " + e.message };
  }
}

// Uso:
const resultado = validarMapa('[[0,0,...]]');
console.log(resultado);
```

---

## 🚀 Próximos Pasos

1. **Prueba los 10 mapas de ejemplo** incluidos en `EJEMPLOS_MAPAS.md`
2. **Crea tus propios mapas** siguiendo las guías
3. **Configura diferentes niveles de dificultad** ajustando `maxBlocks`
4. **Experimenta con restricciones** deshabilitando ciertos bloques
5. **Personaliza los mensajes** según tu contexto educativo

---

## 📚 Recursos Adicionales

- `README.md` - Documentación completa de la librería
- `EJEMPLOS_MAPAS.md` - 10 mapas de ejemplo listos para usar
- `content-example.json` - Ejemplo de configuración completa
- [Documentación de Blockly](https://developers.google.com/blockly)
- [Documentación de H5P](https://h5p.org/documentation)

---

## ✅ Checklist de Instalación Completa

- [ ] Estructura de carpetas correcta
- [ ] Todos los archivos presentes (13 archivos en total)
- [ ] Imágenes copiadas (9 archivos PNG)
- [ ] library.json válido
- [ ] semantics.json válido
- [ ] Prueba básica realizada
- [ ] Mapa personalizado creado
- [ ] Integrado en tu aplicación

---

## 💡 Consejos Finales

1. **Empieza simple**: Usa el Nivel 1 para probar que todo funciona
2. **Progresión gradual**: Incrementa la dificultad poco a poco
3. **Prueba tus mapas**: Asegúrate de que son solucionables
4. **Ajusta el límite de bloques**: No lo hagas ni muy fácil ni muy difícil
5. **Personaliza mensajes**: Adapta el lenguaje a tu audiencia
6. **Usa las imágenes**: Mejoran mucho la experiencia visual

---

¡Tu librería H5P.Blockly está lista para usar! 🎉

Si tienes problemas, revisa la consola del navegador para mensajes de error específicos.


