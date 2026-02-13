jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Un estudiante universitario quiere mejorar la forma en que organiza su tiempo y sus responsabilidades académicas, ya que siente que realiza muchas tareas, pero no siempre logra priorizarlas ni distribuirlas adecuadamente. Para comprender mejor su situación, decide ordenar la información que ha recopilado sobre sus actividades, con el fin de analizarla de manera más clara y tomar mejores decisiones.<br><br>Lee atentamente el siguiente texto y completa los espacios en blanco utilizando parejas de expresiones que representen categorías adecuadas para organizar la información. Las palabras que completes deben permitir clasificar las actividades de forma coherente, de modo que la información quede ordenada y sea más fácil de analizar.<br><br><strong>Une con una línea solamente las 3 posibles combinaciones correctas de expresiones que completan el texto coherentemente.</strong><br><br><strong>Texto:</strong><br>Al organizar la información sobre mis actividades, puedo agruparlas en categorías como ________________, lo que me permite analizar ________________ de manera más clara y tomar mejores decisiones sobre cómo distribuir mi tiempo.</div>
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
                                                <div class="instructions-text">Un estudiante universitario quiere mejorar la forma en que organiza su tiempo y sus responsabilidades académicas, ya que siente que realiza muchas tareas, pero no siempre logra priorizarlas ni distribuirlas adecuadamente. Para comprender mejor su situación, decide ordenar la información que ha recopilado sobre sus actividades, con el fin de analizarla de manera más clara y tomar mejores decisiones.<br><br>Lee atentamente el siguiente texto y completa los espacios en blanco utilizando parejas de expresiones que representen categorías adecuadas para organizar la información. Las palabras que completes deben permitir clasificar las actividades de forma coherente, de modo que la información quede ordenada y sea más fácil de analizar.<br><br><strong>Une con una línea solamente las 3 posibles combinaciones correctas de expresiones que completan el texto coherentemente.</strong><br><br><strong>Texto:</strong><br>Al organizar la información sobre mis actividades, puedo agruparlas en categorías como ________________, lo que me permite analizar ________________ de manera más clara y tomar mejores decisiones sobre cómo distribuir mi tiempo.</div>
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