jQuery(document).ready(()=>{
    const instructions = `Lee atentamente el siguiente caso:<br><br>
                          Vives en un departamento con poca luz y un balcón pequeño. Quieres mejorar tu alimentación con vegetales frescos, pero tienes poco presupuesto y ninguna experiencia con plantas. Aun así, buscas una forma simple y económica de crear un pequeño huerto urbano que puedas mantener sin complicaciones.<br><br>
                          ¿Cómo podrías crear un huerto urbano considerando las condiciones del departamento? Para dar con la solución has descompuesto el problema y elaborado un plan de 4 etapas.<br><br>
                          A continuación, manten el cursor sobre cada carta para ver la información. Luego, toma y arrástralas para organizarlas de acuerdo a las 4 etapas del plan.
                        `;

    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">${instructions}</div>
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
                                                <div class="instructions-text">${instructions}</div>
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