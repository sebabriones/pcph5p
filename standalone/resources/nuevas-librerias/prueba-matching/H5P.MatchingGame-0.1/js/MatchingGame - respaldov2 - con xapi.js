var H5P = H5P || {};

H5P.MatchingGame = (function ($) {
    /**
    * Constructor principal
    * @extends H5P.Question
    * @param {Object} options - Configuraciones del juego
    * @param {number} id - ID único de la instancia
    */

    MatchingGame.prototype = Object.create(H5P.Question.prototype);
    MatchingGame.prototype.constructor = MatchingGame;

    //Constructor
    function MatchingGame(options, id){
        var self = this;

        H5P.Question.call(self, 'matching-game');

        self.options = $.extend(true, {}, {
            pairs: [],
            showScore: true
        }, options);

        self.selectedElement = null;
        self.matches = [];

        self.definitions = [...self.options.pairs].sort(() => Math.random() - 0.5);
        self.isComplete = false;
    }

    MatchingGame.prototype.attach = function($container){
        var self = this;

        H5P.Question.prototype.attach.call(self, $container);

        /*self.$container = $container;
        $container.empty();
        $container.addClass('h5p-matching-game');

        self.renderGame();*/

        var $content = self.getContent();
        
        if($content && $content.length > 0){
            $content.addClass('h5p-matching-game');
            self.renderGame($content);
        }else{
            console.error("Error: H5P.Question content container not found.")
        }
    };

    // Genera el HTML para los términos y definiciones
    MatchingGame.prototype.renderGame = function($content){
        var self = this;

        self.$content.append(`
            <div class="column" id="left-column"></div>
            <svg id="lines-svg"></svg>
            <div class="column" id="right-column"></div>
        `);

        var leftColumn = document.getElementById('left-column');
        var rightColumn = document.getElementById('right-column');

        leftColumn.innerHTML = self.options.pairs.map((pair, id) => 
            `<div class="item term" data-name="${pair.answer}">${pair.answer}</div>`
        ).join('');

        rightColumn.innerHTML = self.definitions.map((pair, id) => 
            `<div class="item definition" data-name="${pair.answer}">${pair.definition}</div>`
        ).join('');

        // Añade el event listener a las columnas (delegación)
        leftColumn.addEventListener('click', (e)=>{
            self.handleSelection(e);
        });
        rightColumn.addEventListener('click', (e)=>{
            self.handleSelection(e);
        });
    }

    MatchingGame.prototype.handleSelection = function(event) {
        var self = this;

        const clickedItem = event.target.closest('.item');
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
            // Coincidencia correcta
            self.drawConnection(self.selectedElement, clickedItem);
            
            self.selectedElement.classList.remove('selected');
            self.selectedElement.classList.add('matched');
            clickedItem.classList.add('matched');

            // Guarda el par para evitar clics futuros
            self.matches.push([selectedName, itemName]);

            self.triggerXAPI('interacted');
            
        } else {
            // Coincidencia incorrecta - Simplemente deselecciona
            self.selectedElement.classList.remove('selected');
        }

        self.selectedElement = null;

        // Verificar fin del juego
        if (self.matches.length === self.options.pairs.length) {
            self.isComplete = true;

            self.reportCompletion();
        }
    };

    MatchingGame.prototype.drawConnection = function(el1, el2) {
        var svg = document.getElementById('lines-svg');

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

    MatchingGame.prototype.getScore = function(){
        var self = this;

        return self.matches.length;
    };
    
    MatchingGame.prototype.getMaxScore = function(){
        var self = this;

        return self.options.pairs.length;
    };

    MatchingGame.prototype.get_response_data = function(){

    };

    MatchingGame.prototype.reportCompletion = function(){
        var self = this;

        self.triggerXAPICompleted(self.getScore(), self.getMaxScore(), 'completed');

        self.set = true;
        //self.showScore(self.getScore(), self.getMaxScore());
        //self.hideButton('check-answer');
        //self.showButton('show-solution');
        //self.showButton('retry');

        alert("¡Juego completado!"); 
    }

    return MatchingGame;
})(H5P.jQuery);