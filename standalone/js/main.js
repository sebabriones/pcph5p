let d = document,
    instructions = {};

/*(async()=>{
    try{
        let response = await fetch('./js/resources/instructions.json');
        instructions = await response.json();
    }catch(error){
        console.log(error);
    }
})();*/

jQuery(document).ready(()=>{
    //console.log(window);
    const element = document.getElementById('h5p-container'),
          id = new URLSearchParams(window.location.search).get('id'),
          path = new URLSearchParams(window.location.search).get('path');

    const options = {
        h5pJsonPath:  path,
        frameCss: 'assets/styles/h5p.css',
        frameJs: 'assets/frame.bundle.js',
        copyright: false,
        export: false,
        icon: false,
        customCss: [ 'css/demo.css' ],
        customJs: [ 'js/resources/demo.js' ],
    }

    /*const instructions = {
        'm1l1e1': 'Clasifica el tipo de dispositivo electrónico digital arrastrando las imágenes al lugar que corresponda.',
        'm1l1e2': 'Arrastra los componentes que son necesarios para formar un sistema computacional.'
    }*/

    /*const options = {
        //h5pJsonPath:  'resources/dyd',
        h5pJsonPath:  'resources/M1_L1_E1(respaldo)',
        //h5pJsonPath:  'resources/pasapalabra',
        //h5pJsonPath:  'resources/ordenar',
        //h5pJsonPath:  'resources/m1-l1-e3-4',
        //h5pJsonPath:  'resources/shuffle',
        frameCss: 'assets/styles/h5p.css',
        frameJs: 'assets/frame.bundle.js',
        copyright: false,
        export: false,
        icon: false,
        customCss: [ 'css/demo.css' ],
        customJs: [ 'js/resources/demo.js' ],
    }*/

    const h5pFunction = function(event){
        //console.log('h5pFunction');

        /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
        $('iframe').contents().find('body').prepend(`<div class="intro">
                                                        <div class="text-content">
                                                            <div class="intro-text">${instructions[id]}</div>
                                                            <a class="intro-btn">Comenzar</a>
                                                        </div>
                                                    </div>`);

        $('iframe').contents().find('.intro-btn').on('click',(e)=>{
            $('iframe').contents().find('.intro').animate({
                    marginLeft:`-${$('iframe').contents().find('.h5p-container').outerWidth()}px`,
            }, 1000);

            setTimeout(() => {
                $('iframe').contents().find('.intro').css({'display':'none'});
            }, 1000);
        });

        /////////////////////////INSTRUCCIONES PARA H5P/////////////////////////////

        //$('iframe').contents().find('.h5p-question-introduction').remove();
        $('iframe').contents().find('.h5p-content').prepend(`<div class="custom-instructions">
                                                                    <div class="tab-container">
                                                                        <div id="tab" class="tab">
                                                                            <div class="tab-content">
                                                                                <div class="instructions-text">${instructions[id]}</div>
                                                                            </div>
                                                                            <a class="instructions-btn" href="">Instrucciones</a>
                                                                        </div>
                                                                    </div>
                                                                </div>`);

        //$('iframe').contents().find('.h5p-container').css({'margin-top':`-${$('iframe').contents().find('.tab-content').outerHeight()}px`});

        $('iframe').contents().find('.instructions-btn').on('click',(e)=>{
            e.preventDefault();

            if(parseInt($('iframe').contents().find('.custom-instructions').css('margin-top').split("px")[0]) == 0){
                //$('iframe').contents().find('.custom-instructions').css({'margin-top':`-${$('iframe').contents().find('.tab-content').outerHeight()}px`, 'animation-name':'instructions-hidden','animation-duration': '1s'});
                $('iframe').contents().find('.custom-instructions').animate({
                    marginTop:`-${$('iframe').contents().find('.tab-content').outerHeight()}px`,
                }, 1000);

                //$('iframe').contents().find('.h5p-question-content').css({'margin-top':'0'});
                /*$('iframe').contents().find('.h5p-container').animate({
                    marginTop:'0',
                }, 1000);*/
            }else if(parseInt($('iframe').contents().find('.custom-instructions').css('margin-top').split("px")[0]) < 0){
                //$('iframe').contents().find('.custom-instructions').css({'margin-top':'0', 'animation-name':'instructions-display','animation-duration':'1s'});
                $('iframe').contents().find('.custom-instructions').animate({
                    marginTop:'0',
                }, 1000);

                //$('iframe').contents().find('.h5p-question-content').css({'margin-top':`-${$('iframe').contents().find('.tab-content').outerHeight()}px`});
                /*$('iframe').contents().find('.h5p-container').animate({
                    marginTop:`-${$('iframe').contents().find('.tab-content').outerHeight()}px`,
                }, 1000);*/
            }
        });

        setTimeout(() => {
            $('iframe').contents().find('.custom-instructions').animate({
                marginTop:`-${$('iframe').contents().find('.tab-content').outerHeight()}px`,
            }, 1000);

            //$('iframe').contents().find('.h5p-question-content').css({'margin-top':'0'});
            /*$('iframe').contents().find('.h5p-container').animate({
                marginTop:'0',
            }, 1000);*/
        }, 500);
    }

    //Función que oculta y crea nuevos selects (personalizables) en los ejercicios advanced blank
    const selectFunction = function(){
        if($('iframe').contents().find('.h5p-advanced-blanks') && id == 'm1l2r1'){
            const h5pInputWrapper = $('iframe').contents().find('.h5p-input-wrapper'), //contenedor del select original
                  selects = $('iframe').contents().find('select'); //array con los selects

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
            const uls = $('iframe').contents().find('.custom-options');

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

            const display = $('iframe').contents().find('.custom-select-display'); //Nuevo select
            const text = $('iframe').contents().find('.custom-select-text'); //Texto dentro del nuevo select
            const optionsList = $('iframe').contents().find('.custom-options'); //Nuevas options

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
                    console.log(selects[i]);
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
                $('iframe').contents().find('.h5p-question-buttons').on('click', (e)=>{
                    if([...e.target.classList].includes('h5p-question-check-answer')){ //Si se clickea "Comprobar"
                        $(display[i]).css({'pointer-events':'none'});
                    }else if([...e.target.classList].includes('h5p-question-try-again')){ //Si se clickea "Intentar de nuevo"
                        text[i].textContent = selects[i].options[selects[i].selectedIndex].textContent;
                        if($(optionsList[i]).find('.selected').length > 0) $(optionsList[i]).find('.selected')[0].classList.remove('selected');                        
                        $(display[i]).css({'pointer-events':'auto'});
                        $('iframe').contents().find('.option-selected').removeClass('option-selected');
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
        }
    }

    /*Función que permite posicionar los botones prev y next en el mismo div que el progressbar dentro de un cuestionario(quiz)*/
    const quizFunction = function(){
        //if($('iframe').contents().find('.h5p-question-next')){
        if(id==='m1l1r2' || id==='m1l4e1' || id==='m1l5r1'){
            const qContainer = $('iframe').contents().find('.question-container'),
                  qsProgress = $('iframe').contents().find('.qs-progress')[0],
                  qCheck = $('iframe').contents().find('.h5p-question-check-answer');

            if(qContainer.length >= 3){
                const btnPrev = qContainer[1].children[1].children[2],
                      btnNext = qContainer[1].children[1].children[1];

                qsProgress.children[0].parentNode.insertBefore(btnPrev, qsProgress.children[0]);
                qsProgress.appendChild(btnNext);
            }

            $('iframe').contents().find('.h5p-question-buttons').find('a').css({'display':'none'});

            function actionBtn(){
                const btnPrev = $('iframe').contents().find('.question-container[style=""]').find('.h5p-question-prev')[0] || null,
                      btnNext = $('iframe').contents().find('.question-container[style=""]').find('.h5p-question-next')[0] || null;

                if(btnPrev === null && btnNext !== null){
                    $('iframe').contents().find('.qs-progress .h5p-question-prev')[0].style.pointerEvents = 'none';
                    $('iframe').contents().find('.qs-progress .h5p-question-next')[0].style.pointerEvents = 'auto';
                }else if(btnPrev !== null && btnNext === null){
                    $('iframe').contents().find('.qs-progress .h5p-question-prev')[0].style.pointerEvents = 'auto';
                    $('iframe').contents().find('.qs-progress .h5p-question-next')[0].style.pointerEvents = 'none';
                }else if((btnPrev !== null && btnNext !== null)||(btnPrev === null && btnNext === null)){
                    $('iframe').contents().find('.qs-progress .h5p-question-prev')[0].style.pointerEvents = 'auto';
                    $('iframe').contents().find('.qs-progress .h5p-question-next')[0].style.pointerEvents = 'auto';
                }
            }

            qsProgress.addEventListener('click', actionBtn);

            qCheck.each((i,el)=>{
                el.addEventListener('click', ()=>{
                    setTimeout(() => {
                        const qFinish = $('iframe').contents().find('.h5p-question-finish')[0] || null;
                        if(qFinish !== null){
                            qFinish.addEventListener('click', ()=>{
                                $('iframe').contents().find('.questionset-results').find('.qs-retrybutton')[0].addEventListener('click', actionBtn);
                            })
                        }
                    }, 200);
                })
            });

            actionBtn();
        }
    }

    //Función que centra los elementos draggeables y que quita el background azul cuando vuelva a su lugar original
    const draggableFunction = function(){
        if(id == 'm1l1r1' || id == 'm1l3r1'){
            console.log('dragableFunction');
        }
    }

    //Función que posiciona las flechas del footer de navegación a los costados de la navegación (puntos)
    //y cuando se hayan respondido todas las slides envía de forma automática al slide de resumen
    const coursePreFunction = function(){
        if(id=='m1l4r2' || id=='m1l4r3' || id=='m1l4r4'){ //se deben revisar estas condicionales*
        //if($('iframe').contents().find('.h5p-course-presentation')){ //se deben revisar estas condicionales*
            $('iframe').contents().find('.h5p-footer').css({'display':'none'});
            $('iframe').contents().find('.h5p-tooltip').css({'display':'none'});

            const h5pNavigation = $('iframe').contents().find('.h5p-cp-navigation')[0],
                  btnPrev = $('iframe').contents().find('.h5p-footer-previous-slide')[0],
                  btnNext = $('iframe').contents().find('.h5p-footer-next-slide')[0],
                  taskAnswered = $('iframe').contents().find('.h5p-progressbar-part-has-task'),
                  slides = $('iframe').contents().find('.h5p-slides-wrapper')[0].children,
                  summarySlide = $('iframe').contents().find('.progressbar-part-summary-slide');

            summarySlide.css({'display':'none'});

            h5pNavigation.children[0].parentNode.insertBefore(btnPrev, h5pNavigation.children[0]);
            h5pNavigation.appendChild(btnNext);

            //Si la diapo que se esta observando es la ultima antes del summary, bloquea el boton de avanzar
            const observerSlides = new MutationObserver((mutationList, observerInstance)=>{
                if($('iframe').contents().find('.h5p-current')[0].id == slides[slides.length-2].id){
                    $('iframe').contents().find('.h5p-footer-next-slide').css({'pointer-events':'none'});
                }else{
                    $('iframe').contents().find('.h5p-footer-next-slide').css({'pointer-events':'auto'});
                }
            })

            $(slides).each((i,el)=>{
                observerSlides.observe(el, {
                    attributes: true,
                    attributeFilter: ['class'],
                    attributeOldValue: true
                })
            });
            
            //Si se responden todas las diapos aparece el boton de "terminar"
            //para ir al slide de resumen
            const observerAnswered = new MutationObserver((mutationList, observerInstance)=>{
                if($('iframe').contents().find('.h5p-answered').length == taskAnswered.length){
                    summarySlide[0].children[0].click();
                }
            })

            $(taskAnswered).each((i,el)=>{
                observerAnswered.observe(el, {
                    attributes: true,
                    attributeFilter: ['class'],
                    attributeOldValue: true
                })
            });
        }
    }

    const pruebaFunction = function(){
        console.log('pruebaFunction');
        $('iframe').contents().find('.h5p-sc-alternative').each((el,i)=>{
            console.log(el);
        })
    }

    /*new H5PStandalone.H5P( element, options ).then(
        function(){
            //H5P.externalDispatcher.on('domChanged', h5pFunction);
            setTimeout(() => {
                h5pFunction();
            }, 150);
        }
    );*/

    new H5PStandalone.H5P( element, options ).then(
        function(){
            setTimeout(() => {
                //h5pFunction();
                //selectFunction();
                //quizFunction(); //Esta funcion arroja un error de que no encuentra un elemento, si ocurre el resto de funciones no se llaman, se debe corregir*
                //draggableFunction();
                //coursePreFunction();
                //pruebaFunction();
            }, 300);
        }
    );
});