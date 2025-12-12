var H5P = H5P || {};

H5P.Blockly = (function ($, Question) {
  'use strict';

  /**
   * Constructor function.
   */
  function C(options, contentId, contentData) {
    var self = this;
    
    // Llamar al constructor de H5P.Question
    Question.call(self, 'blockly');
    
    this.contentId = contentId;
    this.contentData = contentData;
    
    // Parámetros configurables desde el editor H5P
    this.options = $.extend(true, {}, {
      taskDescription: 'Ayuda al personaje a llegar al punto B utilizando los bloques.',
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
      failureMessage: 'El personaje no llegó al destino. Revisa tu secuencia de bloques.',
      crashMessage: 'El personaje chocó con un muro. Revisa tu secuencia de bloques.',
      animationSpeed: 300
    }, options);
    
    // Estadísticas para xAPI
    this.score = 0;
    this.maxScore = 1;
    
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
    
    // Imágenes
    this.images = {
      idle: null,
      frontJump: null,
      backJump: null,
      rightJump: null,
      leftJump: null,
      turn: null,
      bg: null,
      success: null,
      fail: null,
      loaded: false
    };
    
    this.SPRITE_WIDTH = 150;
    this.SPRITE_HEIGHT_IDLE = 210;
    
    // Parsear el mapa desde JSON
    try {
      this.MAZE_CONFIG.map = JSON.parse(this.options.mazeMap);
    } catch (e) {
      console.error('Error al parsear el mapa del laberinto:', e);
      // Usar mapa por defecto
      this.MAZE_CONFIG.map = [
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
      ];
    }
  }
  
  // Heredar de H5P.Question
  C.prototype = Object.create(Question.prototype);
  C.prototype.constructor = C;

  /**
   * Registrar elementos DOM - Requerido por H5P.Question
   */
  C.prototype.registerDomElements = function () {
    var self = this;
    
    // Crear el contenedor principal
    var $container = $('<div>', {
      'class': 'h5p-blockly-wrapper'
    });
    
    // Registrar el contenido principal
    this.setContent($container);
    
    // Inicializar el juego dentro del contenedor
    this.initializeGame($container);
  };

  /**
   * Inicializar el juego
   */
  C.prototype.initializeGame = function ($container) {
    var self = this;
    this.$container = $container;
    
    // Crear estructura HTML
    var html = '<div class="h5p-blockly-container">' +
      '<div class="h5p-blockly-header">' +
        '<span class="h5p-blockly-level-badge">' + this.options.levelName + '</span>' +
        '<h1>Laberinto Blockly</h1>' +
        '<p>' + this.options.taskDescription + '</p>' +
        '<p style="margin-top: 10px;"><strong>Máximo de bloques: ' + this.options.maxBlocks + '</strong></p>' +
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
      self.loadImages().then(function() {
        self.initMaze();
        self.initBlockly();
        self.attachEvents();
        
        // Mostrar ayuda al inicio
        setTimeout(function() {
          self.showHelp();
        }, 500);
      });
    });
  };
  
  /**
   * Cargar Blockly desde CDN
   */
  C.prototype.loadBlockly = function() {
    var self = this;
    return new Promise(function(resolve) {
      // Si ya está cargado, resolver inmediatamente
      if (typeof Blockly !== 'undefined') {
        self.javascriptGenerator = Blockly.JavaScript;
        resolve();
        return;
      }
      
      // Cargar scripts
      var scripts = [
        'https://unpkg.com/blockly@11.0.0/blockly.min.js',
        'https://unpkg.com/blockly@11.0.0/javascript_compressed.js'
      ];
      
      var loadedCount = 0;
      scripts.forEach(function(src) {
        var script = document.createElement('script');
        script.src = src;
        script.onload = function() {
          loadedCount++;
          if (loadedCount === scripts.length) {
            self.javascriptGenerator = Blockly.JavaScript;
            resolve();
          }
        };
        document.head.appendChild(script);
      });
    });
  };
  
  /**
   * Cargar imágenes
   */
  C.prototype.loadImages = function() {
    var self = this;
    return new Promise(function(resolve) {
      var basePath = H5P.getPath('images', self.contentId) || 'images/';
      
      var imagesToLoad = [
        { key: 'idle', src: basePath + 'idle.png' },
        { key: 'frontJump', src: basePath + 'front_jump.png' },
        { key: 'backJump', src: basePath + 'back_jump.png' },
        { key: 'rightJump', src: basePath + 'right_jump.png' },
        { key: 'leftJump', src: basePath + 'left_jump.png' },
        { key: 'turn', src: basePath + 'turn.png' },
        { key: 'bg', src: basePath + 'level1.png' },
        { key: 'success', src: basePath + 'success.png' },
        { key: 'fail', src: basePath + 'fail.png' }
      ];
      
      var loadedCount = 0;
      
      imagesToLoad.forEach(function(item) {
        var img = new Image();
        img.onload = function() {
          self.images[item.key] = img;
          loadedCount++;
          if (loadedCount === imagesToLoad.length) {
            self.images.loaded = true;
            resolve();
          }
        };
        img.onerror = function() {
          console.warn('No se pudo cargar: ' + item.src);
          loadedCount++;
          if (loadedCount === imagesToLoad.length) {
            self.images.loaded = true;
            resolve();
          }
        };
        img.src = item.src;
      });
    });
  };
  
  /**
   * Inicializar laberinto
   */
  C.prototype.initMaze = function() {
    this.canvas = this.$container.find('.h5p-blockly-canvas')[0];
    this.ctx = this.canvas.getContext('2d');
    
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

    // Generadores de código
    self.javascriptGenerator.forBlock['action_forward'] = function(block) {
      return 'moveForward();\n';
    };

    self.javascriptGenerator.forBlock['action_turnright'] = function(block) {
      return 'turnRight();\n';
    };

    self.javascriptGenerator.forBlock['action_turnleft'] = function(block) {
      return 'turnLeft();\n';
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
    this.workspace = Blockly.inject(this.$container.find('.h5p-blockly-workspace')[0], {
      media: 'https://unpkg.com/blockly@11.0.0/media/',
      maxBlocks: this.options.maxBlocks,
      grid: { spacing: 25, length: 3, colour: '#ccc', snap: true },
      toolbox: {
        kind: 'flyoutToolbox',
        contents: toolboxContents
      }
    });
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
    
    // Dibujar fondo
    if (this.images.loaded && this.images.bg) {
      this.ctx.drawImage(this.images.bg, 0, 0, this.MAZE_CONFIG.WIDTH, this.MAZE_CONFIG.HEIGHT);
    } else {
      // Fondo de respaldo
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
    }
    
    this.drawPlayer();
  };
  
  /**
   * Dibujar jugador
   */
  C.prototype.drawPlayer = function() {
    if (this.images.loaded && this.images.idle) {
      var x = this.playerPosition.x;
      var y = this.playerPosition.y;
      
      // Calcular la posición X en el sprite sheet según la dirección
      var spriteX = 0;
      switch(this.currentDirection) {
        case this.MAZE_CONFIG.directionType.NORTH:
          spriteX = 0;
          break;
        case this.MAZE_CONFIG.directionType.EAST:
          spriteX = this.SPRITE_WIDTH;
          break;
        case this.MAZE_CONFIG.directionType.SOUTH:
          spriteX = 2 * this.SPRITE_WIDTH;
          break;
        case this.MAZE_CONFIG.directionType.WEST:
          spriteX = 3 * this.SPRITE_WIDTH;
          break;
      }
      
      // Dibujar sprite
      var spriteDisplayHeight = 70;
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.drawImage(
        this.images.idle,
        spriteX, 0,
        this.SPRITE_WIDTH, this.SPRITE_HEIGHT_IDLE,
        x, y - spriteDisplayHeight + this.MAZE_CONFIG.SQUARE,
        this.MAZE_CONFIG.SQUARE, spriteDisplayHeight
      );
    } else {
      // Fallback: círculo simple
      var x = this.playerPosition.x + this.MAZE_CONFIG.SQUARE / 2;
      var y = this.playerPosition.y + this.MAZE_CONFIG.SQUARE / 2;
      
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
    }
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
    
    var i = newY / this.MAZE_CONFIG.SQUARE;
    var j = newX / this.MAZE_CONFIG.SQUARE;
    
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
    this.drawScene();
    
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
        
        eval(lines[index]);
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
   * Verificar resultado
   */
  C.prototype.checkResult = function() {
    if (this.result === this.MAZE_CONFIG.resultType.UNSET) {
      var i = this.playerPosition.y / this.MAZE_CONFIG.SQUARE;
      var j = this.playerPosition.x / this.MAZE_CONFIG.SQUARE;
      
      if (this.MAZE_CONFIG.map[i][j] === this.MAZE_CONFIG.pathType.FINISH) {
        this.result = this.MAZE_CONFIG.resultType.SUCCESS;
        this.score = 1;
        // Disparar evento xAPI de completado
        this.triggerXAPICompleted(this.score, this.maxScore);
      } else {
        this.result = this.MAZE_CONFIG.resultType.FAILURE;
        this.score = 0;
      }
    }
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
      if (this.images.loaded && this.images.success) {
        $emoji.html('<img src="' + this.images.success.src + '" style="max-width: 300px;">');
      } else {
        $emoji.text('🎉');
      }
      $title.text('¡Éxito!');
      $message.text(this.options.successMessage);
    } else {
      if (this.images.loaded && this.images.fail) {
        $emoji.html('<img src="' + this.images.fail.src + '" style="max-width: 300px;">');
      } else {
        $emoji.text('❌');
      }
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


