jQuery(document).ready(()=>{
    const instructions = `En un torneo se necesita un algoritmo para gestionar el orden de uso de la cancha porque:
                          <ul style="text-align:left;"><li>Algunos equipos tienen prioridad (por ejemplo, semifinalistas o equipos con menos partidos jugados).</li><li>La cancha tiene tiempo limitado de uso.</li><li>Se quiere minimizar los tiempos muertos y asegurar que todos jueguen de manera justa.</li></ul>
                          <strong>Objetivo del algoritmo: </strong>Decidir qué equipo juega a continuación de forma clara, replicable y aplicable a cualquier torneo.<br><br>
                          <strong>Datos de entrada: </strong>Cada equipo tiene
                          <ol style="text-align:left;"><li>hora_registro (momento en que pidió turno).</li><li>prioridad (0 = normal, 1 = semifinalista o con menos partidos).</li><li>duracion_partido (tiempo solicitado, entre 45 y 60 minutos).</li></ol>
                          <strong>Restricciones y criterios:</strong>
                          <ul style="text-align:left;"><li>Nunca asignar cancha a un equipo que no esté registrado.</li><li>La prioridad no significa “saltarse todo”: define una regla exacta.</li><li>El algoritmo debe funcionar si cambia el rango de duración, si hay más tipos de prioridad o si hay más canchas disponibles.</li></ul>
                          Ordena los módulos en el orden correcto para formar el algoritmo.
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