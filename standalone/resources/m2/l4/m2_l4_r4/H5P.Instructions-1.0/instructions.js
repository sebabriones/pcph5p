jQuery(document).ready(()=>{
    const instructions = `Un alienígena tiene una cabeza, un cuerpo, dos brazos y dos piernas.<br><br>
                          El alienígena puede transformarse mediante los comandos de mutación que se muestran en la tabla en el área interactuable.<br><br>
                          ¿Cómo se verá el alienígena después de recibir los siguientes comandos?<br><br>
                          C(T), T(C), B(-), P(-)<br><br>
                          Desplaza hacia la izquierda o derecha cada parte del cuerpo del alien hasta dar con la forma que indica la serie de comandos dada.<br><br>
                          <strong>Nomenclatura:</strong><br><br>
                          <img src="resources/m2/l4/m2_l4_e4/content/images/table.png" alt="table" width="30%">
                        `;

    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">${instructions}</div>
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
                                                <div class="instructions-text">${instructions}</div>
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