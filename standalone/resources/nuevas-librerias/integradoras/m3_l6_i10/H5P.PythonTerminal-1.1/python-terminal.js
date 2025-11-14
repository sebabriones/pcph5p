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
      passingScore: 70,
      feedbackLevel: 'detailed'
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
    
    // Variable para capturar salida de stdout para validación
    this.lastOutput = '';
    this.currentExecutionOutput = '';
    
    // Variable para capturar valores de input() para validación en tiempo de ejecución
    this.capturedInputs = [];
    
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
    }).then(async function(pyodide) {
      self.pyodide = pyodide;
      self.pyodideReady = true;
      
      // Configurar stdout y stderr
      pyodide.setStdout({
        batched: function(text) {
          self.addOutput(text, 'stdout');
          // Capturar salida para validación
          self.currentExecutionOutput += text;
          self.lastOutput += text;
        }
      });
      
      pyodide.setStderr({
        batched: function(text) {
          self.addOutput(text, 'stderr');
        }
      });
      
      // Configurar stdin para manejar input()
      if (self.params.allowInput) {
        pyodide.setStdin({
          prompt: function(message) {
            // Limpiar y formatear el mensaje
            var cleanMessage = '';
            if (message !== null && message !== undefined && String(message).trim() !== '') {
              cleanMessage = String(message).trim().replace(/\r\n/g, ' ').replace(/\n/g, ' ');
            }
            if (!cleanMessage || cleanMessage === '') {
              cleanMessage = 'Ingrese un valor:';
            }
            
            // Mostrar el mensaje en la consola
            self.addOutput(cleanMessage, 'input-prompt');
            
            // Usar prompt nativo de JavaScript (síncrono)
            var userInput = prompt(cleanMessage);
            
            // Si el usuario cancela el prompt, devolver cadena vacía
            if (userInput === null) {
              userInput = '';
            }
            
            // CAPTURAR el valor ingresado para validación en tiempo de ejecución
            if (!self.capturedInputs) {
              self.capturedInputs = [];
            }
            self.capturedInputs.push({
              prompt: cleanMessage,
              value: userInput,
              timestamp: new Date().toISOString()
            });
            
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
        await self.runPythonCode(self.params.preloadedCode, false); // No enviar xAPI en código de inicialización
      }
      
    }).catch(function(error) {
      self.addOutput('❌ Error al inicializar Python: ' + error.message, 'error');
      self.$statusIndicator.removeClass('loading').addClass('error').text('❌ Error');
    });
  };

  /**
   * Ejecutar código Python (sin enviar xAPI)
   */
  PythonTerminal.prototype.runCode = async function() {
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
    await self.runPythonCode(code, false); // false = no enviar xAPI
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
      var feedbackLevel = self.params.feedbackLevel || 'detailed';
      
      var passed = scorePercentage >= self.params.passingScore;
      
      if (feedbackLevel === 'minimal') {
        // Nivel mínimo: mostrar puntuación y estado
        self.addOutput('', 'info');
        self.addOutput('📊 Puntuación: ' + self.score + '/' + self.maxScore + ' (' + scorePercentage + '%)', 'info');
        self.addOutput(passed ? '✅ Aprobado' : '❌ No aprobado', passed ? 'success' : 'warning');
      } else if (feedbackLevel === 'medium') {
        // Nivel medio: mostrar puntuación pero sin detalles
        self.addOutput('', 'info');
        self.addOutput('📊 Puntuación: ' + self.score + '/' + self.maxScore + ' (' + scorePercentage + '%)', 'info');
        self.addOutput(passed ? '✅ Aprobado (Mínimo: ' + self.params.passingScore + '%)' : '❌ No aprobado (Mínimo: ' + self.params.passingScore + '%)', passed ? 'success' : 'warning');
      } else {
        // Nivel medio y detallado: mostrar resumen completo
        self.addOutput('', 'info');
        self.addOutput('📊 Resumen de calificación:', 'info');
        self.addOutput('   Ejercicios completados: ' + self.completedExercises.length + '/' + self.maxScore, 'info');
        self.addOutput('   Puntuación: ' + self.score + '/' + self.maxScore + ' (' + scorePercentage + '%)', 'info');
        self.addOutput('   Estado: ' + (passed ? '✅ Aprobado' : '❌ No aprobado (requiere ' + self.params.passingScore + '%)'), passed ? 'success' : 'warning');
      }
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
    }
    
    self.addOutput('💾 Código guardado y enviado al LRS', 'success');
    
    // Resetear flag después de 1 segundo
    setTimeout(function() {
      self.isSending = false;
    }, 1000);
  };

  /**
   * Detectar y cargar paquetes necesarios (como pandas)
   */
  PythonTerminal.prototype.loadRequiredPackages = async function(code) {
    const self = this;
    
    if (!self.pyodide || !self.pyodideReady) {
      return; // Pyodide no está listo
    }
    
    // Detectar import de pandas
    var pandasPattern = /(?:^|\n)\s*(?:import\s+pandas|from\s+pandas\s+import)/;
    if (pandasPattern.test(code)) {
      try {
        // Verificar si pandas ya está cargado usando el namespace de Pyodide
        try {
          var pandasModule = self.pyodide.globals.get('pandas');
          if (pandasModule !== undefined && pandasModule !== null) {
            // pandas ya está cargado
            return;
          }
        } catch (e) {
          // pandas no está en el namespace, continuar para cargarlo
        }
        
        // Cargar pandas
        self.addOutput('📦 Cargando pandas...', 'info');
        await self.pyodide.loadPackage('pandas');
        self.addOutput('✅ pandas cargado correctamente', 'info');
      } catch (error) {
        self.addOutput('⚠️ No se pudo cargar pandas: ' + error.message, 'warning');
        // Continuar de todas formas, el error se mostrará cuando se intente usar
      }
    }
  };

  /**
   * Ejecutar código Python usando Pyodide
   */
  PythonTerminal.prototype.runPythonCode = async function(code, sendXAPI) {
    const self = this;
    
    // sendXAPI es opcional, por defecto false
    sendXAPI = sendXAPI || false;
    
    var executionSuccess = false;
    var executionResult = null;
    var executionError = null;
    
    // Resetear salida capturada para esta ejecución
    self.currentExecutionOutput = '';
    
    // Resetear valores capturados de input() para esta ejecución
    // (mantener solo los de ejecuciones anteriores si es necesario)
    // Nota: Podríamos mantener un historial completo, pero para validación solo necesitamos la última ejecución
    self.capturedInputs = [];
    
    // Cargar paquetes necesarios antes de ejecutar
    await self.loadRequiredPackages(code);
    
    try {
      // Ejecutar el código de forma asíncrona para manejar input() correctamente
      const result = await self.pyodide.runPythonAsync(code);
      executionSuccess = true;
      executionResult = result;
      
      // Si hay un resultado (no None), mostrarlo
      if (result !== undefined && result !== null) {
        var resultStr = String(result);
        self.addOutput(resultStr, 'result');
        // Agregar resultado a la salida capturada
        self.currentExecutionOutput += resultStr;
      }
      
    } catch (error) {
      // Mostrar error de Python
      executionSuccess = false;
      executionError = error.message;
      self.addOutput(error.message, 'error');
    }
    
    // Registrar ejecución en historial (incluyendo salida capturada)
    var execution = {
      timestamp: new Date().toISOString(),
      code: code,
      success: executionSuccess,
      result: executionResult,
      error: executionError,
      output: self.currentExecutionOutput // Agregar salida capturada
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
    // No resetear lastOutput aquí, solo currentExecutionOutput
    // lastOutput se mantiene para historial completo
    self.currentExecutionOutput = '';
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
   * Extraer contenido de f-strings para validación
   * @param {string} code - Código Python a analizar
   * @return {string} Contenido extraído de f-strings concatenado
   */
  PythonTerminal.prototype.extractFStringContent = function(code) {
    var fStringContent = [];
    
    // Patrón para f-strings: f"..." o f'...'
    // Extraer contenido dentro de {} en f-strings
    // Manejar f-strings con comillas simples y dobles
    // Usar un patrón más robusto que maneje saltos de línea y caracteres especiales
    // Mejorar el patrón para manejar comillas anidadas correctamente
    var fStringPattern = /f(["'])/g;
    var match;
    
    while ((match = fStringPattern.exec(code)) !== null) {
      var quoteChar = match[1]; // ' o "
      var startPos = match.index + 2; // Posición después de f" o f'
      var endPos = startPos;
      var escaped = false;
      
      // Buscar la comilla de cierre correspondiente, manejando escapes
      while (endPos < code.length) {
        var char = code[endPos];
        if (escaped) {
          escaped = false;
        } else if (char === '\\') {
          escaped = true;
        } else if (char === quoteChar) {
          // Encontramos la comilla de cierre
          break;
        }
        endPos++;
      }
      
      var fStringBody = '';
      if (endPos < code.length) {
        fStringBody = code.substring(startPos, endPos);
      }
      
      // Extraer contenido dentro de {} (expresiones de f-string)
      // Mejorar el patrón para manejar llaves anidadas y strings con comillas
      // Buscar { seguido de contenido hasta encontrar } que no esté dentro de un string
      var pos = 0;
      while (pos < fStringBody.length) {
        var openBrace = fStringBody.indexOf('{', pos);
        if (openBrace === -1) break;
        
        // Buscar la llave de cierre correspondiente
        var depth = 1;
        var i = openBrace + 1;
        var inSingleQuote = false;
        var inDoubleQuote = false;
        
        while (i < fStringBody.length && depth > 0) {
          var char = fStringBody[i];
          var prevChar = i > 0 ? fStringBody[i - 1] : '';
          
          // Manejar escapes
          if (prevChar === '\\') {
            i++;
            continue;
          }
          
          // Manejar comillas
          if (char === "'" && !inDoubleQuote) {
            inSingleQuote = !inSingleQuote;
          } else if (char === '"' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
          }
          
          // Solo contar llaves si no estamos dentro de un string
          if (!inSingleQuote && !inDoubleQuote) {
            if (char === '{') depth++;
            if (char === '}') depth--;
          }
          
          i++;
        }
        
        if (depth === 0) {
          // Encontramos una expresión completa
          var expression = fStringBody.substring(openBrace + 1, i - 1).trim();
          if (expression.length > 0) {
            fStringContent.push(expression);
          }
        }
        
        pos = i;
      }
    }
    
    var result = fStringContent.join(' ');
    return result;
  };

  /**
   * Detectar si una palabra clave se usa como función (no como string)
   * @param {string} code - Código Python a analizar
   * @param {string} keyword - Palabra clave a buscar
   * @return {boolean} true si se usa como función
   */
  PythonTerminal.prototype.isKeywordUsedAsFunction = function(code, keyword) {
    // Lista de funciones comunes en Python que requieren llamada con paréntesis
    var commonFunctions = ['input', 'print', 'int', 'float', 'str', 'bool', 'len', 'range', 
                          'lower', 'upper', 'title', 'split', 'join', 'strip', 'replace'];
    
    // Lista de métodos de string (se usan con punto: variable.metodo())
    var stringMethods = ['lower', 'upper', 'title', 'capitalize', 'swapcase', 'strip', 
                        'lstrip', 'rstrip', 'split', 'join', 'replace', 'count'];
    
    var keywordLower = keyword.toLowerCase();
    var isStringMethod = stringMethods.indexOf(keywordLower) !== -1;
    
    // Si es un método de string y la keyword es solo el nombre (sin punto), 
    // buscar directamente en f-strings ANTES de procesar (búsqueda más directa)
    if (isStringMethod && !keyword.includes('.')) {
      var escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Buscar directamente f-strings que contengan el método
      // Patrón: f"{...variable.metodo()...}" o f'{...variable.metodo()...}'
      // Busca: f"...{...variable.metodo()...}..."
      var directFStringPattern = new RegExp('f["\'].*\\{[^}]*\\w+\\.' + escapedKeyword + '\\s*\\([^}]*\\}.*["\']', 'g');
      var test1 = directFStringPattern.test(code);
      if (test1) {
        return true;
      }
      
      // También buscar el método sin punto explícito (por si hay espacios o variaciones)
      var directFStringPattern2 = new RegExp('f["\'].*\\{[^}]*' + escapedKeyword + '\\s*\\([^}]*\\}.*["\']', 'g');
      var test2 = directFStringPattern2.test(code);
      if (test2) {
        return true;
      }
    }
    
    // Si no es una función común, no aplicar validación estricta
    if (commonFunctions.indexOf(keywordLower) === -1) {
      return code.indexOf(keyword) !== -1;
    }
    
    // Remover comentarios de línea
    var codeWithoutComments = code.replace(/#.*$/gm, '');
    
    // Extraer contenido de f-strings antes de remover strings
    var fStringContent = this.extractFStringContent(codeWithoutComments);
    
    // Remover strings (simples y dobles) para evitar falsos positivos
    var strings = [];
    var marker = '___STRING_MARKER___';
    var stringIndex = 0;
    
    // Reemplazar strings simples (manejar escapes)
    codeWithoutComments = codeWithoutComments.replace(/'([^'\\]|\\.)*'/g, function(match) {
      strings[stringIndex] = match;
      return marker + stringIndex++ + marker;
    });
    
    // Reemplazar strings dobles (pero NO f-strings todavía)
    // Primero reemplazar f-strings con un marcador especial
    var fStringMarker = '___FSTRING_MARKER___';
    var fStringIndex = 0;
    var fStrings = [];
    codeWithoutComments = codeWithoutComments.replace(/f["']([^"']*)["']/g, function(match) {
      fStrings[fStringIndex] = match;
      return fStringMarker + fStringIndex++ + fStringMarker;
    });
    
    // Ahora reemplazar strings dobles normales
    codeWithoutComments = codeWithoutComments.replace(/"([^"\\]|\\.)*"/g, function(match) {
      strings[stringIndex] = match;
      return marker + stringIndex++ + marker;
    });
    
    // Escapar caracteres especiales de regex
    var escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Si es un método de string, debe usarse con punto: variable.metodo()
    if (isStringMethod) {
      // Patrón para métodos de string: .metodo(
      // Ejemplos: nombre.title(), variable.lower(), texto.upper()
      var stringMethodPattern = new RegExp('\\.' + escapedKeyword + '\\s*\\(', 'g');
      
      // Buscar en código sin strings
      var testCodeWithoutStrings = stringMethodPattern.test(codeWithoutComments);
      if (testCodeWithoutStrings) {
        return true; // Método usado correctamente con paréntesis
      }
      
      // Buscar también en contenido de f-strings
      // El patrón .metodo( debería encontrar .lower( en nombre.lower()
      if (fStringContent && fStringContent.trim().length > 0) {
        // Primero intentar con el patrón estándar
        var testFStringStandard = stringMethodPattern.test(fStringContent);
        if (testFStringStandard) {
          return true; // Método encontrado dentro de f-string
        }
        
        // Si la keyword es solo el nombre del método (sin punto), buscar de forma más flexible
        if (!keyword.includes('.')) {
          // Buscar directamente el método seguido de paréntesis en f-strings
          // Esto detecta "lower(" en "nombre.lower()" - búsqueda más simple y directa
          var simpleMethodPattern = new RegExp(escapedKeyword + '\\s*\\(', 'g');
          var testSimple = simpleMethodPattern.test(fStringContent);
          if (testSimple) {
            return true;
          }
          
          // Buscar el método con punto dentro de f-strings (nombre.lower() o .lower())
          var methodInFString = new RegExp('(\\w+\\.|\\.)' + escapedKeyword + '\\s*\\(', 'g');
          var testMethodInFString = methodInFString.test(fStringContent);
          if (testMethodInFString) {
            return true;
          }
          
          // También buscar solo el nombre del método si está seguido de paréntesis (como palabra completa)
          var methodNameOnly = new RegExp('\\b' + escapedKeyword + '\\s*\\(', 'g');
          var testMethodNameOnly = methodNameOnly.test(fStringContent);
          if (testMethodNameOnly) {
            return true;
          }
        }
      }
      
      // Como último recurso, buscar directamente en el código original (antes de procesar)
      // Esto captura métodos dentro de f-strings que pueden no haberse extraído correctamente
      if (!keyword.includes('.')) {
        // Buscar f-strings que contengan el método
        var fStringWithMethod = new RegExp('f["\']([^"\']*\\{[^}]*' + escapedKeyword + '\\s*\\([^}]*\\}[^"\']*)["\']', 'g');
        var testLastResort = fStringWithMethod.test(code);
        if (testLastResort) {
          return true;
        }
      }
      
      // Verificar si se usa sin paréntesis (incorrecto): .metodo sin (
      var stringMethodWithoutParens = new RegExp('\\.' + escapedKeyword + '(?!\\s*\\()', 'g');
      if (stringMethodWithoutParens.test(codeWithoutComments)) {
        return false; // Método usado sin paréntesis (incorrecto)
      }
      return false; // No se encontró el método
    }
    
    // Patrones para detectar uso como función (funciones normales, no métodos):
    // 1. keyword( - llamada directa
    // 2. = keyword( - asignación
    // 3. (keyword( - dentro de otra función
    // 4. , keyword( - en parámetros
    // 5. [keyword( - en listas/comprehensions
    // 6. espacio o inicio de línea antes de keyword(
    
    var patterns = [
      // Llamada directa: keyword(
      new RegExp('\\b' + escapedKeyword + '\\s*\\(', 'g'),
      // Asignación: = keyword(
      new RegExp('=\\s*' + escapedKeyword + '\\s*\\(', 'g'),
      // En función: (keyword( o ,keyword(
      new RegExp('[,\\(\\[\\s]' + escapedKeyword + '\\s*\\(', 'g')
    ];
    
    // Verificar si alguno de los patrones coincide
    for (var i = 0; i < patterns.length; i++) {
      if (patterns[i].test(codeWithoutComments)) {
        return true;
      }
    }
    
    return false;
  };

  /**
   * Validar que una palabra clave sea una palabra completa, número o palabra con números
   * @param {string} code - Código Python a analizar
   * @param {string} keyword - Palabra clave a buscar
   * @return {boolean} true si es una palabra/número válido
   */
  PythonTerminal.prototype.isValidWordOrNumber = function(code, keyword) {
    // Remover comentarios
    var codeWithoutComments = code.replace(/#.*$/gm, '');
    
    // Extraer contenido de f-strings antes de remover strings
    var fStringContent = this.extractFStringContent(codeWithoutComments);
    
    // Extraer strings normales para buscar patrones de formato dentro de ellos
    // (necesario para detectar :.2f, .2f, etc. dentro de strings de formato)
    var extractedStrings = this.extractStrings(codeWithoutComments);
    
    // Remover strings para evitar falsos positivos
    // Primero reemplazar f-strings con un marcador especial
    var fStringMarker = '___FSTRING_MARKER___';
    var fStringIndex = 0;
    var fStrings = [];
    codeWithoutComments = codeWithoutComments.replace(/f["']([^"']*)["']/g, function(match) {
      fStrings[fStringIndex] = match;
      return fStringMarker + fStringIndex++ + fStringMarker;
    });
    
    // Ahora remover strings normales
    var codeWithoutStrings = codeWithoutComments
      .replace(/'([^'\\]|\\.)*'/g, '')
      .replace(/"([^"\\]|\\.)*"/g, '');
    
    // CASOS ESPECIALES: Detectar patrones específicos antes de validación general
    
    // 0. Patrones de formato dentro de strings (:.2f, .2f, etc.)
    // Estos aparecen dentro de strings de formato como "{:.2f}" o "%.2f"
    if ((keyword.includes(':') || keyword.includes('.')) && /[:.][0-9]/.test(keyword)) {
      var escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var formatPattern = new RegExp(escapedKeyword.replace(/\\\./g, '\\.'), 'g');
      
      // Buscar en strings extraídos
      for (var i = 0; i < extractedStrings.length; i++) {
        if (formatPattern.test(extractedStrings[i])) {
          return true;
        }
      }
      
      // También buscar en f-strings
      if (fStringContent && formatPattern.test(fStringContent)) {
        return true;
      }
    }
    
    // 1. Palabras clave con espacio al final (def , lambda )
    if (keyword.trim().endsWith(' ') && /^(def|lambda|if|else|elif|for|while|with|try|except|finally|class|async|await)\s+$/.test(keyword.trim())) {
      var keywordBase = keyword.trim();
      var pattern = new RegExp('\\b' + keywordBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+', 'g');
      if (pattern.test(codeWithoutStrings) || (fStringContent && pattern.test(fStringContent))) {
        return true;
      }
    }
    
    // 2. Frases completas (import string, from string import)
    if (keyword.includes(' ') && !keyword.trim().endsWith('(') && !keyword.trim().endsWith('.')) {
      var phrasePattern = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (phrasePattern.test(codeWithoutStrings) || (fStringContent && phrasePattern.test(fStringContent))) {
        return true;
      }
    }
    
    // 3. Métodos con punto (string., nombre.)
    if (keyword.endsWith('.') && keyword.length > 1) {
      var dotPattern = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (dotPattern.test(codeWithoutStrings) || (fStringContent && dotPattern.test(fStringContent))) {
        return true;
      }
    }
    
    // 4. Funciones con paréntesis (map(, list(, etc.)
    if (keyword.endsWith('(') && keyword.length > 1) {
      var funcPattern = new RegExp('\\b' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (funcPattern.test(codeWithoutStrings) || (fStringContent && funcPattern.test(fStringContent))) {
        return true;
      }
    }
    
    // Si la keyword es un carácter especial (corchetes, llaves, operadores, etc.)
    // usar búsqueda simple con indexOf
    // EXCEPCIÓN: Los operadores de comparación (==, !=, >=, <=) se manejan más abajo
    if (/^[\[\]{}()+\-*/=<>!@#$%^&|\\,.;:?~`]+$/.test(keyword) && 
        keyword !== '==' && keyword !== '!=' && keyword !== '>=' && keyword !== '<=') {
      // Para patrones de formato que pueden estar en strings, también buscar en strings extraídos
      if ((keyword.includes(':') || keyword.includes('.')) && /[:.][0-9]/.test(keyword)) {
        var escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var formatPattern = new RegExp(escapedKeyword.replace(/\\\./g, '\\.'), 'g');
        for (var i = 0; i < extractedStrings.length; i++) {
          if (formatPattern.test(extractedStrings[i])) {
            return true;
          }
        }
        if (fStringContent && formatPattern.test(fStringContent)) {
          return true;
        }
      }
      return codeWithoutStrings.indexOf(keyword) !== -1;
    }
    
    // Escapar caracteres especiales de regex
    var escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Verificar si es un número puro (solo dígitos)
    if (/^\d+$/.test(keyword)) {
      // Buscar el número como número completo (no parte de otro número)
      // Patrones: número al inicio, después de operadores, después de espacios, etc.
      var numberPattern = new RegExp('(^|[^\\d])' + escapedKeyword + '([^\\d]|$)', 'g');
      return numberPattern.test(codeWithoutStrings);
    }
    
    // Verificar si es una palabra simple que puede contener caracteres acentuados (ej: "contraseña", "nombre")
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ_][a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9_]*$/.test(keyword) && !/[a-zA-Z].*\d|\d.*[a-zA-Z]/.test(keyword)) {
      // Es un identificador válido (variable, función, etc.) que puede contener caracteres acentuados
      // Buscar como palabra completa con límites de palabra
      var wordPattern = new RegExp('\\b' + escapedKeyword + '\\b', 'g');
      
      // Buscar en código sin strings
      if (wordPattern.test(codeWithoutStrings)) {
        return true;
      }
      
      // Buscar también en contenido de f-strings
      if (fStringContent && wordPattern.test(fStringContent)) {
        return true;
      }
      
      // Buscar también en strings literales (necesario para casos como contraseña = "contraseña")
      for (var i = 0; i < extractedStrings.length; i++) {
        var str = extractedStrings[i];
        // Primero intentar con el patrón de límites de palabra
        if (wordPattern.test(str)) {
          return true;
        }
        // Si no funciona (por caracteres acentuados), buscar como substring exacto
        // o con límites de palabra más flexibles (espacios, inicio/fin de string, puntuación)
        var flexiblePattern = new RegExp('(^|[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9_])' + escapedKeyword + '([^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9_]|$)', 'g');
        if (flexiblePattern.test(str)) {
          return true;
        }
        // También verificar si el string es exactamente igual a la keyword
        if (str === keyword) {
          return true;
        }
      }
      
      return false;
    }
    
    // Verificar si es una palabra con números (ej: "m3_l5_e1", "area_rectangulo", "num1")
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(keyword)) {
      // Es un identificador válido de Python (variable, función, etc.)
      // Buscar como palabra completa con límites de palabra
      var wordPattern = new RegExp('\\b' + escapedKeyword + '\\b', 'g');
      
      // Buscar en código sin strings
      if (wordPattern.test(codeWithoutStrings)) {
        return true;
      }
      
      // Buscar también en contenido de f-strings
      if (fStringContent && wordPattern.test(fStringContent)) {
        return true;
      }
      
      // Buscar también en strings literales (necesario para casos como contraseña = "contraseña")
      for (var i = 0; i < extractedStrings.length; i++) {
        var str = extractedStrings[i];
        // Primero intentar con el patrón de límites de palabra
        if (wordPattern.test(str)) {
          return true;
        }
        // Si no funciona (por caracteres acentuados), buscar como substring exacto
        // o con límites de palabra más flexibles (espacios, inicio/fin de string, puntuación)
        var flexiblePattern = new RegExp('(^|[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9_])' + escapedKeyword + '([^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9_]|$)', 'g');
        if (flexiblePattern.test(str)) {
          return true;
        }
        // También verificar si el string es exactamente igual a la keyword
        if (str === keyword) {
          return true;
        }
      }
      
      return false;
    }
    
    // Verificar si contiene números y letras (ej: "m3", "l5", "e1")
    if (/[a-zA-Z].*\d|\d.*[a-zA-Z]/.test(keyword)) {
      // Palabra con números: buscar como palabra completa
      var mixedPattern = new RegExp('\\b' + escapedKeyword + '\\b', 'g');
      
      // Buscar en código sin strings
      if (mixedPattern.test(codeWithoutStrings)) {
        return true;
      }
      
      // Buscar también en contenido de f-strings
      if (fStringContent && mixedPattern.test(fStringContent)) {
        return true;
      }
      
      // Buscar también en strings literales
      for (var i = 0; i < extractedStrings.length; i++) {
        var str = extractedStrings[i];
        // Primero intentar con el patrón de límites de palabra
        if (mixedPattern.test(str)) {
          return true;
        }
        // Si no funciona (por caracteres acentuados), buscar como substring exacto
        // o con límites de palabra más flexibles (espacios, inicio/fin de string, puntuación)
        var flexiblePattern = new RegExp('(^|[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9_])' + escapedKeyword + '([^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9_]|$)', 'g');
        if (flexiblePattern.test(str)) {
          return true;
        }
        // También verificar si el string es exactamente igual a la keyword
        if (str === keyword) {
          return true;
        }
      }
      
      return false;
    }
    
    // Para operadores y símbolos especiales (ej: "=", "+", "**", "==")
    if (/^[+\-*/%=<>!&|]+$/.test(keyword)) {
      // Buscar el operador con contexto válido
      // Evitar que sea parte de otro operador (ej: "=" no debe coincidir con "==")
      var operatorPattern;
      
      if (keyword === '=') {
        // Para "=", buscar que no sea parte de "==", "!=", ">=", "<="
        operatorPattern = new RegExp('(^|[^=!<>])' + escapedKeyword + '([^=]|$)', 'g');
      } else if (keyword === '==') {
        // Para "==", buscar exactamente "=="
        // Buscar == que no sea parte de === (evitar falsos positivos)
        operatorPattern = new RegExp(escapedKeyword + '(?![=])', 'g');
      } else if (keyword === '!=' || keyword === '>=' || keyword === '<=') {
        // Para operadores de comparación compuestos (!=, >=, <=), buscar exactamente el operador
        // Evitar que sea parte de otro operador (ej: != no debe coincidir con !==)
        // Buscar el operador que no esté seguido de otro = (evitar !==, >=, <=)
        operatorPattern = new RegExp(escapedKeyword + '(?![=])', 'g');
      } else if (keyword.length > 1 && keyword[0] === keyword[1]) {
        // Operadores dobles como "**", "//", "&&", "||"
        operatorPattern = new RegExp(escapedKeyword, 'g');
      } else {
        // Otros operadores simples
        var escapedOp = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        operatorPattern = new RegExp('(^|[^' + escapedOp + '])' + escapedKeyword + '([^' + escapedOp + ']|$)', 'g');
      }
      
      // Buscar el operador tanto en el código principal como en expresiones de f-strings
      return operatorPattern.test(codeWithoutStrings) || (fStringContent && operatorPattern.test(fStringContent));
    }
    
    // Para otros casos, usar validación por límite de palabra
    var defaultPattern = new RegExp('\\b' + escapedKeyword + '\\b', 'g');
    return defaultPattern.test(codeWithoutStrings);
  };

  /**
   * Extraer strings del código Python
   * @param {string} code - Código Python a analizar
   * @return {Array} Array de strings encontrados (sin comillas)
   */
  PythonTerminal.prototype.extractStrings = function(code) {
    var strings = [];
    
    // Extraer strings simples (manejar escapes)
    code.replace(/'([^'\\]|\\.)*'/g, function(match) {
      // Remover comillas y procesar escapes
      var content = match.slice(1, -1);
      // Procesar escapes básicos
      content = content.replace(/\\(.)/g, '$1');
      strings.push(content);
      return '';
    });
    
    // Extraer strings dobles (manejar escapes)
    code.replace(/"([^"\\]|\\.)*"/g, function(match) {
      // Remover comillas y procesar escapes
      var content = match.slice(1, -1);
      // Procesar escapes básicos
      content = content.replace(/\\(.)/g, '$1');
      strings.push(content);
      return '';
    });
    
    return strings;
  };

  /**
   * Validar formato de string (solo letras, solo números, o letras y números)
   * @param {string} str - String a validar
   * @param {string} format - Formato esperado: 'letters_only', 'numbers_only', 'letters_and_numbers'
   * @return {boolean} true si el string cumple con el formato
   */
  PythonTerminal.prototype.validateStringFormat = function(str, format) {
    if (!format || format === '') {
      return true; // Sin restricción de formato
    }
    
    // Remover espacios para validación (los espacios se permiten en todos los formatos)
    var strWithoutSpaces = str.replace(/\s/g, '');
    
    if (format === 'letters_only') {
      // Solo letras (incluyendo acentos y caracteres especiales de español)
      // Permitir: a-z, A-Z, áéíóú, ñ, ü, etc.
      var lettersPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/;
      var result = lettersPattern.test(strWithoutSpaces) || strWithoutSpaces === '';
      return result;
    }
    
    if (format === 'numbers_only') {
      // Solo números (0-9)
      var numbersPattern = /^[0-9]+$/;
      return numbersPattern.test(strWithoutSpaces) || strWithoutSpaces === '';
    }
    
    if (format === 'letters_and_numbers') {
      // Letras y números (a-z, A-Z, 0-9, acentos)
      var mixedPattern = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]+$/;
      return mixedPattern.test(strWithoutSpaces) || strWithoutSpaces === '';
    }
    
    if (format === 'letters_numbers_and_special') {
      // Letras y caracteres especiales comunes (a-z, A-Z, acentos, :, ., ,, ;, !, ?, -, _, etc.)
      // Permitir letras, acentos y caracteres especiales comunes de puntuación y símbolos (SIN números)
      var lettersSpecialPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s:.,;!?\-_()\[\]{}'"\/\\+=*&%$#@~`|<>]+$/;
      return lettersSpecialPattern.test(str) || str === '';
    }
    
    return true; // Formato desconocido, no restringir
  };

  /**
   * Normalizar patrón regex para corregir doble escape
   * @param {string} pattern - Patrón regex que puede tener doble escape
   * @return {string} Patrón normalizado
   */
  PythonTerminal.prototype.normalizeRegexPattern = function(pattern) {
    if (!pattern) return pattern;
    
    // Si el patrón tiene doble escape (\\\\), reducirlo a escape simple (\\)
    // Esto corrige el problema cuando H5P guarda el JSON con doble escape
    // Ejemplo: "\\\\d" se convierte en "\\d" (correcto para RegExp)
    // Nota: En JavaScript, cuando se lee del JSON parseado, \\\\ ya se convierte a \\,
    // pero si hay un escape adicional en el almacenamiento, esto lo corrige
    var normalized = pattern.replace(/\\\\/g, '\\');
    
    return normalized;
  };

  /**
   * Validar listas según configuración
   * @param {string} code - Código Python ejecutado
   * @param {Object} exercise - Ejercicio con validación
   * @return {Object} {valid: boolean, errors: Array}
   */
  PythonTerminal.prototype.validateLists = function(code, exercise) {
    const self = this;
    var errors = [];
    var valid = true;
    
    if (!exercise.validation || !exercise.validation.listValidation || !Array.isArray(exercise.validation.listValidation)) {
      return {valid: true, errors: []};
    }
    
    var listValidation = exercise.validation.listValidation;
    
    // Si no hay listas para validar, retornar válido
    if (listValidation.length === 0) {
      return {valid: true, errors: []};
    }
    
    try {
      // Acceder al namespace global de Pyodide
      var pyodide = self.pyodide;
      if (!pyodide || !pyodide.globals) {
        return {valid: false, errors: ['Pyodide no está inicializado. Ejecuta el código primero.']};
      }
      
      // Validar cada lista configurada
      for (var i = 0; i < listValidation.length; i++) {
        var listConfig = listValidation[i];
        var varName = listConfig.variableName;
        
        if (!varName || varName.trim() === '') continue;
        
        // Obtener la variable del namespace de Python
        try {
          var pythonList = pyodide.globals.get(varName);
          
          if (pythonList === undefined || pythonList === null) {
            errors.push('La variable \'' + varName + '\' no está definida');
            valid = false;
            continue;
          }
          
          // Verificar que sea una lista o tupla
          // Intentar convertir a JavaScript
          var jsList = null;
          try {
            if (pythonList.toJs && typeof pythonList.toJs === 'function') {
              jsList = pythonList.toJs({depth: 1});
            } else {
              // Intentar acceder directamente si es un proxy de Pyodide
              jsList = pythonList;
            }
          } catch (e) {
            errors.push('Error al convertir \'' + varName + '\' a JavaScript: ' + e.message);
            valid = false;
            continue;
          }
          
          if (!Array.isArray(jsList)) {
            errors.push('\'' + varName + '\' no es una lista (tipo: ' + typeof jsList + ')');
            valid = false;
            continue;
          }
          
          // Validar tamaño
          var listSize = jsList.length;
          
          // Validar tamaño mínimo
          if (listConfig.minSize !== undefined && listConfig.minSize !== null && listSize < listConfig.minSize) {
            errors.push('\'' + varName + '\' debe tener al menos ' + listConfig.minSize + ' elementos (tiene ' + listSize + ')');
            valid = false;
          }
          
          // Validar tamaño máximo
          if (listConfig.maxSize !== undefined && listConfig.maxSize !== null && listSize > listConfig.maxSize) {
            errors.push('\'' + varName + '\' debe tener como máximo ' + listConfig.maxSize + ' elementos (tiene ' + listSize + ')');
            valid = false;
          }
          
          // Validar que tenga el mismo tamaño que otra lista
          if (listConfig.mustMatchSize && listConfig.mustMatchSize.trim() !== '') {
            try {
              var otherList = pyodide.globals.get(listConfig.mustMatchSize);
              if (otherList === undefined || otherList === null) {
                errors.push('La variable \'' + listConfig.mustMatchSize + '\' no está definida');
                valid = false;
              } else {
                var otherJsList = null;
                try {
                  if (otherList.toJs && typeof otherList.toJs === 'function') {
                    otherJsList = otherList.toJs({depth: 1});
                  } else {
                    otherJsList = otherList;
                  }
                } catch (e) {
                  errors.push('Error al convertir \'' + listConfig.mustMatchSize + '\' a JavaScript: ' + e.message);
                  valid = false;
                  continue;
                }
                
                if (!Array.isArray(otherJsList)) {
                  errors.push('\'' + listConfig.mustMatchSize + '\' no es una lista');
                  valid = false;
                } else if (listSize !== otherJsList.length) {
                  errors.push('\'' + varName + '\' debe tener el mismo tamaño que \'' + listConfig.mustMatchSize + '\' (' + listSize + ' vs ' + otherJsList.length + ')');
                  valid = false;
                }
              }
            } catch (e) {
              errors.push('Error al validar tamaño con \'' + listConfig.mustMatchSize + '\': ' + e.message);
              valid = false;
            }
          }
          
          // Validar tipo de elementos
          if (listConfig.elementType && listConfig.elementType.trim() !== '') {
            var expectedType = listConfig.elementType;
            for (var j = 0; j < jsList.length; j++) {
              var element = jsList[j];
              var elementType = typeof element;
              var typeMatches = false;
              
              // Mapear tipos de JavaScript a Python
              if (expectedType === 'str') {
                // String puede ser string de JS o String object
                typeMatches = (elementType === 'string' || element instanceof String);
              } else if (expectedType === 'int') {
                // Entero debe ser número y entero
                typeMatches = (elementType === 'number' && Number.isInteger(element));
              } else if (expectedType === 'float') {
                // Float es cualquier número
                typeMatches = (elementType === 'number');
              } else if (expectedType === 'bool') {
                // Booleano
                typeMatches = (elementType === 'boolean');
              }
              
              if (!typeMatches) {
                var elementStr = String(element);
                if (elementStr.length > 20) {
                  elementStr = elementStr.substring(0, 20) + '...';
                }
                errors.push('El elemento en índice ' + j + ' de \'' + varName + '\' debe ser de tipo ' + expectedType + ' (es ' + elementType + ': ' + elementStr + ')');
                valid = false;
              }
            }
          }
          
          // Validar valores permitidos
          if (listConfig.allowedValues && Array.isArray(listConfig.allowedValues) && listConfig.allowedValues.length > 0) {
            for (var j = 0; j < jsList.length; j++) {
              var element = String(jsList[j]);
              var isValidValue = false;
              
              for (var k = 0; k < listConfig.allowedValues.length; k++) {
                if (element === String(listConfig.allowedValues[k])) {
                  isValidValue = true;
                  break;
                }
              }
              
              if (!isValidValue) {
                var elementStr = element;
                if (elementStr.length > 20) {
                  elementStr = elementStr.substring(0, 20) + '...';
                }
                errors.push('El elemento en índice ' + j + ' de \'' + varName + '\' tiene un valor no permitido: ' + elementStr + '. Valores permitidos: ' + listConfig.allowedValues.join(', '));
                valid = false;
              }
            }
          }
          
        } catch (e) {
          errors.push('Error al validar \'' + varName + '\': ' + e.message);
          valid = false;
        }
      }
      
    } catch (e) {
      errors.push('Error general en validación de listas: ' + e.message);
      valid = false;
    }
    
    return {valid: valid, errors: errors};
  };

  /**
   * Validar que los strings en el código cumplan con el formato esperado
   * @param {string} code - Código Python a analizar
   * @param {string} format - Formato esperado
   * @param {string} context - 'input' o 'output' para contexto
   * @param {Array} capturedInputs - Valores capturados de input() (opcional, para validación en tiempo de ejecución)
   * @param {string} executionOutput - Salida capturada de la ejecución (opcional, para validación en tiempo de ejecución)
   * @return {boolean} true si hay al menos un string que cumple el formato
   */
  PythonTerminal.prototype.validateStringsInCode = function(code, format, context, capturedInputs, executionOutput) {
    if (!format || format === '') {
      return true; // Sin restricción de formato
    }
    
    // Validación en tiempo de ejecución: usar valores capturados
    if (context === 'input' && capturedInputs && capturedInputs.length > 0) {
      // Validar el último valor ingresado (o todos si es necesario)
      var lastInput = capturedInputs[capturedInputs.length - 1];
      if (lastInput && lastInput.value !== null && lastInput.value !== undefined) {
        return this.validateStringFormat(lastInput.value, format);
      }
    }
    
    if (context === 'output' && executionOutput && executionOutput !== '') {
      // Remover el prompt de input() de la salida capturada
      // Los prompts suelen tener el formato: "texto: " al inicio
      var cleanedOutput = executionOutput;
      
      // Buscar y remover prompts comunes (texto seguido de ": " al inicio)
      // Ejemplo: "Ingresa nombre: seba" -> "seba"
      var promptPattern = /^[^:]*:\s*/;
      if (promptPattern.test(cleanedOutput)) {
        cleanedOutput = cleanedOutput.replace(promptPattern, '');
      }
      
      // También remover si empieza con "Ingresa" o "Ingrese" (sin dos puntos)
      if (cleanedOutput.indexOf('Ingresa') === 0 || cleanedOutput.indexOf('Ingrese') === 0) {
        // Encontrar donde termina el prompt (después de ": ")
        var colonIndex = cleanedOutput.indexOf(':');
        if (colonIndex !== -1) {
          cleanedOutput = cleanedOutput.substring(colonIndex + 1).trim();
        }
      }
      
      // Dividir la salida en líneas y validar cada una individualmente
      // Esto permite validar correctamente cuando hay múltiples líneas de salida
      var lines = cleanedOutput.split(/\r?\n/);
      
      // Si no hay saltos de línea, intentar detectar múltiples valores concatenados
      // Esto puede pasar cuando los print() no agregan saltos de línea en la captura
      if (lines.length === 1 && cleanedOutput.length > 0) {
        // Intentar detectar transiciones entre mayúsculas/minúsculas/título
        // Ejemplo: "sebaSEBASeba" -> ["seba", "SEBA", "Seba"]
        // Buscar transiciones: minúscula->MAYÚSCULA, MAYÚSCULA->Título, etc.
        var detectedLines = [];
        var currentLine = '';
        var previousCase = null; // 'lower', 'upper', 'title', null
        
        for (var j = 0; j < cleanedOutput.length; j++) {
          var char = cleanedOutput[j];
          var isUpper = /[A-ZÁÉÍÓÚÑÜ]/.test(char);
          var isLower = /[a-záéíóúñü]/.test(char);
          var isLetter = isUpper || isLower;
          
          if (isLetter) {
            var currentCase = isUpper ? 'upper' : 'lower';
            
            // Detectar transición de caso (ej: "seba" -> "SEBA")
            if (previousCase !== null && previousCase !== currentCase) {
              // Si hay una transición clara (minúscula a MAYÚSCULA o viceversa)
              // y la línea actual tiene al menos 2 caracteres, considerar nueva línea
              if (currentLine.length >= 2) {
                detectedLines.push(currentLine);
                currentLine = char;
              } else {
                currentLine += char;
              }
            } else {
              currentLine += char;
            }
            
            previousCase = currentCase;
          } else {
            // Carácter no letra (espacio, número, etc.)
            currentLine += char;
            if (char === ' ' || char === '\t') {
              previousCase = null; // Reset en espacios
            }
          }
        }
        
        // Agregar la última línea
        if (currentLine.trim() !== '') {
          detectedLines.push(currentLine);
        }
        
        // Si detectamos múltiples líneas, usarlas; si no, usar la original
        if (detectedLines.length > 1) {
          lines = detectedLines;
        }
      }
      
      var validLinesFound = 0;
      var totalValidLines = 0; // Contar líneas que deben ser validadas (no vacías, no filtradas)
      
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim(); // Remover espacios al inicio/final
        
        // Filtrar líneas que parecen ser prompts o valores ingresados
        // (líneas que empiezan con ">>> " o contienen prompts comunes)
        // También filtrar líneas que terminan con ":" (prompts de input como "Edad:", "Sueldo:", etc.)
        if (line.indexOf('>>> ') === 0 || 
            line.indexOf('Ingresa') === 0 || 
            line.indexOf('Ingrese') === 0 ||
            line.indexOf('Nombre:') === 0 ||
            line.indexOf('nombre:') === 0 ||
            (line.length > 0 && line[line.length - 1] === ':')) {
          continue; // Saltar estas líneas
        }
        
        if (line !== '') { // Ignorar líneas vacías
          totalValidLines++; // Esta línea debe ser validada
          var isValid = this.validateStringFormat(line, format);
          if (isValid) {
            validLinesFound++;
          }
        }
      }
      
      // Validación estricta: TODAS las líneas deben cumplir el formato
      if (totalValidLines > 0) {
        var allLinesValid = validLinesFound === totalValidLines;
        return allLinesValid; // Todas las líneas deben cumplir el formato
      }
      // Si no hay líneas válidas para validar, continuar con el fallback
      // (no retornar false aquí, permitir que el código continúe con el fallback)
    }
    
    // Fallback: validación desde código fuente (solo para strings literales)
    // Si el contexto es 'input', el valor viene del usuario en tiempo de ejecución
    // No podemos validar el formato desde el código fuente, así que aceptamos
    if (context === 'input') {
      // Verificar que haya un input() en el código
      var hasInput = /input\s*\(/.test(code);
      if (hasInput) {
        return true; // Aceptar automáticamente si hay input() (sin valores capturados)
      }
    }
    
    // Si el contexto es 'output', el valor puede venir de variables o métodos
    // No podemos validar el formato desde el código fuente, así que aceptamos
    if (context === 'output') {
      // Verificar que haya métodos de string o variables en print()
      // Incluir también string.capwords y otras funciones del módulo string
      var hasStringMethods = /\.(lower|upper|title|capitalize|swapcase|strip|lstrip|rstrip)\s*\(/.test(code);
      var hasStringModule = /(import\s+string|from\s+string\s+import|string\.(capwords|lower|upper|title|capitalize))/.test(code);
      var hasPrintWithVariable = /print\s*\([^)]*[a-zA-Z_][a-zA-Z0-9_]*/.test(code);
      if (hasStringMethods || hasStringModule || hasPrintWithVariable) {
        return true; // Aceptar automáticamente si hay métodos de string o variables
      }
    }
    
    var strings = this.extractStrings(code);
    
    if (strings.length === 0) {
      // Si no hay strings literales, puede ser que use variables
      // En este caso, no podemos validar el contenido, así que aceptamos
      return true;
    }
    
    // Validar que al menos un string cumpla con el formato
    for (var i = 0; i < strings.length; i++) {
      if (this.validateStringFormat(strings[i], format)) {
        return true; // Al menos un string cumple
      }
    }
    
    return false; // Ningún string cumple el formato
  };

  /**
   * Verificar si hay una asignación correcta con el operador =
   * @param {string} code - Código Python a analizar
   * @return {boolean} true si hay una asignación válida (no comparación)
   */
  PythonTerminal.prototype.hasValidAssignment = function(code) {
    // Remover comentarios
    var codeWithoutComments = code.replace(/#.*$/gm, '');
    
    // Remover strings
    var strings = [];
    var marker = '___STRING_MARKER___';
    var stringIndex = 0;
    
    codeWithoutComments = codeWithoutComments.replace(/'([^'\\]|\\.)*'/g, function(match) {
      strings[stringIndex] = match;
      return marker + stringIndex++ + marker;
    });
    
    codeWithoutComments = codeWithoutComments.replace(/"([^"\\]|\\.)*"/g, function(match) {
      strings[stringIndex] = match;
      return marker + stringIndex++ + marker;
    });
    
    // Buscar patrón de asignación: variable = valor (no ==)
    var assignmentPattern = /[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*[^=]/;
    return assignmentPattern.test(codeWithoutComments);
  };

  /**
   * Decodificar entidades HTML comunes
   * @param {string} str - String con entidades HTML
   * @return {string} String decodificado
   */
  PythonTerminal.prototype.decodeHTMLEntities = function(str) {
    if (!str) return str;
    
    // Intentar usar el método del DOM si está disponible
    if (typeof document !== 'undefined') {
      var textarea = document.createElement('textarea');
      textarea.innerHTML = str;
      var decoded = textarea.value;
      
      // Si el método del textarea funcionó, retornar
      if (decoded !== str) {
        return decoded;
      }
    }
    
    // Fallback: reemplazos manuales de entidades HTML comunes
    return str
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
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
    
    // Obtener nivel de feedback configurado
    var feedbackLevel = self.params.feedbackLevel || 'detailed';
    
    var exerciseCompleted = false;
    var previousScore = self.score;
    
    self.params.requiredExercises.forEach(function(exercise, index) {
      // SIEMPRE revalidar, incluso si ya está completado
      // Esto permite detectar cuando un ejercicio que estaba correcto ahora falla
      var wasCompleted = self.completedExercises.indexOf(index) !== -1;
      
      // Verificar si el código contiene la solución esperada
      if (exercise && exercise.validation) {
        // Validación tipo "contains" (palabras clave en código)
        if (exercise.validation.type === 'contains') {
        // Verificar que keywords existe y es un array
        // Si no existe, inicializarlo como array vacío (permitir solo keywordGroups o listValidation)
        if (!exercise.validation.keywords || !Array.isArray(exercise.validation.keywords)) {
          // Inicializar keywords como array vacío si no existe
          // Esto permite usar solo keywordGroups o solo listValidation sin necesidad de keywords
          exercise.validation.keywords = [];
        }
        
        var matches = true;
        var missingKeywords = [];
        var foundKeywords = [];
        
        // Verificar si la validación estricta está habilitada (por defecto true)
        var strictValidation = exercise.validation.strictValidation !== false;
        
        // Lista de funciones comunes que requieren llamada con paréntesis
        var functionsRequiringCall = [
          // Funciones básicas de entrada/salida
          'input', 'print',
          // Funciones de conversión de tipo
          'int', 'float', 'str', 'bool',
          // Funciones de utilidad
          'len', 'range', 'abs', 'round', 'min', 'max', 'sum',
          // Métodos de string
          'lower', 'upper', 'title', 'split', 'join', 'strip', 'replace', 'count',
          // Métodos de lista
          'append', 'extend', 'index', 'insert', 'pop', 'remove', 'reverse', 'sort',
          // Funciones de conversión y estructura
          'set', 'list', 'dict', 'tuple',
          // Funciones de iteración
          'zip', 'enumerate', 'map', 'filter',
          // Funciones matemáticas adicionales
          'pow'
        ];
        
        // Procesar grupos de keywords alternativas primero
        var keywordGroups = exercise.validation.keywordGroups || [];
        if (keywordGroups.length > 0) {
          keywordGroups.forEach(function(group, groupIndex) {
            if (!group || !group.keywords || !Array.isArray(group.keywords) || group.keywords.length < 2) {
              return;
            }
            
            var groupFound = false;
            var foundInGroup = [];
            
            group.keywords.forEach(function(keyword) {
              if (!keyword) return;
              
              // Decodificar entidades HTML en la keyword
              var decodedKeyword = self.decodeHTMLEntities(keyword);
              var keywordLower = decodedKeyword.toLowerCase();
              var keywordFound = false;
              
              // Si la validación estricta está desactivada, usar validación simple
              if (!strictValidation) {
                // Buscar tanto la keyword original como la decodificada
                keywordFound = code.indexOf(decodedKeyword) !== -1 || code.indexOf(keyword) !== -1;
              } else {
                // Validación estricta activada
                // Si es el operador '=', validar que haya una asignación correcta
                if (decodedKeyword === '=' || keyword === '=') {
                  keywordFound = self.hasValidAssignment(code);
                }
                // Si es una función que requiere llamada, validar uso correcto
                else if (functionsRequiringCall.indexOf(keywordLower) !== -1) {
                  keywordFound = self.isKeywordUsedAsFunction(code, decodedKeyword);
                }
                // Para otras palabras clave (métodos, variables, etc.), validar existencia
                // Si la keyword decodificada contiene comillas, buscar el string literal
                else if ((decodedKeyword.indexOf('"') !== -1 || decodedKeyword.indexOf("'") !== -1)) {
                  // Buscar el string literal en el código
                  keywordFound = code.indexOf(decodedKeyword) !== -1;
                } else {
                  keywordFound = self.isValidWordOrNumber(code, decodedKeyword);
                }
              }
              
              if (keywordFound) {
                groupFound = true;
                foundInGroup.push(decodedKeyword); // Mostrar la versión decodificada
              }
            });
            
            if (groupFound) {
              // Al menos una keyword del grupo fue encontrada
              var groupDisplay = foundInGroup.length === 1 
                ? foundInGroup[0] 
                : '(' + foundInGroup.join(' o ') + ')';
              foundKeywords.push(groupDisplay);
            } else {
              // Ninguna keyword del grupo fue encontrada
              matches = false;
              var groupDesc = group.description || 'grupo ' + (groupIndex + 1);
              missingKeywords.push('una de: ' + group.keywords.join(', ') + ' (' + groupDesc + ')');
            }
          });
        }
        
        // Validar palabras clave individuales (obligatorias)
        exercise.validation.keywords.forEach(function(keyword) {
          if (!keyword) return;
          
          // Decodificar entidades HTML en la keyword
          var decodedKeyword = self.decodeHTMLEntities(keyword);
          var keywordLower = decodedKeyword.toLowerCase();
          var keywordFound = false;
          
          // Si la validación estricta está desactivada, usar validación simple
          if (!strictValidation) {
            // Buscar tanto la keyword original como la decodificada
            if (code.indexOf(decodedKeyword) !== -1 || code.indexOf(keyword) !== -1) {
              keywordFound = true;
              foundKeywords.push(decodedKeyword);
            } else {
              matches = false;
              missingKeywords.push(decodedKeyword);
            }
            return;
          }
          
          // Validación estricta activada
          // Si es el operador '=', validar que haya una asignación correcta
          if (decodedKeyword === '=' || keyword === '=') {
            if (self.hasValidAssignment(code)) {
              keywordFound = true;
              foundKeywords.push('asignación con =');
            } else {
              matches = false;
              missingKeywords.push('asignación con = (ej: variable = valor)');
            }
          } 
          // Si es una función que requiere llamada, validar uso correcto
          else if (functionsRequiringCall.indexOf(keywordLower) !== -1) {
            if (self.isKeywordUsedAsFunction(code, decodedKeyword)) {
              keywordFound = true;
              foundKeywords.push(decodedKeyword + '()');
            } else {
              matches = false;
              missingKeywords.push(decodedKeyword + '() (debe ser una función, no un string)');
            }
          }
          // Para otras palabras clave (métodos, variables, etc.), validar existencia
          else {
            // Usar validación mejorada que verifica palabras completas, números y combinaciones
            if (self.isValidWordOrNumber(code, decodedKeyword)) {
              keywordFound = true;
              foundKeywords.push(decodedKeyword);
            } else {
              matches = false;
              missingKeywords.push(decodedKeyword);
            }
          }
        });
        
        // Validar tipo de dato de entrada si está especificado
        if (matches && exercise.validation.inputType && exercise.validation.inputType !== '') {
          // Verificar que input() esté siendo usado correctamente
          var hasInput = self.isKeywordUsedAsFunction(code, 'input');
          
          if (hasInput) {
            if (exercise.validation.inputType !== 'str') {
              // Verificar que la conversión de tipo esté presente
              // Buscar patrones como: int(input( o float(input(
              var conversionPattern = new RegExp(exercise.validation.inputType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\([^)]*input\\s*\\(', 'g');
              
              // Remover strings para evitar falsos positivos
              var codeWithoutStrings = code.replace(/'([^'\\]|\\.)*'/g, '').replace(/"([^"\\]|\\.)*"/g, '');
              
              if (!conversionPattern.test(codeWithoutStrings)) {
                // Verificar si están en líneas separadas (dos formas posibles)
                var lines = code.split('\n');
                var hasInputType = false;
                
                // Forma 1: Verificar si input y el tipo están en la misma línea
                for (var i = 0; i < lines.length; i++) {
                  var lineWithoutStrings = lines[i].replace(/'([^'\\]|\\.)*'/g, '').replace(/"([^"\\]|\\.)*"/g, '');
                  if (lineWithoutStrings.indexOf('input') !== -1 && 
                      lineWithoutStrings.indexOf(exercise.validation.inputType) !== -1) {
                    hasInputType = true;
                    break;
                  }
                }
                
                // Forma 2: Verificar si hay una variable que se asigna con input() 
                // y luego se convierte con float()/int() en líneas separadas
                if (!hasInputType) {
                  var inputVariablePattern = /(\w+)\s*=\s*input\s*\(/;
                  var conversionTypePattern = new RegExp(exercise.validation.inputType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\(', 'g');
                  
                  for (var i = 0; i < lines.length; i++) {
                    var lineWithoutStrings = lines[i].replace(/'([^'\\]|\\.)*'/g, '').replace(/"([^"\\]|\\.)*"/g, '');
                    var inputMatch = lineWithoutStrings.match(inputVariablePattern);
                    
                    if (inputMatch) {
                      var variableName = inputMatch[1];
                      // Buscar en las líneas siguientes si hay una conversión de esa variable
                      for (var j = i + 1; j < lines.length; j++) {
                        var nextLineWithoutStrings = lines[j].replace(/'([^'\\]|\\.)*'/g, '').replace(/"([^"\\]|\\.)*"/g, '');
                        // Verificar si hay: variable = tipo(variable)
                        var conversionPattern2 = new RegExp('\\b' + variableName + '\\s*=\\s*' + exercise.validation.inputType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\(\\s*' + variableName + '\\s*\\)', 'g');
                        if (conversionPattern2.test(nextLineWithoutStrings)) {
                          hasInputType = true;
                          break;
                        }
                      }
                      if (hasInputType) break;
                    }
                  }
                }
                
                if (!hasInputType) {
                  matches = false;
                  missingKeywords.push('conversión a ' + exercise.validation.inputType + ' (ej: ' + exercise.validation.inputType + '(input(...)) o variable = input(...) seguido de variable = ' + exercise.validation.inputType + '(variable))');
                }
              }
            } else if (exercise.validation.inputType === 'str' && exercise.validation.inputStringFormat && exercise.validation.inputStringFormat !== '') {
              // Validar formato del string de entrada (usar valores capturados en tiempo de ejecución)
              if (!self.validateStringsInCode(code, exercise.validation.inputStringFormat, 'input', self.capturedInputs)) {
                matches = false;
                var formatDescription = '';
                if (exercise.validation.inputStringFormat === 'letters_only') {
                  formatDescription = 'solo letras';
                } else if (exercise.validation.inputStringFormat === 'numbers_only') {
                  formatDescription = 'solo números';
                } else if (exercise.validation.inputStringFormat === 'letters_and_numbers') {
                  formatDescription = 'letras y números';
                } else if (exercise.validation.inputStringFormat === 'letters_numbers_and_special') {
                  formatDescription = 'letras y caracteres especiales';
                }
                missingKeywords.push('string de entrada debe contener ' + formatDescription);
              }
            }
          }
        }
        
        // Validar tipo de dato de salida si está especificado
        if (matches && exercise.validation.outputType && exercise.validation.outputType !== '') {
          if (exercise.validation.outputType === 'str') {
            // Si es string, validar formato si está especificado (usar salida capturada en tiempo de ejecución)
            if (exercise.validation.outputStringFormat && exercise.validation.outputStringFormat !== '') {
              if (!self.validateStringsInCode(code, exercise.validation.outputStringFormat, 'output', null, self.currentExecutionOutput)) {
                matches = false;
                var formatDescription = '';
                if (exercise.validation.outputStringFormat === 'letters_only') {
                  formatDescription = 'solo letras';
                } else if (exercise.validation.outputStringFormat === 'numbers_only') {
                  formatDescription = 'solo números';
                } else if (exercise.validation.outputStringFormat === 'letters_and_numbers') {
                  formatDescription = 'letras y números';
                } else if (exercise.validation.outputStringFormat === 'letters_numbers_and_special') {
                  formatDescription = 'letras y caracteres especiales';
                }
                missingKeywords.push('string de salida debe contener ' + formatDescription);
              }
            }
          } else {
            // Verificar que el tipo de dato esté en el código (puede estar en variables o directamente en print)
            var hasOutputType = code.indexOf(exercise.validation.outputType) !== -1;
            if (!hasOutputType) {
              // Si no es string, debe haber conversión explícita
              matches = false;
              missingKeywords.push('tipo de salida ' + exercise.validation.outputType);
            }
          }
        }
        
        // Validar listas si está especificado (solo si la ejecución fue exitosa)
        if (matches && exercise.validation.listValidation && Array.isArray(exercise.validation.listValidation) && exercise.validation.listValidation.length > 0) {
          var lastExecution = self.executionHistory.length > 0 
            ? self.executionHistory[self.executionHistory.length - 1] 
            : null;
          
          // Solo validar listas si la última ejecución fue exitosa
          if (lastExecution && lastExecution.success) {
            var listValidationResult = self.validateLists(code, exercise);
            if (!listValidationResult.valid) {
              matches = false;
              listValidationResult.errors.forEach(function(error) {
                missingKeywords.push(error);
              });
            }
          }
        }
        
        if (matches) {
          // Si no estaba completado, agregarlo
          if (!wasCompleted) {
            self.completedExercises.push(index);
            self.score++;
            exerciseCompleted = true;
            var exerciseName = exercise.name || 'Ejercicio ' + (index + 1);
            self.addOutput('', 'info');
            
            // Actualizar maxScore si es necesario
            if (self.maxScore !== self.params.requiredExercises.length) {
              self.maxScore = self.params.requiredExercises.length;
            }
            
            // Feedback según nivel (siempre mostrar puntuación)
            var currentPercentage = Math.round((self.score / self.maxScore) * 100);
            if (feedbackLevel === 'minimal') {
              self.addOutput('✅ ' + exerciseName + ' completado', 'success');
              self.addOutput('📊 Puntuación: ' + self.score + '/' + self.maxScore + ' (' + currentPercentage + '%)', 'info');
            } else if (feedbackLevel === 'medium') {
              self.addOutput('✅ ' + exerciseName + ' completado (+1 punto)', 'success');
              self.addOutput('📊 Puntuación: ' + self.score + '/' + self.maxScore + ' (' + currentPercentage + '%)', 'info');
            } else {
              self.addOutput('✅ ¡Ejercicio completado: ' + exerciseName + '! +1 punto', 'success');
              self.addOutput('📊 Puntuación actual: ' + self.score + '/' + self.maxScore + ' (' + currentPercentage + '%)', 'info');
            }
          }
          // Si ya estaba completado, no hacer nada (ya está en la lista)
        } else {
          // Si no cumple y estaba completado, removerlo
          if (wasCompleted) {
            var exerciseIndex = self.completedExercises.indexOf(index);
            if (exerciseIndex !== -1) {
              self.completedExercises.splice(exerciseIndex, 1);
              self.score = Math.max(0, self.score - 1); // No permitir score negativo
              exerciseCompleted = true; // Marcar que hubo cambio
              var exerciseName = exercise.name || 'Ejercicio ' + (index + 1);
              self.addOutput('', 'info');
              
              // Actualizar maxScore si es necesario
              if (self.maxScore !== self.params.requiredExercises.length) {
                self.maxScore = self.params.requiredExercises.length;
              }
              
              // Feedback según nivel (siempre mostrar puntuación)
              var currentPercentage = Math.round((self.score / self.maxScore) * 100);
              if (feedbackLevel === 'minimal') {
                self.addOutput('❌ ' + exerciseName + ': Incorrecto', 'warning');
                self.addOutput('📊 Puntuación: ' + self.score + '/' + self.maxScore + ' (' + currentPercentage + '%)', 'info');
              } else if (feedbackLevel === 'medium') {
                self.addOutput('⚠️ ' + exerciseName + ': Ya no cumple los requisitos (-1 punto)', 'warning');
                self.addOutput('📊 Puntuación: ' + self.score + '/' + self.maxScore + ' (' + currentPercentage + '%)', 'info');
              } else {
                self.addOutput('⚠️ ' + exerciseName + ': Ya no cumple los requisitos. -1 punto', 'warning');
                self.addOutput('📊 Puntuación actual: ' + self.score + '/' + self.maxScore + ' (' + currentPercentage + '%)', 'info');
              }
            }
          }
          
          // Mostrar feedback detallado de qué falta y qué se encontró
          if (missingKeywords.length > 0) {
            var exerciseName = exercise.name || 'Ejercicio ' + (index + 1);
            self.addOutput('', 'info');
            
            if (feedbackLevel === 'minimal') {
              // Solo indicar que está incorrecto
              self.addOutput('❌ ' + exerciseName + ': Incorrecto', 'warning');
            } else if (feedbackLevel === 'medium') {
              // Mostrar qué falta pero no qué se encontró
              self.addOutput('⚠️ ' + exerciseName + ': Faltan elementos requeridos', 'warning');
              self.addOutput('   ❌ Faltan: ' + missingKeywords.join(', '), 'warning');
            } else {
              // Detallado: mostrar todo
              self.addOutput('⚠️ ' + exerciseName + ': Faltan elementos requeridos', 'warning');
              if (foundKeywords.length > 0) {
                self.addOutput('   ✅ Encontrados: ' + foundKeywords.join(', '), 'info');
              }
              self.addOutput('   ❌ Faltan: ' + missingKeywords.join(', '), 'warning');
            }
          }
        }
        }
        // Validación tipo "output" (salida contiene texto específico)
        else if (exercise.validation.type === 'output') {
          var matches = true;
          var missingOutputs = [];
          
          // Obtener la salida de la última ejecución
          var lastExecution = self.executionHistory.length > 0 
            ? self.executionHistory[self.executionHistory.length - 1] 
            : null;
          
          if (!lastExecution || !lastExecution.success) {
            // Si no hay ejecución exitosa, no validar salida
            return;
          }
          
          // Obtener salida capturada (stdout + result)
          var output = lastExecution.output || '';
          if (lastExecution.result !== undefined && lastExecution.result !== null) {
            output += String(lastExecution.result);
          }
          
          // Normalizar salida (minúsculas, sin espacios extra)
          var normalizedOutput = output.toLowerCase().trim();
          
          // Validar salida esperada si está especificada
          if (exercise.validation.expectedOutput) {
            var expectedOutput = exercise.validation.expectedOutput;
            var normalizedExpected = expectedOutput.toLowerCase().trim();
            
            // Verificar si la salida contiene el texto esperado
            if (normalizedOutput.indexOf(normalizedExpected) === -1) {
              matches = false;
              missingOutputs.push('salida esperada: "' + expectedOutput + '"');
            }
          }
          
          // Validar múltiples salidas esperadas si están especificadas
          // AL MENOS UNA debe estar presente (no todas)
          if (exercise.validation.expectedOutputs && Array.isArray(exercise.validation.expectedOutputs)) {
            var foundAny = false;
            exercise.validation.expectedOutputs.forEach(function(expected) {
              if (expected && normalizedOutput.indexOf(expected.toLowerCase().trim()) !== -1) {
                foundAny = true;
              }
            });
            if (!foundAny) {
              matches = false;
              missingOutputs.push('salida esperada: una de: ' + exercise.validation.expectedOutputs.join(' o '));
            }
          }
          
          // Validar patrón regex si está especificado
          if (exercise.validation.outputPattern) {
            try {
              // Normalizar el patrón para corregir doble escape si existe
              // Cuando H5P guarda el JSON, puede hacer doble escape (\\\\ en lugar de \\)
              var normalizedPattern = self.normalizeRegexPattern(exercise.validation.outputPattern);
              var pattern = new RegExp(normalizedPattern, 'i'); // case insensitive
              if (!pattern.test(output)) {
                matches = false;
                missingOutputs.push('patrón de salida: ' + exercise.validation.outputPattern);
              }
            } catch (e) {
              console.warn('Patrón regex inválido:', exercise.validation.outputPattern, e);
            }
          }
          
          if (matches) {
            // Si no estaba completado, agregarlo
            if (!wasCompleted) {
              self.completedExercises.push(index);
              self.score++;
              exerciseCompleted = true;
              var exerciseName = exercise.name || 'Ejercicio ' + (index + 1);
              self.addOutput('', 'info');
              
              // Actualizar maxScore si es necesario
              if (self.maxScore !== self.params.requiredExercises.length) {
                self.maxScore = self.params.requiredExercises.length;
              }
              
              // Feedback según nivel (siempre mostrar puntuación)
              var currentPercentage = Math.round((self.score / self.maxScore) * 100);
              if (feedbackLevel === 'minimal') {
                self.addOutput('✅ ' + exerciseName + ' completado', 'success');
                self.addOutput('📊 Puntuación: ' + self.score + '/' + self.maxScore + ' (' + currentPercentage + '%)', 'info');
              } else if (feedbackLevel === 'medium') {
                self.addOutput('✅ ' + exerciseName + ' completado (+1 punto)', 'success');
                self.addOutput('📊 Puntuación: ' + self.score + '/' + self.maxScore + ' (' + currentPercentage + '%)', 'info');
              } else {
                self.addOutput('✅ ¡Ejercicio completado: ' + exerciseName + '! +1 punto', 'success');
                self.addOutput('📊 Puntuación actual: ' + self.score + '/' + self.maxScore + ' (' + currentPercentage + '%)', 'info');
              }
            }
            // Si ya estaba completado, no hacer nada (ya está en la lista)
          } else {
            // Si no cumple y estaba completado, removerlo
            if (wasCompleted) {
              var exerciseIndex = self.completedExercises.indexOf(index);
              if (exerciseIndex !== -1) {
                self.completedExercises.splice(exerciseIndex, 1);
                self.score = Math.max(0, self.score - 1); // No permitir score negativo
                exerciseCompleted = true; // Marcar que hubo cambio
                var exerciseName = exercise.name || 'Ejercicio ' + (index + 1);
                self.addOutput('', 'info');
                
                // Actualizar maxScore si es necesario
                if (self.maxScore !== self.params.requiredExercises.length) {
                  self.maxScore = self.params.requiredExercises.length;
                }
                
                // Feedback según nivel (siempre mostrar puntuación)
                var currentPercentage = Math.round((self.score / self.maxScore) * 100);
                if (feedbackLevel === 'minimal') {
                  self.addOutput('❌ ' + exerciseName + ': Incorrecto', 'warning');
                  self.addOutput('📊 Puntuación: ' + self.score + '/' + self.maxScore + ' (' + currentPercentage + '%)', 'info');
                } else if (feedbackLevel === 'medium') {
                  self.addOutput('⚠️ ' + exerciseName + ': Ya no cumple los requisitos (-1 punto)', 'warning');
                  self.addOutput('📊 Puntuación: ' + self.score + '/' + self.maxScore + ' (' + currentPercentage + '%)', 'info');
                } else {
                  self.addOutput('⚠️ ' + exerciseName + ': Ya no cumple los requisitos. -1 punto', 'warning');
                  self.addOutput('📊 Puntuación actual: ' + self.score + '/' + self.maxScore + ' (' + currentPercentage + '%)', 'info');
                }
              }
            }
            
            // Mostrar feedback sobre salida faltante
            if (missingOutputs.length > 0) {
              var exerciseName = exercise.name || 'Ejercicio ' + (index + 1);
              self.addOutput('', 'info');
              
              if (feedbackLevel === 'minimal') {
                // Solo indicar que está incorrecto
                self.addOutput('❌ ' + exerciseName + ': Incorrecto', 'warning');
              } else if (feedbackLevel === 'medium') {
                // Mostrar qué falta pero no la salida actual
                self.addOutput('⚠️ ' + exerciseName + ': La salida no coincide con lo esperado', 'warning');
                self.addOutput('   ❌ Faltan en la salida: ' + missingOutputs.join(', '), 'warning');
              } else {
                // Detallado: mostrar todo incluyendo salida actual
                self.addOutput('⚠️ ' + exerciseName + ': La salida no coincide con lo esperado', 'warning');
                self.addOutput('   ❌ Faltan en la salida: ' + missingOutputs.join(', '), 'warning');
                self.addOutput('   💡 Salida actual: ' + (output.substring(0, 100) + (output.length > 100 ? '...' : '')), 'info');
              }
            }
          }
        }
      }
    });
    
    // Verificar si completó todos los ejercicios
    if (self.completedExercises.length === self.params.requiredExercises.length && self.params.requiredExercises.length > 0) {
      // Mostrar mensaje de finalización
      self.addOutput('', 'info');
      
      var scorePercentage = Math.round((self.score / self.maxScore) * 100);
      var passed = scorePercentage >= self.params.passingScore;
      
      if (feedbackLevel === 'minimal') {
        self.addOutput('🎉 ¡Completado!', 'success');
        self.addOutput('📊 Puntuación final: ' + self.score + '/' + self.maxScore + ' (' + scorePercentage + '%)', 'success');
        self.addOutput(passed ? '✅ Aprobado' : '❌ No aprobado', passed ? 'success' : 'warning');
      } else if (feedbackLevel === 'medium') {
        self.addOutput('🎉 ¡Has completado todos los ejercicios!', 'success');
        self.addOutput('📊 Puntuación final: ' + self.score + '/' + self.maxScore + ' (' + scorePercentage + '%)', 'success');
        self.addOutput(passed ? '✅ ¡Aprobado! (Mínimo requerido: ' + self.params.passingScore + '%)' : '❌ Necesitas practicar más (Mínimo requerido: ' + self.params.passingScore + '%)', passed ? 'success' : 'warning');
      } else {
        self.addOutput('🎉 ¡Has completado todos los ejercicios!', 'success');
        self.addOutput('📊 Puntuación final: ' + self.score + '/' + self.maxScore + ' (' + scorePercentage + '%)', 'success');
        self.addOutput(passed ? '✅ ¡Aprobado! (Mínimo requerido: ' + self.params.passingScore + '%)' : '❌ Necesitas practicar más (Mínimo requerido: ' + self.params.passingScore + '%)', passed ? 'success' : 'warning');
      }
    } else if (self.params.requiredExercises.length > 0) {
      // Mostrar resumen del estado actual (siempre mostrar puntuación en todos los niveles)
      var currentPercentage = Math.round((self.score / self.maxScore) * 100);
      self.addOutput('', 'info');
      self.addOutput('📊 Puntuación actual: ' + self.score + '/' + self.maxScore + ' (' + currentPercentage + '%)', 'info');
      
      if (feedbackLevel === 'detailed') {
        var remaining = self.maxScore - self.score;
        var completed = self.completedExercises.length;
        self.addOutput('📝 Progreso: ' + completed + ' de ' + self.maxScore + ' ejercicios completados (' + remaining + ' restantes)', 'info');
      }
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
    
    // Resetear salida capturada
    self.lastOutput = '';
    self.currentExecutionOutput = '';
    self.capturedInputs = [];
    
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

