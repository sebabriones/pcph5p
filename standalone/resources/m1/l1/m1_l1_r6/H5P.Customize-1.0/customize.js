jQuery(document).ready(()=>{
    const d = document;

    //****Course presentation customize****
    //****Fill the blank customize****

    //Funcionalidad que reemplaza los inputs text de la actividad "Fill in the blank"
    //por selects, de forma que al momento de seleccionar una opción de cada select
    //este setee el valor seleccionado al input text que está oculto.

    //Se capturan los inputs text y se crea un arreglo vacío donde estaran los select creados
    const inputsWrapper = d.querySelectorAll('.h5p-input-wrapper'),
          selects = [];

    //Se crea un arreglo con las opciones que tendrá cada uno de los selects          
    const options = [
        ['Hogar','Educación','Industria','Gobierno','Sistemas de salud','Medio ambiente'],
        ['Hogar','Educación','Industria','Gobierno','Sistemas de salud','Medio ambiente'],
        ['Hogar','Educación','Industria','Gobierno','Sistemas de salud','Medio ambiente'],
        ['Hogar','Educación','Industria','Gobierno','Sistemas de salud','Medio ambiente'],
        ['Hogar','Educación','Industria','Gobierno','Sistemas de salud','Medio ambiente'],
        ['Hogar','Educación','Industria','Gobierno','Sistemas de salud','Medio ambiente']
    ];

    //Cambia de posición los elementos de cada arreglo de options para randomizar los selects
    $(options).each((i,option)=>{
        for(let x=option.length-1; x>0; x--){
            const y = Math.floor(Math.random()*(x+1));
            [option[x], option[y]] = [option[y], option[x]];
        }
    });

    $(inputsWrapper).each((i,inputWrapper)=>{
        const div = d.createElement('div'),
              ul = d.createElement('ul'),
              span1 = d.createElement('div'),
              span2 = d.createElement('div');

        div.classList.add('custom-select-display');
        ul.classList.add('custom-options','hidden');
        span1.classList.add('custom-select-text');
        span2.classList.add('custom-select-icon');
        span2.innerText = '▼';

        inputWrapper.appendChild(div);
        inputWrapper.appendChild(ul);
        div.appendChild(span1);
        div.appendChild(span2);

        inputWrapper.children[0].style.display = 'none';
    });

    //array con las uls que contendrán las li's
    const uls = $('.custom-options');

    $(options).each((i,option)=>{
        $(option).each((x,opt)=>{
            if(x==0){
                const li = d.createElement('li');
                li.dataset.value = '';
                li.innerText = '';
                uls[i].appendChild(li);
            }

            const li = d.createElement('li');
            li.dataset.value = opt;
            li.innerText = opt;

            uls[i].appendChild(li);
        });
    });

    const display = $('.custom-select-display'), //Nuevo select
          text = $('.custom-select-text'), //Texto dentro del nuevo select
          optionsList = $('.custom-options'); //Nuevas options

    for(let i=0; i<options.length; i++){
        const closeDropdown = () => {
            optionsList[i].classList.add('hidden');
            optionsList[i].classList.remove('open-up');
        };

        // Abrir/cerrar el menú
        display[i].addEventListener('click', (e) => {
            e.stopPropagation();

            if (!optionsList[i].classList.contains('hidden')) {
                closeDropdown();
                return;
            }

            optionsList[i].classList.remove('hidden');
            optionsList[i].classList.remove('open-up');

            const rect = display[i].getBoundingClientRect();
            const dropdownHeight = optionsList[i].scrollHeight;
            const viewportPadding = 8;
            const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
            const spaceAbove = rect.top - viewportPadding;

            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                optionsList[i].classList.add('open-up');
            }
        });

        // Seleccionar una opción
        optionsList[i].addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                const selectedText = e.target.textContent;

                text[i].textContent = selectedText;
                inputsWrapper[i].children[0].value = selectedText;
                closeDropdown(); // Cerrar el menú

                // Actualizar la clase 'selected'
                optionsList[i].querySelectorAll('li').forEach(li => li.classList.remove('selected'));
                e.target.classList.add('selected');
            }
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if(!inputsWrapper[i].contains(e.target)) {
                closeDropdown();
            }
        });

        $('iframe').contents().on('click', (e) => {
            //console.log('click');
            if (!inputsWrapper[i].contains(e.target)) {
                closeDropdown();
            }
        });

        //Activa o desactiva el pointer-event (bloquea o activa) del nuevo select al checkear o resetear el ejercicio
        //Además resetea los nuevos selects
        $('.h5p-question-buttons').on('click', (e)=>{
            if([...e.target.classList].includes('h5p-question-check-answer')){ //Si se clickea "Comprobar"
                //En este caso se utiliza la función "contains" ya que parentNode.classlist devuelve un DOMTokenList, no un arreglo
                if(display[i].parentNode.classList.contains('h5p-wrong') || display[i].parentNode.classList.contains('h5p-correct')) $(display[i]).css({'pointer-events':'none'});
            }else if([...e.target.classList].includes('h5p-question-try-again')){ //Si se clickea "Intentar de nuevo"
                text[i].textContent = '';
                if($(optionsList[i]).find('.selected').length > 0) $(optionsList[i]).find('.selected')[0].classList.remove('selected');                        
                $(display[i]).css({'pointer-events':'auto'});
                $('.option-selected').removeClass('option-selected');
            }
        });

        $('.h5p-question-buttons').on('click', (e)=>{
            if([...e.target.classList].includes('h5p-question-check-answer')){ //Si se clickea "Comprobar"
                //En este caso se utiliza la función "contains" ya que parentNode.classlist devuelve un DOMTokenList, no un arreglo
                if(display[i].parentNode.classList.contains('h5p-wrong') || display[i].parentNode.classList.contains('h5p-correct')) $(display[i]).css({'pointer-events':'none'});
            }
        });

        $('div[aria-label=Resumen]').on('click',()=>{
            $('.h5p-cp-retry-button').on('click', ()=>{
                text[i].textContent = '';
                if($(optionsList[i]).find('.selected').length > 0) $(optionsList[i]).find('.selected')[0].classList.remove('selected');                        
                $(display[i]).css({'pointer-events':'auto'});
                $('.option-selected').removeClass('option-selected');
            });
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