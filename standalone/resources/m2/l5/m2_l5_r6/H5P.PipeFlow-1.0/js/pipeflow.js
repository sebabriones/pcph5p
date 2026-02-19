var H5P = H5P || {};

H5P.PipeFlow = (function ($, Question) {
  'use strict';

  // Tipos de celdas
  var CELL_TYPES = {
    EMPTY: 0,
    // Fuentes: 101-109, Destinos: 201-209
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
    // Fuentes múltiples: 101-109 (SOURCE_1 a SOURCE_9)
    // Destinos múltiples: 201-209 (DEST_1 a DEST_9)
  };

  // === Funciones auxiliares para tipos de celda ===

  function isSource(cellType) {
    return cellType >= 101 && cellType <= 109;
  }

  function isDestination(cellType) {
    return cellType >= 201 && cellType <= 209;
  }

  function getSourceId(cellType) {
    if (cellType >= 101 && cellType <= 109) return cellType - 100;
    return 0;
  }

  function getDestinationId(cellType) {
    if (cellType >= 201 && cellType <= 209) return cellType - 200;
    return 0;
  }

  function isValve(cellType) {
    return cellType >= 3 && cellType <= 13;
  }

  function isPipe(cellType) {
    return cellType >= 14 && cellType <= 24;
  }

  /**
   * Aclarar un color hexadecimal
   */
  function lightenColor(hex, amount) {
    if (!hex || hex.length < 7) return '#99ccff';
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    r = Math.min(255, r + amount);
    g = Math.min(255, g + amount);
    b = Math.min(255, b + amount);
    var rr = r.toString(16); if (rr.length < 2) rr = '0' + rr;
    var gg = g.toString(16); if (gg.length < 2) gg = '0' + gg;
    var bb = b.toString(16); if (bb.length < 2) bb = '0' + bb;
    return '#' + rr + gg + bb;
  }

  /**
   * Constructor principal
   */
  function PipeFlow(options, id) {
    var self = this;

    // Llamar al constructor padre
    Question.call(self, 'pipe-flow');

    // Guardar contentId
    self.contentId = id;

    // Opciones con valores por defecto
    self.options = $.extend(true, {}, {
      instructions: 'Activa y desactiva las válvulas para controlar el flujo de agua desde las fuentes hasta los destinos correctos.',
      gameConfig: '[[101, 17, 14, 3, 14, 24, 0, 0, 0, 0], [0, 22, 14, 14, 14, 5, 14, 3, 14, 24], [0, 0, 0, 0, 0, 4, 0, 0, 0, 15], [0, 0, 0, 0, 0, 22, 14, 14, 6, 23], [0, 0, 0, 0, 0, 0, 0, 0, 7, 3], [0, 0, 0, 0, 0, 0, 0, 0, 7, 3], [0, 0, 0, 0, 21, 14, 14, 14, 23, 0], [0, 0, 0, 0, 201, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]',
      sources: [
        { color: '#2196F3', label: 'Fuente 1', emoji: '🚰' }
      ],
      destinations: [
        { acceptedSources: '101', label: 'Destino 1', emoji: '🏁' }
      ],
      messages: {
        successMessage: 'Has completado el circuito correctamente.',
        failureMessage: 'El agua no llegó correctamente. Revisa las válvulas.',
        leakMessage: 'El agua se fuga por una tubería abierta.',
        noPathMessage: 'No hay camino hacia el destino. Abre más válvulas.',
        noSolutionMessage: 'No existe solución posible para este circuito.',
        suboptimalPathMessage: 'Tu camino tiene @current pasos. El óptimo es @optimal.',
        missingSourceDestMessage: 'Falta fuente o destino en el circuito.',
        destNoWaterMessage: '@dest no recibió agua. Revisa las conexiones.',
        destWrongSourceMessage: '@dest recibió agua no aceptada de @sources.',
        destMissingSourceMessage: '@dest no recibió agua de todas las fuentes requeridas.'
      },
      settings: {
        animationSpeed: 100,
        showPathInfo: true,
        canvasSize: 450
      },
      l10n: {
        checkAnswerButtonLabel: 'Comprobar',
        retryButtonLabel: 'Reintentar'
      },
      behaviour: {
        enableRetry: true,
        scoringMode: 'destinations'
      }
    }, options);

    // Parsear gameConfig desde string JSON
    try {
      self.gameConfig = JSON.parse(self.options.gameConfig);
    } catch (e) {
      console.error('Error parsing gameConfig:', e);
      self.gameConfig = [[101, 0, 201], [0, 0, 0], [0, 0, 0]];
    }

    // Estado del juego
    self.gameState = {
      grid: [],
      sources: new Map(),       // Map<sourceId, {row, col}>
      destinations: new Map(),  // Map<destId, {row, col}>
      valves: new Map(),
      waterPaths: {},           // {sourceId: [{row, col}]}
      waterOwnership: {},       // {"row-col": sourceId}
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

    // Referencias a elementos DOM
    self.canvas = null;
    self.ctx = null;
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
    var self = this;
    self.on('resize', self.resize.bind(self));
  };

  /**
   * Obtener puntuación actual
   */
  PipeFlow.prototype.getScore = function () {
    return this.score;
  };

  /**
   * Obtener puntuación máxima
   */
  PipeFlow.prototype.getMaxScore = function () {
    return this.maxScore;
  };

  // === Helpers para configuración de fuentes/destinos ===

  PipeFlow.prototype.getSourceColor = function (sourceId) {
    var config = this.options.sources[sourceId - 1];
    return (config && config.color) ? config.color : '#2196F3';
  };

  PipeFlow.prototype.getSourceLightColor = function (sourceId) {
    return lightenColor(this.getSourceColor(sourceId), 60);
  };

  PipeFlow.prototype.getSourceEmoji = function (sourceId) {
    var config = this.options.sources[sourceId - 1];
    return (config && config.emoji) ? config.emoji : '🚰';
  };

  PipeFlow.prototype.getSourceLabel = function (sourceId) {
    var config = this.options.sources[sourceId - 1];
    return (config && config.label) ? config.label : ('Fuente ' + sourceId);
  };

  PipeFlow.prototype.getDestEmoji = function (destId) {
    var config = this.options.destinations[destId - 1];
    return (config && config.emoji) ? config.emoji : '🏁';
  };

  PipeFlow.prototype.getDestLabel = function (destId) {
    var config = this.options.destinations[destId - 1];
    return (config && config.label) ? config.label : ('Destino ' + destId);
  };

  PipeFlow.prototype.getDestAcceptedSources = function (destId) {
    var config = this.options.destinations[destId - 1];
    if (config && config.acceptedSources) {
      return config.acceptedSources.split(',').map(function (s) {
        var val = parseInt(s.trim());
        // Normalizar: si el usuario puso el código del grid (101-109), convertir a sourceId (1-9)
        if (val >= 101 && val <= 109) return val - 100;
        return val;
      });
    }
    return [1];
  };

  /**
   * Obtener color del destino basado en las fuentes aceptadas
   */
  PipeFlow.prototype.getDestColor = function (destId) {
    var accepted = this.getDestAcceptedSources(destId);
    if (accepted.length === 1) {
      return this.getSourceColor(accepted[0]);
    }
    return '#66bb6a';
  };

  // === Registro de elementos DOM ===

  PipeFlow.prototype.registerDomElements = function () {
    var self = this;
    var $wrapper = self.createGameContent();
    self.setContent($wrapper);
    self.registerButtons();
    setTimeout(function () {
      self.initDOMReferences();
      self.initGame();
    }, 0);
  };

  PipeFlow.prototype.createGameContent = function () {
    var self = this;
    var CANVAS_SIZE = self.options.settings.canvasSize;

    var $wrapper = $('<div>', { 'class': 'pipe-flow-container' });

    // Instrucciones
    if (self.options.instructions) {
      var $instructions = $('<div>', { 'class': 'instructions' })
        .html('<h2>Instrucciones</h2><p>' + self.options.instructions + '</p>' +
          '<ul><li><strong>Click</strong> en una válvula para abrirla o cerrarla</li>' +
          '<li>Las válvulas abiertas permiten el paso del agua</li>' +
          '<li>Las válvulas cerradas bloquean el flujo</li>' +
          '<li>¡Haz que el agua correcta llegue al destino!</li></ul>');
      $wrapper.append($instructions);
    }

    // Información del juego
    var $gameInfo = $('<div>', { 'class': 'game-info' });

    var $pathInfo = $('<div>', { 'class': 'path-info' });
    if (self.options.settings.showPathInfo) {
      $pathInfo.html('<span>Camino actual: <strong id="current-path-length">-</strong></span>' +
        '<span>Camino más corto: <strong id="shortest-path-length">-</strong></span>');
    }

    if (self.options.settings.showPathInfo) {
      $gameInfo.append($pathInfo);
    }
    $wrapper.append($gameInfo);

    // Canvas
    var $canvasContainer = $('<div>', { 'class': 'canvas-container' });
    var $canvas = $('<canvas>', { 'id': 'game-canvas', 'width': CANVAS_SIZE, 'height': CANVAS_SIZE });
    $canvasContainer.append($canvas);
    $wrapper.append($canvasContainer);

    return $wrapper;
  };

  PipeFlow.prototype.initDOMReferences = function () {
    var self = this;
    self.canvas = document.getElementById('game-canvas');
    if (self.canvas) {
      self.ctx = self.canvas.getContext('2d');
    }
    self.currentPathLengthElement = document.getElementById('current-path-length');
    self.shortestPathLengthElement = document.getElementById('shortest-path-length');
  };

  PipeFlow.prototype.registerButtons = function () {
    var self = this;

    // Botón "Comprobar"
    self.addButton('check-answer', self.options.l10n.checkAnswerButtonLabel || 'Comprobar', function () {
      if (!self.gameState.isRunning) {
        self.startWaterFlow();
      }
    }, true, {
      'aria-label': self.options.l10n.checkAnswerButtonLabel || 'Comprobar'
    });

    // Botón "Reintentar" (siempre se registra, inicialmente oculto)
    self.addButton('try-again', self.options.l10n.retryButtonLabel || 'Reintentar', function () {
      self.resetTask();
    }, false, {
      'aria-label': self.options.l10n.retryButtonLabel || 'Reintentar'
    });
  };

  // === Inicialización del juego ===

  PipeFlow.prototype.initGame = function () {
    var self = this;
    if (!self.canvas || !self.ctx) return;

    self.gameState.grid = [];
    self.gameState.sources = new Map();
    self.gameState.destinations = new Map();
    self.gameState.valves.clear();
    self.gameState.waterPaths = {};
    self.gameState.waterOwnership = {};
    self.gameState.isRunning = false;
    self.gameState.gameWon = false;
    self.gameState.hoveredCell = null;
    self.gameState.leakCell = null;
    self.gameState.animationTime = 0;

    self.gameState.gridSize = self.gameConfig.length;
    var CANVAS_SIZE = self.options.settings.canvasSize;
    self.canvas.width = CANVAS_SIZE;
    self.canvas.height = CANVAS_SIZE;

    // Parsear grid
    for (var row = 0; row < self.gameState.gridSize; row++) {
      self.gameState.grid[row] = [];
      for (var col = 0; col < self.gameState.gridSize; col++) {
        var cellValue = self.gameConfig[row][col];

        if (isSource(cellValue)) {
          self.gameState.grid[row][col] = cellValue;
          var srcId = getSourceId(cellValue);
          self.gameState.sources.set(srcId, { row: row, col: col });
        } else if (isDestination(cellValue)) {
          self.gameState.grid[row][col] = cellValue;
          var dstId = getDestinationId(cellValue);
          self.gameState.destinations.set(dstId, { row: row, col: col });
        } else if (isValve(cellValue)) {
          self.gameState.grid[row][col] = cellValue;
          self.gameState.valves.set(row + '-' + col, false);
        } else if (isPipe(cellValue)) {
          self.gameState.grid[row][col] = cellValue;
        } else {
          self.gameState.grid[row][col] = CELL_TYPES.EMPTY;
        }
      }
    }

    self.setupEventListeners();
    self.renderGame();
    self.updatePathInfo();
  };

  // === Event listeners ===

  PipeFlow.prototype.setupEventListeners = function () {
    var self = this;
    if (self._listenersSetup) return;

    if (self.canvas) {
      self.canvas.addEventListener('click', function (e) {
        if (!self.gameState.isRunning && !self.gameState.gameWon) {
          var cell = self.getCellFromMouse(e);
          if (cell) {
            var cellType = self.gameState.grid[cell.row][cell.col];
            if (isValve(cellType)) {
              self.toggleValve(cell.row, cell.col);
            }
          }
        }
      });

      self.canvas.addEventListener('mousemove', function (e) {
        var cell = self.getCellFromMouse(e);
        if (cell) {
          var cellType = self.gameState.grid[cell.row][cell.col];
          self.canvas.style.cursor = isValve(cellType) ? 'pointer' : 'default';
        }
        if (cell !== self.gameState.hoveredCell) {
          self.gameState.hoveredCell = cell;
          self.renderGame();
        }
      });

      self.canvas.addEventListener('mouseleave', function () {
        self.gameState.hoveredCell = null;
        self.canvas.style.cursor = 'default';
        self.renderGame();
      });
    }

    self._listenersSetup = true;
  };

  /**
   * Resetear juego (patrón estándar H5P)
   */
  PipeFlow.prototype.resetTask = function () {
    var self = this;
    self.score = 0;
    self.maxScore = 0;
    self.initGame();
    self.hideButton('try-again');
    self.showButton('check-answer');
    self.removeFeedback();
  };

  // === Conexiones de celdas ===

  PipeFlow.prototype.getCellConnectionsVisual = function (row, col) {
    var self = this;
    var cellType = self.gameState.grid[row][col];

    // Fuentes y destinos conectan en todas direcciones
    if (isSource(cellType) || isDestination(cellType)) {
      return [true, true, true, true];
    }

    switch (cellType) {
      case CELL_TYPES.PIPE_H: case CELL_TYPES.VALVE_H:
        return [false, true, false, true];
      case CELL_TYPES.PIPE_V: case CELL_TYPES.VALVE_V:
        return [true, false, true, false];
      case CELL_TYPES.PIPE_CROSS: case CELL_TYPES.VALVE_CROSS:
        return [true, true, true, true];
      case CELL_TYPES.PIPE_T_SOUTH: case CELL_TYPES.VALVE_T_SOUTH:
        return [false, true, true, true];
      case CELL_TYPES.PIPE_T_EAST: case CELL_TYPES.VALVE_T_EAST:
        return [true, true, true, false];
      case CELL_TYPES.PIPE_T_NORTH: case CELL_TYPES.VALVE_T_NORTH:
        return [true, true, false, true];
      case CELL_TYPES.PIPE_T_WEST: case CELL_TYPES.VALVE_T_WEST:
        return [true, false, true, true];
      case CELL_TYPES.PIPE_L_SE: case CELL_TYPES.VALVE_L_SE:
        return [false, true, true, false];
      case CELL_TYPES.PIPE_L_NE: case CELL_TYPES.VALVE_L_NE:
        return [true, true, false, false];
      case CELL_TYPES.PIPE_L_NW: case CELL_TYPES.VALVE_L_NW:
        return [true, false, false, true];
      case CELL_TYPES.PIPE_L_SW: case CELL_TYPES.VALVE_L_SW:
        return [false, false, true, true];
      default:
        return [false, false, false, false];
    }
  };

  PipeFlow.prototype.getCellConnections = function (row, col) {
    var self = this;
    var cellType = self.gameState.grid[row][col];

    if (isValve(cellType)) {
      var valveOpen = self.gameState.valves.get(row + '-' + col);
      if (valveOpen !== true) {
        return [false, false, false, false];
      }
    }

    return self.getCellConnectionsVisual(row, col);
  };

  PipeFlow.prototype.areConnected = function (row1, col1, row2, col2) {
    var self = this;
    var cell1 = self.gameState.grid[row1][col1];
    var cell2 = self.gameState.grid[row2][col2];

    if (cell1 === CELL_TYPES.EMPTY || cell2 === CELL_TYPES.EMPTY) {
      return false;
    }

    var conn1 = self.getCellConnections(row1, col1);
    var conn2 = self.getCellConnections(row2, col2);

    if (row2 === row1 - 1 && col2 === col1) return conn1[0] && conn2[2];
    if (row2 === row1 + 1 && col2 === col1) return conn1[2] && conn2[0];
    if (row2 === row1 && col2 === col1 - 1) return conn1[3] && conn2[1];
    if (row2 === row1 && col2 === col1 + 1) return conn1[1] && conn2[3];

    return false;
  };

  // === Pathfinding ===

  PipeFlow.prototype.findPath = function (start, end) {
    var self = this;
    var queue = [{ row: start.row, col: start.col, path: [] }];
    var visited = new Set();
    visited.add(start.row + '-' + start.col);

    var directions = [
      { row: -1, col: 0 }, { row: 1, col: 0 },
      { row: 0, col: -1 }, { row: 0, col: 1 }
    ];

    while (queue.length > 0) {
      var current = queue.shift();
      if (current.row === end.row && current.col === end.col) {
        return current.path.concat([{ row: current.row, col: current.col }]);
      }
      for (var d = 0; d < directions.length; d++) {
        var dir = directions[d];
        var newRow = current.row + dir.row;
        var newCol = current.col + dir.col;
        var key = newRow + '-' + newCol;
        if (newRow >= 0 && newRow < self.gameState.gridSize &&
            newCol >= 0 && newCol < self.gameState.gridSize &&
            !visited.has(key) &&
            self.areConnected(current.row, current.col, newRow, newCol)) {
          visited.add(key);
          queue.push({
            row: newRow, col: newCol,
            path: current.path.concat([{ row: current.row, col: current.col }])
          });
        }
      }
    }
    return [];
  };

  PipeFlow.prototype.findAllConnectedCellsWithDistance = function (start) {
    var self = this;
    var connected = new Map();
    var queue = [{ row: start.row, col: start.col, distance: 0 }];
    connected.set(start.row + '-' + start.col, 0);

    var directions = [
      { row: -1, col: 0 }, { row: 1, col: 0 },
      { row: 0, col: -1 }, { row: 0, col: 1 }
    ];

    while (queue.length > 0) {
      var current = queue.shift();
      for (var d = 0; d < directions.length; d++) {
        var dir = directions[d];
        var newRow = current.row + dir.row;
        var newCol = current.col + dir.col;
        var key = newRow + '-' + newCol;
        if (newRow >= 0 && newRow < self.gameState.gridSize &&
            newCol >= 0 && newCol < self.gameState.gridSize &&
            !connected.has(key) &&
            self.areConnected(current.row, current.col, newRow, newCol)) {
          var newDistance = current.distance + 1;
          connected.set(key, newDistance);
          queue.push({ row: newRow, col: newCol, distance: newDistance });
        }
      }
    }
    return connected;
  };

  // === Válvula ===

  PipeFlow.prototype.toggleValve = function (row, col) {
    var self = this;
    if (self.gameState.isRunning || self.gameState.gameWon) return;

    var key = row + '-' + col;
    if (!self.gameState.valves.has(key)) return;

    var currentState = self.gameState.valves.get(key);
    self.gameState.valves.set(key, !currentState);

    self.renderGame();
    self.updatePathInfo();
  };

  // === Animación de flujo de agua (Multi-fuente) ===

  PipeFlow.prototype.animateWaterFlowNew = function () {
    var self = this;

    // BFS desde cada fuente
    var sourceReachability = new Map(); // Map<sourceId, Map<cellKey, distance>>
    self.gameState.sources.forEach(function (srcPos, srcId) {
      var reachable = self.findAllConnectedCellsWithDistance(srcPos);
      sourceReachability.set(srcId, reachable);
    });

    // Determinar propiedad: cada celda pertenece a la fuente que llega primero
    var cellOwnership = {}; // "row-col" -> {sourceId, distance}
    var allCellEntries = [];

    sourceReachability.forEach(function (reachable, srcId) {
      reachable.forEach(function (distance, cellKey) {
        if (!cellOwnership[cellKey] || distance < cellOwnership[cellKey].distance) {
          cellOwnership[cellKey] = { sourceId: srcId, distance: distance };
        }
      });
    });

    // Crear lista de animación ordenada por distancia
    var cellKeys = Object.keys(cellOwnership);
    for (var i = 0; i < cellKeys.length; i++) {
      var ck = cellKeys[i];
      var parts = ck.split('-');
      allCellEntries.push({
        row: parseInt(parts[0]),
        col: parseInt(parts[1]),
        distance: cellOwnership[ck].distance,
        sourceId: cellOwnership[ck].sourceId
      });
    }

    allCellEntries.sort(function (a, b) { return a.distance - b.distance; });

    // Verificar resultados por destino
    var destResults = new Map();
    self.gameState.destinations.forEach(function (destPos, destId) {
      var destKey = destPos.row + '-' + destPos.col;
      var reachingSources = [];
      sourceReachability.forEach(function (reachable, srcId) {
        if (reachable.has(destKey)) {
          reachingSources.push(srcId);
        }
      });
      var accepted = self.getDestAcceptedSources(destId);
      var allAcceptedReached = true;
      for (var a = 0; a < accepted.length; a++) {
        if (reachingSources.indexOf(accepted[a]) === -1) {
          allAcceptedReached = false;
          break;
        }
      }
      var noRejectedReached = true;
      for (var r = 0; r < reachingSources.length; r++) {
        if (accepted.indexOf(reachingSources[r]) === -1) {
          noRejectedReached = false;
          break;
        }
      }
      destResults.set(destId, {
        reached: reachingSources,
        correct: allAcceptedReached && noRejectedReached && reachingSources.length > 0,
        allAcceptedReached: allAcceptedReached,
        noRejectedReached: noRejectedReached
      });
    });

    // Detectar fugas reales (tubería abierta apuntando al vacío)
    var leakCell = null;
    var leakFound = false;
    var leakDirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    sourceReachability.forEach(function (reachable, srcId) {
      if (leakFound) return;
      reachable.forEach(function (distance, cellKey) {
        if (leakFound) return;
        var parts = cellKey.split('-');
        var r = parseInt(parts[0]);
        var c = parseInt(parts[1]);
        var ct = self.gameState.grid[r][c];
        if (isSource(ct) || isDestination(ct)) return;

        var conn = self.getCellConnections(r, c);
        for (var d = 0; d < 4; d++) {
          if (!conn[d]) continue;
          var nr = r + leakDirs[d][0];
          var nc = c + leakDirs[d][1];

          if (nr < 0 || nr >= self.gameState.grid.length || nc < 0 || nc >= self.gameState.grid[0].length) {
            leakCell = { row: r, col: c };
            leakFound = true;
            return;
          }

          if (self.gameState.grid[nr][nc] === CELL_TYPES.EMPTY) {
            leakCell = { row: r, col: c };
            leakFound = true;
            return;
          }

          var neighborVisualConn = self.getCellConnectionsVisual(nr, nc);
          if (!neighborVisualConn[(d + 2) % 4]) {
            leakCell = { row: r, col: c };
            leakFound = true;
            return;
          }
        }
      });
    });

    // Animación
    var currentIndex = 0;
    self.gameState.waterPaths = {};
    self.gameState.waterOwnership = {};

    self.gameState.sources.forEach(function (srcPos, srcId) {
      self.gameState.waterPaths[srcId] = [];
    });

    var animateStep = function () {
      if (!self.gameState.isRunning) return;

      if (currentIndex >= allCellEntries.length) {
        self.gameState.isRunning = false;

        var scoringMode = (self.options.behaviour && self.options.behaviour.scoringMode) || 'destinations';
        var score = 0;
        var maxScore = 0;
        var allCorrect = true;
        var failMessages = [];

        if (scoringMode === 'shortestPath') {
          // === Modo B: Camino más corto ===
          // maxScore = camino óptimo, score = max(0, óptimo - diferencia)
          var firstSource = self.gameState.sources.values().next().value;
          var firstDest = self.gameState.destinations.values().next().value;

          if (firstSource && firstDest) {
            // Camino óptimo (todas las válvulas abiertas)
            var shortestLength = self.calculateShortestPath();
            // Camino del jugador (con las válvulas actuales)
            var playerPath = self.findPath(firstSource, firstDest);
            var playerLength = playerPath.length > 0 ? playerPath.length - 2 : 0;

            if (playerLength === 0) {
              // No hay camino: maxScore = óptimo (o 1 si no hay solución), score = 0
              maxScore = (shortestLength !== Infinity && shortestLength > 0) ? shortestLength : 1;
              score = 0;
              allCorrect = false;
              failMessages.push(self.options.messages.noPathMessage);
            } else if (shortestLength === Infinity) {
              // No hay solución posible (error de diseño)
              maxScore = 1;
              score = 0;
              allCorrect = false;
              failMessages.push(self.options.messages.noSolutionMessage);
            } else {
              // maxScore = longitud del camino óptimo
              maxScore = shortestLength;
              // Cada paso extra resta 1 punto
              var diff = playerLength - shortestLength;
              score = Math.max(0, maxScore - diff);
              allCorrect = (diff === 0);
              if (!allCorrect) {
                failMessages.push(
                  self.options.messages.suboptimalPathMessage
                    .replace('@current', playerLength)
                    .replace('@optimal', shortestLength)
                );
              }
            }
          } else {
            maxScore = 1;
            score = 0;
            allCorrect = false;
            failMessages.push(self.options.messages.missingSourceDestMessage);
          }

        } else {
          // === Modo A: Distribución correcta (por defecto) ===
          maxScore = self.gameState.destinations.size;

          destResults.forEach(function (result, destId) {
            if (result.correct) {
              score++;
            } else {
              allCorrect = false;
              var destLabel = self.getDestLabel(destId);
              if (result.reached.length === 0) {
                failMessages.push(
                  self.options.messages.destNoWaterMessage.replace('@dest', destLabel)
                );
              } else if (!result.noRejectedReached) {
                var accepted = self.getDestAcceptedSources(destId);
                var wrongSources = [];
                for (var w = 0; w < result.reached.length; w++) {
                  if (accepted.indexOf(result.reached[w]) === -1) {
                    wrongSources.push(result.reached[w]);
                  }
                }
                var wrongLabels = wrongSources.map(function (id) { return self.getSourceLabel(id); });
                failMessages.push(
                  self.options.messages.destWrongSourceMessage
                    .replace('@dest', destLabel)
                    .replace('@sources', wrongLabels.join(', '))
                );
              } else if (!result.allAcceptedReached) {
                failMessages.push(
                  self.options.messages.destMissingSourceMessage.replace('@dest', destLabel)
                );
              }
            }
          });
        }

        self.score = score;
        self.maxScore = maxScore;
        self.gameState.gameWon = allCorrect;
        self.hideButton('check-answer');

        if (allCorrect) {
          self.setFeedback(self.options.messages.successMessage, score, maxScore);
          self.triggerXAPICompleted(self.score, self.maxScore);
        } else {
          var feedbackMsg = failMessages.length > 0 ?
            failMessages.join(' ') :
            self.options.messages.failureMessage;
          if (leakCell) {
            feedbackMsg += ' ' + self.options.messages.leakMessage;
            self.highlightLeakCell(leakCell.row, leakCell.col);
          }
          self.setFeedback(feedbackMsg, score, maxScore);
          self.triggerXAPIAnswered(self.score, self.maxScore, false);

          // Mostrar "Reintentar" solo si falló
          if (!self.options.behaviour || self.options.behaviour.enableRetry !== false) {
            self.showButton('try-again');
          }
        }
        return;
      }

      var cell = allCellEntries[currentIndex];
      var cellKey = cell.row + '-' + cell.col;
      var ownerSrcId = cellOwnership[cellKey].sourceId;

      if (self.gameState.waterPaths[ownerSrcId]) {
        self.gameState.waterPaths[ownerSrcId].push({ row: cell.row, col: cell.col });
      }
      self.gameState.waterOwnership[cellKey] = ownerSrcId;

      self.renderGame();
      currentIndex++;

      if (self.gameState.isRunning) {
        setTimeout(animateStep, self.options.settings.animationSpeed);
      }
    };

    animateStep();
  };

  PipeFlow.prototype.startWaterFlow = function () {
    var self = this;
    if (self.gameState.isRunning) return;

    self.gameState.isRunning = true;
    self.gameState.waterPaths = {};
    self.gameState.waterOwnership = {};
    self.gameState.sources.forEach(function (srcPos, srcId) {
      self.gameState.waterPaths[srcId] = [];
    });
    self.gameState.gameWon = false;
    self.gameState.leakCell = null;
    self.hideButton('check-answer');

    self.animateWaterFlowNew();
  };

  PipeFlow.prototype.highlightLeakCell = function (row, col) {
    var self = this;
    self.gameState.leakCell = { row: row, col: col };
    self.renderGame();
    setTimeout(function () {
      self.gameState.leakCell = null;
      self.renderGame();
    }, 3000);
  };

  // === Información de caminos ===

  PipeFlow.prototype.calculateShortestPath = function () {
    var self = this;
    var savedValves = new Map();
    self.gameState.valves.forEach(function (value, key) { savedValves.set(key, value); });
    self.gameState.valves.forEach(function (value, key) { self.gameState.valves.set(key, true); });

    var firstSource = self.gameState.sources.values().next().value;
    var firstDest = self.gameState.destinations.values().next().value;
    var path = (firstSource && firstDest) ? self.findPath(firstSource, firstDest) : [];

    self.gameState.valves = savedValves;
    return path.length > 0 ? path.length - 2 : Infinity;
  };

  PipeFlow.prototype.updatePathInfo = function () {
    var self = this;
    if (!self.options.settings.showPathInfo) return;

    var firstSource = self.gameState.sources.values().next().value;
    var firstDest = self.gameState.destinations.values().next().value;
    if (!firstSource || !firstDest) return;

    var currentPath = self.findPath(firstSource, firstDest);
    var currentLength = currentPath.length > 0 ? currentPath.length - 2 : 0;
    var shortestLength = self.calculateShortestPath();

    if (self.currentPathLengthElement) {
      self.currentPathLengthElement.textContent = currentLength > 0 ? (currentLength + ' pasos') : 'Sin camino';
    }
    if (self.shortestPathLengthElement) {
      self.shortestPathLengthElement.textContent = shortestLength !== Infinity ? (shortestLength + ' pasos') : 'Sin solución';
    }
  };

  // === xAPI ===

  PipeFlow.prototype.getxAPIDefinition = function () {
    var self = this;
    var definition = {};
    definition.interactionType = 'other';
    definition.type = 'http://adlnet.gov/expapi/activities/cmi.interaction';
    definition.description = {
      'en-US': 'Pipe Flow Game - Route water from sources to correct destinations',
      'es': 'Juego de Tuberías - Dirige el agua desde las fuentes a los destinos correctos'
    };

    var openValves = [];
    self.gameState.valves.forEach(function (isOpen, key) {
      if (isOpen) {
        var parts = key.split('-');
        openValves.push({ row: parseInt(parts[0]), col: parseInt(parts[1]) });
      }
    });

    definition.extensions = {
      'http://h5p.org/x-api/h5p-local-content-id': self.contentId || 0,
      'https://h5p.org/x-api/pipe-flow-valves': openValves
    };

    return definition;
  };

  PipeFlow.prototype.getxAPIResponse = function () {
    var self = this;
    var openValves = [];
    self.gameState.valves.forEach(function (isOpen, key) {
      if (isOpen) openValves.push(key);
    });
    return openValves.join('[,]');
  };

  PipeFlow.prototype.addQuestionToXAPI = function (xAPIEvent) {
    var definition = xAPIEvent.getVerifiedStatementValue(['object', 'definition']);
    if (definition && typeof $.extend === 'function') {
      $.extend(true, definition, this.getxAPIDefinition());
    }
  };

  PipeFlow.prototype.triggerXAPIAnswered = function (score, maxScore, completion) {
    var self = this;
    var xAPIEvent = self.createXAPIEventTemplate('answered');
    self.addQuestionToXAPI(xAPIEvent);

    var isSuccess = (score === maxScore && completion);
    xAPIEvent.data.statement.result = {
      score: {
        raw: score, min: 0, max: maxScore,
        scaled: maxScore > 0 ? (score / maxScore) : 0
      },
      response: self.getxAPIResponse(),
      success: isSuccess,
      completion: completion || false
    };
    self.trigger(xAPIEvent);
  };


  // === Mouse ===

  PipeFlow.prototype.getCellFromMouse = function (event) {
    var self = this;
    var CANVAS_SIZE = self.options.settings.canvasSize;
    var CELL_SIZE = CANVAS_SIZE / self.gameState.gridSize;
    var rect = self.canvas.getBoundingClientRect();
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

  // === Dibujo ===

  PipeFlow.prototype.drawCell = function (ctx, x, y, size, cellType, waterSourceId, isHovered) {
    var self = this;
    var centerX = x + size / 2;
    var centerY = y + size / 2;
    var pipeWidth = size * 0.2;
    var row = Math.floor(y / size);
    var col = Math.floor(x / size);
    var isLeak = self.gameState.leakCell &&
                 self.gameState.leakCell.row === row &&
                 self.gameState.leakCell.col === col;
    var hasWater = waterSourceId > 0;

    ctx.save();

    // Fondo
    if (isLeak) {
      ctx.fillStyle = '#ffebee';
    } else if (isHovered) {
      ctx.fillStyle = '#f5f5f5';
    } else {
      ctx.fillStyle = '#ffffff';
    }
    ctx.fillRect(x, y, size, size);

    // Borde
    if (isLeak) {
      ctx.strokeStyle = '#f44336';
      ctx.lineWidth = 3;
    } else {
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
    }
    ctx.strokeRect(x, y, size, size);

    // Dibujar tuberías/válvulas
    var shouldDrawPipes = !isSource(cellType) && !isDestination(cellType) && cellType !== CELL_TYPES.EMPTY;

    if (shouldDrawPipes) {
      var connections = self.getCellConnectionsVisual(row, col);
      var waterColor = hasWater ? self.getSourceColor(waterSourceId) : '#666';
      var waterLightColor = hasWater ? self.getSourceLightColor(waterSourceId) : '#999';

      ctx.strokeStyle = waterColor;
      ctx.fillStyle = waterColor;
      ctx.lineWidth = pipeWidth;
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';

      ctx.beginPath();
      if (connections[0]) { ctx.moveTo(centerX, y); ctx.lineTo(centerX, centerY); }
      if (connections[1]) { ctx.moveTo(x + size, centerY); ctx.lineTo(centerX, centerY); }
      if (connections[2]) { ctx.moveTo(centerX, y + size); ctx.lineTo(centerX, centerY); }
      if (connections[3]) { ctx.moveTo(x, centerY); ctx.lineTo(centerX, centerY); }
      ctx.stroke();

      // Partículas de agua animadas
      if (hasWater) {
        var particleSize = pipeWidth * 0.6;
        var particleSpacing = size * 0.4;
        var offset = (self.gameState.animationTime * 0.02) % (particleSpacing * 2);

        ctx.fillStyle = waterLightColor;

        if (connections[0]) {
          var numP = Math.ceil((centerY - y) / particleSpacing) + 1;
          for (var i = 0; i < numP; i++) {
            var pY = centerY - (i * particleSpacing + offset);
            if (pY >= y && pY <= centerY) {
              ctx.beginPath(); ctx.arc(centerX, pY, particleSize / 2, 0, Math.PI * 2); ctx.fill();
            }
          }
        }
        if (connections[1]) {
          var numP2 = Math.ceil((x + size - centerX) / particleSpacing) + 1;
          for (var i2 = 0; i2 < numP2; i2++) {
            var pX = centerX + (i2 * particleSpacing + offset);
            if (pX >= centerX && pX <= x + size) {
              ctx.beginPath(); ctx.arc(pX, centerY, particleSize / 2, 0, Math.PI * 2); ctx.fill();
            }
          }
        }
        if (connections[2]) {
          var numP3 = Math.ceil((y + size - centerY) / particleSpacing) + 1;
          for (var i3 = 0; i3 < numP3; i3++) {
            var pY3 = centerY + (i3 * particleSpacing + offset);
            if (pY3 >= centerY && pY3 <= y + size) {
              ctx.beginPath(); ctx.arc(centerX, pY3, particleSize / 2, 0, Math.PI * 2); ctx.fill();
            }
          }
        }
        if (connections[3]) {
          var numP4 = Math.ceil((centerX - x) / particleSpacing) + 1;
          for (var i4 = 0; i4 < numP4; i4++) {
            var pX4 = centerX - (i4 * particleSpacing + offset);
            if (pX4 >= x && pX4 <= centerX) {
              ctx.beginPath(); ctx.arc(pX4, centerY, particleSize / 2, 0, Math.PI * 2); ctx.fill();
            }
          }
        }
      }

      // Juntas de esquina y T
      var isCorner = cellType === CELL_TYPES.PIPE_L_NE || cellType === CELL_TYPES.PIPE_L_NW ||
                     cellType === CELL_TYPES.PIPE_L_SE || cellType === CELL_TYPES.PIPE_L_SW ||
                     cellType === CELL_TYPES.VALVE_L_NE || cellType === CELL_TYPES.VALVE_L_NW ||
                     cellType === CELL_TYPES.VALVE_L_SE || cellType === CELL_TYPES.VALVE_L_SW;
      var isT = cellType === CELL_TYPES.PIPE_T_EAST || cellType === CELL_TYPES.PIPE_T_NORTH ||
                cellType === CELL_TYPES.PIPE_T_WEST || cellType === CELL_TYPES.PIPE_T_SOUTH ||
                cellType === CELL_TYPES.VALVE_T_EAST || cellType === CELL_TYPES.VALVE_T_NORTH ||
                cellType === CELL_TYPES.VALVE_T_WEST || cellType === CELL_TYPES.VALVE_T_SOUTH;

      if (isCorner || isT) {
        ctx.fillStyle = waterColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pipeWidth / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // === Elementos especiales ===

    if (isSource(cellType)) {
      // Fuente con color configurable
      var srcId = getSourceId(cellType);
      var srcColor = self.getSourceColor(srcId);
      var srcEmoji = self.getSourceEmoji(srcId);

      ctx.fillStyle = srcColor;
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      ctx.strokeStyle = srcColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.35, 0, Math.PI * 2);
      ctx.stroke();

      if (hasWater) {
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      ctx.font = 'bold ' + (size * 0.35) + 'px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000000';
      ctx.fillText(srcEmoji, centerX, centerY);

    } else if (isDestination(cellType)) {
      // Destino con borde del color de fuentes aceptadas
      var dstId = getDestinationId(cellType);
      var dstColor = self.getDestColor(dstId);
      var dstEmoji = self.getDestEmoji(dstId);

      ctx.fillStyle = dstColor;
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Borde punteado con color del destino
      ctx.strokeStyle = dstColor;
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Si hay agua, mostrar anillo con color de la fuente que llegó
      if (hasWater) {
        var waterSrcColor = self.getSourceColor(waterSourceId);
        ctx.strokeStyle = waterSrcColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, size * 0.40, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.font = 'bold ' + (size * 0.35) + 'px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000000';
      ctx.fillText(dstEmoji, centerX, centerY);

    } else if (isValve(cellType)) {
      // Válvula (sin cambios visuales)
      var valveOpen = self.gameState.valves.get(row + '-' + col);
      var valveSize = size * 0.35;

      ctx.fillStyle = (valveOpen === true) ? '#81c784' : '#e57373';
      ctx.strokeStyle = valveOpen ? '#4caf50' : '#c62828';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, valveSize * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = size * 0.08;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (valveOpen === true) {
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
    }

    ctx.restore();
  };

  // === Renderizado ===

  PipeFlow.prototype.renderGame = function () {
    var self = this;
    if (!self.canvas || !self.ctx) return;

    var CANVAS_SIZE = self.options.settings.canvasSize;
    var CELL_SIZE = CANVAS_SIZE / self.gameState.gridSize;

    self.ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    self.ctx.fillStyle = '#f5f5f5';
    self.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    var hasAnyWater = Object.keys(self.gameState.waterOwnership).length > 0;
    if (self.gameState.isRunning && hasAnyWater) {
      self.gameState.animationTime += 1;
    }

    for (var row = 0; row < self.gameState.gridSize; row++) {
      for (var col = 0; col < self.gameState.gridSize; col++) {
        var cellType = self.gameState.grid[row][col];
        var xPos = col * CELL_SIZE;
        var yPos = row * CELL_SIZE;

        var cellKey = row + '-' + col;
        var waterSourceId = self.gameState.waterOwnership[cellKey] || 0;

        var isHovered = self.gameState.hoveredCell &&
                        self.gameState.hoveredCell.row === row &&
                        self.gameState.hoveredCell.col === col;

        self.drawCell(self.ctx, xPos, yPos, CELL_SIZE, cellType, waterSourceId, isHovered);
      }
    }

    if (self.gameState.isRunning && hasAnyWater) {
      requestAnimationFrame(function () {
        if (self.gameState.isRunning) {
          self.renderGame();
        }
      });
    }
  };

  // === Redimensionar ===

  PipeFlow.prototype.resize = function () {
    var self = this;
    if (!self.canvas) return;

    var $container = $(self.canvas).closest('.pipe-flow-container');
    if (!$container || !$container.length) return;

    var containerWidth = $container.parent().width();
    if (!containerWidth || containerWidth <= 0) return;

    var baseWidth = 700;
    var baseFontSize = 16;
    var ratio = containerWidth / baseWidth;
    ratio = Math.max(0.5, Math.min(ratio, 1.5));

    $container.css('font-size', (baseFontSize * ratio) + 'px');

    // Forzar proporción cuadrada del canvas
    var canvasWidth = self.canvas.offsetWidth;
    if (canvasWidth > 0) {
      self.canvas.style.height = canvasWidth + 'px';
    }

    self.renderGame();
  };

  // === xAPI completación ===

  PipeFlow.prototype.triggerXAPICompleted = function (score, maxScore) {
    this.triggerXAPIAnswered(score, maxScore, true);
  };

  PipeFlow.prototype.getXAPIData = function () {
    var self = this;
    var xAPIEvent = self.createXAPIEventTemplate('answered');
    self.addQuestionToXAPI(xAPIEvent);

    var isSuccess = (self.score === self.maxScore && self.gameState.gameWon);
    xAPIEvent.data.statement.result = {
      score: {
        raw: self.score, min: 0, max: self.maxScore,
        scaled: self.maxScore > 0 ? (self.score / self.maxScore) : 0
      },
      response: self.getxAPIResponse(),
      success: isSuccess,
      completion: self.gameState.gameWon
    };

    return { statement: xAPIEvent.data.statement };
  };

  return PipeFlow;
})(H5P.jQuery, H5P.Question);
