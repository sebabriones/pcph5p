jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Un grupo de estudiantes universitarios percibe que su desempeño académico ha disminuido, pero la causa no es clara. Antes de analizar datos específicos, necesitan definir correctamente el problema general y luego descomponerlo en factores observables.<br><br><strong>Actividad 1:</strong> Lee atentamente las siguientes afirmaciones y selecciona el problema general que mejor representa la situación descrita.<br>Selecciona una sola opción.<br><br><strong>Actividad 2:</strong> Una vez seleccionado el problema general, arrastra los elementos que permiten descomponerlo en factores específicos, de modo que pueda analizarse con mayor claridad.<br><br><strong>Nota:</strong> No podrá avanzar a la siguiente slide si no completa la primera actividad.</div>
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
                                                <div class="instructions-text">Un grupo de estudiantes universitarios percibe que su desempeño académico ha disminuido, pero la causa no es clara. Antes de analizar datos específicos, necesitan definir correctamente el problema general y luego descomponerlo en factores observables.<br><br><strong>Actividad 1:</strong> Lee atentamente las siguientes afirmaciones y selecciona el problema general que mejor representa la situación descrita.<br>Selecciona una sola opción.<br><br><strong>Actividad 2:</strong> Una vez seleccionado el problema general, arrastra los elementos que permiten descomponerlo en factores específicos, de modo que pueda analizarse con mayor claridad.<br><br><strong>Nota:</strong> No podrá avanzar a la siguiente slide si no completa la primera actividad.</div>
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