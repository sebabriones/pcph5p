jQuery(document).ready(()=>{
    const instructions = `Lee atentamente el siguiente caso y luego selecciona la alternativa correcta:<br><br>
                          Imagina que una aplicación de juegos en tu teléfono celular se cierra inesperadamente, pero solo cuando usas datos móviles. Cuando te conectas a una red Wi-Fi, la aplicación funciona sin problemas. Para entender qué ocurre, decides observar el comportamiento bajo distintas condiciones.
                          Has realizado las siguientes <strong>pruebas de manera controlada</strong>:<br><br>
                          <ul style="text-align:left;">
                            <li>Usas la aplicación con Wi-Fi → funciona correctamente.</li>
                            <li>Usas la aplicación con datos móviles → la aplicación se cierra.</li>
                            <li>Pruebas otras aplicaciones con datos móviles → funcionan correctamente.</li>
                            <li>Reinicias el teléfono → el problema persiste solo con datos móviles.</li>
                          </ul>`;

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