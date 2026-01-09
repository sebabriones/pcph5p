jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Un estudiante universitario afirma que estudia muchas horas, pero sus resultados académicos siguen siendo bajos. Dice sentirse frustrado porque “hace todo lo posible” y no entiende por qué no mejora su rendimiento. Un tutor académico quiere comprender el problema antes de proponer soluciones.<br><br>A continuación se presentan distintos tipos de información. Arrastra sólo aquella información que es necesaria para comprender el problema académico del estudiante a la zona correspondiente. Indicación: No todas las opciones deben usarse.</div>
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
                                                <div class="instructions-text">Un estudiante universitario afirma que estudia muchas horas, pero sus resultados académicos siguen siendo bajos. Dice sentirse frustrado porque “hace todo lo posible” y no entiende por qué no mejora su rendimiento. Un tutor académico quiere comprender el problema antes de proponer soluciones.<br><br>A continuación se presentan distintos tipos de información. Arrastra sólo aquella información que es necesaria para comprender el problema académico del estudiante a la zona correspondiente. Indicación: No todas las opciones deben usarse.</div>
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