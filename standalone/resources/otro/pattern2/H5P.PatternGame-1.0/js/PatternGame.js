var H5P = H5P || {};

H5P.PatternGame = (function ($, Question) {
  'use strict';

  // Constructor principal
  function PatternGame(options, id) {
    const self = this;

    // Llamar al constructor padre de H5P.Question
    Question.call(self, 'pattern-game');

    // Guardar el contentId
    self.contentId = id;

    // Opciones y valores por defecto
    self.options = $.extend(true, {}, {
      instructions: 'Observa la distribución de colores en los elementos de ejemplo; cada elemento está formado por 4 partes y cada parte tiene un color distinto. Los colores disponibles son: rojo, azul, verde y amarillo. Cada elemento debe tener los 4 colores pero en posiciones diferentes. Para los elementos interactuables, asegúrate de que ningún color se repita en la misma parte que en los elementos de ejemplo.',
      referenceElements: [
        { useImage: true }
      ],
      interactiveElements: [
        {
          rows: [
            {
              images: [],
              correctImage: null
            },
            {
              images: [],
              correctImage: null
            },
            {
              images: [],
              correctImage: null
            },
            {
              images: [],
              correctImage: null
            }
          ]
        }
      ],
      messages: {
        successMessage: '¡Excelente! Has encontrado el patrón correcto.',
        failureMessage: 'El patrón no coincide completamente. Sigue intentando.'
      },
      l10n: {
        checkAnswerButtonLabel: 'Comprobar',
        retryButtonLabel: 'Reintentar'
      },
      behaviour: {
        enableRetry: true
      }
    }, options);

    // Leer la cantidad de elementos directamente desde las listas
    // Por defecto: 1 elemento de referencia y 1 elemento interactuable
    self.numReferenceElements = (self.options.referenceElements && self.options.referenceElements.length > 0) ? 
                                self.options.referenceElements.length : 1;
    self.numInteractiveElements = (self.options.interactiveElements && self.options.interactiveElements.length > 0) ? 
                                  self.options.interactiveElements.length : 1;

    // Colores disponibles para rotación (predefinidos)
    self.colorValues = [
      '#e74c3c', // Rojo
      '#3498db', // Azul
      '#2ecc71', // Verde
      '#f1c40f'  // Amarillo
    ];
    
    // Función auxiliar para obtener el índice de un color hexadecimal
    self.getColorIndex = function(hexColor) {
      if (!hexColor) return 0;
      const normalizedColor = hexColor.toLowerCase();
      const index = self.colorValues.indexOf(normalizedColor);
      return index >= 0 ? index : 0;
    };
    
    // Función auxiliar para normalizar rutas de imágenes
    self.normalizePath = function(path) {
      if (!path) return '';
      // Eliminar parámetros como #tmp
      let normalized = path.split('#')[0];
      // Convertir a minúsculas para comparación case-insensitive
      normalized = normalized.toLowerCase();
      // Extraer solo el nombre del archivo para comparación más flexible
      const filename = normalized.split('/').pop();
      return filename;
    };
    
    // Función auxiliar para mezclar un array (Fisher-Yates shuffle)
    self.shuffleArray = function(array) {
      const shuffled = array.slice(); // Crear una copia del array
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Estado del juego - múltiples elementos interactuables
    self.gameState = {
      playerElements: [], // Array de arrays, uno por cada elemento interactuable. Cada array contiene índices de imágenes seleccionadas por fila
      correctImages: [], // Array de arrays, uno por cada elemento interactuable. Cada array contiene las imágenes correctas por fila
      gameWon: false,
      score: 0,
      maxScore: 1
    };

    // Inicializar el juego
    self.initGame();

    // Manejar redimensionamiento
    self.on('resize', self.resize.bind(self));
  }

  // Establecer herencia
  PatternGame.prototype = Object.create(Question.prototype);
  PatternGame.prototype.constructor = PatternGame;

  // Registrar elementos DOM
  PatternGame.prototype.registerDomElements = function () {
    const self = this;

    // Establecer introducción si existe
    if (self.options.instructions) {
      self.setIntroduction(self.options.instructions);
    }

    // Crear contenido del juego
    self.$gameWrapper = self.createGameContent();

    // Registrar contenido principal
    self.setContent(self.$gameWrapper);

    // Registrar botones de acción
    self.registerButtons();

    // Trigger resize inicial
    setTimeout(function() {
      self.trigger('resize');
    }, 100);
  };

  // Crear contenido del juego
  PatternGame.prototype.createGameContent = function () {
    const self = this;

    const $wrapper = $('<div>', {
      'class': 'pattern-game-wrapper'
    });

    // Contenedor de elementos
    const totalElements = self.numReferenceElements + self.numInteractiveElements;
    const $elementsRow = $('<div>', {
      'class': 'elements-row'
    });
    
    // Ajustar grid dinámicamente según el número de elementos
    // Si hay muchos elementos, usar auto-fit, si no, usar columnas específicas
    if (totalElements <= 4) {
      $elementsRow.css('grid-template-columns', 'repeat(' + totalElements + ', 1fr)');
    } else {
      // Para más de 4 elementos, usar auto-fit con minmax
      $elementsRow.css('grid-template-columns', 'repeat(auto-fit, minmax(150px, 1fr))');
    }

    // Crear elementos de referencia
    for (let i = 0; i < self.numReferenceElements; i++) {
      const elementData = self.options.referenceElements[i] || { 
        useImage: true
      };
      const $element = self.createElementContainer(i + 1, elementData);
      $elementsRow.append($element);
    }

    // Crear áreas interactuables
    for (let i = 0; i < self.numInteractiveElements; i++) {
      const $interactiveArea = self.createInteractiveArea(i);
      $elementsRow.append($interactiveArea);
    }

    $wrapper.append($elementsRow);

    return $wrapper;
  };

  // Crear contenedor de elemento
  PatternGame.prototype.createElementContainer = function (elementNum, elementData) {
    const self = this;

    const $container = $('<div>', {
      'class': 'element-container',
      'id': 'element-' + elementNum
    });

    const $label = $('<div>', {
      'class': 'element-label',
      'text': 'Elemento ' + elementNum
    });

    let $image;
    const useImage = elementData.useImage && elementData.image && elementData.image.path;
    
    if (useImage) {
      // Leer el pattern del atributo data-pattern de la imagen si existe
      const pattern = elementData.pattern || '0,1,2,3';
      $image = $('<img>', {
        'class': 'element-image',
        'src': H5P.getPath(elementData.image.path, self.contentId),
        'alt': 'Elemento ' + elementNum,
        'data-pattern': pattern,
        'id': 'img-element-' + elementNum
      });
    } else {
      // Si no usa imagen, usar un patrón por defecto
      const pattern = elementData.pattern || '0,1,2,3';
      $image = self.createVisualElement(pattern);
    }

    $container.append($label);
    $container.append($image);

    return $container;
  };

  // Crear elemento visual (fallback si no hay imagen)
  PatternGame.prototype.createVisualElement = function (pattern) {
    const self = this;
    const colors = pattern.split(',').map(p => parseInt(p.trim()));

    const $element = $('<div>', {
      'class': 'element'
    });

    for (let i = 0; i < 4; i++) {
      const $part = $('<div>', {
        'class': 'element-part',
        'css': {
          'backgroundColor': self.colorValues[colors[i]]
        }
      });
      $element.append($part);
    }

    return $element;
  };

  // Crear área interactiva
  PatternGame.prototype.createInteractiveArea = function (interactiveIndex) {
    const self = this;

    const $area = $('<div>', {
      'class': 'interactive-area',
      'data-interactive-index': interactiveIndex
    });

    const $label = $('<div>', {
      'class': 'interactive-label',
      'text': 'Elemento ' + (self.numReferenceElements + interactiveIndex + 1)
    });

    const $controls = $('<div>', {
      'class': 'controls-container',
      'data-interactive-index': interactiveIndex
    });

    // Obtener configuración de filas para este elemento interactuable
    const interactiveConfig = self.options.interactiveElements && 
                              self.options.interactiveElements[interactiveIndex] ? 
                              self.options.interactiveElements[interactiveIndex] : 
                              null;

    // Detectar si es un array directamente (formato Lumi) o un objeto con rows
    let rows = [];
    if (interactiveConfig) {
      if (Array.isArray(interactiveConfig)) {
        // Formato Lumi: interactiveElements[0] es directamente un array de filas
        rows = interactiveConfig;
      } else if (interactiveConfig.rows && Array.isArray(interactiveConfig.rows)) {
        // Formato esperado: interactiveElements[0] es un objeto con propiedad rows
        rows = interactiveConfig.rows;
      }
    }
    
    // Crear filas de controles
    for (let i = 0; i < rows.length; i++) {
      const rowConfig = rows[i] || { images: [], correctImage: null };
      const images = rowConfig.images || [];
      
      // Si no hay imágenes, saltar esta fila
      if (images.length === 0) continue;

      const $row = $('<div>', {
        'class': 'control-row',
        'data-row': i,
        'data-interactive-index': interactiveIndex
      });

      const $leftArrow = $('<button>', {
        'class': 'arrow-btn left-arrow',
        'data-row': i,
        'data-interactive-index': interactiveIndex,
        'data-direction': '-1',
        'html': '◀',
        'type': 'button'
      });

      const $preview = $('<div>', {
        'class': 'part-preview',
        'id': 'preview-' + interactiveIndex + '-' + i
      });

      // Mostrar la imagen inicial (índice 0)
      const initialImageIndex = self.gameState.playerElements[interactiveIndex] && 
                                self.gameState.playerElements[interactiveIndex][i] !== undefined ?
                                self.gameState.playerElements[interactiveIndex][i] : 0;
      
      if (images[initialImageIndex] && images[initialImageIndex].path) {
        const $img = $('<img>', {
          'src': H5P.getPath(images[initialImageIndex].path, self.contentId),
          'alt': 'Fila ' + (i + 1) + ' - Imagen ' + (initialImageIndex + 1),
          'class': 'part-preview-image',
          'data-image-index': initialImageIndex
        });
        $preview.append($img);
      }

      const $rightArrow = $('<button>', {
        'class': 'arrow-btn right-arrow',
        'data-row': i,
        'data-interactive-index': interactiveIndex,
        'data-direction': '1',
        'html': '▶',
        'type': 'button'
      });

      $row.append($leftArrow);
      $row.append($preview);
      $row.append($rightArrow);

      $controls.append($row);
    }

    $area.append($label);
    $area.append($controls);

    // Event listeners para botones de flecha (deslizar imágenes)
    $area.find('.arrow-btn').on('click', function() {
      const rowIndex = parseInt($(this).data('row'));
      const interactiveIndex = parseInt($(this).data('interactive-index'));
      const direction = parseInt($(this).data('direction'));
      self.changeRowImage(interactiveIndex, rowIndex, direction);
    });

    return $area;
  };

  // Inicializar el juego
  PatternGame.prototype.initGame = function () {
    const self = this;

    // Inicializar estado para cada elemento interactuable
    self.gameState.playerElements = [];
    self.gameState.correctImages = [];
    
    for (let i = 0; i < self.numInteractiveElements; i++) {
      const interactiveConfig = self.options.interactiveElements && 
                                self.options.interactiveElements[i] ? 
                                self.options.interactiveElements[i] : 
                                null;
      
      const rowSelections = []; // Índices de imágenes seleccionadas por fila
      const correctImagesForElement = []; // Imágenes correctas por fila
      
      // Detectar formato: array directo o objeto con rows
      let rows = [];
      if (interactiveConfig) {
        if (Array.isArray(interactiveConfig)) {
          rows = interactiveConfig;
        } else if (interactiveConfig.rows && Array.isArray(interactiveConfig.rows)) {
          rows = interactiveConfig.rows;
        }
      }
      for (let j = 0; j < rows.length; j++) {
        const rowConfig = rows[j] || { images: [], correctImage: null };
        let images = rowConfig.images || [];
        const correctImage = rowConfig.correctImage;
        
        // Asegurar que la imagen correcta esté en el array de imágenes opcionales
        if (correctImage && correctImage.path) {
          const correctImageFilename = self.normalizePath(correctImage.path);
          const isCorrectImageInOptions = images.some(img => 
            img && img.path && self.normalizePath(img.path) === correctImageFilename
          );
          
          // Si la imagen correcta no está en las opciones, agregarla
          if (!isCorrectImageInOptions) {
            images.push(correctImage);
          }
        }
        
        // Mezclar las imágenes aleatoriamente
        if (images.length > 0) {
          images = self.shuffleArray(images);
          // Guardar las imágenes mezcladas de vuelta en la configuración
          rowConfig.images = images;
        }
        
        // Inicializar con la primera imagen (índice 0)
        rowSelections.push(0);
        // Guardar la imagen correcta
        correctImagesForElement.push(correctImage);
      }
      
      self.gameState.playerElements.push(rowSelections);
      self.gameState.correctImages.push(correctImagesForElement);
    }

    self.gameState.gameWon = false;

    // Renderizar controles
    if (self.$gameWrapper) {
      self.renderControls();
    }
  };


  // Renderizar controles
  PatternGame.prototype.renderControls = function () {
    const self = this;

    for (let interactiveIndex = 0; interactiveIndex < self.numInteractiveElements; interactiveIndex++) {
      const interactiveConfig = self.options.interactiveElements && 
                                self.options.interactiveElements[interactiveIndex] ? 
                                self.options.interactiveElements[interactiveIndex] : 
                                null;
      
      // Detectar formato: array directo o objeto con rows
      let rows = [];
      if (interactiveConfig) {
        if (Array.isArray(interactiveConfig)) {
          rows = interactiveConfig;
        } else if (interactiveConfig.rows && Array.isArray(interactiveConfig.rows)) {
          rows = interactiveConfig.rows;
        }
      }
      
      for (let i = 0; i < rows.length; i++) {
        const $preview = self.$gameWrapper.find('#preview-' + interactiveIndex + '-' + i);
        if ($preview.length) {
          const rowConfig = rows[i] || { images: [] };
          const images = rowConfig.images || [];
          
          if (images.length > 0) {
            const currentIndex = self.gameState.playerElements[interactiveIndex] && 
                                self.gameState.playerElements[interactiveIndex][i] !== undefined ?
                                self.gameState.playerElements[interactiveIndex][i] : 0;
            
            // Actualizar la imagen mostrada
            $preview.empty();
            if (images[currentIndex] && images[currentIndex].path) {
              const $img = $('<img>', {
                'src': H5P.getPath(images[currentIndex].path, self.contentId),
                'alt': 'Fila ' + (i + 1) + ' - Imagen ' + (currentIndex + 1),
                'class': 'part-preview-image',
                'data-image-index': currentIndex
              });
              $preview.append($img);
            }
          }
        }
      }
    }
  };

  // Cambiar imagen de una fila
  PatternGame.prototype.changeRowImage = function (interactiveIndex, rowIndex, direction) {
    const self = this;

    if (self.gameState.gameWon) return;

    const interactiveConfig = self.options.interactiveElements && 
                              self.options.interactiveElements[interactiveIndex] ? 
                              self.options.interactiveElements[interactiveIndex] : 
                              null;

    // Detectar formato: array directo o objeto con rows
    let rows = [];
    if (interactiveConfig) {
      if (Array.isArray(interactiveConfig)) {
        rows = interactiveConfig;
      } else if (interactiveConfig.rows && Array.isArray(interactiveConfig.rows)) {
        rows = interactiveConfig.rows;
      }
    }
    
    const rowConfig = rows && rows[rowIndex] ? rows[rowIndex] : { images: [] };
    
    const images = rowConfig.images || [];
    if (images.length === 0) return;

    // Calcular nuevo índice
    const currentIndex = self.gameState.playerElements[interactiveIndex][rowIndex] || 0;
    let newIndex = currentIndex + direction;
    
    // Circular: si es negativo, ir al final; si excede, volver al inicio
    if (newIndex < 0) {
      newIndex = images.length - 1;
    } else if (newIndex >= images.length) {
      newIndex = 0;
    }
    
    self.gameState.playerElements[interactiveIndex][rowIndex] = newIndex;
    self.renderControls();
  };

  // Registrar botones
  PatternGame.prototype.registerButtons = function () {
    const self = this;

    // Botón de verificar
    self.addButton('check-answer', self.options.l10n.checkAnswerButtonLabel || 'Comprobar', function() {
      self.checkAnswer();
    }, true, {
      'aria-label': 'Comprobar respuesta'
    });

    // Botón de reintentar
    if (self.options.behaviour && typeof self.options.behaviour === 'object' && self.options.behaviour.enableRetry) {
      self.addButton('try-again', self.options.l10n.retryButtonLabel || 'Reintentar', function() {
        self.resetTask();
      }, false, {
        'aria-label': 'Reintentar'
      });
    }
  };

  // Verificar respuesta
  PatternGame.prototype.checkAnswer = function () {
    const self = this;

    if (self.gameState.gameWon) return;

    // Calcular el número total de filas y contar las correctas
    let totalRows = 0;
    let correctRows = 0;
    let allCorrect = true;

    for (let interactiveIndex = 0; interactiveIndex < self.numInteractiveElements; interactiveIndex++) {
      const interactiveConfig = self.options.interactiveElements && 
                                self.options.interactiveElements[interactiveIndex] ? 
                                self.options.interactiveElements[interactiveIndex] : 
                                null;

      // Detectar formato: array directo o objeto con rows
      let rows = [];
      if (interactiveConfig) {
        if (Array.isArray(interactiveConfig)) {
          rows = interactiveConfig;
        } else if (interactiveConfig.rows && Array.isArray(interactiveConfig.rows)) {
          rows = interactiveConfig.rows;
        }
      }
      
      const correctImages = self.gameState.correctImages[interactiveIndex] || [];
      
      for (let i = 0; i < rows.length; i++) {
        const rowConfig = rows[i] || { images: [], correctImage: null };
        const images = rowConfig.images || [];
        const correctImage = correctImages[i];
        
        if (!correctImage || !correctImage.path) {
          continue; // Si no hay imagen correcta definida, saltar
        }
        
        // Contar esta fila en el total
        totalRows++;
        
        // Obtener la imagen seleccionada actualmente
        const selectedIndex = self.gameState.playerElements[interactiveIndex] && 
                             self.gameState.playerElements[interactiveIndex][i] !== undefined ?
                             self.gameState.playerElements[interactiveIndex][i] : 0;
        
        const selectedImage = images[selectedIndex];
        
        // Verificar si la imagen seleccionada es la correcta
        // Usar normalización de rutas para comparación más robusta
        if (selectedImage && selectedImage.path && 
            self.normalizePath(selectedImage.path) === self.normalizePath(correctImage.path)) {
          correctRows++;
        } else {
          allCorrect = false;
        }
      }
    }

    // Usar el número total de filas como maxScore
    const maxScore = totalRows > 0 ? totalRows : 1;
    const score = correctRows;

    // Guardar en gameState para xAPI
    self.gameState.score = score;
    self.gameState.maxScore = maxScore;

    // Disparar evento xAPI "answered"
    self.triggerXAPIAnswered();

    if (allCorrect && score === maxScore) {
      self.gameState.gameWon = true;
      self.setFeedback(
        self.options.messages.successMessage,  // content
        score,                                  // score (número de filas correctas)
        maxScore,                               // maxScore (número total de filas)
        '',                                     // scoreBarLabel (opcional)
        '',                                     // helpText (opcional)
        null,                                   // popupSettings (opcional)
        ''                                      // scoreExplanationButtonLabel (opcional)
      );
      self.hideButton('check-answer');
      if (self.options.behaviour && typeof self.options.behaviour === 'object' && self.options.behaviour.enableRetry) {
        self.showButton('try-again');
      }
    } else {
      self.setFeedback(
        self.options.messages.failureMessage,   // content
        score,                                  // score (número de filas correctas)
        maxScore,                               // maxScore (número total de filas)
        '',                                     // scoreBarLabel
        '',                                     // helpText
        null,                                   // popupSettings
        ''                                      // scoreExplanationButtonLabel
      );
      self.hideButton('check-answer');
      // No mostrar botón de reintentar si está deshabilitado
      if (self.options.behaviour && typeof self.options.behaviour === 'object' && self.options.behaviour.enableRetry) {
        self.showButton('try-again');
      }
    }
  };

  // Reiniciar tarea
  PatternGame.prototype.resetTask = function () {
    const self = this;

    self.initGame();
    self.hideButton('try-again');
    self.showButton('check-answer');
    self.removeFeedback();  // Ocultar feedback y scorebar
    self.gameState.gameWon = false;  // Resetear el estado del juego
    self.gameState.score = 0;  // Resetear el score
    self.gameState.maxScore = 1;  // Resetear el maxScore
  };


  // Redimensionar
  PatternGame.prototype.resize = function () {
    const self = this;
    
    if (!self.$gameWrapper || !self.$gameWrapper.length) {
      return;
    }
    
    // Dimensiones base (como Course Presentation)
    const baseWidth = 640;
    const baseHeight = 440;
    const baseFontSize = 16;
    
    // Obtener el contenedor padre
    const $container = self.$gameWrapper.parent();
    if (!$container || !$container.length) {
      return;
    }
    
    // Obtener dimensiones del contenedor
    const containerWidth = $container.width();
    const containerHeight = $container.height();
    
    if (containerWidth <= 0 || containerHeight <= 0) {
      return;
    }
    
    // Calcular ratios
    const widthRatio = containerWidth / baseWidth;
    const heightRatio = containerHeight / baseHeight;
    
    // Determinar el ratio de escalado
    // Cuando la pantalla crece, priorizar el ancho para que los elementos crezcan
    // Cuando se reduce, usar el menor ratio para mantener proporciones
    let scaleRatio;
    if (containerWidth > baseWidth) {
      // Cuando hay más espacio, usar el ancho pero limitar por altura si es necesario
      // Usar 90% del widthRatio para un crecimiento más controlado
      scaleRatio = Math.min(widthRatio * 0.9, heightRatio);
    } else {
      // Cuando es más pequeño, usar el menor ratio para mantener proporciones
      scaleRatio = Math.min(widthRatio, heightRatio);
    }
    
    // Limitar el ratio mínimo para evitar que se haga muy pequeño
    scaleRatio = Math.max(scaleRatio, 0.5);
    // Limitar el ratio máximo para evitar que se haga demasiado grande
    // 2.0 significa que puede crecer hasta el doble del tamaño base
    scaleRatio = Math.min(scaleRatio, 2.0);
    
    // Calcular nuevo font-size
    const newFontSize = baseFontSize * scaleRatio;
    
    // Aplicar font-size al wrapper (esto escalará todos los elementos con em)
    self.$gameWrapper.css('font-size', newFontSize + 'px');
    
    // Ajustar ancho del wrapper: usar el ancho disponible basado en el ratio
    // Permitir que crezca hasta 1280px (2x el tamaño base) cuando hay espacio
    const maxAllowedWidth = 1280;
    const calculatedWidth = baseWidth * scaleRatio;
    
    // Cuando la pantalla crece, usar el ancho calculado pero asegurar que use bien el espacio
    // Si el contenedor es más grande, usar el 95% del contenedor o el ancho calculado, el que sea mayor
    // Esto reduce el espacio vacío a la derecha
    let newWidth;
    if (containerWidth > baseWidth) {
      // Usar el mayor entre el ancho calculado y el 95% del contenedor, pero limitado al máximo
      newWidth = Math.min(Math.max(calculatedWidth, containerWidth * 0.95), maxAllowedWidth);
    } else {
      newWidth = calculatedWidth;
    }
    
    const newHeight = baseHeight * scaleRatio;
    
    self.$gameWrapper.css({
      'width': newWidth + 'px',
      'max-width': maxAllowedWidth + 'px',
      'height': newHeight + 'px',
      'margin': '0 auto' // Centrar si hay espacio extra
    });
  };

  /**
   * Get current score
   * @return {number}
   */
  PatternGame.prototype.getScore = function () {
    return this.gameState.score || 0;
  };

  /**
   * Get maximum score
   * @return {number}
   */
  PatternGame.prototype.getMaxScore = function () {
    return this.gameState.maxScore || 1;
  };

  /**
   * Creates and triggers the xAPI answered event
   */
  PatternGame.prototype.triggerXAPIAnswered = function () {
    const self = this;
    const xAPIEvent = self.createXAPIEventTemplate('answered');
    self.addQuestionToXAPI(xAPIEvent);
    self.addResponseToXAPI(xAPIEvent);
    self.trigger(xAPIEvent);
  };

  /**
   * Get xAPI data.
   * Contract used by report rendering engine.
   *
   * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-6}
   */
  PatternGame.prototype.getXAPIData = function () {
    const self = this;
    const xAPIEvent = self.createXAPIEventTemplate('answered');
    self.addQuestionToXAPI(xAPIEvent);
    self.addResponseToXAPI(xAPIEvent);
    return {
      statement: xAPIEvent.data.statement
    };
  };

  /**
   * Add the question itself to the definition part of an xAPIEvent
   */
  PatternGame.prototype.addQuestionToXAPI = function (xAPIEvent) {
    const self = this;
    const definition = xAPIEvent.getVerifiedStatementValue(['object', 'definition']);
    $.extend(definition, self.getxAPIDefinition());
  };

  /**
   * Generate xAPI object definition used in xAPI statements.
   * @return {Object}
   */
  PatternGame.prototype.getxAPIDefinition = function () {
    const self = this;
    const definition = {};
    definition.interactionType = 'choice';
    definition.type = 'http://adlnet.gov/expapi/activities/cmi.interaction';
    
    // Obtener texto de las instrucciones sin HTML
    const instructionsText = $('<div>' + (self.options.instructions || '') + '</div>').text();
    definition.description = {
      'en-US': instructionsText || 'Pattern matching game'
    };
    
    // Crear patrón de respuestas correctas
    const correctResponsesPattern = self.getCorrectResponsesPattern();
    if (correctResponsesPattern.length > 0) {
      definition.correctResponsesPattern = [correctResponsesPattern.join('[,]')];
    }
    
    return definition;
  };

  /**
   * Get correct responses pattern for xAPI
   * @return {Array}
   */
  PatternGame.prototype.getCorrectResponsesPattern = function () {
    const self = this;
    const pattern = [];
    
    for (let interactiveIndex = 0; interactiveIndex < self.numInteractiveElements; interactiveIndex++) {
      const correctImages = self.gameState.correctImages[interactiveIndex] || [];
      for (let i = 0; i < correctImages.length; i++) {
        const correctImage = correctImages[i];
        if (correctImage && correctImage.path) {
          // Usar el nombre del archivo como identificador
          const filename = self.normalizePath(correctImage.path);
          pattern.push(filename);
        }
      }
    }
    
    return pattern;
  };

  /**
   * Add the response part to an xAPI event
   *
   * @param {H5P.XAPIEvent} xAPIEvent
   *  The xAPI event we will add a response to
   */
  PatternGame.prototype.addResponseToXAPI = function (xAPIEvent) {
    const self = this;
    const score = self.getScore();
    const maxScore = self.getMaxScore();
    const isCorrect = (score === maxScore && maxScore > 0);
    
    xAPIEvent.setScoredResult(score, maxScore, self, true, isCorrect);
    
    // Agregar respuesta del usuario
    const userResponse = self.getUserResponse();
    if (userResponse) {
      xAPIEvent.data.statement.result.response = userResponse;
    }
  };

  /**
   * Get user response as string for xAPI
   * @return {String}
   */
  PatternGame.prototype.getUserResponse = function () {
    const self = this;
    const responses = [];
    
    for (let interactiveIndex = 0; interactiveIndex < self.numInteractiveElements; interactiveIndex++) {
      const playerElements = self.gameState.playerElements[interactiveIndex] || [];
      const interactiveConfig = self.options.interactiveElements && 
                                self.options.interactiveElements[interactiveIndex] ? 
                                self.options.interactiveElements[interactiveIndex] : null;
      
      let rows = [];
      if (interactiveConfig) {
        if (Array.isArray(interactiveConfig)) {
          rows = interactiveConfig;
        } else if (interactiveConfig.rows && Array.isArray(interactiveConfig.rows)) {
          rows = interactiveConfig.rows;
        }
      }
      
      for (let i = 0; i < playerElements.length && i < rows.length; i++) {
        const selectedIndex = playerElements[i];
        const rowConfig = rows[i] || { images: [] };
        const images = rowConfig.images || [];
        const selectedImage = images[selectedIndex];
        
        if (selectedImage && selectedImage.path) {
          const filename = self.normalizePath(selectedImage.path);
          responses.push(filename);
        }
      }
    }
    
    return responses.join('[,]');
  };

  return PatternGame;
})(H5P.jQuery, H5P.Question);
