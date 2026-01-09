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
        checkAnswerButtonLabel: 'Verificar',
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

    // Estado del juego - múltiples elementos interactuables
    self.gameState = {
      playerElements: [], // Array de arrays, uno por cada elemento interactuable. Cada array contiene índices de imágenes seleccionadas por fila
      correctImages: [], // Array de arrays, uno por cada elemento interactuable. Cada array contiene las imágenes correctas por fila
      gameWon: false
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
                              { rows: [] };

    const rows = interactiveConfig.rows || [];
    
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

      const $rowLabel = $('<span>', {
        'class': 'part-label',
        'text': 'Fila ' + (i + 1)
      });

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
      $row.append($rowLabel);
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
                                { rows: [] };
      
      const rowSelections = []; // Índices de imágenes seleccionadas por fila
      const correctImagesForElement = []; // Imágenes correctas por fila
      
      const rows = interactiveConfig.rows || [];
      for (let j = 0; j < rows.length; j++) {
        const rowConfig = rows[j] || { images: [], correctImage: null };
        // Inicializar con la primera imagen (índice 0)
        rowSelections.push(0);
        // Guardar la imagen correcta
        correctImagesForElement.push(rowConfig.correctImage);
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
                                { rows: [] };
      
      const rows = interactiveConfig.rows || [];
      
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
                              { rows: [] };
    
    const rowConfig = interactiveConfig.rows && interactiveConfig.rows[rowIndex] ? 
                      interactiveConfig.rows[rowIndex] : 
                      { images: [] };
    
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
    self.addButton('check-answer', self.options.l10n.checkAnswerButtonLabel || 'Verificar', function() {
      self.checkAnswer();
    }, true, {
      'aria-label': 'Verificar respuesta'
    });

    // Botón de reintentar
    if (self.options.behaviour.enableRetry) {
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

    // Verificar todos los elementos interactuables
    let allCorrect = true;
    for (let interactiveIndex = 0; interactiveIndex < self.numInteractiveElements; interactiveIndex++) {
      const interactiveConfig = self.options.interactiveElements && 
                                self.options.interactiveElements[interactiveIndex] ? 
                                self.options.interactiveElements[interactiveIndex] : 
                                { rows: [] };
      
      const rows = interactiveConfig.rows || [];
      const correctImages = self.gameState.correctImages[interactiveIndex] || [];
      
      for (let i = 0; i < rows.length; i++) {
        const rowConfig = rows[i] || { images: [], correctImage: null };
        const images = rowConfig.images || [];
        const correctImage = correctImages[i];
        
        if (!correctImage || !correctImage.path) {
          continue; // Si no hay imagen correcta definida, saltar
        }
        
        // Obtener la imagen seleccionada actualmente
        const selectedIndex = self.gameState.playerElements[interactiveIndex] && 
                             self.gameState.playerElements[interactiveIndex][i] !== undefined ?
                             self.gameState.playerElements[interactiveIndex][i] : 0;
        
        const selectedImage = images[selectedIndex];
        
        // Verificar si la imagen seleccionada es la correcta
        if (!selectedImage || !selectedImage.path || 
            selectedImage.path !== correctImage.path) {
          allCorrect = false;
          break;
        }
      }
      if (!allCorrect) break;
    }

    if (allCorrect) {
      self.gameState.gameWon = true;
      self.setScore(1, 1);
      self.showMessage(self.options.messages.successMessage, 'success');
      self.hideButton('check-answer');
      if (self.options.behaviour.enableRetry) {
        self.showButton('try-again');
      }
    } else {
      self.setScore(0, 1);
      self.showMessage(self.options.messages.failureMessage, 'error');
    }
  };

  // Reiniciar tarea
  PatternGame.prototype.resetTask = function () {
    const self = this;

    self.initGame();
    self.hideButton('try-again');
    self.showButton('check-answer');
    self.hideMessage();
    self.setScore(0, 1);
  };

  // Mostrar mensaje
  PatternGame.prototype.showMessage = function (message, type) {
    const self = this;

    const $message = $('<div>', {
      'class': 'pattern-game-message ' + type,
      'text': message
    });

    self.$gameWrapper.find('.pattern-game-message').remove();
    self.$gameWrapper.append($message);

    setTimeout(function() {
      $message.addClass('show');
    }, 10);
  };

  // Ocultar mensaje
  PatternGame.prototype.hideMessage = function () {
    const self = this;
    self.$gameWrapper.find('.pattern-game-message').remove();
  };

  // Redimensionar
  PatternGame.prototype.resize = function () {
    const self = this;
    // Implementar lógica de redimensionamiento si es necesario
  };

  return PatternGame;
})(H5P.jQuery, H5P.Question);
