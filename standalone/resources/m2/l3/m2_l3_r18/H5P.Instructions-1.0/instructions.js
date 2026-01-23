jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Un entrenador universitario se prepara para diseñar el plan de trabajo mensual del equipo de fútbol, pero durante el último tiempo, debido a varios imprevistos, ha ido anotando toda la información importante de manera desorganizada en cualquier parte (libreta, notas adhesivas, pizarra). Antes de definir la estrategia, él necesita reunir y clasificar esta información para evitar confusiones y asegurar una preparación eficiente.<br>Ayuda al entrenador a organizar la información en categorías que le permitan planificar eficientemente el mes de trabajo del equipo.<br><br>Esta actividad se realiza en dos pasos:<br><br><strong>Slide 1:</strong> Analiza atentamente el caso e identifica los elementos que se vinculan directamente con su trabajo.<br>Luego, arrastra hacia el recuadro vacío el nombre de las 3 categorías que mejor representan los grupos de datos que el entrenador debe organizar.<br><strong>Slide 2:</strong> Clasifica cada actividad de acuerdo a la categoría más pertinente. Arrastra cada elemento hacia la columna correspondiente dentro de la tabla.<br><br><strong>Nota:</strong> No podrá avanzar a la siguiente slide si no completa la primera actividad.</div>
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
                                                <div class="instructions-text">Un entrenador universitario se prepara para diseñar el plan de trabajo mensual del equipo de fútbol, pero durante el último tiempo, debido a varios imprevistos, ha ido anotando toda la información importante de manera desorganizada en cualquier parte (libreta, notas adhesivas, pizarra). Antes de definir la estrategia, él necesita reunir y clasificar esta información para evitar confusiones y asegurar una preparación eficiente.<br>Ayuda al entrenador a organizar la información en categorías que le permitan planificar eficientemente el mes de trabajo del equipo.<br><br>Esta actividad se realiza en dos pasos:<br><br><strong>Slide 1:</strong> Analiza atentamente el caso e identifica los elementos que se vinculan directamente con su trabajo.<br>Luego, arrastra hacia el recuadro vacío el nombre de las 3 categorías que mejor representan los grupos de datos que el entrenador debe organizar.<br><strong>Slide 2:</strong> Clasifica cada actividad de acuerdo a la categoría más pertinente. Arrastra cada elemento hacia la columna correspondiente dentro de la tabla.<br><br><strong>Nota:</strong> No podrá avanzar a la siguiente slide si no completa la primera actividad.</div>
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