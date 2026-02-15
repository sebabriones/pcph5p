jQuery(document).ready(()=>{
    const instructions = `Una nueva tienda online, que recientemente comenzó a operar, ha identificado que algunos pedidos se envían incompletos o con productos equivocados. Esto ocurre porque los trabajadores son nuevos y no tienen experiencia en procesos de embalaje y verificación. El <strong>objetivo</strong> es establecer un procedimiento claro y ordenado para <strong>preparar correctamente un pedido</strong>, de modo que cualquier empleado pueda aplicarlo sin ambigüedades.<br><br>
                          A continuación, se presentan acciones posibles que forman parte del procedimiento, pero NO están en orden.<br><br>
                          Ordena las acciones de manera lógica y precisa, de modo que el procedimiento pueda ejecutarse siempre de la misma forma y conduzca al mismo resultado, sin depender de quien lo implemente.
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