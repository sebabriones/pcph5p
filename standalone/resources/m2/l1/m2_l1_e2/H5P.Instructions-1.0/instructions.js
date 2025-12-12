jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Caso: Como parte de una actividad evaluada, los/as estudiantes debían completar una bitácora digital semanal para registrar sus avances en el desarrollo de una aplicación móvil. Sin embargo, esta bitácora contenía campos obligatorios poco claros, instrucciones extensas y ambiguas, y un diseño confuso. Muchos la enviaron incompleta, con información repetida o con errores, y algunos ni siquiera lograron enviarla. Al momento de la evaluación, los/as docentes encontraron difícil valorar el proceso real de aprendizaje.<br>Una con una línea cada estructura de control con su función correspondiente clickeando un término (fila izquierda) y luego clickea una de las definiciones (fila derecha).</div>
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
                                                <div class="instructions-text">Caso: Como parte de una actividad evaluada, los/as estudiantes debían completar una bitácora digital semanal para registrar sus avances en el desarrollo de una aplicación móvil. Sin embargo, esta bitácora contenía campos obligatorios poco claros, instrucciones extensas y ambiguas, y un diseño confuso. Muchos la enviaron incompleta, con información repetida o con errores, y algunos ni siquiera lograron enviarla. Al momento de la evaluación, los/as docentes encontraron difícil valorar el proceso real de aprendizaje.<br>Una con una línea cada estructura de control con su función correspondiente clickeando un término (fila izquierda) y luego clickea una de las definiciones (fila derecha).</div>
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