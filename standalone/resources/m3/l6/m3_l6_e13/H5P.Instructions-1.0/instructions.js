jQuery(document).ready(()=>{
    const instructions = `Seleccione la alternativa correcta.<br><br>
                          <strong>Nota: </strong>Para mejor comprensión del ejercicio, tiene a disposición la Terminal Python.<br>
                          Al hacer clic en el botón "Terminal Python" se mostrar una ventana con ella.<br><br>
                          <strong>Botones Terminal Python:</strong>
                          <ul style=\"text-align:left;\">
                           <li style=\"list-style-position: inside;\">▶️ Ejecutar: Ejecuta el código.</li>
                           <li style=\"list-style-position: inside;\">💾 Enviar: Envía el código para ser revisado y calificado.</li>
                           <li style=\"list-style-position: inside;\">🗑️ Limpiar: Limpia la consola.</li>
                           <li style=\"list-style-position: inside;\">📁 Cargar archivo(s): Carga archivos almacenados en su equipo.</li>
                           <li style=\"list-style-position: inside;\">💡 Cargar ejemplo: Carga uno o varios ejemplos de código.</li>
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