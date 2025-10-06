var H5P = H5P || {};

H5P.MatchingGame = (function ($, Question) {

    //Constructor principal. Hereda de H5P.Question.
    function MatchingGame(options, id) {
        let self = this;

        //Llama al constructor padre de H5P.Question, se le pasa la instancia actual y un nombre para la clase
        Question.call(self, 'matching-game');

        //Opciones y valores por defecto
        self.options = $.extend(true, {}, {
            pairs: [],
            l10n: {
                checkAnswerButtonLabel: "Verificar",
                retryButtonLabel: "Reintentar",
                showSolutionButtonLabel: "Mostrar solución",
                taskDescription: "Arrastra para unir los conceptos con sus definiciones."
            }
        }, options);
        
        // Inicializar el estado del juego
        self.resetTask();
    }

    //Establece la herencia
    MatchingGame.prototype = Object.create(Question.prototype);
    MatchingGame.prototype.constructor = MatchingGame;

    /**
     * El método registerDomElements prepara el contenido y se lo entrega a H5P.Question.
     */
    MatchingGame.prototype.registerDomElements = function () {
        let self = this;
        
        // Registrar la introducción (descripción de la tarea) en caso de requerirse
        //self.setIntroduction(this.options.l10n.taskDescription);

        // Crear el contenido principal del juego
        self.$gameWrapper = this.createGameContent();
        
        // Registrar el contenido principal en H5P.Question
        self.setContent(self.$gameWrapper);
        
        // Registrar los botones de acción (Check, Retry, etc.)
        self.registerButtons();
    };
    
    /**
     * Esta función crea el DOM del juego, pero NO lo añade a la página.
     * Simplemente devuelve el objeto jQuery para que setContent() lo maneje.
     */
    MatchingGame.prototype.createGameContent = function () {
        let self = this;
        
        // Usamos clases en lugar de IDs para permitir múltiples instancias
        let $wrapper = $(`
            <div class="matching-game-wrapper">
                <div class="column left-column"></div>
                <svg class="lines-svg"></svg>
                <div class="column right-column"></div>
            </div>
        `);

        let $leftColumn = $wrapper.find('.left-column');
        let $rightColumn = $wrapper.find('.right-column');
        
        $leftColumn.html(self.options.pairs.map(pair =>
            `<div class="item term" data-name="${pair.answer}">${pair.answer}</div>`
        ).join(''));
        
        $rightColumn.html(self.definitions.map(pair =>
            `<div class="item definition" data-name="${pair.answer}">${pair.definition}</div>`
        ).join(''));
        
        // Añadir listeners de eventos
        $wrapper.find('.item').on('click', function() {
            self.handleSelection(this);
        });

        return $wrapper;
    };
    
    //Se declaran los métodos que manejan la puntuación del ejercicio
    //Estos son propios de H5P.Question por lo que siempre se deben crear
    //en caso que se quira manejar puntuaciones
    MatchingGame.prototype.getScore = function () {
        let self = this;
        return self.matches.length;
    };

    MatchingGame.prototype.getMaxScore = function () {
        let self = this;
        return self.options.pairs.length;
    };

    //***revisar para que entregue bien la respuesta
    MatchingGame.prototype.showSolutions = function () {
        var self = this;
        // Limpiar líneas existentes y clases visuales
        self.$gameWrapper.find('.lines-svg').empty();
        self.$gameWrapper.find('.item').removeClass('selected matched');

        // Dibujar todas las conexiones correctas
        self.options.pairs.forEach(function(pair) {
            var el1 = self.$gameWrapper.find('.term[data-name="' + pair.answer + '"]')[0];
            var el2 = self.$gameWrapper.find('.definition[data-name="' + pair.answer + '"]')[0];
            if (el1 && el2) {
                self.drawConnection(el1, el2);
                $(el1).addClass('matched');
                $(el2).addClass('matched');
            }
        });
        
        // Deshabilitar más clics
        self.$gameWrapper.find('.item').off('click');
    };

    MatchingGame.prototype.reportCompletion = function(){
        let self = this;

        self.triggerXAPICompleted(self.getScore(), self.getMaxScore(), 'completed');

        alert("¡Juego completado!"); 
    }
    

    MatchingGame.prototype.resetTask = function () {
        let self = this;
        
        // Reiniciar estado
        self.selectedElement = null;
        self.matches = [];
        self.definitions = [...self.options.pairs].sort(() => Math.random() - 0.5);
        
        // Reiniciar la UI si ya fue creada
        if (self.$gameWrapper) {
            self.$gameWrapper.find('.lines-svg').empty();
            self.$gameWrapper.find('.item').removeClass('selected matched');
            
            // Re-renderizar columna derecha con nuevo orden
            var $rightColumn = self.$gameWrapper.find('.right-column');
            $rightColumn.html(self.definitions.map(pair =>
                `<div class="item definition" data-name="${pair.answer}">${pair.definition}</div>`
            ).join(''));
            
            // Reactivar listeners
            self.$gameWrapper.find('.item').off('click').on('click', function() {
                self.handleSelection(this);
            });
        }
        
        self.removeFeedback();
    };

    //Registrar botones de acción
    MatchingGame.prototype.registerButtons = function () {
        let self = this;
        
        self.addButton('check-answer', self.options.l10n.checkAnswerButtonLabel, function() {
            var score = self.getScore();
            var maxScore = self.getMaxScore();
            self.setFeedback(`Has conseguido ${score} de ${maxScore} puntos.`, score, maxScore);
            self.reportCompletion();
            
            // Deshabilitar más clics después de verificar
            self.$gameWrapper.find('.item').off('click');
            
            self.hideButton('check-answer');
            self.showButton('show-solution');
            self.showButton('retry');
        }, true);
        
        self.addButton('show-solution', self.options.l10n.showSolutionButtonLabel, function() {
            self.showSolutions();
            self.hideButton('show-solution');
        }, false);
        
        self.addButton('retry', self.options.l10n.retryButtonLabel, function() {
            self.resetTask();
            self.showButton('check-answer');
            self.hideButton('show-solution');
            self.hideButton('retry');
        }, false);
    };

    //Lógica del juego
    MatchingGame.prototype.handleSelection = function(clickedItem) {
        let self = this;
        
        //const clickedItem = event.target.closest('.item');
        if (!clickedItem) return;

        const itemName = clickedItem.dataset.name;
        
        // Si ya fue emparejado, ignora el clic
        if (self.matches.some(m => m.includes(itemName))) return;
        
        // 1. Primer clic (seleccionar)
        if (!self.selectedElement) {
            self.selectedElement = clickedItem;
            clickedItem.classList.add('selected');
            return;
        } 
        
        // 2. Segundo clic (emparejar o deseleccionar)
        
        // Deseleccionar si se hace clic en el mismo elemento o en un elemento del mismo lado
        if (self.selectedElement === clickedItem || self.selectedElement.parentElement === clickedItem.parentElement) {
            self.selectedElement.classList.remove('selected');
            self.selectedElement = null;
            return;
        }

        // Proceso de Emparejamiento
        const selectedName = self.selectedElement.dataset.name;
        
        if (selectedName === itemName) {
            console.log('linea');
            // Coincidencia correcta
            self.drawConnection(self.selectedElement, clickedItem);
            
            self.selectedElement.classList.remove('selected');
            self.selectedElement.classList.add('matched');
            clickedItem.classList.add('matched');

            // Guarda el par para evitar clics futuros
            self.matches.push([selectedName, itemName]);
            
        } else {
            // Coincidencia incorrecta - Simplemente deselecciona
            self.selectedElement.classList.remove('selected');
        }

        self.selectedElement = null;
    };

    //Dibuja las líneas que unen los términos
    MatchingGame.prototype.drawConnection = function(el1, el2) {
        // Buscamos el SVG dentro de nuestro contenedor del juego
        var svg = this.$gameWrapper.find('.lines-svg')[0];
        if (!svg) return;
        
        // Calcula la posición en relación al SVG (para simplificar)
        const containerRect = svg.parentElement.getBoundingClientRect(); 

        const r1 = el1.getBoundingClientRect();
        const r2 = el2.getBoundingClientRect();

        // Coordenadas de inicio (Centro de la derecha del el1)
        const x1 = r1.right - containerRect.left;
        const y1 = r1.top + r1.height / 2 - containerRect.top;

        // Coordenadas de fin (Centro de la izquierda del el2)
        const x2 = r2.left - containerRect.left;
        const y2 = r2.top + r2.height / 2 - containerRect.top;

        // Crea el elemento <line> SVG
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.classList.add('connection-line');
        
        svg.appendChild(line);
    };

    return MatchingGame;

})(H5P.jQuery, H5P.Question);