jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Un estudiante universitario está comenzando a trabajar en un proyecto académico final. Durante varias semanas ha ido registrando ideas, recordatorios y datos en distintos soportes (cuaderno, celular, correos), sin un orden claro. Antes de avanzar, necesita organizar esta información para poder planificar su trabajo de manera efectiva y evitar errores u omisiones importantes.<br>Ayuda al estudiante a organizar la información en categorías que le permitan planificar adecuadamente su trabajo.<br><br>Esta actividad se realiza en dos pasos:<br><br><strong>Slide 1:</strong> Observa los elementos disponibles e identifica qué tipos de información aparecen.Luego, arrastra hacia el recuadro vacío el nombre de las 3 categorías que mejor representan cada tipo de información que clasifica el estudiante.<br><strong>Slide 2:</strong> Clasifica cada actividad de acuerdo a la categoría más pertinente. Arrastra cada elemento hacia la columna correspondiente dentro de la tabla.<br><br><strong>Nota:</strong> No podrá avanzar a la siguiente slide si no completa la primera actividad.</div>
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
                                                <div class="instructions-text">Un estudiante universitario está comenzando a trabajar en un proyecto académico final. Durante varias semanas ha ido registrando ideas, recordatorios y datos en distintos soportes (cuaderno, celular, correos), sin un orden claro. Antes de avanzar, necesita organizar esta información para poder planificar su trabajo de manera efectiva y evitar errores u omisiones importantes.<br>Ayuda al estudiante a organizar la información en categorías que le permitan planificar adecuadamente su trabajo.<br><br>Esta actividad se realiza en dos pasos:<br><br><strong>Slide 1:</strong> Observa los elementos disponibles e identifica qué tipos de información aparecen.Luego, arrastra hacia el recuadro vacío el nombre de las 3 categorías que mejor representan cada tipo de información que clasifica el estudiante.<br><strong>Slide 2:</strong> Clasifica cada actividad de acuerdo a la categoría más pertinente. Arrastra cada elemento hacia la columna correspondiente dentro de la tabla.<br><br><strong>Nota:</strong> No podrá avanzar a la siguiente slide si no completa la primera actividad.</div>
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