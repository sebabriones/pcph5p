jQuery(document).ready(()=>{
    const instructions = `Lee atentamente el siguiente caso y luego selecciona la alternativa correcta:<br><br>
                          Imagina que tu computador portátil se apaga repentinamente después de 15 minutos de uso. Para no reemplazar piezas innecesariamente, decides analizar el problema revisando cada componente por separado:
                          <ul style="text-align:left;">
                            <li>Batería</li>
                            <li>Cargador</li>
                            <li>Sistema de ventilación</li>
                            <li>Software</li>
                          </ul>
                          Has realizado las siguientes <strong>pruebas de manera controlada</strong>:<br><br>
                          <ul style="text-align:left;">
                            <li>Usas el computador solo con batería → enciende bien, pero se apaga después de 15 minutos.</li>
                            <li>Usas el computador conectado al cargador → enciende bien, pero se apaga después de 15 minutos.</li>
                            <li>Inicias el sistema en modo seguro (mínimos programas) → funciona bien hasta que se apaga después de 15 minutos.</li>
                            <li>Observas el ventilador → no funciona, nunca gira, y la carcasa está muy caliente al tacto.</li>
                          </ul>
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