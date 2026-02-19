var H5P = H5P || {};

H5P.PipeFlow = (function ($, Question) {
  'use strict';

  // Tipos de celdas
  const CELL_TYPES = {
    EMPTY: 0,
    SOURCE: 1,
    DESTINATION: 2,
    VALVE_H: 3,
    VALVE_V: 4,
    VALVE_CROSS: 5,
    VALVE_T_SOUTH: 6,
    VALVE_T_EAST: 7,
    VALVE_T_NORTH: 8,
    VALVE_T_WEST: 9,
    VALVE_L_SE: 10,
    VALVE_L_NE: 11,
    VALVE_L_NW: 12,
    VALVE_L_SW: 13,
    PIPE_H: 14,
    PIPE_V: 15,
    PIPE_CROSS: 16,
    PIPE_T_SOUTH: 17,
    PIPE_T_EAST: 18,
    PIPE_T_NORTH: 19,
    PIPE_T_WEST: 20,
    PIPE_L_SE: 21,
    PIPE_L_NE: 22,
    PIPE_L_NW: 23,
    PIPE_L_SW: 24
  };

  /**
   * Constructor principal
   */
  function PipeFlow(options, id) {
    const self = this;
    
    // Llamar al constructor padre
    Question.call(self, 'pipe-flow');
    
    // Opciones con valores por defecto
    self.options = $.extend(true, {}, {
      instructions: 'Activa y desactiva las válvulas para controlar el flujo de agua desde la fuente hasta el destino.',
      gameConfig: '[[1, 17, 14, 3, 14, 24, 0, 0, 0, 0], [0, 22, 14, 14, 14, 5, 14, 3, 14, 24], [0, 0, 0, 0, 0, 4, 0, 0, 0, 15], [0, 0, 0, 0, 0, 22, 14, 14, 6, 23], [0, 0, 0, 0, 0, 0, 0, 0, 7, 3], [0, 0, 0, 0, 0, 0, 0, 0, 7, 3], [0, 0, 0, 0, 21, 14, 14, 14, 23, 0], [0, 0, 0, 0, 2, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]',
      messages: {
        successMessage: '¡Felicidades! El agua llegó al destino 🎉',
        failureMessage: 'El agua no puede llegar al destino. Abre más válvulas.',
        leakMessage: 'El agua se escapa del circuito. Hay tuberías conectadas que no llevan al destino.',
        noPathMessage: 'No hay camino desde la fuente al destino. Abre más válvulas.',
        deadEndMessage: 'El agua llegó a un callejón sin salida. Hay tuberías que no llevan al destino.'
      },
      settings: {
        animationSpeed: 100,
        showPathInfo: true,
        canvasSize: 450
      },
      behaviour: {
        enableRetry: true
      },
      scoring: {
        enablePenalty: false
      }
    }, options);

    // Parsear gameConfig desde string JSON
    try {
      self.gameConfig = JSON.parse(self.options.gameConfig);
    } catch (e) {
      console.error('Error parsing gameConfig:', e);
      self.gameConfig = [[1, 0, 2], [0, 0, 0], [0, 0, 0]];
    }

    // Estado del juego
    self.gameState = {
      grid: [],
      source: null,
      destination: null,
      valves: new Map(),
      waterPath: [],
      isRunning: false,
      gameWon: false,
      hoveredCell: null,
      gridSize: 0,
      leakCell: null,
      animationTime: 0
    };

    // Puntuación
    self.score = 0;
    self.maxScore = 0;

    // Referencias a elementos DOM (se inicializarán después de crear el DOM)
    self.canvas = null;
    self.ctx = null;
    self.startBtn = null;
    self.resetBtn = null;
    self.statusMessage = null;
    self.resultDiv = null;
    self.currentPathLengthElement = null;
    self.shortestPathLengthElement = null;

    // Inicializar
    self.init();
  }

  // Establecer herencia
  PipeFlow.prototype = Object.create(Question.prototype);
  PipeFlow.prototype.constructor = PipeFlow;

  /**
   * Inicializar el juego
   */
  PipeFlow.prototype.init = function () {
    const self = this;
    self.on('resize', self.resize.bind(self));
  };

  /**
   * Obtener puntuación actual
   * Requerido por H5P.Question
   */
  PipeFlow.prototype.getScore = function () {
    return this.score;
  };

  /**
   * Obtener puntuación máxima
   * Requerido por H5P.Question
   */
  PipeFlow.prototype.getMaxScore = function () {
    return this.maxScore;
  };

  /**
   * Registrar elementos DOM
   */
  PipeFlow.prototype.registerDomElements = function () {
    const self = this;
    
    // Crear contenido del juego
    const $wrapper = self.createGameContent();
    
    // Registrar contenido
    self.setContent($wrapper);
    
    // Registrar botones
    self.registerButtons();
    
    // Inicializar referencias DOM después de crear el contenido
    setTimeout(function() {
      self.initDOMReferences();
      self.initGame();
    }, 0);
  };

  /**
   * Crear contenido del juego
   */
  PipeFlow.prototype.createGameContent = function () {
    const self = this;
    
    const CANVAS_SIZE = self.options.settings.canvasSize;
    
    const $wrapper = $('<div>', {
      'class': 'pipe-flow-container'
    });

    // Instrucciones
    if (self.options.instructions) {
      const $instructions = $('<div>', {
        'class': 'instructions'
      }).html('<h2>Instrucciones</h2><p>' + self.options.instructions + '</p><ul><li><strong>Click</strong> en una válvula para abrirla o cerrarla</li><li>Las válvulas abiertas permiten el paso del agua</li><li>Las válvulas cerradas bloquean el flujo</li><li>¡Haz que el agua llegue al destino!</li></ul>');
      $wrapper.append($instructions);
    }

    // Información del juego
    const $gameInfo = $('<div>', {
      'class': 'game-info'
    });

    const $status = $('<div>', {
      'class': 'status'
    }).html('<span id="status-message" class="status-message">Haz click en las válvulas para controlar el flujo</span>');

    let $pathInfo = $('<div>', {
      'class': 'path-info'
    });
    
    if (self.options.settings.showPathInfo) {
      $pathInfo.html('<span>Camino actual: <strong id="current-path-length">-</strong></span><span>Camino más corto: <strong id="shortest-path-length">-</strong></span>');
    }

    const $startBtn = $('<button>', {
      'id': 'start-btn',
      'class': 'btn btn-primary',
      'text': 'Iniciar Flujo'
    });

    const $resetBtn = $('<button>', {
      'id': 'reset-btn',
      'class': 'btn btn-secondary',
      'text': 'Reiniciar'
    });

    $gameInfo.append($status);
    if (self.options.settings.showPathInfo) {
      $gameInfo.append($pathInfo);
    }
    $gameInfo.append($startBtn);
    $gameInfo.append($resetBtn);
    $wrapper.append($gameInfo);

    // Canvas container
    const $canvasContainer = $('<div>', {
      'class': 'canvas-container'
    });

    const $canvas = $('<canvas>', {
      'id': 'game-canvas',
      'width': CANVAS_SIZE,
      'height': CANVAS_SIZE
    });

    $canvasContainer.append($canvas);
    $wrapper.append($canvasContainer);

    // Resultado
    const $result = $('<div>', {
      'id': 'result',
      'class': 'result hidden'
    });
    $wrapper.append($result);

    return $wrapper;
  };

  /**
   * Inicializar referencias DOM
   */
  PipeFlow.prototype.initDOMReferences = function () {
    const self = this;
    self.canvas = document.getElementById('game-canvas');
    if (self.canvas) {
      self.ctx = self.canvas.getContext('2d');
    }
    self.startBtn = document.getElementById('start-btn');
    self.resetBtn = document.getElementById('reset-btn');
    self.statusMessage = document.getElementById('status-message');
    self.resultDiv = document.getElementById('result');
    self.currentPathLengthElement = document.getElementById('current-path-length');
    self.shortestPathLengthElement = document.getElementById('shortest-path-length');
  };

  /**
   * Registrar botones
   */
  PipeFlow.prototype.registerButtons = function () {
    const self = this;
    
    if (self.options.behaviour.enableRetry) {
      self.addButton('Reintentar', function() {
        self.resetGame();
      }, true, {
        'aria-label': 'Reintentar'
      });
    }
  };

  /**
   * Inicializar el juego
   */
  PipeFlow.prototype.initGame = function () {
    const self = this;
    if (!self.canvas || !self.ctx) return;
    
    self.gameState.grid = [];
    self.gameState.valves.clear();
    self.gameState.waterPath = [];
    self.gameState.isRunning = false;
    self.gameState.gameWon = false;
    self.gameState.hoveredCell = null;
    self.gameState.leakCell = null;
    self.gameState.animationTime = 0;
    
    // Determinar tamaño del grid
    self.gameState.gridSize = self.gameConfig.length;
    const CANVAS_SIZE = self.options.settings.canvasSize;
    const CELL_SIZE = CANVAS_SIZE / self.gameState.gridSize;
    
    // Ajustar tamaño del canvas
    self.canvas.width = CANVAS_SIZE;
    self.canvas.height = CANVAS_SIZE;
    
    // Crear grid desde la configuración
    for (let row = 0; row < self.gameState.gridSize; row++) {
      self.gameState.grid[row] = [];
      for (let col = 0; col < self.gameState.gridSize; col++) {
        const cellValue = self.gameConfig[row][col];
        
        switch (cellValue) {
          case CELL_TYPES.SOURCE:
            self.gameState.grid[row][col] = CELL_TYPES.SOURCE;
            self.gameState.source = { row, col };
            break;
          case CELL_TYPES.DESTINATION:
            self.gameState.grid[row][col] = CELL_TYPES.DESTINATION;
            self.gameState.destination = { row, col };
            break;
          case CELL_TYPES.VALVE_H:
          case CELL_TYPES.VALVE_V:
          case CELL_TYPES.VALVE_CROSS:
          case CELL_TYPES.VALVE_T_SOUTH:
          case CELL_TYPES.VALVE_T_EAST:
          case CELL_TYPES.VALVE_T_NORTH:
          case CELL_TYPES.VALVE_T_WEST:
          case CELL_TYPES.VALVE_L_SE:
          case CELL_TYPES.VALVE_L_NE:
          case CELL_TYPES.VALVE_L_NW:
          case CELL_TYPES.VALVE_L_SW:
            self.gameState.grid[row][col] = cellValue;
            self.gameState.valves.set(`${row}-${col}`, false);
            break;
          case CELL_TYPES.PIPE_H:
          case CELL_TYPES.PIPE_V:
          case CELL_TYPES.PIPE_CROSS:
          case CELL_TYPES.PIPE_T_SOUTH:
          case CELL_TYPES.PIPE_T_EAST:
          case CELL_TYPES.PIPE_T_NORTH:
          case CELL_TYPES.PIPE_T_WEST:
          case CELL_TYPES.PIPE_L_SE:
          case CELL_TYPES.PIPE_L_NE:
          case CELL_TYPES.PIPE_L_NW:
          case CELL_TYPES.PIPE_L_SW:
            self.gameState.grid[row][col] = cellValue;
            break;
          default:
            self.gameState.grid[row][col] = CELL_TYPES.EMPTY;
        }
      }
    }
    
    // Configurar event listeners
    self.setupEventListeners();
    
    // Renderizar y actualizar
    self.renderGame();
    self.updatePathInfo();
    self.updateStatus('Haz click en las válvulas para abrirlas o cerrarlas');
    if (self.resultDiv) {
      self.resultDiv.classList.add('hidden');
    }
    if (self.startBtn) {
      self.startBtn.disabled = false;
    }
  };

  /**
   * Configurar event listeners
   */
  PipeFlow.prototype.setupEventListeners = function () {
    const self = this;
    
    // Solo agregar listeners si no existen ya
    if (self._listenersSetup) {
      return; // Ya están configurados
    }
    
    if (self.startBtn) {
      self.startBtn.addEventListener('click', function() {
        if (!self.gameState.isRunning) {
          self.startWaterFlow();
        }
      });
    }
    
    if (self.resetBtn) {
      self.resetBtn.addEventListener('click', function() {
        self.resetGame();
      });
    }
    
    if (self.canvas) {
      self.canvas.addEventListener('click', function(e) {
        if (!self.gameState.isRunning && !self.gameState.gameWon) {
          const cell = self.getCellFromMouse(e);
          if (cell) {
            const cellType = self.gameState.grid[cell.row][cell.col];
            if (cellType >= 3 && cellType <= 13) {
              self.toggleValve(cell.row, cell.col);
            }
          }
        }
      });
      
      self.canvas.addEventListener('mousemove', function(e) {
        const cell = self.getCellFromMouse(e);
        if (cell) {
          const cellType = self.gameState.grid[cell.row][cell.col];
          if (cellType >= 3 && cellType <= 13) {
            self.canvas.style.cursor = 'pointer';
          } else {
            self.canvas.style.cursor = 'default';
          }
        }
        
        if (cell !== self.gameState.hoveredCell) {
          self.gameState.hoveredCell = cell;
          self.renderGame();
        }
      });
      
      self.canvas.addEventListener('mouseleave', function() {
        self.gameState.hoveredCell = null;
        self.canvas.style.cursor = 'default';
        self.renderGame();
      });
    }
    
    self._listenersSetup = true;
  };

  /**
   * Resetear juego
   */
  PipeFlow.prototype.resetGame = function () {
    const self = this;
    self.initGame();
    self.hideButton('Reintentar');
    // Reiniciar puntuación
    self.score = 0;
    self.maxScore = 0;
  };

  /**
   * Obtener conexiones visuales de una celda
   */
  PipeFlow.prototype.getCellConnectionsVisual = function (row, col) {
    const self = this;
    const cellType = self.gameState.grid[row][col];
    
    switch (cellType) {
      case CELL_TYPES.SOURCE:
      case CELL_TYPES.DESTINATION:
        return [true, true, true, true];
      case CELL_TYPES.PIPE_H:
        return [false, true, false, true];
      case CELL_TYPES.PIPE_V:
        return [true, false, true, false];
      case CELL_TYPES.PIPE_CROSS:
        return [true, true, true, true];
      case CELL_TYPES.PIPE_T_SOUTH:
        return [false, true, true, true];
      case CELL_TYPES.PIPE_T_EAST:
        return [true, true, true, false];
      case CELL_TYPES.PIPE_T_NORTH:
        return [true, true, false, true];
      case CELL_TYPES.PIPE_T_WEST:
        return [true, false, true, true];
      case CELL_TYPES.PIPE_L_SE:
        return [false, true, true, false];
      case CELL_TYPES.PIPE_L_NE:
        return [true, true, false, false];
      case CELL_TYPES.PIPE_L_NW:
        return [true, false, false, true];
      case CELL_TYPES.PIPE_L_SW:
        return [false, false, true, true];
      case CELL_TYPES.VALVE_H:
        return [false, true, false, true];
      case CELL_TYPES.VALVE_V:
        return [true, false, true, false];
      case CELL_TYPES.VALVE_CROSS:
        return [true, true, true, true];
      case CELL_TYPES.VALVE_T_SOUTH:
        return [false, true, true, true];
      case CELL_TYPES.VALVE_T_EAST:
        return [true, true, true, false];
      case CELL_TYPES.VALVE_T_NORTH:
        return [true, true, false, true];
      case CELL_TYPES.VALVE_T_WEST:
        return [true, false, true, true];
      case CELL_TYPES.VALVE_L_SE:
        return [false, true, true, false];
      case CELL_TYPES.VALVE_L_NE:
        return [true, true, false, false];
      case CELL_TYPES.VALVE_L_NW:
        return [true, false, false, true];
      case CELL_TYPES.VALVE_L_SW:
        return [false, false, true, true];
      default:
        return [false, false, false, false];
    }
  };

  /**
   * Obtener conexiones funcionales de una celda
   */
  PipeFlow.prototype.getCellConnections = function (row, col) {
    const self = this;
    const cellType = self.gameState.grid[row][col];
    
    if (cellType >= 3 && cellType <= 13) {
      const isOpen = self.gameState.valves.get(`${row}-${col}`);
      if (isOpen !== true) {
        return [false, false, false, false];
      }
    }
    
    return self.getCellConnectionsVisual(row, col);
  };

  /**
   * Verificar si dos celdas están conectadas
   */
  PipeFlow.prototype.areConnected = function (row1, col1, row2, col2) {
    const self = this;
    const cell1 = self.gameState.grid[row1][col1];
    const cell2 = self.gameState.grid[row2][col2];
    
    if (cell1 === CELL_TYPES.EMPTY || cell2 === CELL_TYPES.EMPTY) {
      return false;
    }
    
    const conn1 = self.getCellConnections(row1, col1);
    const conn2 = self.getCellConnections(row2, col2);
    
    if (row2 === row1 - 1 && col2 === col1) {
      return conn1[0] && conn2[2];
    } else if (row2 === row1 + 1 && col2 === col1) {
      return conn1[2] && conn2[0];
    } else if (row2 === row1 && col2 === col1 - 1) {
      return conn1[3] && conn2[1];
    } else if (row2 === row1 && col2 === col1 + 1) {
      return conn1[1] && conn2[3];
    }
    
    return false;
  };

  /**
   * Buscar camino usando BFS
   */
  PipeFlow.prototype.findPath = function (start, end) {
    const self = this;
    const queue = [{ row: start.row, col: start.col, path: [] }];
    const visited = new Set();
    visited.add(`${start.row}-${start.col}`);
    
    const directions = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 }
    ];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (current.row === end.row && current.col === end.col) {
        return current.path.concat([{ row: current.row, col: current.col }]);
      }
      
      for (const dir of directions) {
        const newRow = current.row + dir.row;
        const newCol = current.col + dir.col;
        const key = `${newRow}-${newCol}`;
        
        if (newRow >= 0 && newRow < self.gameState.gridSize && 
            newCol >= 0 && newCol < self.gameState.gridSize &&
            !visited.has(key) &&
            self.areConnected(current.row, current.col, newRow, newCol)) {
          
          visited.add(key);
          queue.push({
            row: newRow,
            col: newCol,
            path: current.path.concat([{ row: current.row, col: current.col }])
          });
        }
      }
    }
    
    return [];
  };

  /**
   * Encontrar todas las celdas conectadas con distancias
   */
  PipeFlow.prototype.findAllConnectedCellsWithDistance = function (start) {
    const self = this;
    const connected = new Map();
    const queue = [{ row: start.row, col: start.col, distance: 0 }];
    connected.set(`${start.row}-${start.col}`, 0);
    
    const directions = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 }
    ];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      for (const dir of directions) {
        const newRow = current.row + dir.row;
        const newCol = current.col + dir.col;
        const key = `${newRow}-${newCol}`;
        
        if (newRow >= 0 && newRow < self.gameState.gridSize && 
            newCol >= 0 && newCol < self.gameState.gridSize &&
            !connected.has(key) &&
            self.areConnected(current.row, current.col, newRow, newCol)) {
          
          const newDistance = current.distance + 1;
          connected.set(key, newDistance);
          queue.push({ row: newRow, col: newCol, distance: newDistance });
        }
      }
    }
    
    return connected;
  };

  /**
   * Alternar válvula
   */
  PipeFlow.prototype.toggleValve = function (row, col) {
    const self = this;
    if (self.gameState.isRunning || self.gameState.gameWon) return;
    
    const key = `${row}-${col}`;
    if (!self.gameState.valves.has(key)) return;
    
    const currentState = self.gameState.valves.get(key);
    self.gameState.valves.set(key, !currentState);
    
    self.renderGame();
    self.updatePathInfo();
    self.updateStatus(`Válvula ${!currentState ? 'abierta' : 'cerrada'}`);
  };

  /**
   * Animar flujo de agua
   */
  PipeFlow.prototype.animateWaterFlowNew = function () {
    const self = this;
    const allConnectedCells = self.findAllConnectedCellsWithDistance(self.gameState.source);
    
    const destKey = `${self.gameState.destination.row}-${self.gameState.destination.col}`;
    const hasPathToDestination = allConnectedCells.has(destKey);
    
    // Ya no detenemos aquí - permitimos que el flujo se anime
    // y verificamos al final si llegó al destino
    
    let leakCell = null;
    for (const [cellKey, distance] of allConnectedCells) {
      const [row, col] = cellKey.split('-').map(Number);
      const cellType = self.gameState.grid[row][col];
      
      if (cellType === CELL_TYPES.SOURCE || cellType === CELL_TYPES.DESTINATION) {
        continue;
      }
      
      const canReachDestination = self.findPath({ row, col }, self.gameState.destination).length > 0;
      if (!canReachDestination) {
        leakCell = { row, col };
        break;
      }
    }
    
    const cellsToAnimate = Array.from(allConnectedCells.entries())
      .map(([key, distance]) => {
        const [row, col] = key.split('-').map(Number);
        return { row, col, distance };
      })
      .sort((a, b) => a.distance - b.distance);
    
    let currentIndex = 0;
    self.gameState.waterPath = [];
    
    const animateStep = () => {
      if (!self.gameState.isRunning) {
        return;
      }
      
      if (currentIndex >= cellsToAnimate.length) {
        self.gameState.isRunning = false;
        if (self.startBtn) self.startBtn.disabled = false;
        
        // Calcular puntuación parcial (incluso si no completó)
        const score = self.calculateScore();
        const maxScore = self.calculateMaxScore();
        self.score = score;
        self.maxScore = maxScore;
        
        // Verificar si completó exitosamente
        const isCompleted = hasPathToDestination && !leakCell;
        self.gameState.gameWon = isCompleted;
        
        if (isCompleted) {
          // Éxito - llegó al destino
          const scoreMessage = ` Puntuación: ${score}/${maxScore}`;
          self.showResult(self.options.messages.successMessage + scoreMessage, true);
          self.updateStatus('¡Agua llegó al destino exitosamente!');
          
          // Enviar evento xAPI con completion: true
          self.triggerXAPICompleted(self.score, self.maxScore);
        } else {
          // No completó - mostrar error y enviar xAPI con completion: false
          if (!hasPathToDestination) {
            self.showResult(self.options.messages.noPathMessage + ` Puntuación parcial: ${score}/${maxScore}`, false);
            self.updateStatus(self.options.messages.noPathMessage);
          } else if (leakCell) {
            self.showResult(self.options.messages.leakMessage + ` Puntuación parcial: ${score}/${maxScore}`, false);
            self.highlightLeakCell(leakCell.row, leakCell.col);
            self.updateStatus(self.options.messages.leakMessage);
          }
          
          // Enviar evento xAPI con completion: false
          self.triggerXAPIAnswered(self.score, self.maxScore, false);
        }
        return;
      }
      
      const cell = cellsToAnimate[currentIndex];
      self.gameState.waterPath.push({ row: cell.row, col: cell.col });
      
      self.renderGame();
      currentIndex++;
      
      if (self.gameState.isRunning) {
        setTimeout(animateStep, self.options.settings.animationSpeed);
      }
    };
    
    animateStep();
  };

  /**
   * Iniciar flujo de agua
   */
  PipeFlow.prototype.startWaterFlow = function () {
    const self = this;
    if (self.gameState.isRunning) return;
    
    self.gameState.isRunning = true;
    self.gameState.waterPath = [];
    self.gameState.gameWon = false;
    self.gameState.leakCell = null;
    if (self.startBtn) self.startBtn.disabled = true;
    self.updateStatus('El agua está fluyendo...');
    if (self.resultDiv) self.resultDiv.classList.add('hidden');
    
    self.animateWaterFlowNew();
  };

  /**
   * Resaltar celda con fuga
   */
  PipeFlow.prototype.highlightLeakCell = function (row, col) {
    const self = this;
    self.gameState.leakCell = { row, col };
    self.renderGame();
    
    setTimeout(() => {
      self.gameState.leakCell = null;
      self.renderGame();
    }, 3000);
  };

  /**
   * Calcular camino más corto
   */
  PipeFlow.prototype.calculateShortestPath = function () {
    const self = this;
    const savedValves = new Map();
    self.gameState.valves.forEach((value, key) => {
      savedValves.set(key, value);
    });
    
    self.gameState.valves.forEach((value, key) => {
      self.gameState.valves.set(key, true);
    });
    
    const path = self.findPath(self.gameState.source, self.gameState.destination);
    
    self.gameState.valves = savedValves;
    
    return path.length > 0 ? path.length : Infinity;
  };

  /**
   * Actualizar información de caminos
   */
  PipeFlow.prototype.updatePathInfo = function () {
    const self = this;
    if (!self.options.settings.showPathInfo) return;
    
    const currentPath = self.findPath(self.gameState.source, self.gameState.destination);
    const currentLength = currentPath.length > 0 ? currentPath.length : 0;
    const shortestLength = self.calculateShortestPath();
    
    if (self.currentPathLengthElement) {
      if (currentLength > 0) {
        self.currentPathLengthElement.textContent = `${currentLength} pasos`;
      } else {
        self.currentPathLengthElement.textContent = 'Sin camino';
      }
    }
    
    if (self.shortestPathLengthElement) {
      if (shortestLength !== Infinity) {
        self.shortestPathLengthElement.textContent = `${shortestLength} pasos`;
      } else {
        self.shortestPathLengthElement.textContent = 'Sin solución';
      }
    }
  };

  /**
   * Encontrar válvulas en el camino más corto
   */
  PipeFlow.prototype.findValvesInShortestPath = function () {
    const self = this;
    const savedValves = new Map();
    self.gameState.valves.forEach((value, key) => {
      savedValves.set(key, value);
    });
    
    // Abrir todas las válvulas para encontrar el camino más corto
    self.gameState.valves.forEach((value, key) => {
      self.gameState.valves.set(key, true);
    });
    
    const shortestPath = self.findPath(self.gameState.source, self.gameState.destination);
    const valvesInPath = new Set();
    
    // Identificar válvulas en el camino más corto
    shortestPath.forEach(cell => {
      const cellType = self.gameState.grid[cell.row][cell.col];
      if (cellType >= 3 && cellType <= 13) { // Es una válvula (3-13)
        valvesInPath.add(`${cell.row}-${cell.col}`);
      }
    });
    
    // Restaurar estado de válvulas
    self.gameState.valves = savedValves;
    
    return valvesInPath;
  };

  /**
   * Calcular puntuación máxima posible
   */
  PipeFlow.prototype.calculateMaxScore = function () {
    const self = this;
    const valvesInShortestPath = self.findValvesInShortestPath();
    return valvesInShortestPath.size; // Máximo = número de válvulas en el camino más corto
  };

  /**
   * Calcular puntuación
   */
  PipeFlow.prototype.calculateScore = function () {
    const self = this;
    let score = 0;
    
    // Encontrar válvulas en el camino más corto
    const valvesInShortestPath = self.findValvesInShortestPath();
    
    // Contar válvulas abiertas correctas (están en el camino más corto)
    self.gameState.valves.forEach((isOpen, key) => {
      if (isOpen) {
        if (valvesInShortestPath.has(key)) {
          score += 1; // Sumar 1 punto por válvula correcta
        } else {
          // Restar 1 punto si está habilitada la penalización
          if (self.options.scoring && self.options.scoring.enablePenalty) {
            score -= 1;
          }
        }
      }
    });
    
    // Asegurar que el score no sea negativo
    return Math.max(0, score);
  };

  /**
   * Agregar información específica del juego al evento xAPI
   */
  PipeFlow.prototype.getxAPIDefinition = function () {
    const self = this;
    const definition = {};
    
    definition.interactionType = 'other';
    definition.type = 'http://adlnet.gov/expapi/activities/cmi.interaction';
    definition.description = {
      'en-US': 'Pipe Flow Game - Control de válvulas para dirigir el flujo de agua',
      'es': 'Juego de Tuberías - Control de válvulas para dirigir el flujo de agua'
    };
    
    // Agregar información sobre válvulas abiertas
    const openValves = [];
    self.gameState.valves.forEach((isOpen, key) => {
      if (isOpen) {
        const [row, col] = key.split('-').map(Number);
        openValves.push({ row, col });
      }
    });
    
    definition.extensions = {
      'http://h5p.org/x-api/h5p-local-content-id': self.contentId || 0,
      'https://h5p.org/x-api/pipe-flow-valves': openValves
    };
    
    return definition;
  };

  /**
   * Agregar respuesta del usuario al evento xAPI
   */
  PipeFlow.prototype.getxAPIResponse = function () {
    const self = this;
    const openValves = [];
    self.gameState.valves.forEach((isOpen, key) => {
      if (isOpen) {
        openValves.push(key);
      }
    });
    return openValves.join('[,]');
  };

  /**
   * Agregar la pregunta al evento xAPI
   */
  PipeFlow.prototype.addQuestionToXAPI = function (xAPIEvent) {
    const definition = xAPIEvent.getVerifiedStatementValue(['object', 'definition']);
    if (definition && typeof $.extend === 'function') {
      $.extend(true, definition, this.getxAPIDefinition());
    }
  };

  /**
   * Enviar evento xAPI con puntuación parcial (completion: false)
   */
  PipeFlow.prototype.triggerXAPIAnswered = function (score, maxScore, completion) {
    const self = this;
    
    const xAPIEvent = self.createXAPIEventTemplate('answered');
    
    // Agregar información de la pregunta
    self.addQuestionToXAPI(xAPIEvent);
    
    // Configurar resultado
    const isSuccess = (score === maxScore && completion);
    const result = {
      score: {
        raw: score,
        min: 0,
        max: maxScore,
        scaled: maxScore > 0 ? (score / maxScore) : 0
      },
      response: self.getxAPIResponse(),
      success: isSuccess,
      completion: completion || false
    };
    
    xAPIEvent.data.statement.result = result;
    
    self.trigger(xAPIEvent);
  };

  /**
   * Actualizar estado
   */
  PipeFlow.prototype.updateStatus = function (message) {
    const self = this;
    if (self.statusMessage) {
      self.statusMessage.textContent = message;
    }
  };

  /**
   * Mostrar resultado
   */
  PipeFlow.prototype.showResult = function (message, success) {
    const self = this;
    if (self.resultDiv) {
      self.resultDiv.textContent = message;
      self.resultDiv.className = `result ${success ? 'success' : 'error'}`;
      self.resultDiv.classList.remove('hidden');
    }
  };

  /**
   * Obtener celda desde coordenadas del mouse
   */
  PipeFlow.prototype.getCellFromMouse = function (event) {
    var self = this;
    var CANVAS_SIZE = self.options.settings.canvasSize;
    var CELL_SIZE = CANVAS_SIZE / self.gameState.gridSize;
    var rect = self.canvas.getBoundingClientRect();

    // Escalar coordenadas del mouse al tamaño interno del canvas
    var scaleX = CANVAS_SIZE / rect.width;
    var scaleY = CANVAS_SIZE / rect.height;
    var x = (event.clientX - rect.left) * scaleX;
    var y = (event.clientY - rect.top) * scaleY;

    var col = Math.floor(x / CELL_SIZE);
    var row = Math.floor(y / CELL_SIZE);

    if (row >= 0 && row < self.gameState.gridSize && col >= 0 && col < self.gameState.gridSize) {
      return { row: row, col: col };
    }
    return null;
  };

  /**
   * Dibujar celda
   */
  PipeFlow.prototype.drawCell = function (ctx, x, y, size, cellType, isWater, isHovered) {
    const self = this;
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const pipeWidth = size * 0.2;
    const row = Math.floor(y / size);
    const col = Math.floor(x / size);
    const isLeak = self.gameState.leakCell && 
                   self.gameState.leakCell.row === row && 
                   self.gameState.leakCell.col === col;
    
    ctx.save();
    
    if (isLeak) {
      ctx.fillStyle = '#ffebee';
    } else if (isHovered) {
      ctx.fillStyle = '#f5f5f5';
    } else {
      ctx.fillStyle = '#ffffff';
    }
    ctx.fillRect(x, y, size, size);
    
    if (isLeak) {
      ctx.strokeStyle = '#f44336';
      ctx.lineWidth = 3;
    } else {
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
    }
    ctx.strokeRect(x, y, size, size);
    
    const shouldDrawPipes = cellType !== CELL_TYPES.SOURCE && 
                           cellType !== CELL_TYPES.DESTINATION && 
                           cellType !== CELL_TYPES.EMPTY;
    
    if (shouldDrawPipes) {
      const connections = self.getCellConnectionsVisual(row, col);
      
      ctx.strokeStyle = isWater ? '#2196F3' : '#666';
      ctx.fillStyle = isWater ? '#2196F3' : '#666';
      ctx.lineWidth = pipeWidth;
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';
      
      ctx.beginPath();
      
      if (connections[0]) {
        ctx.moveTo(centerX, y);
        ctx.lineTo(centerX, centerY);
      }
      if (connections[1]) {
        ctx.moveTo(x + size, centerY);
        ctx.lineTo(centerX, centerY);
      }
      if (connections[2]) {
        ctx.moveTo(centerX, y + size);
        ctx.lineTo(centerX, centerY);
      }
      if (connections[3]) {
        ctx.moveTo(x, centerY);
        ctx.lineTo(centerX, centerY);
      }
      
      ctx.stroke();
      
      if (isWater) {
        const animationSpeed = 0.02;
        const particleSize = pipeWidth * 0.6;
        const particleSpacing = size * 0.4;
        const offset = (self.gameState.animationTime * animationSpeed) % (particleSpacing * 2);
        
        ctx.fillStyle = '#64b5f6';
        
        if (connections[0]) {
          const numParticles = Math.ceil((centerY - y) / particleSpacing) + 1;
          for (let i = 0; i < numParticles; i++) {
            const particleY = centerY - (i * particleSpacing + offset);
            if (particleY >= y && particleY <= centerY) {
              ctx.beginPath();
              ctx.arc(centerX, particleY, particleSize / 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        if (connections[1]) {
          const numParticles = Math.ceil((x + size - centerX) / particleSpacing) + 1;
          for (let i = 0; i < numParticles; i++) {
            const particleX = centerX + (i * particleSpacing + offset);
            if (particleX >= centerX && particleX <= x + size) {
              ctx.beginPath();
              ctx.arc(particleX, centerY, particleSize / 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        if (connections[2]) {
          const numParticles = Math.ceil((y + size - centerY) / particleSpacing) + 1;
          for (let i = 0; i < numParticles; i++) {
            const particleY = centerY + (i * particleSpacing + offset);
            if (particleY >= centerY && particleY <= y + size) {
              ctx.beginPath();
              ctx.arc(centerX, particleY, particleSize / 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        if (connections[3]) {
          const numParticles = Math.ceil((centerX - x) / particleSpacing) + 1;
          for (let i = 0; i < numParticles; i++) {
            const particleX = centerX - (i * particleSpacing + offset);
            if (particleX >= x && particleX <= centerX) {
              ctx.beginPath();
              ctx.arc(particleX, centerY, particleSize / 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
      
      const isCorner = cellType === CELL_TYPES.PIPE_L_NE || 
                      cellType === CELL_TYPES.PIPE_L_NW ||
                      cellType === CELL_TYPES.PIPE_L_SE ||
                      cellType === CELL_TYPES.PIPE_L_SW ||
                      cellType === CELL_TYPES.VALVE_L_NE ||
                      cellType === CELL_TYPES.VALVE_L_NW ||
                      cellType === CELL_TYPES.VALVE_L_SE ||
                      cellType === CELL_TYPES.VALVE_L_SW;
      
      const isT = cellType === CELL_TYPES.PIPE_T_EAST ||
                 cellType === CELL_TYPES.PIPE_T_NORTH ||
                 cellType === CELL_TYPES.PIPE_T_WEST ||
                 cellType === CELL_TYPES.PIPE_T_SOUTH ||
                 cellType === CELL_TYPES.VALVE_T_EAST ||
                 cellType === CELL_TYPES.VALVE_T_NORTH ||
                 cellType === CELL_TYPES.VALVE_T_WEST ||
                 cellType === CELL_TYPES.VALVE_T_SOUTH;
      
      if (isCorner || isT) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, pipeWidth / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    switch (cellType) {
      case CELL_TYPES.SOURCE:
        ctx.fillStyle = '#4fc3f7';
        ctx.beginPath();
        ctx.arc(centerX, centerY, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        if (isWater) {
          ctx.strokeStyle = '#2196F3';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold ' + (size * 0.4) + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚰', centerX, centerY);
        break;
        
      case CELL_TYPES.DESTINATION:
        ctx.fillStyle = '#66bb6a';
        ctx.beginPath();
        ctx.arc(centerX, centerY, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        if (isWater) {
          ctx.strokeStyle = '#2196F3';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold ' + (size * 0.4) + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏁', centerX, centerY);
        break;
        
      case CELL_TYPES.VALVE_H:
      case CELL_TYPES.VALVE_V:
      case CELL_TYPES.VALVE_CROSS:
      case CELL_TYPES.VALVE_T_SOUTH:
      case CELL_TYPES.VALVE_T_EAST:
      case CELL_TYPES.VALVE_T_NORTH:
      case CELL_TYPES.VALVE_T_WEST:
      case CELL_TYPES.VALVE_L_SE:
      case CELL_TYPES.VALVE_L_NE:
      case CELL_TYPES.VALVE_L_NW:
      case CELL_TYPES.VALVE_L_SW:
        const isOpen = self.gameState.valves.get(`${row}-${col}`);
        const valveSize = size * 0.35;
        
        ctx.fillStyle = (isOpen === true) ? '#81c784' : '#e57373';
        ctx.strokeStyle = isOpen ? '#4caf50' : '#c62828';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, valveSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = size * 0.08;
        ctx.lineCap = 'round';
        ctx.beginPath();
        
        if (isOpen === true) {
          ctx.moveTo(centerX - valveSize * 0.4, centerY);
          ctx.lineTo(centerX + valveSize * 0.4, centerY);
        } else {
          ctx.moveTo(centerX, centerY - valveSize * 0.4);
          ctx.lineTo(centerX, centerY + valveSize * 0.4);
        }
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, valveSize * 0.25, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
    
    ctx.restore();
  };

  /**
   * Renderizar juego
   */
  PipeFlow.prototype.renderGame = function () {
    const self = this;
    if (!self.canvas || !self.ctx) return;
    
    const CANVAS_SIZE = self.options.settings.canvasSize;
    const CELL_SIZE = CANVAS_SIZE / self.gameState.gridSize;
    
    self.ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    self.ctx.fillStyle = '#f5f5f5';
    self.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    if (self.gameState.isRunning && self.gameState.waterPath.length > 0) {
      self.gameState.animationTime += 1;
    }
    
    for (let row = 0; row < self.gameState.gridSize; row++) {
      for (let col = 0; col < self.gameState.gridSize; col++) {
        const cellType = self.gameState.grid[row][col];
        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;
        
        const isWater = self.gameState.waterPath.some(p => p.row === row && p.col === col);
        const isHovered = self.gameState.hoveredCell && 
                         self.gameState.hoveredCell.row === row && 
                         self.gameState.hoveredCell.col === col;
        
        self.drawCell(self.ctx, x, y, CELL_SIZE, cellType, isWater, isHovered);
      }
    }
    
    if (self.gameState.isRunning && self.gameState.waterPath.length > 0) {
      requestAnimationFrame(() => {
        if (self.gameState.isRunning) {
          self.renderGame();
        }
      });
    }
  };

  /**
   * Redimensionar
   */
  PipeFlow.prototype.resize = function () {
    var self = this;
    if (!self.canvas) return;

    var $container = $(self.canvas).closest('.pipe-flow-container');
    if (!$container || !$container.length) return;

    var containerWidth = $container.parent().width();
    if (!containerWidth || containerWidth <= 0) return;

    // Dimensiones base de referencia
    var baseWidth = 700;
    var baseFontSize = 16;

    // Calcular ratio de escalado
    var ratio = containerWidth / baseWidth;
    ratio = Math.max(0.5, Math.min(ratio, 1.5));

    // Aplicar font-size escalado al contenedor (todo en em se adapta)
    $container.css('font-size', (baseFontSize * ratio) + 'px');

    self.renderGame();
  };

  /**
   * Enviar evento xAPI de completación exitosa
   */
  PipeFlow.prototype.triggerXAPICompleted = function (score, maxScore) {
    const self = this;
    self.triggerXAPIAnswered(score, maxScore, true);
  };

  /**
   * Get xAPI data.
   * Contract used by report rendering engine.
   *
   * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-6}
   */
  PipeFlow.prototype.getXAPIData = function () {
    const self = this;
    var xAPIEvent = self.createXAPIEventTemplate('answered');
    self.addQuestionToXAPI(xAPIEvent);

    var isSuccess = (self.score === self.maxScore && self.gameState.gameWon);
    xAPIEvent.data.statement.result = {
      score: {
        raw: self.score,
        min: 0,
        max: self.maxScore,
        scaled: self.maxScore > 0 ? (self.score / self.maxScore) : 0
      },
      response: self.getxAPIResponse(),
      success: isSuccess,
      completion: self.gameState.gameWon
    };

    return {
      statement: xAPIEvent.data.statement
    };
  };

  return PipeFlow;
})(H5P.jQuery, H5P.Question);

