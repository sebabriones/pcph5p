jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">La biblioteca universitaria ha detectado una disminución en el préstamo de libros físicos, y quiere comprender las posibles causas antes de tomar decisiones. Para ello, necesita reunir información desde distintas fuentes, ya que ningún registro por sí solo permite entender completamente el problema.<br><br>A continuación, se presentan distintas fuentes de información y de diferentes tipos, según su aporte. Relaciona correctamente cada fuente con el tipo de información que permite obtener, considerando qué datos serían útiles para comprender el problema del uso de la biblioteca.<br><br>Une con una línea cada fuente con el tipo de información que mejor corresponda.</div>
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
                                                <div class="instructions-text">La biblioteca universitaria ha detectado una disminución en el préstamo de libros físicos, y quiere comprender las posibles causas antes de tomar decisiones. Para ello, necesita reunir información desde distintas fuentes, ya que ningún registro por sí solo permite entender completamente el problema.<br><br>A continuación, se presentan distintas fuentes de información y de diferentes tipos, según su aporte. Relaciona correctamente cada fuente con el tipo de información que permite obtener, considerando qué datos serían útiles para comprender el problema del uso de la biblioteca.<br><br>Une con una línea cada fuente con el tipo de información que mejor corresponda.</div>
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