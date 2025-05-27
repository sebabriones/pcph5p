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
                }, 150);
            }
        );
    }

    a(options);
});