jQuery(document).ready(()=>{
    const instructions = `La empresa TecnoPlus, dedicada a la venta de dispositivos electrónicos, ha experimentado una caída del 25 % en sus ventas durante los últimos seis meses. Además, los clientes han comenzado a expresar insatisfacción en redes sociales por retrasos en las entregas y falta de respuesta del servicio al cliente; incluso, cerca del 5 % ha realizado devoluciones. Al mismo tiempo, han aparecido nuevos competidores que ofrecen productos similares a precios más bajos y con envíos más rápidos.<br><br>
                          Identifica las partes que componen este problema complejo. Para ello, considera:
                          <ul style="text-align:left;"><li>Factores internos (dentro de la empresa)</li><li>Factores externos (mercado, competencia)</li><li>Posibles subproblemas relacionados (efectos visibles)</li></ul>
                          Arrastra las categorías a sus respectivas situaciones.
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