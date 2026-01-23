jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Julia está organizando las actividades que necesita para abrir una cafetería. Ha anotado varias tareas en una hoja, pero están desordenadas. Tu misión es ayudarle a organizar la información en categorías adecuadas.<br><br><strong>Slide 1:</strong> Arrastra hacia el recuadro vacío las 4 categorías que mejor permiten a Julia organizar lo que necesita para abrir una cafetería.<br><strong>Slide 2:</strong> Une con una línea cada categoría con la tarea que le corresponde.<br><br><strong>Nota:</strong> No podrá avanzar a la siguiente slide si no completa la primera actividad.</div>
                                <a class="intro-btn">Comenzar</a>
                            </div>
                        </div>`);

    $('.intro-btn').on('click',(e)=>{
        $('.intro').animate({
                marginTop:`-${$('.h5p-container').outerHeight()}px`,
        }, 1000);

        setTimeout(() => {
            $('.intro').css({'display':'none'});
        }, 1000);
    });

    /////////////////////////PESTAÑA CON INSTRUCCIONES PARA H5P/////////////////////////////

    $('.h5p-content').prepend(`<div class="custom-instructions">
                                    <div class="tab-container">
                                        <div id="tab" class="tab">
                                            <div class="tab-content">
                                                <div class="instructions-text">Julia está organizando las actividades que necesita para abrir una cafetería. Ha anotado varias tareas en una hoja, pero están desordenadas. Tu misión es ayudarle a organizar la información en categorías adecuadas.<br><br><strong>Slide 1:</strong> Arrastra hacia el recuadro vacío las 4 categorías que mejor permiten a Julia organizar lo que necesita para abrir una cafetería.<br><strong>Slide 2:</strong> Une con una línea cada categoría con la tarea que le corresponde.<br><br><strong>Nota:</strong> No podrá avanzar a la siguiente slide si no completa la primera actividad.</div>
                                            </div>
                                            <a class="instructions-btn" href="">Instrucciones</a>
                                        </div>
                                    </div>
                                </div>`);

    $('.instructions-btn').on('click',(e)=>{
        e.preventDefault();

        if(parseInt($('.custom-instructions').css('margin-top').split("px")[0]) == 0){
            $('.custom-instructions').animate({
                marginTop:`-${$('.tab-content').outerHeight()}px`,
            }, 1000);
        }else if(parseInt($('.custom-instructions').css('margin-top').split("px")[0]) < 0){
            $('.custom-instructions').animate({
                marginTop:'0',
            }, 1000);
        }
    });

    setTimeout(() => {
        $('.custom-instructions').animate({
            marginTop:`-${$('.tab-content').outerHeight()}px`,
        }, 1000);
    }, 500);
});