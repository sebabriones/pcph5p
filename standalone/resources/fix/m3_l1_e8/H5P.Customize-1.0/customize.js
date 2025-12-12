jQuery(document).ready(()=>{
    const d = document;

    //****Course presentation customize****
    /*Posiciona las flechas del footer de navegación a los costados de la navegación (puntos)
    y cuando se hayan respondido todas las slides envía de forma automática al slide de resumen*/

    //const progressbarItems = $('.h5p-progressbar .h5p-progressbar-part');

    const h5pNavigation = $('.h5p-cp-navigation')[0],
          btnPrev = $('.h5p-footer-previous-slide')[0],
          btnNext = $('.h5p-footer-next-slide')[0],
          taskAnswered = $('.h5p-progressbar-part-has-task'),
          slides = $('.h5p-slides-wrapper')[0].children,
          beforeSummarySlide = $('.h5p-progressbar .h5p-progressbar-part')[$('.h5p-progressbar .h5p-progressbar-part').length - 2],
          summarySlide = $('.progressbar-part-summary-slide'),
          finishBtnContainer = d.createElement('div'),
          finishBtn = d.createElement('div');
          
    let answeredCount = 0;

    $('.h5p-footer').css({'display':'none'});
    $('.h5p-tooltip').css({'display':'none'});

    //Oculta boton de slide de Retroalimentación y Summary
    $(beforeSummarySlide).css('display','none');
    summarySlide.css({'display':'none'});

    h5pNavigation.children[0].parentNode.insertBefore(btnPrev, h5pNavigation.children[0]);
    h5pNavigation.appendChild(btnNext);

    //Genera el botón de Terminar
    $(finishBtnContainer).addClass('finish-btn-container');
    $(finishBtn).html('Terminar').addClass('finish-btn');

    finishBtnContainer.appendChild(finishBtn);
    d.querySelector('.h5p-wrapper').appendChild(finishBtnContainer);

    $(finishBtnContainer).css('display','none');

    //Si la diapo que se esta observando es la ultima antes de la diapo de retroalimentación, bloquea el boton de avanzar
    const observerSlides = new MutationObserver((mutationList, observerInstance)=>{
        if($('.h5p-current')[0].id == slides[slides.length-3].id){
            $('.h5p-footer-next-slide').css({'pointer-events':'none'});
        }else{
            $('.h5p-footer-next-slide').css({'pointer-events':'auto'});
        }

        /*if($('.h5p-current')[0].id == 'slide-undefined'){
            $('.h5p-footer-button').css({'visibility':'hidden'});
            $('.h5p-progressbar').css({'visibility':'hidden'});
        }*/
    })

    $(slides).each((i,el)=>{
        observerSlides.observe(el, {
            attributes: true,
            attributeFilter: ['class'],
            attributeOldValue: true
        })
    });

    //Siempre que se clickee el botón comprobar se sumará uno al contador "answeredCount"
    //de forma que, cuando tenga el mismo valor que la cantidad de slides con ejercicios
    //dirigirá automáticamente a la pantalla de retroalimentación
    $('.h5p-question-check-answer').on('click',(e)=>{
        answeredCount++;

        if(answeredCount == taskAnswered.length){
            setTimeout(() => {
                //Simula click a botón de slide de retroalimentación
                beforeSummarySlide.children[0].click();

                //Oculta el menú de navegación
                /*$('.h5p-footer-button').css({'visibility':'hidden'});
                $('.h5p-progressbar').css({'visibility':'hidden'});*/
                $('.h5p-cp-navigation').css('display','none');

                //Muestra botón Terminar
                $(finishBtnContainer).css('display','block');

                answeredCount = 0;
            }, 1500);
        }
    });

    //Simula click a botón de slide de retroalimentación
    $(finishBtn).click(()=>{
        setTimeout(() => {
            summarySlide[0].children[0].click();

            //Oculta botón Terminar
            $(finishBtnContainer).css('display','none');

            //Si se hace clic en botón de "Intentar de nuevo" vuelve a mostrar el menú de navegación
            $('.h5p-cp-retry-button').on('click', ()=>{
                /*$('.h5p-footer-button').css({'visibility':'visible'});
                $('.h5p-progressbar').css({'visibility':'visible'});*/
                $('.h5p-cp-navigation').css('display','flex');
            });
        }, 500);
    });

    //****Fill the blank customize****

    //Funcionalidad que reemplaza los inputs text de la actividad "Fill in the blank"
    //por selects, de forma que al momento de seleccionar una opción de cada select
    //este setee el valor seleccionado al input text que está oculto.

    //Se capturan los inputs text y se crea un arreglo vacío donde estaran los select creados
    const inputsWrapper = d.querySelectorAll('.h5p-input-wrapper'),
          selects = [];

    //Se crea un arreglo con las opciones que tendrá cada uno de los selects          
    const options = [
        ['Compilación','Interpretación'],
        ['todo el programa antes de correrlo','línea por línea al ejecutar'],
        ['rápida en ejecución final','lenta, pero flexible'],
        ['antes de correr el programa','a medida que se ejecuta'],
        ['Java o C++','Python o JavaScript'],
        ['Compilación','Interpretación'],
        ['todo el programa antes de correrlo','línea por línea al ejecutar'],
        ['rápida en ejecución final','lenta, pero flexible'],
        ['antes de correr el programa','a medida que se ejecuta'],
        ['Java o C++','Python o JavaScript']
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

        // Abrir/cerrar el menú
        display[i].addEventListener('click', () => {
            optionsList[i].classList.toggle('hidden');
        });

        // Seleccionar una opción
        optionsList[i].addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                const selectedText = e.target.textContent;

                text[i].textContent = selectedText;
                inputsWrapper[i].children[0].value = selectedText;
                optionsList[i].classList.add('hidden'); // Cerrar el menú

                // Actualizar la clase 'selected'
                optionsList[i].querySelectorAll('li').forEach(li => li.classList.remove('selected'));
                e.target.classList.add('selected');
            }
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if(!inputsWrapper[i].contains(e.target)) {
                optionsList[i].classList.add('hidden');
            }
        });

        $('iframe').contents().on('click', (e) => {
            console.log('click');
            if (!inputsWrapper[i].contains(e.target)) {
                optionsList[i].classList.add('hidden');
            }
        });

        //Activa o desactiva el pointer-event (bloquea o activa) del nuevo select al checkear o resetear el ejercicio
        //Además resetea los nuevos selects
        /*$('.h5p-question-buttons').on('click', (e)=>{
            if([...e.target.classList].includes('h5p-question-check-answer')){ //Si se clickea "Comprobar"
                //En este caso se utiliza la función "contains" ya que parentNode.classlist devuelve un DOMTokenList, no un arreglo
                if(display[i].parentNode.classList.contains('h5p-wrong') || display[i].parentNode.classList.contains('h5p-correct')) $(display[i]).css({'pointer-events':'none'});
            }else if([...e.target.classList].includes('h5p-question-try-again')){ //Si se clickea "Intentar de nuevo"
                text[i].textContent = '';
                if($(optionsList[i]).find('.selected').length > 0) $(optionsList[i]).find('.selected')[0].classList.remove('selected');                        
                $(display[i]).css({'pointer-events':'auto'});
                $('.option-selected').removeClass('option-selected');
            }
        });*/

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