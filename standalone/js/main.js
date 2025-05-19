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
        options.h5pJsonPath = 'resources/M1_L1_E1';
        //options.h5pJsonPath = 'resources/M1_L1_E1(respaldo)';
    }if(id == 'm1l1e2'){
        options.h5pJsonPath = 'resources/M1_L1_E2';
    }else if(id == 'ordenar'){
        options.h5pJsonPath = 'resources/ordenar';
    }else if(id == 'pasapalabra'){
        options.h5pJsonPath = 'resources/pasapalabra';
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
            /*function(){
                setTimeout(() => {
                    h5pFunction();
                }, 150);
            }*/
        );
    }

    a(options);
});