var H5P = H5P || {};

H5P.MatchingGameCP = (function ($, Question) {

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
        self.solutionDrawn = false; // Bandera para saber si las líneas de solución ya fueron dibujadas correctamente
        
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
        
        // Disparar resize inicial después de que el DOM esté completamente renderizado
        // Usar requestAnimationFrame para asegurar que los botones estén en el DOM
        requestAnimationFrame(function() {
            // Primer resize para calcular líneas y tamaño de fuente
            self.trigger('resize');
            
            // Segundo resize después de un pequeño delay para asegurar que los botones estén completamente renderizados
            setTimeout(function() {
                self.trigger('resize');
            }, 200);
        });
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
        self.showingSolution = false;  // Resetear flag de solución
        self.solutionDrawn = false;  // Resetear bandera de líneas dibujadas
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
        
        // Calcula la posición en relación al contenedor
        const containerRect = svg.parentElement.getBoundingClientRect();

        const r1 = el1.getBoundingClientRect();
        const r2 = el2.getBoundingClientRect();

        let x1=0, y1=0, x2=0, y2=0;

        //Dibuja la línea dependiendo de cual es el primer elemento clickeado
        if(el1.parentNode.classList.contains('left-column')){
            // Coordenadas de inicio (Centro vertical del lado derecho del el1)
            x1 = r1.right - containerRect.left;  // Borde derecho del elemento izquierdo
            y1 = r1.top + r1.height / 2 - containerRect.top;

            // Coordenadas de fin (Centro vertical del lado izquierdo del el2)
            x2 = r2.left - containerRect.left;  // Borde izquierdo del elemento derecho
            y2 = r2.top + r2.height / 2 - containerRect.top;
        }else{
            // Coordenadas de inicio (Centro vertical del lado izquierdo del el1 - columna derecha)
            x1 = r1.left - containerRect.left;  // Borde izquierdo del elemento derecho
            y1 = r1.top + r1.height / 2 - containerRect.top;

            // Coordenadas de fin (Centro vertical del lado derecho del el2 - columna izquierda)
            x2 = r2.right - containerRect.left;  // Borde derecho del elemento izquierdo
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
        
        // Activar flag de modo solución
        self.showingSolution = true;
        self.solutionDrawn = false; // Resetear bandera
        
        // Limpiar líneas existentes y clases visuales
        self.$gameWrapper.find('.lines-svg').empty();
        self.$gameWrapper.find('.item').removeClass('selected matched');
        
        // Función para verificar si los elementos están listos
        var areElementsReady = function() {
            let svg = self.$gameWrapper.find('.lines-svg')[0];
            if (!svg || !svg.parentElement) return false;
            
            const containerRect = svg.parentElement.getBoundingClientRect();
            if (containerRect.width === 0 || containerRect.height === 0) return false;
            
            // Verificar que al menos un par de elementos tenga dimensiones válidas
            let hasValidElements = false;
            for (let i = 0; i < self.options.pairs.length; i++) {
                const pair = self.options.pairs[i];
                const el1 = self.$gameWrapper.find('.term[data-name="' + pair.answer + '"]')[0];
                const el2 = self.$gameWrapper.find('.definition[data-name="' + pair.answer + '"]')[0];
                if (el1 && el2) {
                    const r1 = el1.getBoundingClientRect();
                    const r2 = el2.getBoundingClientRect();
                    if (r1.width > 0 && r1.height > 0 && r2.width > 0 && r2.height > 0) {
                        hasValidElements = true;
                        break;
                    }
                }
            }
            return hasValidElements;
        };

        // Función para dibujar las líneas cuando la diapositiva esté lista
        var drawSolutions = function(attempts) {
            attempts = attempts || 0;
            const maxAttempts = 20; // Máximo 2 segundos (20 * 100ms)
            
            // Verificar si los elementos están listos
            if (!areElementsReady()) {
                if (attempts < maxAttempts) {
                    // Intentar de nuevo después de un breve delay
                    setTimeout(function() {
                        drawSolutions(attempts + 1);
                    }, 100);
                    return;
                }
                // Si llegamos al máximo de intentos y aún no está listo, no dibujar
                // Las líneas se dibujarán cuando la diapositiva se haga visible (en resize)
                return;
            }
            
            // Asegurar que el SVG tenga el tamaño correcto
            let svg = self.$gameWrapper.find('.lines-svg')[0];
            if (!svg || !svg.parentElement) return;
            
            const containerRect = svg.parentElement.getBoundingClientRect();
            svg.setAttribute('width', containerRect.width);
            svg.setAttribute('height', containerRect.height);
            
            // Dibujar todas las conexiones correctas
            self.options.pairs.forEach(function(pair) {
                var el1 = self.$gameWrapper.find('.term[data-name="' + pair.answer + '"]')[0];
                var el2 = self.$gameWrapper.find('.definition[data-name="' + pair.answer + '"]')[0];
                if (el1 && el2) {
                    // Verificar que los elementos tengan dimensiones válidas
                    const r1 = el1.getBoundingClientRect();
                    const r2 = el2.getBoundingClientRect();
                    if (r1.width > 0 && r1.height > 0 && r2.width > 0 && r2.height > 0) {
                        self.drawConnection(el1, el2);
                    }
                }
            });
            
            // Marcar que las líneas fueron dibujadas correctamente
            self.solutionDrawn = true;
            
            // Disparar resize para forzar recálculo después de dibujar
            setTimeout(function() {
                self.trigger('resize');
            }, 50);
        };
        
        // Esperar múltiples frames para asegurar que el DOM esté completamente renderizado
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    drawSolutions(0);
                });
            });
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
        
        // Asegurar que el SVG tenga el tamaño correcto antes de redibujar
        let svgElement = svg[0];
        if (svgElement && svgElement.parentElement) {
            const containerRect = svgElement.parentElement.getBoundingClientRect();
            
            // Solo redibujar si el contenedor está visible
            if (containerRect.width > 0 && containerRect.height > 0) {
                svgElement.setAttribute('width', containerRect.width);
                svgElement.setAttribute('height', containerRect.height);
            } else {
                // Si no está visible pero estamos en modo solución, programar un reintento
                if (self.showingSolution && !self.solutionDrawn) {
                    setTimeout(function() {
                        self.redrawAllConnections();
                    }, 100);
                }
                return; // No redibujar si no está visible
            }
        }

        // Si estamos en modo solución, dibujar las líneas correctas
        if (self.showingSolution) {
            // Verificar que los elementos estén listos antes de dibujar
            var allElementsReady = true;
            for (let i = 0; i < self.options.pairs.length; i++) {
                const pair = self.options.pairs[i];
                const el1 = self.$gameWrapper.find('.term[data-name="' + pair.answer + '"]')[0];
                const el2 = self.$gameWrapper.find('.definition[data-name="' + pair.answer + '"]')[0];
                if (el1 && el2) {
                    const r1 = el1.getBoundingClientRect();
                    const r2 = el2.getBoundingClientRect();
                    if (r1.width === 0 || r1.height === 0 || r2.width === 0 || r2.height === 0) {
                        allElementsReady = false;
                        break;
                    }
                }
            }
            
            // Solo dibujar si todos los elementos están listos
            if (allElementsReady) {
                // Usar requestAnimationFrame para asegurar que los elementos estén posicionados
                requestAnimationFrame(function() {
                    self.options.pairs.forEach(function(pair) {
                        var el1 = self.$gameWrapper.find('.term[data-name="' + pair.answer + '"]')[0];
                        var el2 = self.$gameWrapper.find('.definition[data-name="' + pair.answer + '"]')[0];
                        if (el1 && el2) {
                            // Verificar que los elementos tengan dimensiones válidas
                            const r1 = el1.getBoundingClientRect();
                            const r2 = el2.getBoundingClientRect();
                            if (r1.width > 0 && r1.height > 0 && r2.width > 0 && r2.height > 0) {
                                self.drawConnection(el1, el2);
                            }
                        }
                    });
                    // Marcar que las líneas fueron dibujadas correctamente
                    self.solutionDrawn = true;
                });
            } else {
                // Si no están listos, programar un reintento
                if (!self.solutionDrawn) {
                    setTimeout(function() {
                        self.redrawAllConnections();
                    }, 100);
                }
            }
            return;  // Salir temprano, no redibujar las líneas del usuario
        }

        // Volver a dibujar cada línea guardada del usuario
        if (self.matchesId && self.matchesId.length) {
            requestAnimationFrame(function() {
                self.matchesId.forEach(match => {
                    const el1 = self.$gameWrapper.find(`div[data-id="${match[0]}"]`)[0];
                    const el2 = self.$gameWrapper.find(`div[data-id="${match[1]}"]`)[0];
                    if (el1 && el2) {
                        const r1 = el1.getBoundingClientRect();
                        const r2 = el2.getBoundingClientRect();
                        if (r1.width > 0 && r1.height > 0 && r2.width > 0 && r2.height > 0) {
                            self.drawConnection(el1, el2);
                        }
                    }
                });
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
        
        // Si estamos en modo solución y las líneas no se han dibujado correctamente,
        // intentar dibujarlas ahora (cuando la diapositiva se hace visible)
        if (self.showingSolution && !self.solutionDrawn) {
            // Función para verificar si los elementos están completamente listos
            var checkAndDraw = function(attempts) {
                attempts = attempts || 0;
                const maxAttempts = 10; // Máximo 1 segundo (10 * 100ms)
                
                // Verificar que el contenedor esté visible
                let svg = self.$gameWrapper.find('.lines-svg')[0];
                if (!svg || !svg.parentElement) {
                    if (attempts < maxAttempts) {
                        setTimeout(function() {
                            checkAndDraw(attempts + 1);
                        }, 100);
                    }
                    return;
                }
                
                const containerRect = svg.parentElement.getBoundingClientRect();
                if (containerRect.width === 0 || containerRect.height === 0) {
                    if (attempts < maxAttempts) {
                        setTimeout(function() {
                            checkAndDraw(attempts + 1);
                        }, 100);
                    }
                    return;
                }
                
                // Verificar que todos los elementos tengan dimensiones válidas y posiciones correctas
                var allElementsReady = true;
                var hasValidPositions = true;
                for (let i = 0; i < self.options.pairs.length; i++) {
                    const pair = self.options.pairs[i];
                    const el1 = self.$gameWrapper.find('.term[data-name="' + pair.answer + '"]')[0];
                    const el2 = self.$gameWrapper.find('.definition[data-name="' + pair.answer + '"]')[0];
                    if (el1 && el2) {
                        const r1 = el1.getBoundingClientRect();
                        const r2 = el2.getBoundingClientRect();
                        if (r1.width === 0 || r1.height === 0 || r2.width === 0 || r2.height === 0) {
                            allElementsReady = false;
                            break;
                        }
                        // Verificar que las posiciones sean válidas (no sean todas 0)
                        if (r1.top === 0 && r1.left === 0 && r2.top === 0 && r2.left === 0) {
                            hasValidPositions = false;
                        }
                    }
                }
                
                // Solo dibujar si todos los elementos están listos y tienen posiciones válidas
                if (allElementsReady && hasValidPositions) {
                    // Usar múltiples requestAnimationFrame para asegurar que el layout esté completo
                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            self.redrawAllConnections();
                        });
                    });
                } else {
                    // Si no están listos, intentar de nuevo
                    if (attempts < maxAttempts) {
                        setTimeout(function() {
                            checkAndDraw(attempts + 1);
                        }, 100);
                    }
                }
            };
            
            // Esperar un poco antes de verificar (para que el resize termine)
            setTimeout(function() {
                checkAndDraw(0);
            }, 100);
        } else {
            //Redibujar las líneas SVG
            self.redrawAllConnections();
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
            // Usar self.$gameWrapper para buscar dentro del contexto correcto
            $(self.matchesId).each((i, el)=>{
                var el1 = self.$gameWrapper.find(`div[data-id="${el[0]}"]`)[0];
                var el2 = self.$gameWrapper.find(`div[data-id="${el[1]}"]`)[0];
                
                if (el1 && el2 && el1.dataset.name && el2.dataset.name) {
                    if(el1.dataset.name == el2.dataset.name){
                        $(el1).addClass('correct');
                        $(el2).addClass('correct');
                    }else{
                        $(el1).addClass('incorrect');
                        $(el2).addClass('incorrect');
                    }
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