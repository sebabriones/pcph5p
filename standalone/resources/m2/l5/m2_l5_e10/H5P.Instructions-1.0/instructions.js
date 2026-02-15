jQuery(document).ready(()=>{
    const instructions = `En una feria comunitaria habrá puestos de comida y se necesita un algoritmo para gestionar la fila porque:
                          <ul style="text-align:left;"><li>Algunas personas tienen prioridad (adultos mayores, embarazadas).</li><li>Hay capacidad limitada en el puesto.</li><li>Se quiere minimizar el tiempo total de espera sin perder justicia.</li></ul>
                          <strong>Objetivo del algoritmo: </strong>Decidir a quién atender a continuación de forma clara, replicable y aplicable a cualquier puesto.<br><br>
                          <strong>Datos de entrada: </strong>Cada persona tiene
                          <ol style="text-align:left;"><li>hora_llegada</li><li>prioridad (0 = normal, 1 = prioritaria)</li><li>items (cantidad de productos que comprará, 1 a 10)</li></ol>
                          <strong>Restricciones y criterios:</strong>
                          <ul style="text-align:left;"><li>Nunca atender a alguien que no esté en la fila.</li><li>Prioridad no significa “saltarse todo”: define una regla exacta.</li><li>El algoritmo debe funcionar si cambia el rango de items, si hay más tipos de prioridad o si cambia el número de puestos.</li></ul>
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