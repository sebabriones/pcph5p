jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Analiza cuidadosamente la siguiente información y resuelve el problema planteado paso a paso.<br><br>Una empresa de logística necesita organizar su inventario para optimizar el espacio en el almacén. Durante la semana, se registraron las siguientes entradas:<br><br><img src=\"resources/m2/l3/m2_l3_e21/content/images/table.png\" alt=\"table\" width=\"45%\"><br><br><strong>Problema a resolver:</strong> Necesitas decidir cómo reorganizar el inventario para dar prioridad a la categoría con mayor demanda.</div>
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
                                                <div class="instructions-text">Analiza cuidadosamente la siguiente información y resuelve el problema planteado paso a paso.<br><br>Una empresa de logística necesita organizar su inventario para optimizar el espacio en el almacén. Durante la semana, se registraron las siguientes entradas:<br><br><img src=\"resources/m2/l3/m2_l3_e21/content/images/table.png\" alt=\"table\" width=\"45%\"><br><br><strong>Problema a resolver:</strong> Necesitas decidir cómo reorganizar el inventario para dar prioridad a la categoría con mayor demanda.</div>
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