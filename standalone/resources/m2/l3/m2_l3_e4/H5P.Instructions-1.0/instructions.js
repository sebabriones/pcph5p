jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Un grupo de estudiantes universitarios quiere diseñar una aplicación móvil que ayude a organizar el tiempo de estudio durante el semestre. La app debe permitir a los usuarios/as planificar su semana, priorizar actividades y recibir alertas cuando estén sobrecargados.<br><br>Antes de programar la aplicación, el equipo necesita definir el problema correctamente, identificando la información relevante para el diseño de la solución.<br><br>A continuación, se presenta una lista de información recopilada durante una lluvia de ideas. Selecciona la opción que contiene únicamente información relevante y necesaria para diseñar la app, de forma que esta pueda resolver el problema presentado.</div>
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
                                                <div class="instructions-text">Un grupo de estudiantes universitarios quiere diseñar una aplicación móvil que ayude a organizar el tiempo de estudio durante el semestre. La app debe permitir a los usuarios/as planificar su semana, priorizar actividades y recibir alertas cuando estén sobrecargados.<br><br>Antes de programar la aplicación, el equipo necesita definir el problema correctamente, identificando la información relevante para el diseño de la solución.<br><br>A continuación, se presenta una lista de información recopilada durante una lluvia de ideas. Selecciona la opción que contiene únicamente información relevante y necesaria para diseñar la app, de forma que esta pueda resolver el problema presentado.</div>
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