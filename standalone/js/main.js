let d = document;

jQuery(document).ready(()=>{
    //console.log(window);
    const element = document.getElementById('h5p-container'),
          id = new URLSearchParams(window.location.search).get('id');

    const options = {
        h5pJsonPath:  '',
        frameCss: 'assets/styles/h5p.css',
        frameJs: 'assets/frame.bundle.js',
        copyright: false,
        export: false,
        icon: false,
        customCss: [ 'css/demo.css' ],
        customJs: [ 'js/resources/demo.js' ],
    }

    if(id == 'm1l1e1'){
        options.h5pJsonPath = 'resources/l1/m1_l1_e1';
    }else if(id == 'm1l1e2'){
        options.h5pJsonPath = 'resources/l1/m1_l1_e2';
    }else if(id == 'm1l1e3'){
        options.h5pJsonPath = 'resources/l1/m1_l1_e3';
    }else if(id == 'm1l1e4'){
        options.h5pJsonPath = 'resources/l1/m1_l1_e4';
    }else if(id == 'm1l1e5'){
        options.h5pJsonPath = 'resources/l1/m1_l1_e5';
    }else if(id == 'm1l1r1'){
        options.h5pJsonPath = 'resources/l1/m1_l1_r1';
    }else if(id == 'm1l1r2'){
        options.h5pJsonPath = 'resources/l1/m1_l1_r2';
    }else if(id == 'm1l1r3'){
        options.h5pJsonPath = 'resources/l1/m1_l1_r3';
    }else if(id == 'm1l1r4'){
        options.h5pJsonPath = 'resources/l1/m1_l1_r4';
    }else if(id == 'm1l1r5'){
        options.h5pJsonPath = 'resources/l1/m1_l1_r5';
    }else if(id == 'm1l2e1'){
        options.h5pJsonPath = 'resources/l2/m1_l2_e1';
    }else if(id == 'm1l2e2'){
        options.h5pJsonPath = 'resources/l2/m1_l2_e2';
    }else if(id == 'm1l2e3'){
        options.h5pJsonPath = 'resources/l2/m1_l2_e3';
    }else if(id == 'm1l2e4'){
        options.h5pJsonPath = 'resources/l2/m1_l2_e4';
    }else if(id == 'm1l2r1'){
        options.h5pJsonPath = 'resources/l2/m1_l2_r1';
    }else if(id == 'm1l2r2'){
        options.h5pJsonPath = 'resources/l2/m1_l2_r2';
    }else if(id == 'm1l3e1'){
        options.h5pJsonPath = 'resources/l3/m1_l3_e1';
    }else if(id == 'm1l3e2'){
        options.h5pJsonPath = 'resources/l3/m1_l3_e2';
    }else if(id == 'm1l3r1'){
        options.h5pJsonPath = 'resources/l3/m1_l3_r1';
    }else if(id == 'm1l3r2'){
        options.h5pJsonPath = 'resources/l3/m1_l3_r2';
    }else if(id == 'm1l3r3'){
        options.h5pJsonPath = 'resources/l3/m1_l3_r3';
    }else if(id == 'ordenar'){
        options.h5pJsonPath = 'resources/ordenar';
    }else if(id == 'pasapalabra'){
        options.h5pJsonPath = 'resources/pasapalabra';
    }else if(id == 'prueba'){
        options.h5pJsonPath = 'resources/m1-l1-e3-4';
    }else if(id == 'coursepresentation'){
        options.h5pJsonPath = 'resources/m1_leccion1_7';
    }

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
        console.log('h5pFunction');

        ///////////////////////////////////////////////

        /*let draggableContainer = d.createElement('div');
        draggableContainer.classList.add('draggable-container');

        let draggables = $('iframe').contents().find('.h5p-draggable').length;

        $('iframe').contents().find('.h5p-draggable').each((ind,el)=>{
            (draggables) 
            draggableContainer.appendChild(el);
        });

        //$('iframe').contents().find('.h5p-question-content').append(draggableContainer);
        $('iframe').contents().find('.h5p-inner').each((ind,el)=>{
            if(ind === 0) el.append(draggableContainer);
        });*/

        /////////////////////////INSTRUCCIONES PARA H5P/////////////////////////////

        //$('iframe').contents().find('.h5p-question-introduction').remove();
        $('iframe').contents().find('.h5p-content').prepend(`<div class="custom-instructions">
                                                                    <div class="tab-container">
                                                                        <div id="tab" class="tab">
                                                                            <div class="tab-content">
                                                                                <div class="instructions-text">${(options.h5pJsonPath=='resources/ordenar')
                                                                                                                    ? 'Ordene la secuencia de acuerdo a los pasos de inicio de una computadora.'
                                                                                                                    : (options.h5pJsonPath=='resources/M1_L1_E1(respaldo)')
                                                                                                                        ? 'Clasifica el tipo de dispositivo electrónico digital arrastrando los elementos al lugar que corresponda.'
                                                                                                                        : (options.h5pJsonPath=='resources/m1-l1-e3-4')
                                                                                                                            ? 'Instrucciones'
                                                                                                                            : ''
                                                                                }</div>
                                                                                <span class="loader"></span>
                                                                            </div>
                                                                            <a class="instructions-btn" href="">Instrucciones</a>
                                                                        </div>
                                                                    </div>
                                                                </div>`);

        $('iframe').contents().find('.h5p-container').css({'margin-top':`-${$('iframe').contents().find('.tab-content').outerHeight()}px`});

        $('iframe').contents().find('.instructions-btn').on('click',(e)=>{
            e.preventDefault();

            if(parseInt($('iframe').contents().find('.custom-instructions').css('margin-top').split("px")[0]) == 0){
                //$('iframe').contents().find('.custom-instructions').css({'margin-top':`-${$('iframe').contents().find('.tab-content').outerHeight()}px`, 'animation-name':'instructions-hidden','animation-duration': '1s'});
                $('iframe').contents().find('.custom-instructions').animate({
                    marginTop:`-${$('iframe').contents().find('.tab-content').outerHeight()}px`,
                }, 1000);

                //$('iframe').contents().find('.h5p-question-content').css({'margin-top':'0'});
                $('iframe').contents().find('.h5p-container').animate({
                    marginTop:'0',
                }, 1000);
            }else if(parseInt($('iframe').contents().find('.custom-instructions').css('margin-top').split("px")[0]) < 0){
                //$('iframe').contents().find('.custom-instructions').css({'margin-top':'0', 'animation-name':'instructions-display','animation-duration':'1s'});
                $('iframe').contents().find('.custom-instructions').animate({
                    marginTop:'0',
                }, 1000);

                //$('iframe').contents().find('.h5p-question-content').css({'margin-top':`-${$('iframe').contents().find('.tab-content').outerHeight()}px`});
                $('iframe').contents().find('.h5p-container').animate({
                    marginTop:`-${$('iframe').contents().find('.tab-content').outerHeight()}px`,
                }, 1000);
            }
        });

        setTimeout(() => {
            $('iframe').contents().find('.custom-instructions').animate({
                marginTop:`-${$('iframe').contents().find('.tab-content').outerHeight()}px`,
            }, 1000);

            //$('iframe').contents().find('.h5p-question-content').css({'margin-top':'0'});
            $('iframe').contents().find('.h5p-container').animate({
                marginTop:'0',
            }, 1000);
            $('iframe').contents().find('.loader').css({'display':'none'});
        }, 5000);

    }

    const selectFunction = function(){
        /*$('iframe').contents().find('option').on('click', (e)=>{
            console.log(e.target);
            e.target.classList.add('select-changed');
            e.target.style.background = '#fff';
            e.target.style.color = 'red';
        });

        $('iframe').contents().find('select').on('change', (e)=>{
            console.log(e.target);
            e.target.classList.add('select-changed');
            e.target.style.background = 'linear-gradient(180deg, #5166ad 0%, #062971 90%)';
            e.target.style.color = '#fff';
        });*/

        if($('iframe').contents().find('select')){
            /*const h5pInputWrapper = $('iframe').contents().find('.h5p-input-wrapper'),
                  selects = $('iframe').contents().find('select');

            h5pInputWrapper.each((i,el)=>{
                const div = d.createElement('div'),
                      span1 = d.createElement('span'),
                      span2 = d.createElement('span'),
                      ul = d.createElement('ul');
                div.classList.add('custom-select-display');
                span1.classList.add('selected-value');
                span2.classList.add('dropdown-arrow');
                span2.innerText = '▼';
                ul.classList.add('custom-select-options');

                el.appendChild(div);
                el.appendChild(ul);
                div.appendChild(span1);
                div.appendChild(span2);
            });

            const uls = $('iframe').contents().find('.custom-select-options');

            selects.each((x,sel)=>{
                sel.classList.add('hidden-select');

                $(sel.children).each((i,opt)=>{
                    const li = d.createElement('li');
                    li.dataset.value = `option${i+1}`;
                    li.innerText = opt.value;

                    uls[x].appendChild(li);
                });
            });*/

            const h5pInputWrapper = $('iframe').contents().find('.h5p-input-wrapper'), //contenedor del select original
                  selects = $('iframe').contents().find('select'); //array con los selects

            //Se crean los elementos del nuevo select y se insertan en el contenedor del select original                  
            h5pInputWrapper.each((i,el)=>{
                const div = d.createElement('div'),
                      ul = d.createElement('ul');
                div.classList.add('custom-select-display');
                ul.classList.add('custom-options','hidden');

                el.appendChild(div);
                el.appendChild(ul);
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

            // JavaScript para la lógica (ejemplo simplificado)
            //const wrapper = document.querySelector('.custom-select-wrapper');
            //const display = wrapper.querySelector('.custom-select-display');
            //const optionsList = wrapper.querySelector('.custom-options');
            //const originalSelect = wrapper.querySelector('.original-select');

            const display = $('iframe').contents().find('.custom-select-display')[0];
            const optionsList = $('iframe').contents().find('.custom-options')[0];
            //const originalSelect = $('iframe').contents().find('.original-select');

            //console.log(h5pInputWrapper);
            //console.log(selects);
            //console.log(display);
            //console.log(optionsList);


            // Rellenar las opciones personalizadas desde el select original
            /*Array.from(select.options).forEach(option => {
                const li = document.createElement('li');
                li.textContent = option.textContent;
                li.dataset.value = option.value;
                optionsList.appendChild(li);
            });*/

            // Abrir/cerrar el menú
            display.addEventListener('click', () => {
                console.log('click');
                optionsList.classList.toggle('hidden');
            });

            // Seleccionar una opción
            optionsList.addEventListener('click', (e) => {
                if (e.target.tagName === 'LI') {
                    const selectedValue = e.target.dataset.value;
                    const selectedText = e.target.textContent;

                    display.textContent = selectedText; // Actualizar el display
                    selects[0].value = selectedValue; // Actualizar el select original
                    optionsList.classList.add('hidden'); // Cerrar el menú

                    // Crea un nuevo evento 'change'
                    const event = new Event('change', {
                        bubbles: true,   // El evento "burbujeará" por el DOM
                        cancelable: true // El evento se puede cancelar
                    });

                    // Dispara el evento 'change' en el elemento select
                    selects[0].dispatchEvent(event);

                    // Actualizar la clase 'selected'
                    optionsList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
                    e.target.classList.add('selected');
                }
                console.log(selects[0]);
            });

            // Cerrar al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!h5pInputWrapper[0].contains(e.target)) {
                    optionsList.classList.add('hidden');
                }
            });

            // Inicializar con el valor por defecto
            if (selects[0].value) {
                display.textContent = selects[0].options[selects[0].selectedIndex].textContent;
                optionsList.querySelector(`li[data-value="${selects[0].value}"]`)?.classList.add('selected');
            }

        }
    }

    /*Función que permite posicionar los botones prev y next en el mismo div que el progressbar*/
    const quizFunction = function(){
        if($('iframe').contents().find('.h5p-question-next')){
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
                    }, 400);
                })
            });

            actionBtn();
        }
    }

    /*new H5PStandalone.H5P( element, options ).then(
        function(){
            //H5P.externalDispatcher.on('domChanged', h5pFunction);
            setTimeout(() => {
                h5pFunction();
            }, 150);
        }
    );*/

    function a(opt){
        new H5PStandalone.H5P( element, opt ).then(
            function(){
                setTimeout(() => {
                    //h5pFunction();
                    selectFunction();
                    //quizFunction();
                }, 400);
            }
        );
    }

    a(options);
});