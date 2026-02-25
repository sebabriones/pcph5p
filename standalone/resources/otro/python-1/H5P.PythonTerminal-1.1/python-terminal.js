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
      initialCode: '#Escribe tu código Python aquí',
      examples: [],
      showLineNumbers: true,
      theme: 'dark',
      allowInput: true,
      maxOutputLines: 1000,
      passingPercentage: 70,
      passingScore: undefined
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
    this.pendingInputResolve = null;
    
    // Variables para tracking xAPI
    this.executionHistory = [];
    this.startTime = new Date();
    this.score = 0;
    this.maxScore = 1; // Valor por defecto
    
    // Variable para capturar salida de stdout para validación
    this.lastOutput = '';
    this.currentExecutionOutput = '';
    
    // Variable para capturar valores de input() para validación en tiempo de ejecución
    this.capturedInputs = [];
    
    // Variable para rastrear DataFrames ya mostrados (evitar duplicados)
    this.displayedDataFrames = new Set();
    
    // Normalizar passingScore si viene en formato antiguo (compatibilidad hacia atrás)
    if (this.params.passingScore && typeof this.params.passingScore === 'object' && this.params.passingScore.type) {
      // Formato antiguo: { type: 'percentage', value: 70 } o { type: 'score', value: 100 }
      if (this.params.passingScore.type === 'percentage') {
        this.params.passingPercentage = this.params.passingScore.value || 70;
        this.params.passingScore = undefined;
      } else if (this.params.passingScore.type === 'score') {
        this.params.passingScore = this.params.passingScore.value;
        this.params.passingPercentage = undefined;
      }
    }
    // NO convertir automáticamente números a porcentaje
    // Si passingScore es un número, es el nuevo formato y debe mantenerse como está
    
    // Asegurar valores por defecto
    if (this.params.passingPercentage === undefined && this.params.passingScore === undefined) {
      this.params.passingPercentage = 70; // Por defecto usar porcentaje
    }
    
    // Restaurar estado previo si existe
    if (this.contentData.previousState) {
      try {
        var previousState = JSON.parse(this.contentData.previousState);
        this.executionHistory = previousState.executionHistory || [];
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
      html: '💾 Enviar',
      //title: 'Guardar y enviar al LRS (Ctrl+S)'
      title: 'Enviar código para evaluación (Ctrl+S)'
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
      html: '📁 Cargar archivo(s)',
      title: 'Cargar archivos para usar en Python'
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
      
      // Configurar stdin para manejar input() como fallback (Pyodide 0.28 usa 'stdin', no 'prompt')
      // Python input("msg") envía "msg" a stdout primero, luego lee de stdin
      if (self.params.allowInput) {
        pyodide.setStdin({
          stdin: function() {
            var userInput = prompt('Ingrese un valor:');
            if (userInput === null) {
              userInput = '';
            }

            if (!self.capturedInputs) {
              self.capturedInputs = [];
            }
            self.capturedInputs.push({
              prompt: '',
              value: userInput,
              timestamp: new Date().toISOString()
            });

            self.addOutput('>>> ' + userInput, 'input-value');
            return userInput;
          }
        });
      } else {
        pyodide.setStdin({
          error: true
        });
      }
      
      self.$statusIndicator.removeClass('loading').addClass('ready').text('✅ Listo');
      self.addOutput('✅ Python está listo. ¡Puedes ejecutar tu código!', 'success');

      // Configurar input inline (AST transformer + async input function)
      if (self.params.allowInput) {
        try {
          self.pyodide.globals.set('__js_create_inline_input', function(promptMsg) {
            return self.createInlineInput(promptMsg);
          });

          await self.pyodide.runPythonAsync(
            'import ast as _ast\n' +
            '\n' +
            'def _func_to_async(node):\n' +
            '    """Convierte FunctionDef a AsyncFunctionDef copiando todos los campos dinámicamente."""\n' +
            '    fields = {f: v for f, v in _ast.iter_fields(node)}\n' +
            '    nn = _ast.AsyncFunctionDef(**fields)\n' +
            '    return _ast.copy_location(nn, node)\n' +
            '\n' +
            'def _node_has_await(node):\n' +
            '    if isinstance(node, _ast.Await):\n' +
            '        return True\n' +
            '    if isinstance(node, (_ast.FunctionDef, _ast.AsyncFunctionDef, _ast.ClassDef)):\n' +
            '        return False\n' +
            '    for c in _ast.iter_child_nodes(node):\n' +
            '        if _node_has_await(c):\n' +
            '            return True\n' +
            '    return False\n' +
            '\n' +
            'class _AIT(_ast.NodeTransformer):\n' +
            '    def __init__(self):\n' +
            '        self.af = set()\n' +
            '    def visit_Call(self, node):\n' +
            '        self.generic_visit(node)\n' +
            '        if isinstance(node.func, _ast.Name) and node.func.id == "input":\n' +
            '            node.func.id = "__async_input__"\n' +
            '            return _ast.Await(value=node)\n' +
            '        return node\n' +
            '    def visit_FunctionDef(self, node):\n' +
            '        self.generic_visit(node)\n' +
            '        if any(_node_has_await(s) for s in node.body):\n' +
            '            self.af.add(node.name)\n' +
            '            return _func_to_async(node)\n' +
            '        return node\n' +
            '\n' +
            'def _transform_input(src):\n' +
            '    try:\n' +
            '        tree = _ast.parse(src)\n' +
            '    except SyntaxError:\n' +
            '        return None\n' +
            '    t = _AIT()\n' +
            '    tree = t.visit(tree)\n' +
            '    for _ in range(10):\n' +
            '        if not t.af:\n' +
            '            break\n' +
            '        class _C(_ast.NodeTransformer):\n' +
            '            def __init__(s, names):\n' +
            '                s.names = set(names)\n' +
            '                s.nn = set()\n' +
            '            def visit_Await(s, node):\n' +
            '                return node\n' +
            '            def visit_Call(s, node):\n' +
            '                s.generic_visit(node)\n' +
            '                if isinstance(node.func, _ast.Name) and node.func.id in s.names:\n' +
            '                    return _ast.Await(value=node)\n' +
            '                return node\n' +
            '            def visit_FunctionDef(s, node):\n' +
            '                s.generic_visit(node)\n' +
            '                if any(_node_has_await(st) for st in node.body):\n' +
            '                    if node.name not in s.names:\n' +
            '                        s.nn.add(node.name)\n' +
            '                    return _func_to_async(node)\n' +
            '                return node\n' +
            '        c = _C(t.af)\n' +
            '        tree = c.visit(tree)\n' +
            '        if not c.nn:\n' +
            '            break\n' +
            '        t.af.update(c.nn)\n' +
            '    _ast.fix_missing_locations(tree)\n' +
            '    try:\n' +
            '        return _ast.unparse(tree)\n' +
            '    except Exception as e:\n' +
            '        return None\n' +
            '\n' +
            'async def __async_input__(prompt_msg=""):\n' +
            '    if "_input_captures" not in globals():\n' +
            '        globals()["_input_captures"] = []\n' +
            '    result = await __js_create_inline_input(str(prompt_msg))\n' +
            '    value = str(result) if result is not None else ""\n' +
            '    _input_captures.append({"prompt": str(prompt_msg), "value": value})\n' +
            '    return value\n'
          );
          console.log('[PythonTerminal] AST transformer e inline input configurados correctamente');
        } catch (e) {
          console.warn('No se pudo configurar input inline:', e);
        }
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
      //self.addOutput('⚠️ No hay código para guardar', 'warning');
      self.addOutput('⚠️ No hay código para enviar para evaluación', 'warning');
      return;
    }
    
    // Obtener la última ejecución del historial si existe
    const lastExecution = self.executionHistory.length > 0 
      ? self.executionHistory[self.executionHistory.length - 1] 
      : null;
    
    // Validar que exista al menos una ejecución
    if (!lastExecution) {
      self.addOutput('⚠️ Debes ejecutar el código al menos una vez antes de enviar', 'warning');
      return;
    }
    
    self.isSending = true;
    
    // Calcular score según el tipo configurado
    var finalScore = self.score;
    var finalMaxScore = 1; // Por defecto 1 si no se define
    var success = lastExecution.success;
    
    if (self.params.passingScore !== undefined && self.params.passingScore !== null) {
      // Modo puntaje: usar el valor configurado como maxScore
      // NO calcular success basado en passingScore, solo definir maxScore
      // El success se mantiene basado en lastExecution.success o passingPercentage
      finalMaxScore = self.params.passingScore;
    } else if (self.params.passingPercentage !== undefined && self.params.passingPercentage !== null) {
      // Modo porcentaje: calcular porcentaje
      finalMaxScore = self.getMaxScore(); // Obtener maxScore (por defecto 1)
      var scorePercentage = 0;
      if (finalMaxScore > 0) {
        scorePercentage = Math.round((finalScore / finalMaxScore) * 100);
      }
      success = scorePercentage >= (self.params.passingPercentage || 70);
    } else {
      // Si no hay configuración, usar maxScore por defecto (1)
      finalMaxScore = 1;
    }
    
    // Crear evento xAPI con verbo "answered" usando H5P.Question
    if (typeof self.createXAPIEventTemplate === 'function') {
      var xAPIEvent = self.createXAPIEventTemplate('answered');
      
      if (xAPIEvent && xAPIEvent.data && xAPIEvent.data.statement) {
        // Configurar el resultado con puntuación
        if (typeof xAPIEvent.setScoredResult === 'function') {
          xAPIEvent.setScoredResult(finalScore, finalMaxScore, self, true, success);
        }
        
        // Agregar el response con el código guardado
        if (typeof self.addResponseToXAPI === 'function') {
          self.addResponseToXAPI(xAPIEvent);
        }
        
        // Disparar el evento
        self.trigger(xAPIEvent);
      }
    }
    
    //self.addOutput('💾 Código guardado y enviado al LRS', 'success');
    self.addOutput('💾 Código enviado para evaluación', 'success');
    
    // Resetear flag después de 1 segundo
    setTimeout(function() {
      self.isSending = false;
    }, 1000);
  };

  /**
   * Analizar archivo Python subido para detectar imports de paquetes
   */
  PythonTerminal.prototype.analyzePythonFile = function(filename) {
    const self = this;
    
    if (!self.pyodide || !self.pyodideReady) {
      return null;
    }
    
    try {
      // Leer el contenido del archivo desde el sistema de archivos de Pyodide
      const fileContent = self.pyodide.FS.readFile(filename, { encoding: 'utf8' });
      const code = String(fileContent);
      return code;
    } catch (error) {
      // Archivo no encontrado o error al leer
      return null;
    }
  };

  /**
   * Verificar si un nombre de módulo es un módulo estándar de Python
   */
  PythonTerminal.prototype.isStandardPythonModule = function(moduleName) {
    // Lista de módulos estándar de Python (no exhaustiva, pero cubre los más comunes)
    const standardModules = [
      'sys', 'os', 'json', 'math', 'random', 'datetime', 'time', 're', 'string',
      'collections', 'itertools', 'functools', 'operator', 'copy', 'pickle',
      'csv', 'urllib', 'http', 'email', 'html', 'xml', 'sqlite3', 'threading',
      'multiprocessing', 'subprocess', 'logging', 'unittest', 'doctest', 'pdb',
      'traceback', 'warnings', 'abc', 'typing', 'dataclasses', 'enum', 'pathlib',
      'shutil', 'tempfile', 'glob', 'fnmatch', 'linecache', 'codecs', 'locale',
      'gettext', 'argparse', 'configparser', 'fileinput', 'stat', 'filecmp',
      'mmap', 'readline', 'rlcompleter', 'cmd', 'shlex', 'textwrap', 'unicodedata',
      'stringprep', 'struct', 'codecs', 'encodings', 'io', 'base64', 'binascii',
      'hashlib', 'hmac', 'secrets', 'zlib', 'gzip', 'bz2', 'lzma', 'zipfile',
      'tarfile', 'csv', 'configparser', 'netrc', 'xdrlib', 'plistlib', 'shelve',
      'marshal', 'dbm', 'sqlite3', 'zlib', 'gzip', 'bz2', 'lzma', 'zipfile',
      'tarfile', 'csv', 'netrc', 'xdrlib', 'plistlib', 'shelve', 'marshal',
      'dbm', 'sqlite3', 'xml', 'html', 'email', 'http', 'urllib', 'socket',
      'ssl', 'select', 'selectors', 'asyncio', 'concurrent', 'multiprocessing',
      'threading', 'queue', 'contextvars', 'weakref', 'types', 'copy', 'pprint',
      'reprlib', 'enum', 'numbers', 'math', 'cmath', 'decimal', 'fractions',
      'statistics', 'random', 'secrets', 'array', 'collections', 'heapq', 'bisect',
      'array', 'weakref', 'types', 'copy', 'pprint', 'reprlib', 'enum', 'numbers',
      'io', 'codecs', 'unicodedata', 'stringprep', 'readline', 'rlcompleter',
      'string', 're', 'difflib', 'textwrap', 'unicodedata', 'stringprep',
      'readline', 'rlcompleter', 'string', 're', 'difflib', 'textwrap'
    ];
    
    return standardModules.indexOf(moduleName) !== -1;
  };

  /**
   * Mapear nombre de módulo a nombre de paquete de Pyodide
   */
  PythonTerminal.prototype.getPackageName = function(moduleName) {
    const moduleToPackage = {
      'pandas': 'pandas',
      'numpy': 'numpy',
      'np': 'numpy',
      'matplotlib': 'matplotlib',
      'scipy': 'scipy',
      'sklearn': 'scikit-learn',
      'sympy': 'sympy',
      'PIL': 'Pillow',
      'bs4': 'beautifulsoup4',
      'requests': 'requests',
      'lxml': 'lxml',
      'networkx': 'networkx',
      'statsmodels': 'statsmodels',
      'pytz': 'pytz',
      'dateutil': 'python-dateutil',
      'plotly': 'plotly',
      'bokeh': 'bokeh',
      'regex': 'regex',
      'pyparsing': 'pyparsing',
      'jsonschema': 'jsonschema',
      'yaml': 'PyYAML',
      'toml': 'toml',
      'mpmath': 'mpmath',
      'seaborn': 'seaborn',
      'skimage': 'scikit-image',
      'pydantic': 'pydantic',
      'jinja2': 'jinja2',
      'markupsafe': 'markupsafe',
      'pygments': 'pygments',
      'micropip': 'micropip'
    };
    
    return moduleToPackage[moduleName] || null;
  };

  /**
   * Detectar y cargar paquetes necesarios automáticamente
   */
  PythonTerminal.prototype.loadRequiredPackages = async function(code) {
    const self = this;
    
    if (!self.pyodide || !self.pyodideReady) {
      return; // Pyodide no está listo
    }
    
    // Detectar imports de módulos personalizados (archivos .py subidos)
    const moduleImportPattern = /(?:^|\n)\s*(?:import\s+(\w+)|from\s+(\w+)\s+import)/g;
    let match;
    const importedModules = new Set();
    
    while ((match = moduleImportPattern.exec(code)) !== null) {
      const moduleName = match[1] || match[2];
      if (moduleName && !self.isStandardPythonModule(moduleName)) {
        // Verificar si existe un archivo .py con ese nombre
        // Buscar en el directorio raíz y en subdirectorios comunes
        const possibleFilenames = [
          moduleName + '.py',
          moduleName.toLowerCase() + '.py',
          './' + moduleName + '.py',
          './' + moduleName.toLowerCase() + '.py'
        ];
        
        // También buscar en archivos subidos que puedan tener rutas
        for (let i = 0; i < self.uploadedFiles.length; i++) {
          const uploadedFile = self.uploadedFiles[i];
          if (uploadedFile.name.endsWith('.py')) {
            // Extraer el nombre base del archivo (sin extensión y sin ruta)
            const baseName = uploadedFile.name.replace(/^.*[\\\/]/, '').replace(/\.py$/, '');
            if (baseName === moduleName || baseName.toLowerCase() === moduleName.toLowerCase()) {
              possibleFilenames.push(uploadedFile.name);
            }
          }
        }
        
        for (let i = 0; i < possibleFilenames.length; i++) {
          const filename = possibleFilenames[i];
          try {
            // Verificar si el archivo existe en el sistema de archivos
            self.pyodide.FS.stat(filename);
            // Si existe, analizarlo
            const moduleCode = self.analyzePythonFile(filename);
            if (moduleCode) {
              importedModules.add(filename);
              // Analizar el módulo para detectar sus imports de paquetes
              await self.loadRequiredPackages(moduleCode);
            }
            break; // Archivo encontrado, no buscar más variantes
          } catch (e) {
            // Archivo no encontrado, continuar con siguiente variante
          }
        }
      }
    }
    
    // Lista de paquetes comunes de Pyodide con sus patrones de importación
    var packages = [
      {
        name: 'pandas',
        packageName: 'pandas',
        patterns: [
          /(?:^|\n)\s*(?:import\s+pandas|from\s+pandas\s+import)/
        ]
      },
      {
        name: 'numpy',
        packageName: 'numpy',
        patterns: [
          /(?:^|\n)\s*(?:import\s+numpy|from\s+numpy\s+import)/,
          /(?:^|\n)\s*import\s+numpy\s+as\s+np/
        ]
      },
      {
        name: 'matplotlib',
        packageName: 'matplotlib',
        patterns: [
          /(?:^|\n)\s*(?:import\s+matplotlib|from\s+matplotlib\s+import)/,
          /(?:^|\n)\s*(?:import\s+matplotlib\.pyplot|from\s+matplotlib\.pyplot\s+import)/
        ]
      },
      {
        name: 'scipy',
        packageName: 'scipy',
        patterns: [
          /(?:^|\n)\s*(?:import\s+scipy|from\s+scipy\s+import)/
        ]
      },
      {
        name: 'scikit-learn',
        packageName: 'scikit-learn',
        patterns: [
          /(?:^|\n)\s*(?:import\s+sklearn|from\s+sklearn\s+import)/
        ]
      },
      {
        name: 'sympy',
        packageName: 'sympy',
        patterns: [
          /(?:^|\n)\s*(?:import\s+sympy|from\s+sympy\s+import)/
        ]
      },
      {
        name: 'Pillow',
        packageName: 'Pillow',
        patterns: [
          /(?:^|\n)\s*(?:import\s+PIL|from\s+PIL\s+import)/,
          /(?:^|\n)\s*(?:from\s+Pillow\s+import)/
        ]
      },
      {
        name: 'beautifulsoup4',
        packageName: 'beautifulsoup4',
        patterns: [
          /(?:^|\n)\s*(?:import\s+bs4|from\s+bs4\s+import)/,
          /(?:^|\n)\s*(?:from\s+beautifulsoup4\s+import)/
        ]
      },
      {
        name: 'requests',
        packageName: 'requests',
        patterns: [
          /(?:^|\n)\s*(?:import\s+requests|from\s+requests\s+import)/
        ]
      },
      {
        name: 'lxml',
        packageName: 'lxml',
        patterns: [
          /(?:^|\n)\s*(?:import\s+lxml|from\s+lxml\s+import)/
        ]
      },
      {
        name: 'networkx',
        packageName: 'networkx',
        patterns: [
          /(?:^|\n)\s*(?:import\s+networkx|from\s+networkx\s+import)/
        ]
      },
      {
        name: 'statsmodels',
        packageName: 'statsmodels',
        patterns: [
          /(?:^|\n)\s*(?:import\s+statsmodels|from\s+statsmodels\s+import)/
        ]
      },
      {
        name: 'pytz',
        packageName: 'pytz',
        patterns: [
          /(?:^|\n)\s*(?:import\s+pytz|from\s+pytz\s+import)/
        ]
      },
      {
        name: 'python-dateutil',
        packageName: 'python-dateutil',
        patterns: [
          /(?:^|\n)\s*(?:import\s+dateutil|from\s+dateutil\s+import)/
        ]
      },
      {
        name: 'plotly',
        packageName: 'plotly',
        patterns: [
          /(?:^|\n)\s*(?:import\s+plotly|from\s+plotly\s+import)/
        ]
      },
      {
        name: 'bokeh',
        packageName: 'bokeh',
        patterns: [
          /(?:^|\n)\s*(?:import\s+bokeh|from\s+bokeh\s+import)/
        ]
      },
      {
        name: 'regex',
        packageName: 'regex',
        patterns: [
          /(?:^|\n)\s*(?:import\s+regex|from\s+regex\s+import)/
        ]
      },
      {
        name: 'pyparsing',
        packageName: 'pyparsing',
        patterns: [
          /(?:^|\n)\s*(?:import\s+pyparsing|from\s+pyparsing\s+import)/
        ]
      },
      {
        name: 'jsonschema',
        packageName: 'jsonschema',
        patterns: [
          /(?:^|\n)\s*(?:import\s+jsonschema|from\s+jsonschema\s+import)/
        ]
      },
      {
        name: 'PyYAML',
        packageName: 'PyYAML',
        patterns: [
          /(?:^|\n)\s*(?:import\s+yaml|from\s+yaml\s+import)/
        ]
      },
      {
        name: 'toml',
        packageName: 'toml',
        patterns: [
          /(?:^|\n)\s*(?:import\s+toml|from\s+toml\s+import)/
        ]
      },
      {
        name: 'mpmath',
        packageName: 'mpmath',
        patterns: [
          /(?:^|\n)\s*(?:import\s+mpmath|from\s+mpmath\s+import)/
        ]
      },
      {
        name: 'seaborn',
        packageName: 'seaborn',
        patterns: [
          /(?:^|\n)\s*(?:import\s+seaborn|from\s+seaborn\s+import)/
        ]
      },
      {
        name: 'scikit-image',
        packageName: 'scikit-image',
        patterns: [
          /(?:^|\n)\s*(?:import\s+skimage|from\s+skimage\s+import)/
        ]
      },
      {
        name: 'pydantic',
        packageName: 'pydantic',
        patterns: [
          /(?:^|\n)\s*(?:import\s+pydantic|from\s+pydantic\s+import)/
        ]
      },
      {
        name: 'jinja2',
        packageName: 'jinja2',
        patterns: [
          /(?:^|\n)\s*(?:import\s+jinja2|from\s+jinja2\s+import)/
        ]
      },
      {
        name: 'markupsafe',
        packageName: 'markupsafe',
        patterns: [
          /(?:^|\n)\s*(?:import\s+markupsafe|from\s+markupsafe\s+import)/
        ]
      },
      {
        name: 'pygments',
        packageName: 'pygments',
        patterns: [
          /(?:^|\n)\s*(?:import\s+pygments|from\s+pygments\s+import)/
        ]
      },
      {
        name: 'micropip',
        packageName: 'micropip',
        patterns: [
          /(?:^|\n)\s*(?:import\s+micropip|from\s+micropip\s+import)/
        ]
      }
    ];
    
    // Procesar cada paquete
    for (var i = 0; i < packages.length; i++) {
      var pkg = packages[i];
      var shouldLoad = false;
      
      // Verificar si alguno de los patrones coincide
      for (var j = 0; j < pkg.patterns.length; j++) {
        if (pkg.patterns[j].test(code)) {
          shouldLoad = true;
          break;
        }
      }
      
      if (shouldLoad) {
        try {
          // Verificar si el paquete ya está cargado
          var moduleName = pkg.name;
          // Ajustar nombres de módulo para verificación (nombre del paquete vs nombre de importación)
          if (pkg.name === 'scikit-learn') {
            moduleName = 'sklearn';
          } else if (pkg.name === 'Pillow') {
            moduleName = 'PIL';
          } else if (pkg.name === 'beautifulsoup4') {
            moduleName = 'bs4';
          } else if (pkg.name === 'python-dateutil') {
            moduleName = 'dateutil';
          } else if (pkg.name === 'PyYAML') {
            moduleName = 'yaml';
          } else if (pkg.name === 'scikit-image') {
            moduleName = 'skimage';
          }
          
          try {
            var module = self.pyodide.globals.get(moduleName);
            if (module !== undefined && module !== null) {
              // El paquete ya está cargado
              continue;
            }
          } catch (e) {
            // El módulo no está en el namespace, continuar para cargarlo
          }
          
          // Cargar el paquete
          self.addOutput('📦 Cargando ' + pkg.name + '...', 'info');
          await self.pyodide.loadPackage(pkg.packageName);
          self.addOutput('✅ ' + pkg.name + ' cargado correctamente', 'info');
        } catch (error) {
          self.addOutput('⚠️ No se pudo cargar ' + pkg.name + ': ' + error.message, 'warning');
          // Continuar con otros paquetes aunque uno falle
        }
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
    
    if (!self.capturedInputs) {
      self.capturedInputs = [];
    }
    
    // Cargar paquetes necesarios antes de ejecutar
    await self.loadRequiredPackages(code);
    
    // Transformar código para input inline si contiene input()
    var codeToExecute = code;
    var usingAsyncInput = false;
    if (code.indexOf('input(') !== -1 && self.params.allowInput && self.pyodide) {
      try {
        self.pyodide.globals.set('__code_to_transform__', code);
        var transformed = self.pyodide.runPython('_transform_input(__code_to_transform__)');
        if (transformed !== undefined && transformed !== null) {
          var transformedStr = typeof transformed === 'string' ? transformed : String(transformed);
          if (transformedStr && transformedStr !== 'None' && transformedStr.length > 0) {
            codeToExecute = transformedStr;
            usingAsyncInput = true;
            console.log('[PythonTerminal] Código transformado para inline input:', codeToExecute);
          }
        }
      } catch (e) {
        console.warn('[PythonTerminal] Transformación AST falló:', e.message || e);
      }
    }
    
    try {
      const result = await self.pyodide.runPythonAsync(codeToExecute);
      executionSuccess = true;
      executionResult = result;
      
      if (result !== undefined && result !== null) {
        if (self.isDataFrame(result)) {
          const dfId = 'result_' + Date.now();
          self.displayedDataFrames.add(dfId);
          self.displayDataFrame(result, 'Resultado');
        } else {
          var resultStr = String(result);
          self.addOutput(resultStr, 'result');
          self.currentExecutionOutput += resultStr;
        }
      }
      
    } catch (error) {
      console.warn('[PythonTerminal] Error en ejecución:', error.message || error);
      if (usingAsyncInput && error.message &&
          (error.message.indexOf('SyntaxError') !== -1 || error.message.indexOf('await') !== -1 ||
           error.message.indexOf('async') !== -1 || error.message.indexOf('EOFError') !== -1)) {
        console.log('[PythonTerminal] Reintentando con código original (fallback stdin)...');
        self.$output.find('.inline-input-container').remove();
        self.capturedInputs = [];
        try { self.pyodide.runPython('_input_captures = []'); } catch(e2) {}
        try {
          var fallbackResult = await self.pyodide.runPythonAsync(code);
          executionSuccess = true;
          executionResult = fallbackResult;
          if (fallbackResult !== undefined && fallbackResult !== null) {
            if (self.isDataFrame(fallbackResult)) {
              var dfId = 'result_' + Date.now();
              self.displayedDataFrames.add(dfId);
              self.displayDataFrame(fallbackResult, 'Resultado');
            } else {
              var rStr = String(fallbackResult);
              self.addOutput(rStr, 'result');
              self.currentExecutionOutput += rStr;
            }
          }
        } catch (fallbackError) {
          executionSuccess = false;
          executionError = fallbackError.message;
          self.addOutput(fallbackError.message, 'error');
        }
      } else if (error.message && error.message.includes('ModuleNotFoundError')) {
        // Extraer el nombre del módulo faltante
        const moduleMatch = error.message.match(/No module named ['"]([^'"]+)['"]/);
        if (moduleMatch) {
          const missingModule = moduleMatch[1];
          // Verificar si es un paquete conocido de Pyodide
          const packageName = self.getPackageName(missingModule);
          
          if (packageName) {
            // Cargar el paquete automáticamente
            self.addOutput('📦 Detectado módulo faltante: ' + missingModule + '. Cargando automáticamente...', 'info');
            try {
              await self.pyodide.loadPackage(packageName);
              self.addOutput('✅ ' + packageName + ' cargado. Reintentando ejecución...', 'success');
              
              // Reintentar la ejecución
              try {
                const result = await self.pyodide.runPythonAsync(codeToExecute);
                executionSuccess = true;
                executionResult = result;
                
                // Si hay un resultado (no None), mostrarlo
                if (result !== undefined && result !== null) {
                  // Verificar si el resultado es un DataFrame
                  if (self.isDataFrame(result)) {
                    // Mostrar como tabla HTML
                    const dfId = 'result_' + Date.now();
                    self.displayedDataFrames.add(dfId);
                    self.displayDataFrame(result, 'Resultado');
                  } else {
                    // Mostrar como texto normal
                    var resultStr = String(result);
                    self.addOutput(resultStr, 'result');
                    // Agregar resultado a la salida capturada
                    self.currentExecutionOutput += resultStr;
                  }
                }
              } catch (retryError) {
                // Si el reintento falla, mostrar el error original
                executionSuccess = false;
                executionError = retryError.message;
                self.addOutput(retryError.message, 'error');
              }
            } catch (loadError) {
              // Error al cargar el paquete, mostrar error original
              executionSuccess = false;
              executionError = error.message;
              self.addOutput('⚠️ No se pudo cargar ' + packageName + ': ' + loadError.message, 'warning');
              self.addOutput(error.message, 'error');
            }
          } else {
            // No es un paquete conocido, mostrar error normal
            executionSuccess = false;
            executionError = error.message;
            self.addOutput(error.message, 'error');
          }
        } else {
          // No se pudo extraer el nombre del módulo, mostrar error normal
          executionSuccess = false;
          executionError = error.message;
          self.addOutput(error.message, 'error');
        }
      } else {
        // Otro tipo de error, mostrar normalmente
        executionSuccess = false;
        executionError = error.message;
        self.addOutput(error.message, 'error');
      }
    }
    
    // Recuperar inputs capturados del wrapper de Python
    if (code.includes('input(') && self.params.allowInput && self.pyodide) {
      try {
        // Verificar si _input_captures existe antes de acceder
        var hasCaptures = self.pyodide.runPython('"_input_captures" in globals()');
        if (hasCaptures) {
          var pythonCaptures = self.pyodide.runPython('_input_captures');
          if (pythonCaptures && pythonCaptures.length > 0) {
          // Convertir PyProxy a array JavaScript
          var capturesArray = pythonCaptures.toJs();
          if (!self.capturedInputs) {
            self.capturedInputs = [];
          }
          // Limpiar capturas anteriores de esta ejecución
          self.capturedInputs = [];
          for (var i = 0; i < capturesArray.length; i++) {
            self.capturedInputs.push({
              prompt: capturesArray[i].prompt || '',
              value: capturesArray[i].value || '',
              timestamp: new Date().toISOString()
            });
          }
          // Limpiar capturas de Python para la próxima ejecución
          self.pyodide.runPython('_input_captures = []');
          }
        }
      } catch (error) {
        // Error al recuperar capturas, continuar sin validación de inputs
      }
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
    
    // Detectar y mostrar DataFrames de pandas si la ejecución fue exitosa
    if (executionSuccess && self.pyodideReady) {
      // Usar setTimeout para que se ejecute después de que se muestre la salida
      setTimeout(function() {
        self.detectAndDisplayDataFrames();
      }, 100);
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

    if (self.pendingInputResolve) {
      self.pendingInputResolve('');
      self.pendingInputResolve = null;
    }

    self.$output.empty();
    self.outputLines = [];
    self.currentExecutionOutput = '';
    self.displayedDataFrames.clear();
    self.addOutput('🗑️ Consola limpiada', 'info');
  };

  PythonTerminal.prototype.createInlineInput = function(promptMsg) {
    var self = this;
    return new Promise(function(resolve) {
      self.pendingInputResolve = resolve;

      if (promptMsg && String(promptMsg).trim() !== '') {
        self.addOutput(String(promptMsg), 'input-prompt');
      }

      var $container = $('<div>', { class: 'inline-input-container' });
      var $prefix = $('<span>', { class: 'input-prefix', text: '>>> ' });
      var $field = $('<input>', {
        type: 'text',
        class: 'inline-input-field',
        attr: { autocomplete: 'off', spellcheck: 'false' }
      });

      $container.append($prefix).append($field);
      self.$output.append($container);
      self.$output.scrollTop(self.$output[0].scrollHeight);

      setTimeout(function() { $field.focus(); }, 50);

      $field.on('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
          e.preventDefault();
          var value = $field.val();

          $container.remove();
          self.addOutput('>>> ' + value, 'input-value');
          self.pendingInputResolve = null;

          if (!self.capturedInputs) {
            self.capturedInputs = [];
          }
          self.capturedInputs.push({
            prompt: promptMsg || '',
            value: value,
            timestamp: new Date().toISOString()
          });

          resolve(value);
        }
      });
    });
  };

  /**
   * Escapar HTML para prevenir XSS
   */
  PythonTerminal.prototype.escapeHTML = function(text) {
    if (text === null || text === undefined) {
      return '';
    }
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  };

  /**
   * Verificar si un objeto es un DataFrame de pandas
   */
  PythonTerminal.prototype.isDataFrame = function(obj) {
    const self = this;
    
    if (!obj || typeof obj !== 'object') {
      return false;
    }
    
    try {
      // Verificar si tiene los métodos característicos de DataFrame
      if (obj.shape && obj.columns && obj.head && obj.to_dict) {
        // Verificar que shape y columns sean arrays válidos
        const shape = obj.shape.toJs();
        const columns = obj.columns.toJs();
        
        // Si tiene shape y columns válidos, es un DataFrame
        if (Array.isArray(shape) && shape.length === 2 && Array.isArray(columns)) {
          return true;
        }
      }
    } catch (e) {
      // Error al verificar, no es un DataFrame válido
      return false;
    }
    
    return false;
  };

  /**
   * Mostrar DataFrame de pandas como tabla HTML
   */
  PythonTerminal.prototype.displayDataFrame = function(df, name) {
    const self = this;
    
    try {
      // Obtener información del DataFrame
      const shape = df.shape.toJs();
      const numRows = shape[0];
      const numCols = shape[1];
      
      // Limitar a 100 filas para vista previa
      const maxPreviewRows = 100;
      const previewRows = Math.min(numRows, maxPreviewRows);
      
      // Obtener columnas
      const columns = df.columns.toJs();
      
      // Obtener datos usando values (más confiable que to_dict)
      const headDf = df.head(previewRows);
      const values = headDf.values.toJs({depth: 2});
      
      // Convertir a formato de filas
      const rows = [];
      for (let i = 0; i < previewRows && i < values.length; i++) {
        const row = {};
        const rowData = values[i];
        columns.forEach((col, colIndex) => {
          row[col] = rowData && rowData[colIndex] !== undefined ? rowData[colIndex] : '';
        });
        rows.push(row);
      }
      
      // Crear tabla HTML
      let tableHTML = '<div class="dataframe-preview-container">';
      tableHTML += '<div class="dataframe-preview-header">';
      tableHTML += '<strong>📊 DataFrame: ' + self.escapeHTML(name || 'sin nombre') + '</strong>';
      tableHTML += '<span class="dataframe-info"> (' + numRows + ' filas × ' + numCols + ' columnas)';
      if (numRows > maxPreviewRows) {
        tableHTML += ' - mostrando ' + maxPreviewRows + ' filas';
      }
      tableHTML += '</span>';
      tableHTML += '</div>';
      tableHTML += '<div class="dataframe-table-wrapper">';
      tableHTML += '<table class="dataframe-table">';
      
      // Headers
      if (columns.length > 0) {
        tableHTML += '<thead><tr>';
        columns.forEach(col => {
          tableHTML += '<th>' + self.escapeHTML(String(col)) + '</th>';
        });
        tableHTML += '</tr></thead>';
      }
      
      // Rows
      tableHTML += '<tbody>';
      rows.forEach(row => {
        tableHTML += '<tr>';
        columns.forEach(col => {
          const value = row[col] !== undefined && row[col] !== null ? row[col] : '';
          // Formatear valores numéricos
          let displayValue = String(value);
          if (typeof value === 'number') {
            // Redondear números muy largos
            if (Math.abs(value) > 1000000 || (Math.abs(value) < 0.01 && value !== 0)) {
              displayValue = value.toExponential(2);
            } else {
              displayValue = Number(value.toFixed(6)).toString();
            }
          }
          tableHTML += '<td>' + self.escapeHTML(displayValue) + '</td>';
        });
        tableHTML += '</tr>';
      });
      tableHTML += '</tbody></table></div></div>';
      
      // Agregar a la consola como HTML
      const $tableElement = $(tableHTML);
      self.$output.append($tableElement);
      self.outputLines.push($tableElement);
      
      // Scroll al final
      self.$output.scrollTop(self.$output[0].scrollHeight);
      
    } catch (error) {
      self.addOutput('⚠️ Error al mostrar DataFrame: ' + error.message, 'warning');
      console.error('Error displaying DataFrame:', error);
    }
  };

  /**
   * Detectar y mostrar DataFrames de pandas en el namespace
   */
  PythonTerminal.prototype.detectAndDisplayDataFrames = function() {
    const self = this;
    
    if (!self.pyodide || !self.pyodideReady) {
      return;
    }
    
    try {
      // Obtener el namespace global de Python
      const globals = self.pyodide.globals;
      
      // Intentar obtener pandas para verificar si está disponible
      let pandas = null;
      try {
        pandas = globals.get('pandas');
      } catch (e) {
        // pandas no está disponible
        return;
      }
      
      if (!pandas || pandas === undefined) {
        return;
      }
      
      // Obtener todas las variables del namespace
      const keys = globals.keys();
      const keyArray = keys.toJs();
      
      // Buscar DataFrames
      keyArray.forEach(varName => {
        try {
          const value = globals.get(varName);
          
          // Verificar si es un DataFrame de pandas usando la función helper
          if (self.isDataFrame(value)) {
            try {
              const shape = value.shape.toJs();
              // Crear un identificador único para el DataFrame (nombre + shape)
              const dfId = varName + '_' + shape[0] + 'x' + shape[1];
              
              // Solo mostrar si no se ha mostrado antes
              if (!self.displayedDataFrames.has(dfId)) {
                self.displayedDataFrames.add(dfId);
                self.displayDataFrame(value, varName);
              }
            } catch (e) {
              // Error al obtener shape, continuar
            }
          }
        } catch (e) {
          // Error al acceder a la variable, continuar
        }
      });
      
    } catch (error) {
      // Error general, no mostrar nada
      console.warn('Error detecting DataFrames:', error);
    }
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
    
    if (format === 'letters_and_special') {
      // Letras y caracteres especiales comunes (a-z, A-Z, acentos, :, ., ,, ;, !, ?, -, _, etc.)
      // Permitir letras, acentos y caracteres especiales comunes de puntuación y símbolos (SIN números)
      var lettersSpecialPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s:.,;!?\-_()\[\]{}'"\/\\+=*&%$#@~`|<>]+$/;
      return lettersSpecialPattern.test(str) || str === '';
    }
    
    return true; // Formato desconocido, no restringir
  };

  /**
   * Validar formato de mayúsculas/minúsculas de un string
   * @param {string} str - String a validar
   * @param {string} caseFormat - Formato esperado: 'upper', 'lower', 'title', 'capitalize'
   * @return {boolean} true si el string cumple con el formato
   */
  PythonTerminal.prototype.validateStringCase = function(str, caseFormat) {
    if (!caseFormat || caseFormat === '') {
      return true; // Sin restricción de formato
    }
    
    if (!str || str === '') {
      return true; // String vacío siempre válido
    }
    
    // Obtener solo las letras (sin espacios, números, caracteres especiales)
    var lettersOnly = str.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
    
    if (lettersOnly === '') {
      return true; // Si no hay letras, no se puede validar formato
    }
    
    if (caseFormat === 'upper') {
      // Todas las letras deben estar en mayúscula
      return lettersOnly === lettersOnly.toUpperCase();
    }
    
    if (caseFormat === 'lower') {
      // Todas las letras deben estar en minúscula
      return lettersOnly === lettersOnly.toLowerCase();
    }
    
    if (caseFormat === 'title') {
      // Primera letra de cada palabra en mayúscula
      // Dividir por espacios y validar cada palabra
      var words = str.split(/\s+/);
      for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (word.length > 0) {
          var firstLetter = word.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/);
          if (firstLetter) {
            var firstChar = firstLetter[0];
            var restOfWord = word.substring(firstLetter.index + 1);
            // La primera letra debe ser mayúscula
            if (!/[A-ZÁÉÍÓÚÑÜ]/.test(firstChar)) {
              return false;
            }
            // El resto de las letras deben ser minúsculas
            var restLetters = restOfWord.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
            if (restLetters !== '' && restLetters !== restLetters.toLowerCase()) {
              return false;
            }
          }
        }
      }
      return true;
    }
    
    if (caseFormat === 'capitalize') {
      // Solo la primera letra del string en mayúscula, el resto en minúscula
      var firstLetter = str.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/);
      if (firstLetter) {
        var firstChar = firstLetter[0];
        var restOfString = str.substring(firstLetter.index + 1);
        // La primera letra debe ser mayúscula
        if (!/[A-ZÁÉÍÓÚÑÜ]/.test(firstChar)) {
          return false;
        }
        // El resto de las letras deben ser minúsculas
        var restLetters = restOfString.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
        if (restLetters !== '' && restLetters !== restLetters.toLowerCase()) {
          return false;
        }
        return true;
      }
      return true; // Si no hay letras, es válido
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
   * @param {string} caseFormat - Formato de mayúsculas/minúsculas esperado (opcional)
   * @param {number} inputIndex - Índice del input a validar (opcional, por defecto el último)
   * @return {boolean} true si hay al menos un string que cumple el formato
   */
  PythonTerminal.prototype.validateStringsInCode = function(code, format, context, capturedInputs, executionOutput, caseFormat, inputIndex) {
    // Determinar qué input validar
    var inputToValidate = null;
    if (context === 'input' && capturedInputs && capturedInputs.length > 0) {
      if (inputIndex !== undefined && inputIndex !== null && inputIndex >= 0 && inputIndex < capturedInputs.length) {
        // Usar el índice especificado
        inputToValidate = capturedInputs[inputIndex];
      } else {
        // Por defecto, usar el último input (comportamiento anterior)
        inputToValidate = capturedInputs[capturedInputs.length - 1];
      }
    }
    
    // Validar formato de contenido si está especificado
    var formatValid = true;
    if (format && format !== '') {
      // Validación en tiempo de ejecución: usar valores capturados
      if (inputToValidate && inputToValidate.value !== null && inputToValidate.value !== undefined) {
        formatValid = this.validateStringFormat(inputToValidate.value, format);
      }
    }
    
    // Validar formato de mayúsculas/minúsculas si está especificado
    var caseValid = true;
    if (caseFormat && caseFormat !== '') {
      if (inputToValidate && inputToValidate.value !== null && inputToValidate.value !== undefined) {
        caseValid = this.validateStringCase(inputToValidate.value, caseFormat);
      } else if (context === 'input') {
        // Si no hay input en el índice específico, usar el último como fallback
        if (capturedInputs && capturedInputs.length > 0) {
          // Usar el último input como fallback
          var lastInput = capturedInputs[capturedInputs.length - 1];
          if (lastInput && lastInput.value !== null && lastInput.value !== undefined) {
            caseValid = this.validateStringCase(lastInput.value, caseFormat);
          } else {
            caseValid = false;
          }
        } else {
          caseValid = false;
        }
      }
    }
    
    // Si hay validación de formato de contenido, debe cumplirse
    if (format && format !== '') {
      if (!formatValid) {
        return false;
      }
    }
    
    // Si hay validación de case, debe cumplirse
    if (caseFormat && caseFormat !== '') {
      if (!caseValid) {
        return false;
      }
    }
    
    // Si solo se valida case y no hay formato de contenido, continuar con validación de output
    if ((!format || format === '') && caseFormat && caseFormat !== '') {
      // Para input, ya validamos arriba
      if (context === 'input') {
        return caseValid;
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
          var isValid = true;
          
          // Validar formato de contenido si está especificado
          if (format && format !== '') {
            isValid = this.validateStringFormat(line, format);
          }
          
          // Validar formato de mayúsculas/minúsculas si está especificado
          if (isValid && caseFormat && caseFormat !== '') {
            isValid = this.validateStringCase(line, caseFormat);
          }
          
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
    if (this.params.passingScore !== undefined && this.params.passingScore !== null) {
      return this.params.passingScore;
    }
    return 1; // Si no está definido, retornar 1 por defecto
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
    
    // Resetear puntuación
    self.score = 0;
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
