jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Un estudiante registró durante dos semanas distintos aspectos de su rutina académica para comprender por qué su rendimiento varía. Los datos fueron recolectados por separado y ahora deben integrarse para identificar relaciones.<br><br><ul style='text-align:left;'><li><strong>Pregunta 1:</strong> Observa los datos recolectados y selecciona el problema general que mejor resume la situación.</li><li><strong>Pregunta 2:</strong> Considerando todos los datos en conjunto, selecciona la alternativa que mejor integre la información para explicar el problema identificado.</li></ul></div>
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
                                                <div class="instructions-text">Un estudiante registró durante dos semanas distintos aspectos de su rutina académica para comprender por qué su rendimiento varía. Los datos fueron recolectados por separado y ahora deben integrarse para identificar relaciones.<br><br><ul style='text-align:left;'><li><strong>Pregunta 1:</strong> Observa los datos recolectados y selecciona el problema general que mejor resume la situación.</li><li><strong>Pregunta 2:</strong> Considerando todos los datos en conjunto, selecciona la alternativa que mejor integre la información para explicar el problema identificado.</li></ul></div>
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