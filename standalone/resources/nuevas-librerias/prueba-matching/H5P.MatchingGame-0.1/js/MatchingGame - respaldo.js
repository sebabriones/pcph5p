/**
* Constructor principal
* @param {Object} options - Configuraciones del juego
* @param {number} id - ID único de la instancia
*/

H5P.MatchingGame = function(options, id){
    var self = this;

    self.options = options;
    self.id = id;

    let selectedElement = null;
    let matches = [];

    const definitions = [...self.options.pairs].sort(() => Math.random() - 0.5);

    self.attach = function($container){
        self.$container = $container;
        $container.empty();
        $container.addClass('h5p-matching-game');

        self.renderGame();
    };

    // Genera el HTML para los términos y definiciones
    self.renderGame = function(){
        self.$container.append(`
            <div class="column" id="left-column"></div>
            <svg id="lines-svg"></svg>
            <div class="column" id="right-column"></div>
        `);

        var leftColumn = document.getElementById('left-column');
        var rightColumn = document.getElementById('right-column');

        leftColumn.innerHTML = self.options.pairs.map((pair, id) => 
            `<div class="item term" data-name="${pair.answer}">${pair.answer}</div>`
        ).join('');

        rightColumn.innerHTML = definitions.map((pair, id) => 
            `<div class="item definition" data-name="${pair.answer}">${pair.definition}</div>`
        ).join('');

        // Añade el event listener a las columnas (delegación)
        leftColumn.addEventListener('click', self.handleSelection);
        rightColumn.addEventListener('click', self.handleSelection);
    }

    self.handleSelection = function(event) {
        const clickedItem = event.target.closest('.item');
        if (!clickedItem) return;

        const itemName = clickedItem.dataset.name;
        
        // Si ya fue emparejado, ignora el clic
        if (matches.some(m => m.includes(itemName))) return;
        
        // 1. Primer clic (seleccionar)
        if (!selectedElement) {
            selectedElement = clickedItem;
            clickedItem.classList.add('selected');
            return;
        } 
        
        // 2. Segundo clic (emparejar o deseleccionar)
        
        // Deseleccionar si se hace clic en el mismo elemento o en un elemento del mismo lado
        if (selectedElement === clickedItem || selectedElement.parentElement === clickedItem.parentElement) {
            selectedElement.classList.remove('selected');
            selectedElement = null;
            return;
        }

        // Proceso de Emparejamiento
        const selectedName = selectedElement.dataset.name;
        
        if (selectedName === itemName) {
            // Coincidencia correcta
            self.drawConnection(selectedElement, clickedItem);
            
            selectedElement.classList.remove('selected');
            selectedElement.classList.add('matched');
            clickedItem.classList.add('matched');

            // Guarda el par para evitar clics futuros
            matches.push([selectedName, itemName]);
            
        } else {
            // Coincidencia incorrecta - Simplemente deselecciona
            selectedElement.classList.remove('selected');
        }

        selectedElement = null;

        // Verificar fin del juego
        if (matches.length === self.options.pairs.length) {
            alert("¡Juego completado!");
        }
    };

    self.drawConnection = function(el1, el2) {
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
};