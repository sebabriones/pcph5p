jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Observa la distribución de colores en los tres primeros loros; todos siguen el patron de cuatro colores: rojo, azul, verde y amarillo.<br>Para el cuarto loro, asegúrate de que ningún color se repita en la misma parte del cuerpo que en los anteriores.<br><br>Desplaza hacia la izquierda o derecha cada parte del cuerpo del cuarto loro hasta obtener el patrón correcto.</div>
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
                                                <div class="instructions-text">Observa la distribución de colores en los tres primeros loros; todos siguen el patron de cuatro colores: rojo, azul, verde y amarillo.<br>Para el cuarto loro, asegúrate de que ningún color se repita en la misma parte del cuerpo que en los anteriores.<br><br>Desplaza hacia la izquierda o derecha cada parte del cuerpo del cuarto loro hasta obtener el patrón correcto.</div>
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