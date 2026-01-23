jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Una empresa de ropa deportiva observa una caída del 25 % en las ventas de su línea de zapatillas para running en los últimos tres meses. Antes de definir una estrategia, el equipo de marketing debe reunir información desde distintas fuentes.<br><br>A continuación, se presentan distintas fuentes de información y tipos de datos que pueden aportar. Une con una línea cada fuente con el tipo de información que permite obtener, considerando qué datos serían útiles para comprender el problema de la caída en la ventas.</div>
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
                                                <div class="instructions-text">Una empresa de ropa deportiva observa una caída del 25 % en las ventas de su línea de zapatillas para running en los últimos tres meses. Antes de definir una estrategia, el equipo de marketing debe reunir información desde distintas fuentes.<br><br>A continuación, se presentan distintas fuentes de información y tipos de datos que pueden aportar. Une con una línea cada fuente con el tipo de información que permite obtener, considerando qué datos serían útiles para comprender el problema de la caída en la ventas.</div>
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