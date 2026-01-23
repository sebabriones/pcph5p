jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Un hospital revisa eventos ocurridos en el último año para optimizar la asignación de personal y equipos. El objetivo es identificar qué información ayuda a construir una regla general sobre cuándo se requiere refuerzo de personal médico.<br><br><strong>Slide 1:</strong> Clasifica cada situación según si aporta información relevante para definir cuándo reforzar personal o si no contribuye a generalizar. Arrastra cada situación hacia el recuadro correspondiente.<br><strong>Slide 2 y 3:</strong> Selecciona la alternativa correcta.</div>
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
                                                <div class="instructions-text">Una ciudad analiza distintos incidentes urbanos ocurridos en el último año para mejorar su sistema de respuesta ante emergencias. El equipo busca extraer una regla general que permita anticipar situaciones de riesgo, pero también quiere evitar conclusiones apresuradas.<br><br><strong>Actividad 1:</strong> Arrastra cada situación hacia la zona correspondiente, según si aporta directamente a construir una regla general sobre riesgo urbano o si no aporta información relevante para generalizar.<br><strong>Actividad 2:</strong> Selecciona la opción correcta.<br><strong>Actividad 3:</strong> Selecciona la o las opciones correctas.</div>
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