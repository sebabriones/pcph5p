jQuery(document).ready(()=>{
    const instructions = `El Departamento de seguridad ciudadana quiere implementar un procedimiento algorítmico para atender reportes de emergencias en la ciudad (inundaciones, incendios, deslizamientos, cortes eléctricos, etc.). El objetivo es que el proceso sea estandarizado, rápido y priorice según el nivel de riesgo y tipo de emergencia.<br><br>
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