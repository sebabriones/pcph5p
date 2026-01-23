jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Analiza cuidadosamente la siguiente información y resuelve el problema planteado paso a paso.<br>Has terminado tus evaluaciones y obtuviste:<br><br><strong>Física:</strong> Muy baja nota, <strong>Cálculo:</strong> Nota aceptable, <strong>Álgebra:</strong> Buena nota<br><br>Durante la semana anterior, estudiaste lo siguiente:<br><br><img src=\"resources/m2/l3/m2_l3_r21/content/images/table.png\" alt=\"table\" width=\"45%\"><br><br><strong>Problema a resolver:</strong> Necesitas decidir cómo distribuir tu tiempo de estudio la próxima semana para mantener notas aceptables en todas las asignaturas para aprobarlas, sobre todo en Física.<br><br><p style="text-align:left;"><strong>Slide 1:</strong> Completa la tabla agrupando los días y el total de horas por asignatura para ver cuánto tiempo dedicaste a cada una la semana anterior. Escribe cada dato en su columna correspondiente.<br><strong>Slide 2 y 3:</strong> Seleccione la alternativa correcta.</p></div>
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
                                                <div class="instructions-text">Analiza cuidadosamente la siguiente información y resuelve el problema planteado paso a paso.<br>Has terminado tus evaluaciones y obtuviste:<br><br><strong>Física:</strong> Muy baja nota, <strong>Cálculo:</strong> Nota aceptable, <strong>Álgebra:</strong> Buena nota<br><br>Durante la semana anterior, estudiaste lo siguiente:<br><br><img src=\"resources/m2/l3/m2_l3_r21/content/images/table.png\" alt=\"table\" width=\"45%\"><br><br><strong>Problema a resolver:</strong> Necesitas decidir cómo distribuir tu tiempo de estudio la próxima semana para mantener notas aceptables en todas las asignaturas para aprobarlas, sobre todo en Física.<br><br><p style="text-align:left;"><strong>Slide 1:</strong> Completa la tabla agrupando los días y el total de horas por asignatura para ver cuánto tiempo dedicaste a cada una la semana anterior. Escribe cada dato en su columna correspondiente.<br><strong>Slide 2 y 3:</strong> Seleccione la alternativa correcta.</p></div>
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