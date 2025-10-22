var H5P = H5P || {};

H5P.PythonConsole = (function ($, Question) {

  /**
   * @constructor
   * @param {object} params - Parámetros del autor desde semantics.json.
   * @param {number} contentId - El ID de este contenido.
   * @param {object} [contentData] - Datos de estado guardados previamente.
   */
  function PythonConsole(params, contentId, contentData) {
    var self = this; // Guardamos el contexto de 'this'

    // Llama al constructor padre con .call()
    Question.call(self, 'python-console');

    self.params = params;
    self.contentId = contentId;
    self.contentData = contentData || {};

    // Estado interno
    self.pyodide = null;
    self.aceEditor = null;
    self.isLoading = true;
    self.isRunning = false;
  }

  // --- Herencia al estilo clásico de H5P ---
  PythonConsole.prototype = Object.create(Question.prototype);
  PythonConsole.prototype.constructor = PythonConsole;

  /**
   * Renderiza el componente. H5P llama a esta función.
   * @param {H5P.jQuery} $container
   */
  PythonConsole.prototype.registerDomElements = function () {
    var self = this;

    // Crear la estructura del DOM con jQuery
    /*var container = `
      <div class="python-environment">
        <div class="loading-overlay"><p>Cargando Intérprete de Python...</p></div>
        <div class="python-container" style="display: none;">
          <div class="python-editor">
            <h3>Editor de Código Python</h3>
            <div class="editor-container"></div>
          </div>
          <div class="python-console-wrapper">
            <h3>Consola de Salida</h3>
            <pre class="console-output"></pre>
            <div class="file-upload-wrapper">
              <label>Cargar archivo:</label>
              <input type="file" />
            </div>
          </div>
        </div>
      </div>
    `;*/

    var container = `
      <div class="python-environment">
        <div class="python-container">
          <div class="python-editor">
            <h3>Editor de Código Python</h3>
            <div id="editor" class="editor-container"></div>
          </div>

          <div class="python-console">
            <h3>Consola de Salida</h3>
            <pre class="console-output" class="console-output"></pre>
            
            <button id="run-button" class="run-button" disabled>Ejecutar Código</button>
            <input id="file-input" type="file" disabled>
            <button id="save-button" class="save-button">Guardar código</button>
          </div>
        </div>
      </div>
    `;

    self.$container = $(container);
    self.setContent(self.$container);

    // Guardar referencias a los elementos del DOM
    self.$editor = self.$container.find('.editor-container');
    self.$output = self.$container.find('.console-output');
    self.$fileInput = self.$container.find('input[type="file"]');
    self.$loading = self.$container.find('.loading-overlay');
    self.$mainContainer = self.$container.find('.python-container');
    
    // Iniciar la inicialización
    self.initializeAce();
    self.initializePyodide();

    // Registrar listeners de eventos
    self.$fileInput.on('change', function(e) { self.handleFileUpload(e); });
    
    // Registrar botones estándar de H5P.Question
    self.addButtons();
  };

  /**
   * Inicializa el editor Ace.
   */
  PythonConsole.prototype.initializeAce = function () {
    var self = this;
    
    // --- INICIO DE LA CORRECCIÓN ---
    // Usamos el operador || para asignar 0 si la propiedad no existe.
    const majorVersion = self.libraryInfo.majorVersion || 0;
    const minorVersion = self.libraryInfo.minorVersion || 0;
    
    // 1. Construimos el nombre de la carpeta de forma segura.
    const libraryFolder = `${self.libraryInfo.machineName}-${majorVersion}.${minorVersion}`;
    
    // 2. Obtenemos la ruta base (esta parte no cambia).
    const correctLibraryPath = H5P.getLibraryPath('') + libraryFolder;

    // 3. Configuramos Ace con la ruta segura.
    ace.config.set('basePath', `${correctLibraryPath}/ace`);

    console.log(libraryFolder);
    console.log(correctLibraryPath);
    // --- FIN DE LA CORRECCIÓN ---

    self.aceEditor = ace.edit(self.$editor.get(0));
    self.aceEditor.setTheme('ace/theme/xcode');
    self.aceEditor.session.setMode('ace/mode/python');
    self.aceEditor.setValue('#Escribe aquí tu código');
    self.aceEditor.setReadOnly(false);
  };

  /**
   * Inicializa Pyodide.
   */
  PythonConsole.prototype.initializePyodide = async function () {
    var self = this;
    try {
      // --- INICIO DE LA CORRECCIÓN ---
      // Reutilizamos la misma lógica segura para obtener la ruta.
      const majorVersion = self.libraryInfo.majorVersion || 0;
      const minorVersion = self.libraryInfo.minorVersion || 0;
      const libraryFolder = `${self.libraryInfo.machineName}-${majorVersion}.${minorVersion}`;
      const correctLibraryPath = H5P.getLibraryPath('') + libraryFolder;

      var pyodideRoot = `${correctLibraryPath}/pyodide/`;
      // --- FIN DE LA CORRECCIÓN ---

      self.pyodide = await loadPyodide({ indexURL: pyodideRoot });

      // ... (el resto de la función se mantiene igual) ...
      self.$loading.text('Instalando paquetes...');
      await self.pyodide.loadPackage(['pandas', 'numpy']);
      self.pyodide.setStdout({ batched: function(text) { self.addToOutput(text); }});
      self.pyodide.setStderr({ batched: function(text) { self.addToOutput('Error: ' + text); }});
      self.isLoading = false;
      self.$loading.hide();
      self.$mainContainer.show();
      self.trigger('resize');

    } catch (error) {
      self.$loading.text('Error crítico: No se pudo cargar Python.');
      console.error("Error detallado de Pyodide:", error);
    }
  };

  /**
   * Maneja la carga de archivos.
   */
  PythonConsole.prototype.handleFileUpload = async function (event) {
    var self = this;
    var file = event.target.files[0];
    if (!file) return;
    try {
      var content = await file.text();
      self.pyodide.FS.writeFile(file.name, content);
      self.addToOutput('> Archivo "' + file.name + '" cargado.');
    } catch (error) {
      self.addToOutput('> Error al cargar archivo: ' + error.message);
    }
  };

  /**
   * Añade texto a la consola de salida.
   */
  PythonConsole.prototype.addToOutput = function (text) {
    var self = this;
    self.$output.append(document.createTextNode(text + '\n'));
  };

  // --- Implementación de los Métodos de H5P.Question ---
  
  PythonConsole.prototype.getScore = function () {
    var self = this;
    var output = self.lastOutput ? self.lastOutput.trim() : '';
    var expected = self.params.expectedOutput ? self.params.expectedOutput.trim() : '';
    return (output === expected) ? 1 : 0;
  };

  PythonConsole.prototype.getMaxScore = function () {
    return this.params.expectedOutput ? 1 : 0;
  };

  PythonConsole.prototype.resetTask = function () {
    var self = this;
    self.lastOutput = '';
    self.$output.text('');
    self.aceEditor.setValue(self.params.initialCode || '');
    self.removeFeedback();
  };
  
  PythonConsole.prototype.addButtons = function () {
    var self = this;
    self.addButton('check-answer', self.params.l10n.checkAnswerButton, async function() {
      if (self.isRunning) return;
      self.isRunning = true;
      self.$output.text('');
      self.lastOutput = '';

      self.pyodide.setStdout({ batched: function(text) {
          self.lastOutput += text + '\n';
          self.addToOutput(text);
      }});

      try {
        await self.pyodide.runPythonAsync(self.aceEditor.getValue());
      } catch (e) {
        self.addToOutput(e.toString());
      } finally {
         self.isRunning = false;
         self.pyodide.setStdout({ batched: function(text) { self.addToOutput(text); }});
      }
      
      var score = self.getScore();
      var maxScore = self.getMaxScore();
      self.setFeedback(score === maxScore ? '¡Correcto!' : 'Inténtalo de nuevo', score, maxScore);
      self.triggerXAPI('answered');
    }, true);

    if (self.params.behaviour.enableRetry) {
      self.addButton('try-again', 'Reintentar', function() {
        self.resetTask();
      }, false);
    }
  };

  return PythonConsole;

})(H5P.jQuery, H5P.Question);