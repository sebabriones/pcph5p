jQuery(document).ready(()=>{
    const instructions = `Una municipalidad quiere implementar un procedimiento algorítmico para gestionar reclamos ciudadanos sobre problemas de iluminación pública. El objetivo es que todos los reclamos sean tratados de forma consistente, sin depender del criterio personal de quien los reciba, y que el sistema use los recursos de manera eficiente.<br><br>
                          A continuación, se presentan acciones posibles del procedimiento, algunas necesarias y otras problemáticas.<br><br>
                          <strong>Parte 1 Arrastrar y soltar: </strong>Selecciona sólo las acciones necesarias y ordénalas para construir un algoritmo preciso y verificable.<br>
                          <strong>Parte 2 Selección múltiple: </strong>Selecciona todas las afirmaciones correctas respecto del algoritmo que construiste.<br><br>
                          <strong>Nota: </strong>No podrá avanzar a la siguiente slide si no completa la primera actividad.
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