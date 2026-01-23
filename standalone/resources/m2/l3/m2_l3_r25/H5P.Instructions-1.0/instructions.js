jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">La empresa analiza el comportamiento de sus usuarios/as para entender cuándo se incrementa la cancelación de suscripciones. Tras revisar datos históricos, formula la siguiente regla general:<br><br>“Cuando se reduce la cantidad de contenido nuevo disponible, aumenta la tasa de cancelación de suscripciones.”<br><br>Ahora se quiere evaluar si esta regla se aplica correctamente a distintos escenarios.<br><br>Arrastra cada situación al recuadro que corresponda, según si cumple o no con la regla general planteada. Analiza cada caso considerando la relación entre cantidad de contenido nuevo y cancelaciones, no detalles superficiales.</div>
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
                                                <div class="instructions-text">La empresa analiza el comportamiento de sus usuarios/as para entender cuándo se incrementa la cancelación de suscripciones. Tras revisar datos históricos, formula la siguiente regla general:<br><br>“Cuando se reduce la cantidad de contenido nuevo disponible, aumenta la tasa de cancelación de suscripciones.”<br><br>Ahora se quiere evaluar si esta regla se aplica correctamente a distintos escenarios.<br><br>Arrastra cada situación al recuadro que corresponda, según si cumple o no con la regla general planteada. Analiza cada caso considerando la relación entre cantidad de contenido nuevo y cancelaciones, no detalles superficiales.</div>
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