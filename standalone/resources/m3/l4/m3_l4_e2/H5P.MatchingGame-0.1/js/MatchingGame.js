var H5P = H5P || {};

H5P.MatchingGame = (function ($, Question) {

    //Constructor principal. Hereda de H5P.Question.
    function MatchingGame(options, id) {
        let self = this;

        //Llama al constructor padre de H5P.Question, se le pasa la instancia actual y un nombre para la clase del contenedor de la actividad
        Question.call(self, 'matching-game');

        //Opciones y valores por defecto
        self.options = $.extend(true, {}, {
            pairs: [],
            behaviour: {
                enableRetry: true,
                enableSolutionButton: false,
                enableScoreText: false
            }
        }, options);

        self.options.pairs.forEach((pair, i)=>{
            pair.idAns = `${i}-1`;
            pair.idDef = `${i}-2`;
        });
        
        //Se inicializa la estructura de la actividad
        self.initGame();

        //Se llama al evento que redimensiona el tamñano de los elementos
        self.on('resize', self.resize.bind(self));
    }

    //Establece la herencia
    MatchingGame.prototype = Object.create(Question.prototype);
    MatchingGame.prototype.constructor = MatchingGame;

    //El método registerDomElements prepara el contenido y se lo entrega a H5P.Question. Anteriormente era el método attach.
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

        //Disparamos un resize inicial al final, cuando todo el DOM está listo.
        //Esto asegura que las líneas y el tamaño de la fuente se calculen correctamente al cargar.
        setTimeout(function(){
            self.trigger('resize');
        }, 100);
    };
    
    //Esta función crea el DOM del juego, pero NO lo añade a la página.
    //Simplemente devuelve el objeto jQuery para que setContent() lo maneje.
    MatchingGame.prototype.createGameContent = function () {
        let self = this;
        
        let $wrapper = $(`
            <div class="matching-game-wrapper">
                <div class="column left-column"></div>
                <svg class="lines-svg"></svg>
                <div class="column right-column"></div>
            </div>
        `);

        let $leftColumn = $wrapper.find('.left-column');
        let $rightColumn = $wrapper.find('.right-column');
        
        $leftColumn.html(self.options.pairs.map((pair, i) =>
            (typeof pair.answer !== 'undefined') ? `<div class="item term" data-id="${pair.idAns}" data-name="${pair.answer}"><span class="item-content">${pair.answer}</span></div>` : ''
        ).join(''));
        
        $rightColumn.html(self.definitions.map((pair, i) =>
            (typeof pair.definition !== 'undefined') ? `<div class="item definition" data-id="${pair.idDef}" data-name="${pair.answer}"><span class="item-content">${pair.definition}</span></div>` : ''
        ).join(''));
        
        // Añadir listeners de eventos
        $wrapper.find('.item').on('click', function() {
            self.handleSelection(this);
        });

        return $wrapper;
    };

    //Inicializa los valores iniciales de cada intento
    MatchingGame.prototype.initGame = function () {
        let self = this;
        
        //Setea valores iniciales
        self.selectedElement = null;
        self.matchesId = [];
        self.matchesName = [];
        self.status = false;
        self.definitions = [...self.options.pairs].sort(() => Math.random() - 0.5);
        
        // Reiniciar la UI si ya fue creada
        if (self.$gameWrapper) {
            self.$gameWrapper.find('.lines-svg').empty();
            self.$gameWrapper.find('.item').removeClass('selected');
            
            // Re-renderizar columna derecha con nuevo orden
            let $leftColumn = self.$gameWrapper.find('.left-column'),
                $rightColumn = self.$gameWrapper.find('.right-column');

            $leftColumn.html(self.options.pairs.map((pair, i) =>
            (typeof pair.answer !== 'undefined') ? `<div class="item term" data-id="${pair.idAns}" data-name="${pair.answer}"><span class="item-content">${pair.answer}</span></div>` : ''
            ).join(''));
            
            $rightColumn.html(self.definitions.map((pair, i) =>
                (typeof pair.definition !== 'undefined') ? `<div class="item definition" data-id="${pair.idDef}" data-name="${pair.answer}"><span class="item-content">${pair.definition}</span></div>` : ''
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
            let score = self.getScore();
            let maxScore = self.getMaxScore();
            //if(self.options.behaviour.enableScoreText) self.setFeedback(`Has conseguido ${score} de ${maxScore} puntos.`, score, maxScore);
            self.setFeedback((self.options.behaviour.enableScoreText)?`Has conseguido ${score} de ${maxScore} puntos.`:'', score, maxScore);
            self.reportCompletion(score, maxScore);
            
            // Deshabilitar más clics después de verificar
            self.$gameWrapper.find('.item').off('click');
            
            self.hideButton('check-answer');

            if(self.options.behaviour.enableSolutionButton) self.showButton('show-solution');

            if(self.options.behaviour.enableRetry) self.showButton('try-again');
        }, true);
        
        self.addButton('show-solution', self.options.l10n.showSolutionButtonLabel, function() {
            self.showSolutions();
            self.hideButton('show-solution');
        }, false);
        
        self.addButton('try-again', self.options.l10n.retryButtonLabel, function() {
            self.initGame();
            self.showButton('check-answer');
            self.hideButton('show-solution');
            self.hideButton('try-again');
        }, false);
    };

    //Lógica del juego
    MatchingGame.prototype.handleSelection = function(clickedItem) {
        let self = this;
        
        if (!clickedItem) return; //si no existe el elemento clickeado no hace nada

        //se almacena el data-id y data-name del elemento
        const itemId = clickedItem.dataset.id;
        const itemName = clickedItem.dataset.name;
        
        // Si ya fue emparejado, ignora el clic
        if (self.matchesId.some(m => m.includes(itemId))) return; //si ya esta emparejado no hace nada
        
        // 1. Primer clic (seleccionar)
        //Si no se ha seleccionado un primer elemento
        if (!self.selectedElement) {
            self.selectedElement = clickedItem;
            clickedItem.classList.add('selected');
            return;
        } 
        
        // 2. Segundo clic/selecciona segundo elemento (emparejar o deseleccionar)
        // Deseleccionar si se hace clic en el mismo elemento o en un elemento de la misma columna
        if (self.selectedElement === clickedItem || self.selectedElement.parentElement === clickedItem.parentElement) {
            self.selectedElement.classList.remove('selected');
            self.selectedElement = null;
            return;
        }

        // Proceso de Emparejamiento
        //Busca en selectedElement el elemento que se clickeo primero
        const selectedId = self.selectedElement.dataset.id;
        const selectedName = self.selectedElement.dataset.name;
        clickedItem.classList.add('selected');

        if(selectedId && itemId){
            self.drawConnection(self.selectedElement, clickedItem);

            //Guarda el par para evitar clics futuros
            self.matchesId.push([selectedId, itemId]);

            //Guarda el par para ser evaluado al final
            self.matchesName.push([selectedName, itemName]);

            //Muestra statement xAPI cuando se interactúa con el juego
            //self.triggerXAPI('interacted');
        }

        self.selectedElement = null;
    };

    //Dibuja las líneas que unen los términos
    MatchingGame.prototype.drawConnection = function(el1, el2) {
        // Buscamos el SVG dentro de nuestro contenedor del juego
        let svg = this.$gameWrapper.find('.lines-svg')[0];
        if (!svg) return;
        
        // Calcula la posición en relación al SVG (para simplificar)
        const containerRect = svg.parentElement.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();

        const r1 = el1.getBoundingClientRect();
        const r2 = el2.getBoundingClientRect();

        let x1=0, y1=0, x2=0, y2=0;

        //Dibuja la línea dependiendo de cual es el primer elemento clickeado
        if(el1.parentNode.classList.contains('left-column')){
            // Coordenadas de inicio (Centro de la derecha del el1)
            x1 = r1.left - containerRect.left;
            y1 = r1.top + r1.height / 2 - containerRect.top;

            // Coordenadas de fin (Centro de la izquierda del el2)
            x2 = svgRect.width;
            y2 = r2.top + r2.height / 2 - containerRect.top;
        }else{
            // Coordenadas de inicio (Centro de la izquierda del el1)
            x1 = svgRect.width;
            y1 = r1.top + r1.height / 2 - containerRect.top;

            // Coordenadas de fin (Centro de la derecha del el2)
            x2 = r2.left - containerRect.left;
            y2 = r2.top + r2.height / 2 - containerRect.top;
        }

        // Crea el elemento <line> SVG
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.classList.add('connection-line');
        
        svg.appendChild(line);
    };

    //Entrega la respuesta al clickear "Mostrar solución"
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
                //$(el1).addClass('matched');
                //$(el2).addClass('matched');
            }
        });
        
        // Deshabilitar más clics
        self.$gameWrapper.find('.item').off('click');
    };

    //Función centralizada para redibujar todas las conexiones existentes.
    MatchingGame.prototype.redrawAllConnections = function () {
        let self = this;
        let svg = self.$gameWrapper.find('.lines-svg');
        if (!svg.length) return;

        // Limpiar el SVG
        svg.empty();

        // Volver a dibujar cada línea guardada
        if (self.matchesId && self.matchesId.length) {
            self.matchesId.forEach(match => {
                const el1 = self.$gameWrapper.find(`div[data-id="${match[0]}"]`)[0];
                const el2 = self.$gameWrapper.find(`div[data-id="${match[1]}"]`)[0];
                self.drawConnection(el1, el2);
            });
        }
    };
    
    //La función de 'resize' que se llamará en cada redimensionamiento.
    MatchingGame.prototype.resize = function () {
        let self = this;
        if (!self.$gameWrapper) {
            return;
        }

        //Escalar la fuente (Método del Ratio) ---
        //Se define un ancho base para nuestro diseño (ej. 900px).
        const baseWidth = 900;
        const currentWidth = self.$gameWrapper.width();
        const scaleRatio = currentWidth / baseWidth;

        //Se aplica el ratio al tamaño de fuente del contenedor.
        //1em es un buen valor base. El CSS hará el resto.
        self.$gameWrapper.css('font-size', scaleRatio + 'em');
        
        //Redibujar las líneas SVG
        self.redrawAllConnections();
    };

    //***Métodos de H5P.Question que manejan los botones, score y statement xApi***

    //Se declaran los métodos que manejan la puntuación del ejercicio
    //Estos son propios de H5P.Question por lo que siempre se deben crear
    //en caso que se quiera manejar puntuaciones
    MatchingGame.prototype.getScore = function () {
        let self = this,
            score = 0;

        if(!self.status){
            $(self.matchesId).each((i, el)=>{
                if($(`div[data-id=${el[0]}]`)[0].dataset.name == $(`div[data-id=${el[1]}]`)[0].dataset.name){
                    $($(`div[data-id=${el[0]}]`)[0]).addClass('correct');
                    $($(`div[data-id=${el[1]}]`)[0]).addClass('correct');
                }else{
                    $($(`div[data-id=${el[0]}]`)[0]).addClass('incorrect');
                    $($(`div[data-id=${el[1]}]`)[0]).addClass('incorrect');
                }
            });

            self.status = true;
        }

        $(self.matchesName).each((i, el)=>{
            if(el[0] === el[1]) score++;
        });

        return score;
    };

    MatchingGame.prototype.getMaxScore = function () {
        let self = this;
        let maxScore = 0;

        self.options.pairs.forEach(pair => {if(pair.answer && pair.definition) maxScore++});

        return maxScore;
    };

    //Métodos para incluir data adicional en el statement xApi
    MatchingGame.prototype.getCorrectResponsesPattern = function() {
        let self = this;
        let correctPattern = [];

        self.options.pairs.forEach((pair, i)=>{
            correctPattern.push(pair.idAns +'],['+ pair.idDef);
        });

        return correctPattern;
    }

    MatchingGame.prototype.getResponse = function() {
        let self = this;
        let userResponse = [];

        self.matchesId.forEach((match)=>{
            userResponse.push(match[0] +'],['+ match[1]);
        });

        return userResponse;
    }

    //Entrega statement xAPI
    MatchingGame.prototype.reportCompletion = function(score, maxScore){
        let self = this;
        
        //let score = self.getScore();
        //let maxScore = self.getMaxScore();
        let isSuccess = (score === maxScore);

        let xAPIEvent = self.createXAPIEventTemplate('answered');
        let userResponse = self.getResponse();
        let correctResponses = self.getCorrectResponsesPattern();

        let pairs = [];

        self.options.pairs.forEach(pair => {
            pairs.push({answer: pair.answer, definition: pair.definition});
        });

        let result = {
            score: {
                raw: score,
                min: 0,
                max: maxScore,
                scaled: maxScore > 0 ? (score/maxScore) : 0
            },
            response: userResponse.join('[,]'),
            success: isSuccess,
            completion: true
        };

        xAPIEvent.data.statement.result = result;

        xAPIEvent.data.statement.object.definition.correctResponsesPattern = correctResponses;
        xAPIEvent.data.statement.object.definition.pairs = pairs;
    
        self.trigger(xAPIEvent);

        //self.triggerXAPICompleted(self.getScore(), self.getMaxScore(), 'answered');
    }

    return MatchingGame;

})(H5P.jQuery, H5P.Question);