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
            },
            l10n: {
                checkAnswerButtonLabel: "Comprobar",
                showSolutionButtonLabel: "Mostrar solución",
                retryButtonLabel: "Intentar de nuevo"
            }
        }, options || {});
        
        // Validar que pairs exista y sea un array
        if (!Array.isArray(self.options.pairs)) {
            self.options.pairs = [];
        }
        
        // Si no hay pairs, agregar uno por defecto
        if (self.options.pairs.length === 0) {
            self.options.pairs = [
                {answer: "Aquí va la respuesta", definition: "Aquí va la definición"}
            ];
        }
        
        // Validar pairs antes de procesarlos
        if (Array.isArray(self.options.pairs) && self.options.pairs.length > 0) {
            self.options.pairs.forEach((pair, i)=>{
                pair.idAns = `${i}-1`;
                pair.idDef = `${i}-2`;
            });
        }
        
        //Flag para indicar si estamos mostrando la solución
        self.showingSolution = false;
        self.scaleFactor = 1;
        self._lastResizeReason = 'init';
        self._debugLines = false;
        self._debugMetrics = {
            resizeCalls: 0,
            redrawCalls: 0,
            viewportEvents: 0,
            viewportScheduled: 0
        };

        try {
            const search = (window && window.location && window.location.search) ? window.location.search : '';
            const params = new URLSearchParams(search);
            const localDebug = (window && window.localStorage) ? window.localStorage.getItem('h5pMatchingDebugLines') : null;
            self._debugLines = params.get('h5p_debug_lines') === '1' || localDebug === '1';
        } catch (e) {
            self._debugLines = false;
        }
        
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
        self.$gameViewport = this.createGameContent();
        self.$gameStage = self.$gameViewport.find('.matching-game-stage');
        self.$gameWrapper = self.$gameViewport.find('.matching-game-wrapper');
        
        // Registrar el contenido principal en H5P.Question
        self.setContent(self.$gameViewport);
        
        // Registrar los botones de acción (Check, Retry, etc.)
        self.registerButtons();
        
        // Disparar resize inicial cuando el layout ya está pintado
        requestAnimationFrame(function() {
            requestAnimationFrame(function () {
                self.trigger('resize');
            });
        });

        // Escuchar cambios de viewport y fullscreen
        if (!self._viewportResizeHandler) {
            self._viewportResizeRaf = null;
            self._viewportResizeTimer = null;
            self._lastViewportEventAt = 0;
            self._viewportResizeHandler = function () {
                self._debugMetrics.viewportEvents++;
                const now = Date.now();
                const elapsed = now - self._lastViewportEventAt;
                self._lastViewportEventAt = now;

                // Evitar ráfagas excesivas de resize (especialmente al salir de fullscreen en Firefox).
                // Mantenemos 1 ejecución estable por ventana corta.
                if (self._viewportResizeRaf) {
                    cancelAnimationFrame(self._viewportResizeRaf);
                }
                if (self._viewportResizeTimer) {
                    clearTimeout(self._viewportResizeTimer);
                }
                self._viewportResizeTimer = setTimeout(function () {
                    self._viewportResizeTimer = null;
                    self._viewportResizeRaf = requestAnimationFrame(function () {
                        self._viewportResizeRaf = null;
                        self._lastResizeReason = 'viewport';
                        self._debugMetrics.viewportScheduled++;
                        self.trigger('resize');
                    });
                }, elapsed < 120 ? 120 : 40);
            };

            window.addEventListener('resize', self._viewportResizeHandler);
            window.addEventListener('orientationchange', self._viewportResizeHandler);
            document.addEventListener('fullscreenchange', self._viewportResizeHandler);
            document.addEventListener('webkitfullscreenchange', self._viewportResizeHandler);
            document.addEventListener('mozfullscreenchange', self._viewportResizeHandler);
            document.addEventListener('MSFullscreenChange', self._viewportResizeHandler);
        }

        // Nota: se omite ResizeObserver en esta actividad para evitar loops
        // de resize/redraw cuando el viewport cambia de alto durante el escalado.
    };
    
    //Esta función crea el DOM del juego, pero NO lo añade a la página.
    //Simplemente devuelve el objeto jQuery para que setContent() lo maneje.
    MatchingGame.prototype.createGameContent = function () {
        let self = this;
        
        let $viewport = $(`
            <div class="matching-game-viewport">
                <div class="matching-game-stage">
                    <div class="matching-game-wrapper">
                        <div class="column left-column"></div>
                        <svg class="lines-svg"></svg>
                        <div class="column right-column"></div>
                    </div>
                </div>
            </div>
        `);

        let $wrapper = $viewport.find('.matching-game-wrapper');
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

        return $viewport;
    };

    //Inicializa los valores iniciales de cada intento
    MatchingGame.prototype.initGame = function () {
        let self = this;
        
        //Setea valores iniciales
        self.selectedElement = null;
        self.matchesId = [];
        self.matchesName = [];
        self.status = false;
        self.showingSolution = false;  // Resetear flag de solución
        self.attemptStartTime = Date.now();
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

        // Recalcular escala/alto cuando cambia el orden o longitud del contenido.
        if (self.$gameWrapper) {
            requestAnimationFrame(function () {
                self.trigger('resize');
            });
        }
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
            self.trigger('resize');
        }, false);
        
        self.addButton('try-again', self.options.l10n.retryButtonLabel, function() {
            self.initGame();
            self.showButton('check-answer');
            self.hideButton('show-solution');
            self.hideButton('try-again');
            self.trigger('resize');
        }, false);
    };

    /**
     * Resetea la tarea cuando CoursePresentation llama desde la diapositiva de resumen
     * Este método es requerido por H5P.Question para que el contenedor padre pueda resetear
     * el contenido embebido cuando se hace clic en "intentar de nuevo" en el resumen
     */
    MatchingGame.prototype.resetTask = function () {
        let self = this;
        
        // Resetear el juego usando el método existente
        self.initGame();
        
        // Restaurar botones al estado inicial
        self.showButton('check-answer');
        self.hideButton('show-solution');
        self.hideButton('try-again');
        
        // Limpiar feedback si existe
        self.removeFeedback();
        
        // Resetear el estado de evaluación
        self.status = false;
        
        // Limpiar clases de correcto/incorrecto de los elementos
        if (self.$gameWrapper) {
            self.$gameWrapper.find('.item').removeClass('correct incorrect matched');
        }
    };

    //Lógica del juego
    MatchingGame.prototype.handleSelection = function(clickedItem) {
        let self = this;
        
        if (!clickedItem) return; //si no existe el elemento clickeado no hace nada

        //se almacena el data-id y data-name del elemento
        const itemId = clickedItem.dataset.id;
        const itemName = clickedItem.dataset.name;
        
        // Si ya fue emparejado, permitir deshacer ese pareo con un clic.
        const matchedPairIndex = self.matchesId.findIndex(m => m.includes(itemId));
        if (matchedPairIndex !== -1) {
            const removedPair = self.matchesId[matchedPairIndex];
            self.matchesId.splice(matchedPairIndex, 1);
            self.matchesName.splice(matchedPairIndex, 1);

            // Quitar el estado visual selected de ambos elementos del par removido.
            if (removedPair && removedPair.length === 2) {
                self.$gameWrapper.find(`div[data-id="${removedPair[0]}"]`).removeClass('selected');
                self.$gameWrapper.find(`div[data-id="${removedPair[1]}"]`).removeClass('selected');
            }

            // Limpiar selección temporal y redibujar conexiones restantes.
            if (self.selectedElement) {
                self.selectedElement.classList.remove('selected');
                self.selectedElement = null;
            }

            self.redrawAllConnections();
            return;
        }
        
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
        
        // Calcula la posición en relación al contenedor
        const containerRect = svg.parentElement.getBoundingClientRect();

        const r1 = el1.getBoundingClientRect();
        const r2 = el2.getBoundingClientRect();

        let x1=0, y1=0, x2=0, y2=0;

        //Dibuja la línea dependiendo de cual es el primer elemento clickeado
        if(el1.parentNode.classList.contains('left-column')){
            // Coordenadas de inicio (Centro vertical del lado derecho del el1)
            x1 = (r1.right - containerRect.left) / this.scaleFactor;  // Borde derecho del elemento izquierdo
            y1 = (r1.top + r1.height / 2 - containerRect.top) / this.scaleFactor;

            // Coordenadas de fin (Centro vertical del lado izquierdo del el2)
            x2 = (r2.left - containerRect.left) / this.scaleFactor;  // Borde izquierdo del elemento derecho
            y2 = (r2.top + r2.height / 2 - containerRect.top) / this.scaleFactor;
        }else{
            // Coordenadas de inicio (Centro vertical del lado izquierdo del el1 - columna derecha)
            x1 = (r1.left - containerRect.left) / this.scaleFactor;  // Borde izquierdo del elemento derecho
            y1 = (r1.top + r1.height / 2 - containerRect.top) / this.scaleFactor;

            // Coordenadas de fin (Centro vertical del lado derecho del el2 - columna izquierda)
            x2 = (r2.right - containerRect.left) / this.scaleFactor;  // Borde derecho del elemento izquierdo
            y2 = (r2.top + r2.height / 2 - containerRect.top) / this.scaleFactor;
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
        
        // Activar flag de modo solución
        self.showingSolution = true;
        
        // Limpiar líneas existentes y clases visuales
        self.$gameWrapper.find('.lines-svg').empty();
        self.$gameWrapper.find('.item').removeClass('selected matched');

        // Usar requestAnimationFrame para asegurar que el layout esté completo
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                // Asegurar que el SVG tenga el tamaño correcto
                let svg = self.$gameWrapper.find('.lines-svg')[0];
                if (svg && self.$gameWrapper && self.$gameWrapper[0]) {
                    svg.setAttribute('width', self.$gameWrapper[0].offsetWidth);
                    svg.setAttribute('height', self.$gameWrapper[0].offsetHeight);
                }
                
                // Dibujar todas las conexiones correctas
                self.options.pairs.forEach(function(pair) {
                    var el1 = self.$gameWrapper.find('.term[data-name="' + pair.answer + '"]')[0];
                    var el2 = self.$gameWrapper.find('.definition[data-name="' + pair.answer + '"]')[0];
                    if (el1 && el2) {
                        self.drawConnection(el1, el2);
                    }
                });
            });
        });
        
        // Deshabilitar más clics
        self.$gameWrapper.find('.item').off('click');

        // Asegurar recálculo final de layout y líneas tras render de soluciones
        requestAnimationFrame(function () {
            self.trigger('resize');
        });
    };

    //Función centralizada para redibujar todas las conexiones existentes.
    MatchingGame.prototype.redrawAllConnections = function () {
        let self = this;
        self._debugMetrics.redrawCalls++;
        let svg = self.$gameWrapper.find('.lines-svg');
        if (!svg.length) return;

        // Limpiar el SVG
        svg.empty();
        
        // Asegurar que el SVG tenga el tamaño correcto antes de redibujar
        let svgElement = svg[0];
        if (svgElement && self.$gameWrapper && self.$gameWrapper[0]) {
            svgElement.setAttribute('width', self.$gameWrapper[0].offsetWidth);
            svgElement.setAttribute('height', self.$gameWrapper[0].offsetHeight);
        }

        // Si estamos en modo solución, dibujar las líneas correctas
        if (self.showingSolution) {
            requestAnimationFrame(function() {
                self.options.pairs.forEach(function(pair) {
                    var el1 = self.$gameWrapper.find('.term[data-name="' + pair.answer + '"]')[0];
                    var el2 = self.$gameWrapper.find('.definition[data-name="' + pair.answer + '"]')[0];
                    if (el1 && el2) {
                        self.drawConnection(el1, el2);
                    }
                });
            });
            return;  // Salir temprano, no redibujar las líneas del usuario
        }

        // Volver a dibujar cada línea guardada del usuario
        if (self.matchesId && self.matchesId.length) {
            requestAnimationFrame(function() {
                self.matchesId.forEach(match => {
                    const el1 = self.$gameWrapper.find(`div[data-id="${match[0]}"]`)[0];
                    const el2 = self.$gameWrapper.find(`div[data-id="${match[1]}"]`)[0];
                    if (el1 && el2) {
                        self.drawConnection(el1, el2);
                    }
                });
            });
        }

        if (self._debugLines) {
            console.debug('[MatchingGame] redrawAllConnections', {
                redrawCalls: self._debugMetrics.redrawCalls,
                resizeCalls: self._debugMetrics.resizeCalls,
                viewportEvents: self._debugMetrics.viewportEvents,
                viewportScheduled: self._debugMetrics.viewportScheduled,
                showingSolution: self.showingSolution,
                matches: (self.matchesId || []).length
            });
        }
    };

    /**
     * Programa un único redraw en el próximo frame para evitar
     * múltiples redibujos en cascada durante resize.
     */
    MatchingGame.prototype.scheduleRedrawAllConnections = function () {
        let self = this;
        if (self._redrawRaf) {
            return;
        }

        self._redrawRaf = requestAnimationFrame(function () {
            self._redrawRaf = null;
            self.redrawAllConnections();
        });
    };
    
    //La función de 'resize' que se llamará en cada redimensionamiento.
    MatchingGame.prototype.resize = function () {
        let self = this;
        self._debugMetrics.resizeCalls++;
        if (!self.$gameViewport || !self.$gameStage || !self.$gameWrapper) {
            return;
        }
        if (self._isResizing) {
            return;
        }
        self._isResizing = true;

        try {
            // Escalado proporcional sobre un escenario base.
            const baseWidth = 900;
            const minBaseHeight = 520;
            const leftColumn = self.$gameWrapper.find('.left-column')[0];
            const rightColumn = self.$gameWrapper.find('.right-column')[0];
            const contentHeight = Math.max(
                leftColumn ? leftColumn.scrollHeight : 0,
                rightColumn ? rightColumn.scrollHeight : 0
            );
            const baseHeight = Math.max(minBaseHeight, contentHeight + 40);
            const viewportWidth = self.$gameViewport.width() || baseWidth;
            const $content = self.$gameViewport.closest('.h5p-content');
            const contentHeightAvailable = ($content.height && $content.height()) || window.innerHeight;
            const controlsHeight =
                ($content.find('.h5p-question-buttons:visible').outerHeight(true) || 0) +
                ($content.find('.h5p-question-feedback:visible').outerHeight(true) || 0) + 16;
            const viewportHeight = Math.max(200, contentHeightAvailable - controlsHeight);
            const scaleByWidth = viewportWidth / baseWidth;
            const scaleByHeight = viewportHeight / baseHeight;
            const scaleRatio = Math.min(scaleByWidth, scaleByHeight);
            self.scaleFactor = scaleRatio;

            self.$gameStage.css('height', baseHeight + 'px');
            self.$gameStage.css({
                transform: `scale(${scaleRatio})`,
                transformOrigin: 'top left'
            });

            const nextViewportHeight = (baseHeight * scaleRatio);
            const currentViewportHeight = parseFloat(self.$gameViewport[0].style.height || '0');
            if (Math.abs(nextViewportHeight - currentViewportHeight) > 0.5) {
                self.$gameViewport.css('height', nextViewportHeight + 'px');
            }

            // Redibujar sólo cuando el tamaño efectivo cambie de forma apreciable.
            const viewportRect = self.$gameViewport[0].getBoundingClientRect();
            const currentWidth = Math.round(viewportRect.width);
            const currentHeight = Math.round(viewportRect.height);
            const widthChanged = (self._lastViewportWidth === undefined) || (Math.abs(currentWidth - self._lastViewportWidth) > 1);
            const heightChanged = (self._lastViewportHeight === undefined) || (Math.abs(currentHeight - self._lastViewportHeight) > 1);

            if (widthChanged || heightChanged) {
                self._lastViewportWidth = currentWidth;
                self._lastViewportHeight = currentHeight;
                self.scheduleRedrawAllConnections();
            }

            if (self._debugLines) {
                console.debug('[MatchingGame] resize', {
                    reason: self._lastResizeReason,
                    resizeCalls: self._debugMetrics.resizeCalls,
                    redrawCalls: self._debugMetrics.redrawCalls,
                    viewportEvents: self._debugMetrics.viewportEvents,
                    viewportScheduled: self._debugMetrics.viewportScheduled,
                    currentWidth: currentWidth,
                    currentHeight: currentHeight,
                    scaleFactor: self.scaleFactor
                });
            }
        } finally {
            self._isResizing = false;
        }
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

    /**
     * Calcula la duración del intento actual en formato ISO 8601 (PT#H#M#S)
     * para incluirla en el statement xAPI.
     * @returns {string}
     */
    MatchingGame.prototype.getAttemptDurationISO8601 = function () {
        let self = this;
        let start = self.attemptStartTime || Date.now();
        let elapsedSeconds = Math.max(0, Math.round((Date.now() - start) / 1000));

        let hours = Math.floor(elapsedSeconds / 3600);
        let minutes = Math.floor((elapsedSeconds % 3600) / 60);
        let seconds = elapsedSeconds % 60;

        let duration = 'PT';
        if (hours > 0) duration += `${hours}H`;
        if (minutes > 0) duration += `${minutes}M`;
        duration += `${seconds}S`;

        return duration;
    };

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

        // Usa la API estándar de H5P.Question para poblar score/success/completion
        // y habilitar campos como duration cuando el contenedor los soporta.
        xAPIEvent.setScoredResult(score, maxScore, self, true, isSuccess);
        xAPIEvent.data.statement.result.response = userResponse.join('[,]');

        // Asegurar duration en todos los entornos standalone/LMS.
        if (!xAPIEvent.data.statement.result.duration) {
            xAPIEvent.data.statement.result.duration = self.getAttemptDurationISO8601();
        }

        xAPIEvent.data.statement.object.definition.correctResponsesPattern = correctResponses;
        xAPIEvent.data.statement.object.definition.pairs = pairs;
    
        self.trigger(xAPIEvent);

        //self.triggerXAPICompleted(self.getScore(), self.getMaxScore(), 'answered');
    }

    return MatchingGame;

})(H5P.jQuery, H5P.Question);