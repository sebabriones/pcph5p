jQuery(document).ready(()=>{
    //Crea nuevos selects (personalizables) en los ejercicios advanced blank
    const d = document;

    const h5pInputWrapper = $('.h5p-input-wrapper'), //contenedor del select original
          selects = $('select'); //array con los selects

    //Se crean los elementos del nuevo select y se insertan en el contenedor del select original                  
    h5pInputWrapper.each((i,el)=>{
        const div = d.createElement('div'),
              ul = d.createElement('ul'),
              span1 = d.createElement('div'),
              span2 = d.createElement('div');
        div.classList.add('custom-select-display');
        ul.classList.add('custom-options','hidden');
        span1.classList.add('custom-select-text');
        span2.classList.add('custom-select-icon');
        span2.innerText = '▼';

        el.appendChild(div);
        el.appendChild(ul);
        div.appendChild(span1);
        div.appendChild(span2);
    });

    //array con las uls que contendrán las options
    const uls = $('.custom-options');

    //Se crean los li's que contienen las opciones del nuevo select
    selects.each((x,sel)=>{
        sel.classList.add('original-select');

        $(sel.children).each((i,opt)=>{
            const li = d.createElement('li');
            li.dataset.value = `${opt.text}`;
            li.innerText = opt.value;
            opt.value = `${opt.text}`;
            //console.log(opt);

            uls[x].appendChild(li);
        });
    });

    const display = $('.custom-select-display'), //Nuevo select
          text = $('.custom-select-text'), //Texto dentro del nuevo select
          optionsList = $('.custom-options'); //Nuevas options

    for(let i=0; i<selects.length; i++){

        // Abrir/cerrar el menú
        display[i].addEventListener('click', () => {
            optionsList[i].classList.toggle('hidden');
        });

        // Seleccionar una opción
        optionsList[i].addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                const selectedValue = e.target.dataset.value;
                const selectedText = e.target.textContent;

                //display[i].textContent = selectedText; // Actualizar el display
                text[i].textContent = selectedText;
                selects[i].value = selectedValue; // Actualizar el select original
                optionsList[i].classList.add('hidden'); // Cerrar el menú

                // Crea un nuevo evento 'change'
                const event = new Event('change', {
                    bubbles: true,   // El evento "burbujeará" por el DOM
                    cancelable: true // El evento se puede cancelar
                });

                // Dispara el evento 'change' en el elemento select
                selects[i].dispatchEvent(event);

                // Actualizar la clase 'selected'
                optionsList[i].querySelectorAll('li').forEach(li => li.classList.remove('selected'));
                e.target.classList.add('selected');
            }
            //console.log(selects[i]);
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!h5pInputWrapper[i].contains(e.target)) {
                optionsList[i].classList.add('hidden');
            }
        });

        $('iframe').contents().on('click', (e) => {
            console.log('click');
            if (!h5pInputWrapper[i].contains(e.target)) {
                optionsList[i].classList.add('hidden');
            }
        });

        // Inicializar con el valor por defecto
        if (selects[i].value) {
            text[i].textContent = selects[i].options[selects[i].selectedIndex].textContent;
            optionsList[i].querySelector(`li[data-value="${selects[i].value}"]`)?.classList.add('selected');
        }

        //Activa o desactiva el pointer-event (bloquea o activa) del nuevo select al checkear o resetear el ejercicio
        //Además resetea los nuevos selects
        $('.h5p-question-buttons').on('click', (e)=>{
            if([...e.target.classList].includes('h5p-question-check-answer')){ //Si se clickea "Comprobar"
                $(display[i]).css({'pointer-events':'none'});
            }else if([...e.target.classList].includes('h5p-question-try-again')){ //Si se clickea "Intentar de nuevo"
                text[i].textContent = selects[i].options[selects[i].selectedIndex].textContent;
                if($(optionsList[i]).find('.selected').length > 0) $(optionsList[i]).find('.selected')[0].classList.remove('selected');                        
                $(display[i]).css({'pointer-events':'auto'});
                $('.option-selected').removeClass('option-selected');
            }
        });

        $(optionsList[i].children).each((i,option)=>{
            $(option).on('click', (e)=>{
                if(e.target.textContent !== ""){
                    e.target.parentNode.previousElementSibling.classList.add('option-selected');
                }else{
                    e.target.parentNode.previousElementSibling.classList.remove('option-selected');
                }
            });
        });
    }
});