var H5P = H5P || {};

H5P.PythonTerminal = (function ($, Question) {
  /**
   * Constructor de la Terminal Python
   */
  function PythonTerminal(params, contentId, contentData) {
    // Asegurar que $ existe
    $ = $ || H5P.jQuery || window.jQuery;
    
    var self = this;
    
    // Llamar al constructor de H5P.Question si está disponible
    if (Question) {
      Question.call(self, 'python-terminal');
    }
    
    // Valores por defecto
    const defaults = {
      title: 'Terminal Python Interactiva',
      description: '',
      preloadedCode: '',
      initialCode: '# Escribe tu código Python aquí\nprint("¡Hola, Python!")',
      examples: [],
      showLineNumbers: true,
      theme: 'dark',
      allowInput: true,
      maxOutputLines: 1000,
      enableScoring: false,
      requiredExercises: [],
      passingScore: 70
    };
    
    // Mezclar parámetros
    this.params = {};
    for (var key in defaults) {
      this.params[key] = params && params[key] !== undefined ? params[key] : defaults[key];
    }
    
    this.contentId = contentId;
    this.contentData = contentData || {};
    this.pyodideReady = false;
    this.pyodide = null;
    this.outputLines = [];
    this.currentInput = null;
    this.uploadedFiles = [];
    this.isSending = false; // Flag para prevenir envíos duplicados
    
    // Variables para tracking xAPI
    this.executionHistory = [];
    this.startTime = new Date();
    this.score = 0;
    // Calcular maxScore basado en los ejercicios requeridos
    this.maxScore = (this.params.requiredExercises && Array.isArray(this.params.requiredExercises)) 
      ? this.params.requiredExercises.length 
      : 1;
    this.completedExercises = [];
    
    // Debug: verificar que los parámetros se cargaron correctamente
    if (this.params.enableScoring) {
      console.log('Calificación habilitada');
      console.log('Ejercicios requeridos:', this.params.requiredExercises);
      console.log('Porcentaje para aprobar:', this.params.passingScore);
      console.log('Puntuación máxima:', this.maxScore);
    }
    
    // Restaurar estado previo si existe
    if (this.contentData.previousState) {
      try {
        var previousState = JSON.parse(this.contentData.previousState);
        this.executionHistory = previousState.executionHistory || [];
        this.completedExercises = previousState.completedExercises || [];
        this.score = previousState.score || 0;
      } catch (e) {
        console.warn('No se pudo restaurar estado previo:', e);
      }
    }
  }
  
  // Heredar de H5P.Question si está disponible
  if (Question) {
    PythonTerminal.prototype = Object.create(Question.prototype);
    PythonTerminal.prototype.constructor = PythonTerminal;
  }

  /**
   * Register DOM elements - Método requerido por H5P.Question
   * Este método reemplaza a attach() y es llamado automáticamente por H5P.Question
   */
  PythonTerminal.prototype.registerDomElements = function () {
    var self = this;
    
    // Crear el contenedor principal usando setContent de H5P.Question
    self.createTerminalContent();
    
    // Registrar el contenido principal en H5P.Question
    self.setContent(self.$wrapper);
    
    // Registrar descripción si existe
    if (self.params.description && self.params.description.trim()) {
      self.setIntroduction(self.params.description);
    }

    // Inicializar Ace Editor después de agregar al DOM
    setTimeout(function() {
      self.initAceEditor();
    }, 100);

    // Cargar Pyodide
    self.loadPyodide();
  };

  /**
   * Crear el contenido de la terminal (separado para reutilización)
   */
  PythonTerminal.prototype.createTerminalContent = function () {
    var self = this;
    
    // Asegurar que tenemos jQuery
    $ = $ || H5P.jQuery || window.jQuery;
    
    if (!$) {
      console.error('jQuery no disponible');
      return;
    }
    
    // Crear estructura HTML
    self.$wrapper = $('<div>', {
      class: 'h5p-python-terminal theme-' + self.params.theme
    });

    // Contenedor principal
    var $main = $('<div>', { class: 'terminal-main' });

    // Editor de código
    var $editorSection = $('<div>', { class: 'editor-section' });
    
    var $editorHeader = $('<div>', { class: 'editor-header' });
    $editorHeader.append($('<span>', { text: '📝 Editor Python' }));
    
    // Selector de tema para Ace Editor
    var $themeSelector = $('<select>', { class: 'theme-select' });
    $themeSelector.append($('<option>', { value: 'xcode', text: '☀️ Claro', selected: true }));
    $themeSelector.append($('<option>', { value: 'monokai', text: '🌙 Oscuro' }));
    
    $themeSelector.on('change', function() {
      var theme = $(this).val();
      if (self.aceEditor) {
        self.aceEditor.setTheme('ace/theme/' + theme);
      }
    });
    
    $editorHeader.append($themeSelector);
    
    // Botones de ejemplo
    if (self.params.examples && self.params.examples.length > 0) {
      var $examplesDropdown = $('<select>', { class: 'examples-select' });
      $examplesDropdown.append($('<option>', { 
        value: '', 
        text: '💡 Cargar ejemplo...' 
      }));
      
      self.params.examples.forEach(function(example, idx) {
        $examplesDropdown.append($('<option>', {
          value: idx,
          text: example.name
        }));
      });
      
      $examplesDropdown.on('change', function() {
        var idx = $(this).val();
        if (idx !== '') {
          var example = self.params.examples[idx];
          if (self.aceEditor) {
            self.aceEditor.setValue(example.code, -1);
          }
          $(this).val('');
        }
      });
      
      $editorHeader.append($examplesDropdown);
    }
    
    $editorSection.append($editorHeader);

    // Contenedor para Ace Editor
    var $codeEditor = $('<div>', {
      class: 'code-editor',
      id: 'ace-editor-' + self.contentId
    });
    
    $editorSection.append($codeEditor);
    self.$codeEditorElement = $codeEditor[0];

    // Botones de control
    var $controls = $('<div>', { class: 'terminal-controls' });
    
    var $runBtn = $('<button>', {
      class: 'btn btn-run',
      html: '▶️ Ejecutar',
      title: 'Ejecutar código (Ctrl+Enter)'
    }).on('click', function() {
      self.runCode();
    });
    
    var $saveBtn = $('<button>', {
      class: 'btn btn-save',
      html: '💾 Guardar',
      title: 'Guardar y enviar al LRS (Ctrl+S)'
    }).on('click', function() {
      self.saveAndSubmit();
    });
    
    var $clearBtn = $('<button>', {
      class: 'btn btn-clear',
      html: '🗑️ Limpiar',
      title: 'Limpiar consola'
    }).on('click', function() {
      self.clearOutput();
    });
    
    // Botón para subir archivos
    var $fileInput = $('<input>', {
      type: 'file',
      id: 'file-upload-' + self.contentId,
      style: 'display: none;',
      multiple: true
    }).on('change', function(e) {
      self.handleFileUpload(e.target.files);
    });
    
    var $uploadBtn = $('<button>', {
      class: 'btn btn-upload',
      html: '📁 Subir archivo',
      title: 'Subir archivos para usar en Python'
    }).on('click', function() {
      $fileInput.click();
    });

    $controls.append($runBtn, $saveBtn, $clearBtn, $uploadBtn, $fileInput);
    $editorSection.append($controls);

    $main.append($editorSection);

    // Consola de salida
    var $outputSection = $('<div>', { class: 'output-section' });
    
    var $outputHeader = $('<div>', { class: 'output-header' });
    $outputHeader.append($('<span>', { text: '🖥️ Consola' }));
    
    self.$statusIndicator = $('<span>', { 
      class: 'status-indicator loading',
      text: '⏳ Cargando Python...'
    });
    $outputHeader.append(self.$statusIndicator);
    
    $outputSection.append($outputHeader);

    self.$output = $('<div>', {
      class: 'terminal-output',
      html: '<div class="output-line info">🐍 Iniciando Python (Pyodide)...</div>' +
            '<div class="output-line info">⏳ Esto puede tomar unos segundos la primera vez...</div>'
    });
    
    $outputSection.append(self.$output);

    $main.append($outputSection);
    self.$wrapper.append($main);
  };

  /**
   * Inicializar Ace Editor
   */
  PythonTerminal.prototype.initAceEditor = function() {
    const self = this;
    
    if (!self.$codeEditorElement) {
      console.error('Elemento del editor no encontrado');
      return;
    }
    
    // Ace ya está precargado desde preloadedJs
    if (typeof ace !== 'undefined') {
      try {
        self.aceEditor = ace.edit(self.$codeEditorElement);
        self.aceEditor.setTheme('ace/theme/xcode');
        self.aceEditor.session.setMode('ace/mode/python');
        self.aceEditor.setValue(self.params.initialCode, -1);
        
        // Configuraciones del editor
        self.aceEditor.setOptions({
          fontSize: '14px',
          showPrintMargin: false,
          highlightActiveLine: true,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: false,
          tabSize: 4,
          useSoftTabs: true
        });
        
        // Atajos de teclado
        self.aceEditor.commands.addCommand({
          name: 'run',
          bindKey: { win: 'Ctrl-Enter', mac: 'Cmd-Enter' },
          exec: function() {
            self.runCode(); // Solo ejecutar, no guardar
          }
        });
        
        self.aceEditor.commands.addCommand({
          name: 'save',
          bindKey: { win: 'Ctrl-S', mac: 'Cmd-S' },
          exec: function() {
            self.saveAndSubmit(); // Guardar y enviar al LRS
          }
        });
        
        self.aceEditor.focus();
      } catch (error) {
        console.error('Error al configurar Ace Editor:', error);
      }
    } else {
      console.error('Ace no está disponible');
    }
  };

  /**
   * Cargar Pyodide (Python en WebAssembly)
   */
  PythonTerminal.prototype.loadPyodide = function() {
    const self = this;
    
    // Obtener la ruta base de la librería
    const getLibraryPath = function() {
      if (typeof H5P !== 'undefined' && H5P.getLibraryPath) {
        try {
          return H5P.getLibraryPath('H5P.PythonTerminal-1.1');
        } catch (e) {
          console.warn('H5P.getLibraryPath falló:', e);
        }
      }
      
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].src;
        if (src && src.indexOf('python-terminal.js') > -1) {
          return src.substring(0, src.lastIndexOf('/'));
        }
      }
      
      return '/h5p/content/m3/l5/m3_l5_e1/H5P.PythonTerminal-1.1';
    };
    
    // Cargar Pyodide dinámicamente desde archivos locales
    const libraryPath = getLibraryPath();
    const pyodidePath = libraryPath + '/pyodide';
    
    if (typeof loadPyodide === 'undefined') {
      const script = document.createElement('script');
      script.src = pyodidePath + '/pyodide.js';
      script.onload = function() {
        self.initializePyodide(pyodidePath);
      };
      script.onerror = function(error) {
        console.error('Error al cargar Pyodide:', error);
        self.addOutput('❌ Error al cargar Pyodide desde ' + pyodidePath, 'error');
        self.$statusIndicator.removeClass('loading').addClass('error').text('❌ Error');
      };
      document.head.appendChild(script);
    } else {
      self.initializePyodide(pyodidePath);
    }
  };

  /**
   * Inicializar Pyodide
   */
  PythonTerminal.prototype.initializePyodide = function(pyodidePath) {
    const self = this;
    
    // Usar ruta local si se proporciona, sino CDN
    const indexURL = pyodidePath || 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/';
    
    loadPyodide({
      indexURL: indexURL
    }).then(function(pyodide) {
      self.pyodide = pyodide;
      self.pyodideReady = true;
      
      // Configurar stdout y stderr
      pyodide.setStdout({
        batched: function(text) {
          self.addOutput(text, 'stdout');
        }
      });
      
      pyodide.setStderr({
        batched: function(text) {
          self.addOutput(text, 'stderr');
        }
      });
      
      // Configurar stdin para manejar input()
      if (self.params.allowInput) {
        // Permitir input() con prompt interactivo
        pyodide.setStdin({
          prompt: function(message) {
            // Mostrar el mensaje en la consola
            if (message) {
              self.addOutput(message, 'input-prompt');
            }
            
            // Usar prompt nativo de JavaScript (síncrono)
            // Nota: prompt() bloquea el UI del navegador, pero es necesario para input() en Pyodide
            var userInput = prompt(message || 'Ingrese un valor:');
            
            // Si el usuario cancela el prompt, devolver cadena vacía
            if (userInput === null) {
              userInput = '';
            }
            
            // Mostrar la entrada del usuario en la consola
            if (userInput !== null) {
              self.addOutput('>>> ' + userInput, 'input-value');
            }
            
            // Devolver la entrada del usuario (debe ser síncrono)
            return userInput || '';
          }
        });
      } else {
        // Si allowInput está desactivado, generar error cuando se intente usar input()
        pyodide.setStdin({
          error: true
        });
      }
      
      self.$statusIndicator.removeClass('loading').addClass('ready').text('✅ Listo');
      self.addOutput('✅ Python está listo. ¡Puedes ejecutar tu código!', 'success');
      
      // Mostrar información de calificación si está habilitada
      if (self.params.enableScoring && self.params.requiredExercises && self.params.requiredExercises.length > 0) {
        self.addOutput('', 'info');
        self.addOutput('📝 Modo de evaluación activado', 'info');
        self.addOutput('   Total de ejercicios: ' + self.params.requiredExercises.length, 'info');
        self.addOutput('   Porcentaje para aprobar: ' + self.params.passingScore + '%', 'info');
        self.addOutput('   Ejecuta tu código para ver tu progreso', 'info');
      }
      
      // Ejecutar código pre-cargado si existe
      if (self.params.preloadedCode) {
        self.addOutput('⚙️ Ejecutando código de inicialización...', 'info');
        self.runPythonCode(self.params.preloadedCode, false); // No enviar xAPI en código de inicialización
      }
      
    }).catch(function(error) {
      self.addOutput('❌ Error al inicializar Python: ' + error.message, 'error');
      self.$statusIndicator.removeClass('loading').addClass('error').text('❌ Error');
    });
  };

  /**
   * Ejecutar código Python (sin enviar xAPI)
   */
  PythonTerminal.prototype.runCode = function() {
    const self = this;
    
    if (!self.pyodideReady) {
      self.addOutput('⚠️ Python aún no está listo. Por favor espera...', 'warning');
      return;
    }
    
    const code = self.aceEditor ? self.aceEditor.getValue() : '';
    
    if (!code.trim()) {
      self.addOutput('⚠️ No hay código para ejecutar', 'warning');
      return;
    }
    
    self.addOutput('>>> Ejecutando...', 'command');
    self.runPythonCode(code, false); // false = no enviar xAPI
  };

  /**
   * Guardar y enviar al LRS usando H5P.Question xAPI con verbo "answered"
   */
  PythonTerminal.prototype.saveAndSubmit = function() {
    const self = this;
    
    // Prevenir múltiples envíos simultáneos
    if (self.isSending) {
      return;
    }
    
    const code = self.aceEditor ? self.aceEditor.getValue() : '';
    
    if (!code.trim()) {
      self.addOutput('⚠️ No hay código para guardar', 'warning');
      return;
    }
    
    // Obtener la última ejecución del historial si existe
    const lastExecution = self.executionHistory.length > 0 
      ? self.executionHistory[self.executionHistory.length - 1] 
      : null;
    
    // Validar que exista al menos una ejecución
    if (!lastExecution) {
      self.addOutput('⚠️ Debes ejecutar el código al menos una vez antes de guardar', 'warning');
      return;
    }
    
    self.isSending = true;
    
    // Calcular porcentaje de puntuación
    var scorePercentage = 0;
    if (self.params.enableScoring && self.maxScore > 0) {
      scorePercentage = Math.round((self.score / self.maxScore) * 100);
    }
    
    // Mostrar resumen antes de enviar
    if (self.params.enableScoring && self.params.requiredExercises && self.params.requiredExercises.length > 0) {
      self.addOutput('', 'info');
      self.addOutput('📊 Resumen de calificación:', 'info');
      self.addOutput('   Ejercicios completados: ' + self.completedExercises.length + '/' + self.maxScore, 'info');
      self.addOutput('   Puntuación: ' + self.score + '/' + self.maxScore + ' (' + scorePercentage + '%)', 'info');
      var passed = scorePercentage >= self.params.passingScore;
      self.addOutput('   Estado: ' + (passed ? '✅ Aprobado' : '❌ No aprobado (requiere ' + self.params.passingScore + '%)'), passed ? 'success' : 'warning');
    }
    
    // Crear evento xAPI con verbo "answered" usando H5P.Question
    if (typeof self.createXAPIEventTemplate === 'function') {
      var xAPIEvent = self.createXAPIEventTemplate('answered');
      
      if (xAPIEvent && xAPIEvent.data && xAPIEvent.data.statement) {
        // Configurar el resultado con puntuación
        if (typeof xAPIEvent.setScoredResult === 'function') {
          var success = self.params.enableScoring 
            ? (scorePercentage >= self.params.passingScore) 
            : lastExecution.success;
          xAPIEvent.setScoredResult(self.getScore(), self.getMaxScore(), self, true, success);
        }
        
        // Agregar el response con el código guardado
        if (typeof self.addResponseToXAPI === 'function') {
          self.addResponseToXAPI(xAPIEvent);
        }
        
        // Disparar el evento
        self.trigger(xAPIEvent);
      }
    } else {
      // Fallback: usar triggerXAPICompleted si no está disponible createXAPIEventTemplate
      if (typeof self.triggerXAPICompleted === 'function') {
        self.triggerXAPICompleted(self.getScore(), self.getMaxScore());
      }
    }
    
    self.addOutput('💾 Código guardado y enviado al LRS', 'success');
    
    // Resetear flag después de 1 segundo
    setTimeout(function() {
      self.isSending = false;
    }, 1000);
  };

  /**
   * Ejecutar código Python usando Pyodide
   */
  PythonTerminal.prototype.runPythonCode = function(code, sendXAPI) {
    const self = this;
    
    // sendXAPI es opcional, por defecto false
    sendXAPI = sendXAPI || false;
    
    var executionSuccess = false;
    var executionResult = null;
    var executionError = null;
    
    try {
      // Ejecutar el código
      const result = self.pyodide.runPython(code);
      executionSuccess = true;
      executionResult = result;
      
      // Si hay un resultado (no None), mostrarlo
      if (result !== undefined && result !== null) {
        self.addOutput(String(result), 'result');
      }
      
    } catch (error) {
      // Mostrar error de Python
      executionSuccess = false;
      executionError = error.message;
      self.addOutput(error.message, 'error');
    }
    
    // Registrar ejecución en historial
    var execution = {
      timestamp: new Date().toISOString(),
      code: code,
      success: executionSuccess,
      result: executionResult,
      error: executionError
    };
    
    self.executionHistory.push(execution);
    
    // Verificar ejercicios SIEMPRE cuando enableScoring está habilitado y la ejecución fue exitosa
    // Esto permite que el estudiante vea feedback inmediato al ejecutar código
    if (self.params.enableScoring && executionSuccess && self.params.requiredExercises && self.params.requiredExercises.length > 0) {
      self.checkExerciseCompletion(code, executionSuccess);
    }
    
    // Solo emitir evento xAPI si se solicita explícitamente
    if (sendXAPI) {
      self.triggerXAPIAttempt(code, executionSuccess, executionError, executionResult);
    }
    
    // Guardar estado local (sin enviar xAPI)
    self.saveState();
    
    // Retornar resultado para uso en saveAndSubmit
    return {
      success: executionSuccess,
      result: executionResult,
      error: executionError
    };
  };

  /**
   * Agregar salida a la consola
   */
  PythonTerminal.prototype.addOutput = function(text, type) {
    const self = this;
    
    type = type || 'stdout';
    
    const $line = $('<div>', {
      class: 'output-line ' + type,
      text: text
    });
    
    self.$output.append($line);
    self.outputLines.push($line);
    
    // Limitar número de líneas
    if (self.outputLines.length > self.params.maxOutputLines) {
      self.outputLines.shift().remove();
    }
    
    // Auto-scroll
    self.$output.scrollTop(self.$output[0].scrollHeight);
  };

  /**
   * Limpiar salida
   */
  PythonTerminal.prototype.clearOutput = function() {
    const self = this;
    self.$output.empty();
    self.outputLines = [];
    self.addOutput('🗑️ Consola limpiada', 'info');
  };

  /**
   * Manejar subida de archivos
   */
  PythonTerminal.prototype.handleFileUpload = function(files) {
    const self = this;
    
    if (!self.pyodideReady) {
      self.addOutput('⚠️ Python aún no está listo. Espera a que cargue.', 'warning');
      return;
    }
    
    if (!files || files.length === 0) {
      return;
    }
    
    self.addOutput('📁 Subiendo ' + files.length + ' archivo(s)...', 'info');
    
    // Procesar cada archivo
    Array.from(files).forEach(function(file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        try {
          const content = new Uint8Array(e.target.result);
          
          // Escribir archivo en el sistema de archivos virtual de Pyodide
          self.pyodide.FS.writeFile(file.name, content);
          
          // Guardar en la lista de archivos cargados
          self.uploadedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type
          });
          
          self.addOutput('✅ Archivo cargado: ' + file.name + ' (' + self.formatBytes(file.size) + ')', 'success');
          
          // Sugerencia de uso según tipo de archivo
          if (file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
            self.addOutput('   💡 Ejemplo: open("' + file.name + '", "r").read()', 'info');
          } else if (file.name.endsWith('.json')) {
            self.addOutput('   💡 Ejemplo: import json; json.load(open("' + file.name + '"))', 'info');
          } else {
            self.addOutput('   💡 Usar: open("' + file.name + '", "rb") para archivos binarios', 'info');
          }
          
        } catch (error) {
          self.addOutput('❌ Error al cargar ' + file.name + ': ' + error.message, 'error');
        }
      };
      
      reader.onerror = function() {
        self.addOutput('❌ Error al leer ' + file.name, 'error');
      };
      
      // Leer archivo como ArrayBuffer
      reader.readAsArrayBuffer(file);
    });
  };

  /**
   * Formatear bytes a tamaño legible
   */
  PythonTerminal.prototype.formatBytes = function(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  /**
   * Verificar si se completó un ejercicio requerido
   */
  PythonTerminal.prototype.checkExerciseCompletion = function(code, success) {
    const self = this;
    
    if (!success) {
      // Si hay error, mostrar feedback pero no validar
      return;
    }
    
    // Verificar que requiredExercises existe y es un array
    if (!self.params.requiredExercises || !Array.isArray(self.params.requiredExercises)) {
      console.warn('requiredExercises no está definido o no es un array');
      return;
    }
    
    if (self.params.requiredExercises.length === 0) {
      return;
    }
    
    var exerciseCompleted = false;
    var previousScore = self.score;
    
    self.params.requiredExercises.forEach(function(exercise, index) {
      // Si ya está completado, saltar
      if (self.completedExercises.indexOf(index) !== -1) return;
      
      // Verificar si el código contiene la solución esperada
      if (exercise && exercise.validation && exercise.validation.type === 'contains') {
        // Verificar que keywords existe y es un array
        if (!exercise.validation.keywords || !Array.isArray(exercise.validation.keywords)) {
          console.warn('keywords no está definido para el ejercicio:', exercise.name || index);
          return;
        }
        
        var matches = true;
        var missingKeywords = [];
        
        // Validar palabras clave
        exercise.validation.keywords.forEach(function(keyword) {
          if (keyword && code.indexOf(keyword) === -1) {
            matches = false;
            missingKeywords.push(keyword);
          }
        });
        
        // Validar tipo de dato de entrada si está especificado
        if (matches && exercise.validation.inputType && exercise.validation.inputType !== '') {
          var inputTypeKeyword = exercise.validation.inputType + '(input';
          if (code.indexOf(inputTypeKeyword) === -1) {
            // También verificar si está en una línea separada
            var hasInputType = false;
            var lines = code.split('\n');
            for (var i = 0; i < lines.length; i++) {
              if (lines[i].indexOf('input') !== -1 && lines[i].indexOf(exercise.validation.inputType) !== -1) {
                hasInputType = true;
                break;
              }
            }
            if (!hasInputType && exercise.validation.inputType !== 'str') {
              matches = false;
              missingKeywords.push('conversión a ' + exercise.validation.inputType);
            }
          }
        }
        
        // Validar tipo de dato de salida si está especificado
        if (matches && exercise.validation.outputType && exercise.validation.outputType !== '') {
          // Verificar que el tipo de dato esté en el código (puede estar en variables o directamente en print)
          var hasOutputType = code.indexOf(exercise.validation.outputType) !== -1;
          if (!hasOutputType && exercise.validation.outputType !== 'str') {
            // Si no es string, debe haber conversión explícita
            matches = false;
            missingKeywords.push('tipo de salida ' + exercise.validation.outputType);
          }
        }
        
        if (matches) {
          self.completedExercises.push(index);
          self.score++;
          exerciseCompleted = true;
          var exerciseName = exercise.name || 'Ejercicio ' + (index + 1);
          self.addOutput('', 'info');
          self.addOutput('✅ ¡Ejercicio completado: ' + exerciseName + '! +1 punto', 'success');
          
          // Actualizar maxScore si es necesario
          if (self.maxScore !== self.params.requiredExercises.length) {
            self.maxScore = self.params.requiredExercises.length;
          }
          
          // Mostrar puntuación actual
          var currentPercentage = Math.round((self.score / self.maxScore) * 100);
          self.addOutput('📊 Puntuación actual: ' + self.score + '/' + self.maxScore + ' (' + currentPercentage + '%)', 'info');
        } else if (missingKeywords.length > 0) {
          // Mostrar feedback de qué falta (solo la primera vez que se intenta)
          var exerciseName = exercise.name || 'Ejercicio ' + (index + 1);
          self.addOutput('⚠️ ' + exerciseName + ': Faltan elementos requeridos', 'warning');
        }
      }
    });
    
    // Verificar si completó todos los ejercicios
    if (self.completedExercises.length === self.params.requiredExercises.length && self.params.requiredExercises.length > 0) {
      // Usar triggerXAPICompleted de H5P.Question
      if (typeof self.triggerXAPICompleted === 'function') {
        self.triggerXAPICompleted(self.getScore(), self.getMaxScore());
      }
      
      // Mostrar mensaje de finalización
      self.addOutput('', 'info');
      self.addOutput('🎉 ¡Has completado todos los ejercicios!', 'success');
      var scorePercentage = Math.round((self.score / self.maxScore) * 100);
      self.addOutput('📊 Puntuación final: ' + self.score + '/' + self.maxScore + ' (' + scorePercentage + '%)', 'success');
      var passed = scorePercentage >= self.params.passingScore;
      self.addOutput(passed ? '✅ ¡Aprobado! (Mínimo requerido: ' + self.params.passingScore + '%)' : '❌ Necesitas practicar más (Mínimo requerido: ' + self.params.passingScore + '%)', passed ? 'success' : 'warning');
    }
    
    // Si no se completó ningún ejercicio en esta ejecución, mostrar feedback de progreso
    if (!exerciseCompleted && previousScore === self.score && self.score < self.maxScore) {
      var remaining = self.maxScore - self.score;
      var completed = self.completedExercises.length;
      self.addOutput('📝 Progreso: ' + completed + ' de ' + self.maxScore + ' ejercicios completados (' + remaining + ' restantes)', 'info');
    }
  };

  /**
   * Obtener el código Python guardado como respuesta xAPI
   * @return {string} Código Python del usuario
   */
  PythonTerminal.prototype.getUserXAPIResponse = function() {
    var self = this;
    var code = self.aceEditor ? self.aceEditor.getValue() : '';
    return code || '';
  };

  /**
   * Agregar el response al statement xAPI
   * @param {H5P.XAPIEvent} xAPIEvent - El evento xAPI al que se agregará el response
   */
  PythonTerminal.prototype.addResponseToXAPI = function(xAPIEvent) {
    if (xAPIEvent && xAPIEvent.data && xAPIEvent.data.statement && xAPIEvent.data.statement.result) {
      xAPIEvent.data.statement.result.response = this.getUserXAPIResponse();
    }
  };

  /**
   * Obtener puntuación actual
   */
  PythonTerminal.prototype.getScore = function() {
    return this.score;
  };

  /**
   * Obtener puntuación máxima
   * Método requerido por H5P.Question
   */
  PythonTerminal.prototype.getMaxScore = function() {
    return this.maxScore;
  };

  /**
   * Verificar si se ha dado una respuesta
   * Método requerido por H5P.Question
   */
  PythonTerminal.prototype.getAnswerGiven = function() {
    return this.executionHistory.length > 0 || this.score > 0;
  };

  /**
   * Mostrar soluciones (no aplicable para terminal Python)
   * Método requerido por H5P.Question
   */
  PythonTerminal.prototype.showSolutions = function() {
    // No aplicable para terminal Python
    // El usuario puede ver su código y ejecutarlo
  };

  /**
   * Resetear la tarea
   * Método requerido por H5P.Question
   */
  PythonTerminal.prototype.resetTask = function() {
    var self = this;
    
    // Limpiar el editor
    if (self.aceEditor) {
      self.aceEditor.setValue(self.params.initialCode, -1);
    }
    
    // Limpiar consola
    self.clearOutput();
    
    // Resetear puntuación y ejercicios
    self.score = 0;
    self.completedExercises = [];
    self.executionHistory = [];
    self.startTime = new Date();
    
    // Limpiar archivos subidos
    if (self.pyodide && self.pyodide.FS) {
      self.uploadedFiles.forEach(function(file) {
        try {
          self.pyodide.FS.unlink(file.name);
        } catch (e) {
          // Ignorar errores si el archivo no existe
        }
      });
    }
    self.uploadedFiles = [];
    
    self.addOutput('🔄 Terminal reiniciada', 'info');
  };

  /**
   * Obtener respuesta actual (para guardar estado)
   */
  PythonTerminal.prototype.getCurrentState = function() {
    const self = this;
    
    return JSON.stringify({
      executionHistory: self.executionHistory,
      completedExercises: self.completedExercises,
      score: self.score,
      codeInEditor: self.aceEditor ? self.aceEditor.getValue() : ''
    });
  };

  /**
   * Guardar estado
   */
  PythonTerminal.prototype.saveState = function() {
    const self = this;
    
    if (typeof self.setActivityStarted === 'function') {
      self.setActivityStarted();
    }
    
    // Emitir evento de guardado
    self.trigger('resize');
  };

  return PythonTerminal;
})(H5P.jQuery, H5P.Question);

