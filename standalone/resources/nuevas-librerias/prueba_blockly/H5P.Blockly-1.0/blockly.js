var H5P = H5P || {};

H5P.Blockly = (function ($, Question) {
  'use strict';

  /**
   * Constructor function.
   */
  function C(options, contentId, contentData) {
    var self = this;
    
    // Llamar al constructor de H5P.Question si está disponible
    if (Question) {
      Question.call(self, 'blockly');
    }
    
    this.contentId = contentId;
    this.contentData = contentData;
    
    // Parámetros configurables desde el editor H5P
    this.options = $.extend(true, {}, {
      taskDescription: 'Ayuda al personaje a llegar al punto B utilizando los bloques.',
      levelName: 'Nivel 1 - Básico',
      maxBlocks: 11,
      optimalSteps: 7,
      /*mazeMap: '[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,3,0,0,0],[0,0,0,0,0,0,1,0,0,0],[0,0,0,0,0,0,1,0,0,0],[0,0,0,2,1,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]',*/
      mazeMap: '[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]',
      initialDirection: '1',
      availableBlocks: {
        forward: true,
        turnRight: true,
        turnLeft: true
      },
      successMessage: '¡Excelente! Has completado el laberinto.',
      failureMessage: 'El personaje no llegó al destino. Revisa tu secuencia de bloques.',
      crashMessage: 'El personaje chocó con un muro. Revisa tu secuencia de bloques.',
      animationSpeed: 300
    }, options);
    
    // Estadísticas para xAPI
    this.score = 0;
    this.maxScore = this.options.optimalSteps;
    
    // Configuración del laberinto
    this.MAZE_CONFIG = {
      WIDTH: 500,
      HEIGHT: 500,
      ROWS: 10,
      COLS: 10,
      SQUARE: 50,
      map: [],
      pathType: { WALL: 0, PATH: 1, START: 2, FINISH: 3 },
      directionType: { NORTH: 0, EAST: 1, SOUTH: 2, WEST: 3 },
      resultType: { UNSET: 0, FAILURE: 1, SUCCESS: 2, CRASH: 3 }
    };
    
    // Variables de juego
    this.workspace = null;
    this.canvas = null;
    this.ctx = null;
    this.isRunning = false;
    this.currentDirection = parseInt(this.options.initialDirection);
    this.result = this.MAZE_CONFIG.resultType.UNSET;
    this.playerPosition = { x: 0, y: 0 };
    this.startPosition = { x: 0, y: 0 };
    this.finishPosition = { x: 0, y: 0 };
    
    // No se cargan imágenes - solo estilos fallback
    
    // Parsear el mapa desde JSON
    try {
      this.MAZE_CONFIG.map = JSON.parse(this.options.mazeMap);
    } catch (e) {
      console.error('Error al parsear el mapa del laberinto:', e);
      // Usar mapa por defecto
      /*this.MAZE_CONFIG.map = [
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
      ];*/
      this.MAZE_CONFIG.map = [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
      ];
    }
  }
  
  // Heredar de H5P.Question si está disponible
  if (Question) {
    C.prototype = Object.create(Question.prototype);
    C.prototype.constructor = C;
    
    // Definir addQuestionToXAPI antes de sobrescribir createXAPIEventTemplate
    // para que esté disponible cuando se ejecute la sobrescritura
    C.prototype.addQuestionToXAPI = function(xAPIEvent) {
      if (xAPIEvent && typeof xAPIEvent.getVerifiedStatementValue === 'function') {
        var definition = xAPIEvent.getVerifiedStatementValue(['object', 'definition']);
        if (definition && typeof this.getXAPIDefinition === 'function') {
          $.extend(definition, this.getXAPIDefinition());
        }
      }
    };
    
    // Sobrescribir createXAPIEventTemplate inmediatamente después de la herencia
    // para asegurar que capture TODOS los eventos, incluido "attempted"
    var originalCreateXAPIEventTemplate = C.prototype.createXAPIEventTemplate;
    C.prototype.createXAPIEventTemplate = function(verb) {
      var xAPIEvent = null;
      
      // Try to use original method first (from H5P.Question)
      if (typeof originalCreateXAPIEventTemplate === 'function') {
        xAPIEvent = originalCreateXAPIEventTemplate.call(this, verb);
      } else if (typeof H5P !== 'undefined' && typeof H5P.createXAPIEventTemplate === 'function') {
        xAPIEvent = H5P.createXAPIEventTemplate(verb);
      }
      
      // Always add question definition (choices and correctResponsePattern)
      // This ensures it works for ALL verbs including "attempted"
      if (xAPIEvent && typeof this.addQuestionToXAPI === 'function') {
        this.addQuestionToXAPI(xAPIEvent);
      }
      
      return xAPIEvent;
    };
  }

  /**
   * Attach (adjuntar) a un elemento DOM - Método estándar H5P
   */
  C.prototype.attach = function ($container) {
    var self = this;
    
    // Crear wrapper si no existe
    if (!$container.hasClass('h5p-blockly-wrapper')) {
      $container = $('<div>', {
        'class': 'h5p-blockly-wrapper'
      }).appendTo($container);
    }
    
    // Inicializar el juego
    this.initializeGame($container);
    
    return this;
  };

  /**
   * Registrar elementos DOM - Requerido por H5P.Question
   */
  C.prototype.registerDomElements = function () {
    var self = this;
    
    // Crear el contenedor principal
    var $container = $('<div>', {
      'class': 'h5p-blockly-wrapper'
    });
    
    // Registrar el contenido principal (si H5P.Question está disponible)
    if (this.setContent) {
      this.setContent($container);
    }
    
    // Inicializar el juego dentro del contenedor
    this.initializeGame($container);
  };

  /**
   * Inicializar el juego
   */
  C.prototype.initializeGame = function ($container) {
    var self = this;
    this.$container = $container;
    
    // Interceptar eventos xAPI después de que se disparan para agregar definición si falta
    // Esto asegura que eventos como "attempted" también incluyan choices y correctResponsePattern
    if (typeof H5P !== 'undefined' && H5P.externalDispatcher) {
      H5P.externalDispatcher.on('xAPI', function(event) {
        if (event && event.data && event.data.statement) {
          var definition = event.data.statement.object && event.data.statement.object.definition;
          // Si la definición existe pero no tiene choices ni correctResponsePattern, agregarlos
          if (definition && (!definition.choices || !definition.correctResponsesPattern)) {
            if (typeof self.addQuestionToXAPI === 'function') {
              self.addQuestionToXAPI(event);
            }
          }
        }
      });
    }
    
    // Crear estructura HTML
    var html = '<div class="h5p-blockly-container">' +
      '<div class="h5p-blockly-header">' +
        '<span class="h5p-blockly-level-badge">' + this.options.levelName + '</span>' +
        '<h1>Laberinto Blockly</h1>' +
        '<p>' + this.options.taskDescription + '</p>' +
        '<p style="margin-top: 10px;"><strong>Máximo de bloques: ' + this.options.maxBlocks + '</strong></p>' +
        '<p style="margin-top: 5px;"><strong>Solución óptima: ' + this.options.optimalSteps + ' bloques</strong></p>' +
      '</div>' +
      '<div class="h5p-blockly-game-area">' +
        '<canvas class="h5p-blockly-canvas" width="500" height="500"></canvas>' +
        '<div class="h5p-blockly-workspace"></div>' +
      '</div>' +
      '<div class="h5p-blockly-progress-bar">' +
        '<div class="h5p-blockly-progress-bar-fill"></div>' +
      '</div>' +
      '<div class="h5p-blockly-controls">' +
        '<button class="h5p-blockly-btn-start">Iniciar</button>' +
        '<button class="h5p-blockly-btn-help">?</button>' +
      '</div>' +
      '<div class="h5p-blockly-modal h5p-blockly-result-modal">' +
        '<div class="h5p-blockly-modal-content">' +
          '<div class="h5p-blockly-result-emoji"></div>' +
          '<h3 class="h5p-blockly-result-title"></h3>' +
          '<p class="h5p-blockly-result-message"></p>' +
          '<button class="h5p-blockly-btn-start h5p-blockly-btn-close-result">Continuar</button>' +
        '</div>' +
      '</div>' +
      '<div class="h5p-blockly-modal h5p-blockly-help-modal">' +
        '<div class="h5p-blockly-modal-content">' +
          '<h3>¿Cómo usar el editor de piezas?</h3>' +
          '<p>Este editor de programación usa piezas de rompecabezas como bloques para representar conceptos de código.</p>' +
          '<ul>' +
            '<li>Usar el bloque "avanzar" permite avanzar una casilla en el laberinto.</li>' +
            '<li>Cada bloque representa solo un paso o movimiento a la vez.</li>' +
            '<li>Al finalizar, hacer clic en "INICIAR" para ver la ruta trazada.</li>' +
          '</ul>' +
          '<h3>¿Qué es la programación en bloque?</h3>' +
          '<p>La codificación basada en bloques permite a los usuarios aplicar principios de programación, sin preocuparse por la sintaxis.</p>' +
          '<button class="h5p-blockly-btn-start h5p-blockly-btn-close-help">Cerrar</button>' +
        '</div>' +
      '</div>' +
    '</div>';
    
    $container.addClass('h5p-blockly').html(html);
    
    // Cargar Blockly desde CDN
    this.loadBlockly().then(function() {
      self.initMaze();
      self.initBlockly();
      self.attachEvents();
      
      // Mostrar ayuda al inicio
      setTimeout(function() {
        self.showHelp();
      }, 500);
    });
  };
  
  /**
   * Obtener ruta del archivo de la librería
   */
  C.prototype.getLibraryFilePath = function(file) {
    var basePath = '';
    
    // Estrategia 1: Desde H5P.libraryInfo
    if (this.libraryInfo && this.libraryInfo.libraryPath) {
      basePath = this.libraryInfo.libraryPath;
      console.log('Ruta desde libraryInfo:', basePath + file);
      return basePath + file;
    }
    
    // Estrategia 2: Buscar en H5P.libraryPaths
    if (window.H5P && H5P.libraryPaths) {
      if (H5P.libraryPaths['H5P.Blockly-1.0']) {
        basePath = H5P.libraryPaths['H5P.Blockly-1.0'] + '/';
        console.log('Ruta desde H5P.libraryPaths:', basePath + file);
        return basePath + file;
      }
      if (H5P.libraryPaths['H5P.Blockly 1.0']) {
        basePath = H5P.libraryPaths['H5P.Blockly 1.0'] + '/';
        console.log('Ruta desde H5P.libraryPaths (con espacio):', basePath + file);
        return basePath + file;
      }
    }
    
    // Estrategia 3: Detectar desde los scripts cargados
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src;
      if (src && (src.indexOf('H5P.Blockly') > -1 || src.indexOf('blockly.js') > -1)) {
        var pathParts = src.split('/');
        pathParts.pop(); // Remover el nombre del archivo
        basePath = pathParts.join('/') + '/';
        //console.log('Ruta detectada desde script:', basePath + file);
        return basePath + file;
      }
    }
    
    // Estrategia 4: Fallback relativo
    basePath = './H5P.Blockly-1.0/';
    console.log('Ruta fallback (relativa):', basePath + file);
    return basePath + file;
  };

  /**
   * Cargar Blockly desde archivos locales
   */
  C.prototype.loadBlockly = function() {
    var self = this;
    return new Promise(function(resolve) {
      // Si ya está cargado, resolver inmediatamente
      if (typeof Blockly !== 'undefined') {
        // En Blockly 11.0.0+, el generador puede estar en diferentes lugares
        self.javascriptGenerator = window.javascriptGenerator || 
                                   Blockly.JavaScript || 
                                   (Blockly.generator && Blockly.generator.JavaScript);
        resolve();
        return;
      }
      
      // Obtener la ruta base de la librería H5P
      var basePath = self.getLibraryFilePath('');
      //console.log('Base path para Blockly:', basePath);
      
      // Cargar scripts desde archivos locales SECUENCIALMENTE
      var scripts = [
        basePath + 'blockly-lib/blockly.min.js',
        basePath + 'blockly-lib/javascript_compressed.js'
      ];
      
      //console.log('Cargando scripts secuencialmente:', scripts);
      
      // Función para cargar un script y esperar a que termine
      var loadScriptSequentially = function(index) {
        if (index >= scripts.length) {
          // Todos los scripts cargados
          self.javascriptGenerator = window.javascriptGenerator || 
                                     Blockly.JavaScript || 
                                     (Blockly.generator && Blockly.generator.JavaScript);
          //console.log('✅ Todos los scripts de Blockly cargados secuencialmente');
          resolve();
          return;
        }
        
        var src = scripts[index];
        //console.log('⏳ Cargando script ' + (index + 1) + '/' + scripts.length + ':', src);
        
        var script = document.createElement('script');
        script.src = src;
        
        script.onload = function() {
          //console.log('✅ Script ' + (index + 1) + ' cargado:', src);
          
          // Pequeño delay para asegurar que el script se ejecutó completamente
          setTimeout(function() {
            loadScriptSequentially(index + 1);
          }, 50);
        };
        
        script.onerror = function(error) {
          console.error('❌ Error cargando script ' + (index + 1) + ':', src);
          console.error('Error details:', error);
          
          // Si falla el primer script, intentar con CDN
          console.warn('⚠️ Scripts locales fallaron, intentando CDN...');
          self.loadBlocklyFromCDN().then(resolve);
        };
        
        document.head.appendChild(script);
      };
      
      // Iniciar carga secuencial
      loadScriptSequentially(0);
    });
  };
  
  /**
   * Cargar Blockly desde CDN como fallback (SECUENCIAL)
   */
  C.prototype.loadBlocklyFromCDN = function() {
    var self = this;
    return new Promise(function(resolve) {
      var scripts = [
        'https://unpkg.com/blockly@11.0.0/blockly.min.js',
        'https://unpkg.com/blockly@11.0.0/javascript_compressed.js'
      ];
      
      console.log('Cargando Blockly desde CDN secuencialmente:', scripts);
      
      var loadScriptSequentially = function(index) {
        if (index >= scripts.length) {
          self.javascriptGenerator = window.javascriptGenerator || 
                                     Blockly.JavaScript || 
                                     (Blockly.generator && Blockly.generator.JavaScript);
          console.log('✅ Blockly cargado completamente desde CDN');
          resolve();
          return;
        }
        
        var src = scripts[index];
        console.log('⏳ Cargando script CDN ' + (index + 1) + '/' + scripts.length + ':', src);
        
        var script = document.createElement('script');
        script.src = src;
        
        script.onload = function() {
          console.log('✅ Script CDN ' + (index + 1) + ' cargado:', src);
          
          // Delay para asegurar ejecución completa
          setTimeout(function() {
            loadScriptSequentially(index + 1);
          }, 50);
        };
        
        script.onerror = function() {
          console.error('❌ Error cargando desde CDN:', src);
          console.error('⚠️ No se pudo cargar Blockly ni local ni desde CDN');
        };
        
        document.head.appendChild(script);
      };
      
      loadScriptSequentially(0);
    });
  };
  
  /**
   * Inicializar laberinto
   */
  C.prototype.initMaze = function() {
    this.canvas = this.$container.find('.h5p-blockly-canvas')[0];
    this.ctx = this.canvas.getContext('2d');

    // Tamaño fijo inicial del laberinto según configuración
    
    // Encontrar posiciones de inicio y fin
    for (var i = 0; i < this.MAZE_CONFIG.ROWS; i++) {
      for (var j = 0; j < this.MAZE_CONFIG.COLS; j++) {
        if (this.MAZE_CONFIG.map[i][j] === this.MAZE_CONFIG.pathType.START) {
          this.startPosition = { x: j * this.MAZE_CONFIG.SQUARE, y: i * this.MAZE_CONFIG.SQUARE };
          this.playerPosition = { x: this.startPosition.x, y: this.startPosition.y };
        } else if (this.MAZE_CONFIG.map[i][j] === this.MAZE_CONFIG.pathType.FINISH) {
          this.finishPosition = { x: j * this.MAZE_CONFIG.SQUARE, y: i * this.MAZE_CONFIG.SQUARE };
        }
      }
    }
    
    this.drawScene();
  };

  // (Responsividad eliminada)
  
  /**
   * Inicializar Blockly
   */
  C.prototype.initBlockly = function() {
    var self = this;
    
    // Definir bloques personalizados
    Blockly.Blocks['action_forward'] = {
      init: function() {
        this.appendDummyInput().appendField('avanzar');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#EC6043');
        this.setTooltip('Avanzar una casilla');
      }
    };

    Blockly.Blocks['action_turnright'] = {
      init: function() {
        this.appendDummyInput().appendField('Girar a la derecha');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#F3D00C');
        this.setTooltip('Girar 90° a la derecha');
      }
    };

    Blockly.Blocks['action_turnleft'] = {
      init: function() {
        this.appendDummyInput().appendField('Girar a la izquierda');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#75D14A');
        this.setTooltip('Girar 90° a la izquierda');
      }
    };

    // Construir toolbox basado en bloques disponibles
    var toolboxContents = [];
    if (this.options.availableBlocks.turnRight) {
      toolboxContents.push({ kind: 'block', type: 'action_turnright' });
    }
    if (this.options.availableBlocks.forward) {
      toolboxContents.push({ kind: 'block', type: 'action_forward' });
    }
    if (this.options.availableBlocks.turnLeft) {
      toolboxContents.push({ kind: 'block', type: 'action_turnleft' });
    }

    // Crear workspace
    var mediaPath = this.getLibraryFilePath('blockly-lib/media/');
    //console.log('Media path para Blockly:', mediaPath);
    
    this.workspace = Blockly.inject(this.$container.find('.h5p-blockly-workspace')[0], {
      media: mediaPath,
      maxBlocks: this.options.maxBlocks,
      sounds: false, // Deshabilitar todos los sonidos (click.mp3, disconnect.wav, delete.mp3)
      grid: { spacing: 25, length: 3, colour: '#ccc', snap: true },
      toolbox: {
        kind: 'flyoutToolbox',
        contents: toolboxContents
      }
    });
    
    // Configurar escalado responsivo del área de juego
    this.setupResponsiveScale();

    // Registrar generadores de código DESPUÉS de crear el workspace
    // Esto asegura que Blockly esté completamente inicializado
    this.registerCodeGenerators();
  };

  /**
   * Configura el escalado responsivo del área de juego sin cambiar la disposición
   */
  C.prototype.setupResponsiveScale = function() {
    var container = this.$container && this.$container[0];
    if (!container) return;

    var wrapper = container.querySelector('.h5p-blockly-scale-wrapper');
    var gameArea = container.querySelector('.h5p-blockly-game-area');
    if (!wrapper || !gameArea) return;

    // Medir dimensiones base una sola vez
    if (!this._baseGameDims) {
      // Forzar layout antes de medir
      gameArea.style.transform = 'none';
      this._baseGameDims = {
        width: gameArea.offsetWidth,
        height: gameArea.offsetHeight
      };
    }

    var self = this;
    this._resizeHandler = function() {
      // Recalcular tamaño real del canvas/laberinto
      self.updateResponsiveMazeSize();
    };

    // Ejecutar ahora y suscribirse a resize
    this._resizeHandler();
    window.addEventListener('resize', this._resizeHandler);
  };
  
  /**
   * Registrar generadores de código
   */
  C.prototype.registerCodeGenerators = function() {
    var self = this;
    
    // Intentar obtener el generador de múltiples fuentes
    var generator = this.javascriptGenerator || 
                    window.javascriptGenerator || 
                    (typeof Blockly !== 'undefined' ? Blockly.JavaScript : null);
    
    // Verificar que el generador existe
    if (!generator || typeof generator !== 'object') {
      console.warn('Generador de JavaScript no disponible aún, intentando en siguiente tick');
      // Intentar nuevamente en el siguiente tick
      setTimeout(function() {
        self.registerCodeGenerators();
      }, 100);
      return;
    }
    
    // Registrar generadores según la versión de Blockly
    if (generator.forBlock) {
      // Blockly 11.0.0+ - Nuevo formato
      generator.forBlock['action_forward'] = function(block, generator) {
        return 'moveForward();\n';
      };

      generator.forBlock['action_turnright'] = function(block, generator) {
        return 'turnRight();\n';
      };

      generator.forBlock['action_turnleft'] = function(block, generator) {
        return 'turnLeft();\n';
      };
      
      //console.log('Generadores registrados (Blockly 11.0.0+ formato)');
    } else if (typeof Blockly !== 'undefined' && Blockly.JavaScript) {
      // Blockly versiones antiguas - Formato legacy
      Blockly.JavaScript['action_forward'] = function(block) {
        return 'moveForward();\n';
      };

      Blockly.JavaScript['action_turnright'] = function(block) {
        return 'turnRight();\n';
      };

      Blockly.JavaScript['action_turnleft'] = function(block) {
        return 'turnLeft();\n';
      };
      
      console.log('Generadores registrados (Blockly legacy formato)');
    }
  };
  
  /**
   * Adjuntar eventos
   */
  C.prototype.attachEvents = function() {
    var self = this;
    
    this.$container.find('.h5p-blockly-btn-start').first().on('click', function() {
      self.runCode();
    });
    
    this.$container.find('.h5p-blockly-btn-help').on('click', function() {
      self.showHelp();
    });
    
    this.$container.find('.h5p-blockly-btn-close-result').on('click', function() {
      self.closeResultModal();
    });
    
    this.$container.find('.h5p-blockly-btn-close-help').on('click', function() {
      self.closeHelpModal();
    });
  };
  
  /**
   * Dibujar escena
   */
  C.prototype.drawScene = function() {
    this.ctx.clearRect(0, 0, this.MAZE_CONFIG.WIDTH, this.MAZE_CONFIG.HEIGHT);
    
    // Dibujar fondo con celdas coloreadas
    this.ctx.fillStyle = '#e8f4f8';
    this.ctx.fillRect(0, 0, this.MAZE_CONFIG.WIDTH, this.MAZE_CONFIG.HEIGHT);
    
    // Dibujar celdas
    for (var i = 0; i < this.MAZE_CONFIG.ROWS; i++) {
      for (var j = 0; j < this.MAZE_CONFIG.COLS; j++) {
        var x = j * this.MAZE_CONFIG.SQUARE;
        var y = i * this.MAZE_CONFIG.SQUARE;
        var cellType = this.MAZE_CONFIG.map[i][j];
        
        if (cellType === this.MAZE_CONFIG.pathType.WALL) {
          this.ctx.fillStyle = '#333';
        } else if (cellType === this.MAZE_CONFIG.pathType.START) {
          this.ctx.fillStyle = '#75D14A';
        } else if (cellType === this.MAZE_CONFIG.pathType.FINISH) {
          this.ctx.fillStyle = '#EC6043';
        } else {
          this.ctx.fillStyle = '#fff';
        }
        
        this.ctx.fillRect(x, y, this.MAZE_CONFIG.SQUARE, this.MAZE_CONFIG.SQUARE);
        this.ctx.strokeStyle = '#ccc';
        this.ctx.strokeRect(x, y, this.MAZE_CONFIG.SQUARE, this.MAZE_CONFIG.SQUARE);
        
        // Letras A y B
        this.ctx.fillStyle = cellType === this.MAZE_CONFIG.pathType.FINISH ? '#fff' : '#000';
        this.ctx.font = 'bold 16px Arial';
        if (cellType === this.MAZE_CONFIG.pathType.START) {
          this.ctx.fillText('A', x + 20, y + 30);
        } else if (cellType === this.MAZE_CONFIG.pathType.FINISH) {
          this.ctx.fillText('B', x + 20, y + 30);
        }
      }
    }
    
    this.drawPlayer();
  };
  
  /**
   * Dibujar jugador (círculo azul con flecha direccional)
   */
  C.prototype.drawPlayer = function() {
    var x = this.playerPosition.x + this.MAZE_CONFIG.SQUARE / 2;
    var y = this.playerPosition.y + this.MAZE_CONFIG.SQUARE / 2;
    
    // Círculo azul
    this.ctx.fillStyle = '#003da5';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 15, 0, 2 * Math.PI);
    this.ctx.fill();
    
    // Flecha de dirección
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    
    var arrowSize = 10;
    switch(this.currentDirection) {
      case this.MAZE_CONFIG.directionType.NORTH:
        this.ctx.moveTo(x, y - arrowSize);
        this.ctx.lineTo(x, y + arrowSize);
        this.ctx.moveTo(x, y - arrowSize);
        this.ctx.lineTo(x - 5, y - 5);
        this.ctx.moveTo(x, y - arrowSize);
        this.ctx.lineTo(x + 5, y - 5);
        break;
      case this.MAZE_CONFIG.directionType.EAST:
        this.ctx.moveTo(x + arrowSize, y);
        this.ctx.lineTo(x - arrowSize, y);
        this.ctx.moveTo(x + arrowSize, y);
        this.ctx.lineTo(x + 5, y - 5);
        this.ctx.moveTo(x + arrowSize, y);
        this.ctx.lineTo(x + 5, y + 5);
        break;
      case this.MAZE_CONFIG.directionType.SOUTH:
        this.ctx.moveTo(x, y + arrowSize);
        this.ctx.lineTo(x, y - arrowSize);
        this.ctx.moveTo(x, y + arrowSize);
        this.ctx.lineTo(x - 5, y + 5);
        this.ctx.moveTo(x, y + arrowSize);
        this.ctx.lineTo(x + 5, y + 5);
        break;
      case this.MAZE_CONFIG.directionType.WEST:
        this.ctx.moveTo(x - arrowSize, y);
        this.ctx.lineTo(x + arrowSize, y);
        this.ctx.moveTo(x - arrowSize, y);
        this.ctx.lineTo(x - 5, y - 5);
        this.ctx.moveTo(x - arrowSize, y);
        this.ctx.lineTo(x - 5, y + 5);
        break;
    }
    this.ctx.stroke();
  };
  
  /**
   * Mover hacia adelante
   */
  C.prototype.moveForward = function() {
    var newX = this.playerPosition.x;
    var newY = this.playerPosition.y;
    
    switch(this.currentDirection) {
      case this.MAZE_CONFIG.directionType.NORTH:
        newY -= this.MAZE_CONFIG.SQUARE;
        break;
      case this.MAZE_CONFIG.directionType.EAST:
        newX += this.MAZE_CONFIG.SQUARE;
        break;
      case this.MAZE_CONFIG.directionType.SOUTH:
        newY += this.MAZE_CONFIG.SQUARE;
        break;
      case this.MAZE_CONFIG.directionType.WEST:
        newX -= this.MAZE_CONFIG.SQUARE;
        break;
    }
    
    var i = Math.round(newY / this.MAZE_CONFIG.SQUARE);
    var j = Math.round(newX / this.MAZE_CONFIG.SQUARE);
    
    if (i < 0 || i >= this.MAZE_CONFIG.ROWS || j < 0 || j >= this.MAZE_CONFIG.COLS ||
        this.MAZE_CONFIG.map[i][j] === this.MAZE_CONFIG.pathType.WALL) {
      this.result = this.MAZE_CONFIG.resultType.CRASH;
      return;
    }
    
    this.playerPosition.x = newX;
    this.playerPosition.y = newY;
  };
  
  /**
   * Girar a la derecha
   */
  C.prototype.turnRight = function() {
    this.currentDirection = (this.currentDirection + 1) % 4;
  };
  
  /**
   * Girar a la izquierda
   */
  C.prototype.turnLeft = function() {
    this.currentDirection = (this.currentDirection + 3) % 4;
  };
  
  /**
   * Ejecutar código
   */
  C.prototype.runCode = function() {
    if (this.isRunning) return;
    
    var self = this;
    this.isRunning = true;
    this.$container.find('.h5p-blockly-btn-start').first().prop('disabled', true);
    this.$container.find('.h5p-blockly-progress-bar').addClass('active');
    
    // Reset
    this.playerPosition = { x: this.startPosition.x, y: this.startPosition.y };
    this.currentDirection = parseInt(this.options.initialDirection);
    this.result = this.MAZE_CONFIG.resultType.UNSET;
    this.executedSteps = 0; // Contador de pasos ejecutados
    this.executedBlocksSequence = []; // Secuencia de bloques ejecutados para xAPI response
    this.drawScene();
    
    // Asegurar que el generador esté disponible
    if (!this.javascriptGenerator) {
      this.javascriptGenerator = window.javascriptGenerator || 
                                 Blockly.JavaScript || 
                                 (Blockly.generator && Blockly.generator.JavaScript);
    }
    
    // Verificar que el generador esté disponible
    if (!this.javascriptGenerator) {
      console.error('El generador de JavaScript de Blockly no está disponible');
      this.$container.find('.h5p-blockly-progress-bar').removeClass('active');
      this.$container.find('.h5p-blockly-btn-start').first().prop('disabled', false);
      this.isRunning = false;
      return;
    }
    
    var code = this.javascriptGenerator.workspaceToCode(this.workspace);
    
    // Crear funciones wrapper para bindear el contexto
    var moveForward = function() { self.moveForward(); };
    var turnRight = function() { self.turnRight(); };
    var turnLeft = function() { self.turnLeft(); };
    
    // Ejecutar código usando eval seguro (solo para bloques generados por Blockly)
    try {
      var steps = [];
      var lines = code.split('\n').filter(function(line) { return line.trim(); });
      
      var executeStep = function(index) {
        if (index >= lines.length || self.result !== self.MAZE_CONFIG.resultType.UNSET) {
          self.checkResult();
          self.showResult();
          self.$container.find('.h5p-blockly-progress-bar').removeClass('active');
          self.$container.find('.h5p-blockly-btn-start').first().prop('disabled', false);
          self.isRunning = false;
          return;
        }
        
        // Detectar qué tipo de bloque se ejecutará para rastrear la secuencia
        var line = lines[index].trim();
        var blockType = null;
        if (line.indexOf('moveForward()') !== -1) {
          blockType = 'forward';
        } else if (line.indexOf('turnRight()') !== -1) {
          blockType = 'turnRight';
        } else if (line.indexOf('turnLeft()') !== -1) {
          blockType = 'turnLeft';
        }
        
        // Ejecutar el paso
        eval(lines[index]);
        
        // Incrementar contador solo si el paso se ejecutó exitosamente (sin crash)
        // Si hay crash, result será CRASH y no se cuenta este paso
        if (self.result === self.MAZE_CONFIG.resultType.UNSET) {
          self.executedSteps++;
          // Registrar el bloque ejecutado para xAPI response
          if (blockType) {
            self.executedBlocksSequence.push(blockType);
          }
        }
        
        self.drawScene();
        
        setTimeout(function() {
          executeStep(index + 1);
        }, self.options.animationSpeed);
      };
      
      executeStep(0);
      
    } catch (e) {
      console.error('Error al ejecutar código:', e);
      this.$container.find('.h5p-blockly-progress-bar').removeClass('active');
      this.$container.find('.h5p-blockly-btn-start').first().prop('disabled', false);
      this.isRunning = false;
    }
  };
  
  /**
   * Calculate optimal path from START to FINISH using BFS
   * Returns array of coordinates representing the path
   * 
   * @return {Array} Array of {row, col} objects representing the optimal path
   */
  C.prototype.calculateOptimalPath = function() {
    var map = this.MAZE_CONFIG.map;
    var rows = this.MAZE_CONFIG.ROWS;
    var cols = this.MAZE_CONFIG.COLS;
    var WALL = this.MAZE_CONFIG.pathType.WALL;
    var FINISH = this.MAZE_CONFIG.pathType.FINISH;
    
    // Find START and FINISH positions
    var start = null;
    var finish = null;
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        if (map[i][j] === this.MAZE_CONFIG.pathType.START) {
          start = { row: i, col: j };
        }
        if (map[i][j] === FINISH) {
          finish = { row: i, col: j };
        }
      }
    }
    
    if (!start || !finish) {
      return [];
    }
    
    // BFS to find shortest path
    var queue = [{ row: start.row, col: start.col, path: [{ row: start.row, col: start.col }] }];
    var visited = {};
    visited[start.row + ',' + start.col] = true;
    
    var directions = [
      { dr: -1, dc: 0 }, // NORTH
      { dr: 0, dc: 1 },  // EAST
      { dr: 1, dc: 0 },  // SOUTH
      { dr: 0, dc: -1 }  // WEST
    ];
    
    while (queue.length > 0) {
      var current = queue.shift();
      
      // Check if reached finish
      if (current.row === finish.row && current.col === finish.col) {
        return current.path;
      }
      
      // Explore neighbors
      for (var d = 0; d < directions.length; d++) {
        var newRow = current.row + directions[d].dr;
        var newCol = current.col + directions[d].dc;
        var key = newRow + ',' + newCol;
        
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols &&
            !visited[key] && map[newRow][newCol] !== WALL) {
          visited[key] = true;
          var newPath = current.path.slice();
          newPath.push({ row: newRow, col: newCol });
          queue.push({ row: newRow, col: newCol, path: newPath });
        }
      }
    }
    
    return [];
  };

  /**
   * Convert path coordinates to block sequence (forward, turnRight, turnLeft)
   * 
   * @param {Array} path - Array of {row, col} objects
   * @param {number} initialDirection - Initial facing direction (0=NORTH, 1=EAST, 2=SOUTH, 3=WEST)
   * @return {Array} Array of block IDs: 'forward', 'turnRight', 'turnLeft'
   */
  C.prototype.pathToBlockSequence = function(path, initialDirection) {
    if (path.length < 2) {
      return [];
    }
    
    var sequence = [];
    var currentDir = initialDirection;
    var NORTH = this.MAZE_CONFIG.directionType.NORTH;
    var EAST = this.MAZE_CONFIG.directionType.EAST;
    var SOUTH = this.MAZE_CONFIG.directionType.SOUTH;
    var WEST = this.MAZE_CONFIG.directionType.WEST;
    
    for (var i = 1; i < path.length; i++) {
      var prev = path[i - 1];
      var curr = path[i];
      
      // Calculate required direction
      var dr = curr.row - prev.row;
      var dc = curr.col - prev.col;
      var requiredDir;
      
      if (dr === -1 && dc === 0) requiredDir = NORTH;
      else if (dr === 0 && dc === 1) requiredDir = EAST;
      else if (dr === 1 && dc === 0) requiredDir = SOUTH;
      else if (dr === 0 && dc === -1) requiredDir = WEST;
      else continue;
      
      // Turn until facing the required direction
      while (currentDir !== requiredDir) {
        // Calculate turns needed
        var diff = (requiredDir - currentDir + 4) % 4;
        if (diff === 1) {
          sequence.push('turnRight');
          currentDir = (currentDir + 1) % 4;
        } else if (diff === 3) {
          sequence.push('turnLeft');
          currentDir = (currentDir + 3) % 4;
        } else {
          // 180 degrees turn - use two right turns
          sequence.push('turnRight');
          sequence.push('turnRight');
          currentDir = (currentDir + 2) % 4;
        }
      }
      
      // Move forward
      sequence.push('forward');
    }
    
    return sequence;
  };

  /**
   * Get object definition for xAPI statement.
   * Similar to H5P.DragShuffle implementation.
   * 
   * @return {Object} xAPI object definition
   */
  C.prototype.getXAPIDefinition = function () {
    var definition = {};
    var title = this.options.levelName || 'Blockly Maze';
    var description = this.options.taskDescription || 'Ayuda al personaje a llegar al punto B utilizando los bloques.';
    
    definition.description = {
      // Remove tags, must wrap in div tag because jQuery 1.9 will crash if the string isn't wrapped in a tag.
      'en-US': $('<div>' + description + '</div>').text()
    };
    
    definition.type = 'http://adlnet.gov/expapi/activities/cmi.interaction';
    definition.interactionType = 'sequencing';
    definition.name = {
      'en-US': $('<div>' + title + '</div>').text()
    };
    
    // Add choices: available blocks
    definition.choices = [];
    if (this.options.availableBlocks) {
      if (this.options.availableBlocks.forward) {
        definition.choices.push({
          id: 'forward',
          description: {
            'en-US': 'Move Forward'
          }
        });
      }
      if (this.options.availableBlocks.turnRight) {
        definition.choices.push({
          id: 'turnRight',
          description: {
            'en-US': 'Turn Right'
          }
        });
      }
      if (this.options.availableBlocks.turnLeft) {
        definition.choices.push({
          id: 'turnLeft',
          description: {
            'en-US': 'Turn Left'
          }
        });
      }
    }
    
    // Add correctResponsePattern: optimal solution sequence calculated from actual maze
    // Format: "choiceId1[,]choiceId2[,]choiceId3..." representing the optimal steps
    definition.correctResponsesPattern = [];
    
    // Calculate the actual optimal path from START to FINISH
    var optimalPath = this.calculateOptimalPath();
    if (optimalPath.length > 0) {
      // Convert path to block sequence
      var initialDir = parseInt(this.options.initialDirection);
      var optimalBlockSequence = this.pathToBlockSequence(optimalPath, initialDir);
      
      if (optimalBlockSequence.length > 0) {
        // Format as xAPI response pattern
        definition.correctResponsesPattern.push(optimalBlockSequence.join('[,]'));
      }
    }
    
    return definition;
  };

  // addQuestionToXAPI ya está definido arriba después de la herencia
  // Esta es solo una referencia para documentación

  // La sobrescritura de createXAPIEventTemplate ya se hace arriba después de la herencia
  // para asegurar que capture TODOS los eventos desde el inicio, incluido "attempted"

  /**
   * Get what the user has answered encoded as an xAPI response pattern
   * Similar to H5P.DragShuffle implementation.
   * 
   * @return {string} xAPI encoded user response pattern
   */
  C.prototype.getUserXAPIResponse = function () {
    if (!this.executedBlocksSequence || this.executedBlocksSequence.length === 0) {
      return '';
    }
    
    // Formatear la secuencia de bloques ejecutados en formato xAPI
    // Format: "choiceId1[,]choiceId2[,]choiceId3"
    return this.executedBlocksSequence.join('[,]');
  };

  /**
   * Add the response part to an xAPI event
   * Similar to H5P.DragShuffle implementation.
   * 
   * @param {H5P.XAPIEvent} xAPIEvent - The xAPI event we will add a response to
   */
  C.prototype.addResponseToXAPI = function(xAPIEvent) {
    if (xAPIEvent && xAPIEvent.data && xAPIEvent.data.statement && xAPIEvent.data.statement.result) {
      xAPIEvent.data.statement.result.response = this.getUserXAPIResponse();
    }
  };

  /**
   * Verificar resultado
   */
  C.prototype.checkResult = function() {
    if (this.result === this.MAZE_CONFIG.resultType.UNSET) {
      var i = this.playerPosition.y / this.MAZE_CONFIG.SQUARE;
      var j = this.playerPosition.x / this.MAZE_CONFIG.SQUARE;
      
      if (this.MAZE_CONFIG.map[i][j] === this.MAZE_CONFIG.pathType.FINISH) {
        this.result = this.MAZE_CONFIG.resultType.SUCCESS;
        
        // Calcular puntuación basada en la eficiencia
        var blocksUsed = this.workspace ? this.workspace.getAllBlocks().length : 0;
        var optimalSteps = this.options.optimalSteps;
        
        // Sistema de puntuación:
        // - Si usa <= pasos óptimos: puntuación perfecta (maxScore)
        // - Si usa más: puntuación proporcional descendente
        if (blocksUsed <= optimalSteps) {
          this.score = this.maxScore;
        } else {
          // Calcular puntuación proporcional
          // Ejemplo: óptimo=7, usó=10, maxScore=7
          // score = 7 * (7/10) = 4.9 ≈ 5
          this.score = Math.max(1, Math.round(this.maxScore * (optimalSteps / blocksUsed)));
        }
      } else {
        this.result = this.MAZE_CONFIG.resultType.FAILURE;
        // Calcular score basado en pasos ejecutados vs pasos totales/óptimos
        var totalBlocks = this.workspace ? this.workspace.getAllBlocks().length : 0;
        var optimalSteps = this.options.optimalSteps;
        var totalSteps = Math.max(totalBlocks, optimalSteps);
        
        if (this.executedSteps > 0 && totalSteps > 0) {
          // Calcular proporción de pasos correctos ejecutados
          // Usar el menor entre executedSteps y totalSteps para evitar scores > 1
          var proportion = Math.min(this.executedSteps, totalSteps) / totalSteps;
          this.score = Math.max(1, Math.round(this.maxScore * proportion));
        } else {
          this.score = 0;
        }
      }
    }
    
    // Calcular score para casos de CRASH basado en pasos ejecutados
    if (this.result === this.MAZE_CONFIG.resultType.CRASH) {
      var totalBlocks = this.workspace ? this.workspace.getAllBlocks().length : 0;
      var optimalSteps = this.options.optimalSteps;
      var totalSteps = Math.max(totalBlocks, optimalSteps);
      
      if (this.executedSteps > 0 && totalSteps > 0) {
        // Calcular proporción de pasos ejecutados antes del crash
        var proportion = Math.min(this.executedSteps, totalSteps) / totalSteps;
        this.score = Math.max(1, Math.round(this.maxScore * proportion));
      } else {
        this.score = 0;
      }
    }
    
    // Disparar statement xAPI con verbo 'answered' siempre, independientemente del resultado
    // Esto permite registrar tanto éxitos como errores en el LRS
    (function(instance){
      if (typeof instance.trigger !== 'function') return;
      var evt = null;
      if (typeof instance.createXAPIEventTemplate === 'function') {
        evt = instance.createXAPIEventTemplate('answered');
      } else if (typeof H5P !== 'undefined' && typeof H5P.createXAPIEventTemplate === 'function') {
        evt = H5P.createXAPIEventTemplate('answered');
      }
      if (!evt) return;
      
      // La definición del objeto (question) se agrega automáticamente
      // en createXAPIEventTemplate, pero por si acaso también la agregamos aquí
      if (typeof instance.addQuestionToXAPI === 'function') {
        instance.addQuestionToXAPI(evt);
      }
      
      if (typeof evt.setScoredResult === 'function') {
        var success = (instance.result === instance.MAZE_CONFIG.resultType.SUCCESS && instance.score >= instance.maxScore);
        // completed=true porque finaliza el intento (tanto si es exitoso como si falla)
        evt.setScoredResult(instance.score, instance.maxScore, instance, true, success);
      }
      
      // Agregar el response al result del statement xAPI
      if (typeof instance.addResponseToXAPI === 'function') {
        instance.addResponseToXAPI(evt);
      }
      
      instance.trigger(evt);
    })(this);
  };
  
  /**
   * Mostrar resultado
   */
  C.prototype.showResult = function() {
    var $modal = this.$container.find('.h5p-blockly-result-modal');
    var $emoji = $modal.find('.h5p-blockly-result-emoji');
    var $title = $modal.find('.h5p-blockly-result-title');
    var $message = $modal.find('.h5p-blockly-result-message');
    
    if (this.result === this.MAZE_CONFIG.resultType.SUCCESS) {
      // Emoji de éxito
      $emoji.text('🎉');
      $title.text('¡Éxito!');
      
      // Mostrar mensaje con puntuación
      var blocksUsed = this.workspace ? this.workspace.getAllBlocks().length : 0;
      var optimalSteps = this.options.optimalSteps;
      var messageText = this.options.successMessage;
      
      // Agregar información de eficiencia
      if (blocksUsed <= optimalSteps) {
        messageText += '<br><br><strong>¡Solución óptima!</strong><br>Usaste ' + blocksUsed + ' bloques (óptimo: ' + optimalSteps + ')';
        messageText += '<br>Puntuación: ' + this.score + '/' + this.maxScore;
      } else {
        messageText += '<br><br>Usaste ' + blocksUsed + ' bloques (óptimo: ' + optimalSteps + ')';
        messageText += '<br>Puntuación: ' + this.score + '/' + this.maxScore;
        messageText += '<br><em>¿Puedes hacerlo con menos bloques?</em>';
      }
      
      $message.html(messageText);
    } else {
      // Emoji de fallo
      $emoji.text('❌');
      $title.text('Intenta nuevamente');
      
      if (this.result === this.MAZE_CONFIG.resultType.CRASH) {
        $message.text(this.options.crashMessage);
      } else {
        $message.text(this.options.failureMessage);
      }
    }
    
    $modal.addClass('active');
  };
  
  /**
   * Cerrar modal de resultado
   */
  C.prototype.closeResultModal = function() {
    this.$container.find('.h5p-blockly-result-modal').removeClass('active');
  };
  
  /**
   * Mostrar ayuda
   */
  C.prototype.showHelp = function() {
    this.$container.find('.h5p-blockly-help-modal').addClass('active');
  };
  
  /**
   * Cerrar modal de ayuda
   */
  C.prototype.closeHelpModal = function() {
    this.$container.find('.h5p-blockly-help-modal').removeClass('active');
  };

  // ========== MÉTODOS REQUERIDOS POR H5P.Question ==========
  
  /**
   * Obtener la puntuación actual
   * @returns {number}
   */
  C.prototype.getScore = function() {
    return this.score;
  };

  /**
   * Obtener la puntuación máxima posible
   * @returns {number}
   */
  C.prototype.getMaxScore = function() {
    return this.maxScore;
  };

  /**
   * Mostrar soluciones (no aplicable - cada laberinto tiene múltiples soluciones)
   */
  C.prototype.showSolutions = function() {
    // No aplicable para este tipo de ejercicio
  };

  /**
   * Resetear la tarea
   */
  C.prototype.resetTask = function() {
    // Limpiar workspace de Blockly
    if (this.workspace) {
      this.workspace.clear();
    }
    
    // Resetear puntuación
    this.score = 0;
    this.result = this.MAZE_CONFIG.resultType.UNSET;
    
    // Resetear posición del personaje
    this.playerPosition = { x: this.startPosition.x, y: this.startPosition.y };
    this.currentDirection = parseInt(this.options.initialDirection);
    
    // Redibujar escena
    this.drawScene();
    
    // Habilitar botón de inicio
    this.$container.find('.h5p-blockly-btn-start').first().prop('disabled', false);
  };

  /**
   * Verificar si la respuesta ha sido dada
   * @returns {boolean}
   */
  C.prototype.getAnswerGiven = function() {
    return this.score > 0;
  };

  return C;
})(H5P.jQuery, H5P.Question);


