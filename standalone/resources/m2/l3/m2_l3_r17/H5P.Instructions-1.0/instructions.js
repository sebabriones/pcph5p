jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">La facultad de Ciencias Físicas analiza el rendimiento de sus estudiantes en Física y Cálculo. Además, se considera la actitud frente al aprendizaje, que se infiere según el patrón de notas.<br><strong>Muestra de estudiantes de segundo año:</strong><ul class="unordered-list"><li><strong>Ana:</strong> Física 2.5, Cálculo 5.6</li><li><strong>Luis:</strong> Física 2.9, Cálculo 5.0</li><li><strong>Marta:</strong> Física 4.2, Cálculo 4.0</li><li><strong>Pedro:</strong> Física 3.0, Cálculo 3.8</li><li><strong>Carla:</strong> Física 5.4, Cálculo 3.7</li></ul><strong>Criterios para clasificar:</strong><ol type="i" class="unordered-list"><li>Categoría de rendimiento académico<ul><li>Aprobado en ambas (≥4.0 en ambas).></li><li>Aprobado sólo en Cálculo.</li><li>Aprobado sólo en Física.</li><li>Reprobado en ambas.</li></ul></li><li>Enfoque de estudio (inferida)<ul><li><strong>Motivado:</strong> Aprobada en ambas con ≥ 6.0.</li><li><strong>Proactivo:</strong> Notas equilibradas con ≥ 4.0 en ambas materias.</li><li><strong>Pasivo:</strong> Diferencia marcada entre materias con una < 4.0 y otra ≥ 5.0</li><li><strong>Crítico:</strong> Bajo rendimiento general (< 4.0 en ambas).</li></ul></li></ol></div>
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
                                                <div class="instructions-text">La facultad de Ciencias Físicas analiza el rendimiento de sus estudiantes en Física y Cálculo. Además, se considera la actitud frente al aprendizaje, que se infiere según el patrón de notas.<br><strong>Muestra de estudiantes de segundo año:</strong><ul class="unordered-list"><li><strong>Ana:</strong> Física 2.5, Cálculo 5.6</li><li><strong>Luis:</strong> Física 2.9, Cálculo 5.0</li><li><strong>Marta:</strong> Física 4.2, Cálculo 4.0</li><li><strong>Pedro:</strong> Física 3.0, Cálculo 3.8</li><li><strong>Carla:</strong> Física 5.4, Cálculo 3.7</li></ul><strong>Criterios para clasificar:</strong><ol type="i" class="unordered-list"><li>Categoría de rendimiento académico<ul><li>Aprobado en ambas (≥4.0 en ambas).></li><li>Aprobado sólo en Cálculo.</li><li>Aprobado sólo en Física.</li><li>Reprobado en ambas.</li></ul></li><li>Enfoque de estudio (inferida)<ul><li><strong>Motivado:</strong> Aprobada en ambas con ≥ 6.0.</li><li><strong>Proactivo:</strong> Notas equilibradas con ≥ 4.0 en ambas materias.</li><li><strong>Pasivo:</strong> Diferencia marcada entre materias con una < 4.0 y otra ≥ 5.0</li><li><strong>Crítico:</strong> Bajo rendimiento general (< 4.0 en ambas).</li></ul></li></ol></div>
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