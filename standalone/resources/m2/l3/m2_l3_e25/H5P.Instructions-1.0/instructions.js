jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Una empresa de delivery analiza reclamos de clientes para mejorar su servicio.Tras revisar múltiples situaciones, el equipo formula la siguiente regla general:<br><br>“Cuando los pedidos se concentran en periodos de alta demanda, aumenta la probabilidad de retrasos en la entrega.”<br><br>Ahora se quiere evaluar si esta regla se aplica correctamente a distintos escenarios.<br>Arrastra cada situación al recuadro que corresponda, según si cumple o no con la regla general planteada. Analiza cada caso considerando la relación entre demanda y desempeño del servicio, no detalles superficiales.</div>
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
                                                <div class="instructions-text">Una empresa de delivery analiza reclamos de clientes para mejorar su servicio.Tras revisar múltiples situaciones, el equipo formula la siguiente regla general:<br><br>“Cuando los pedidos se concentran en periodos de alta demanda, aumenta la probabilidad de retrasos en la entrega.”<br><br>Ahora se quiere evaluar si esta regla se aplica correctamente a distintos escenarios.<br>Arrastra cada situación al recuadro que corresponda, según si cumple o no con la regla general planteada. Analiza cada caso considerando la relación entre demanda y desempeño del servicio, no detalles superficiales.</div>
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