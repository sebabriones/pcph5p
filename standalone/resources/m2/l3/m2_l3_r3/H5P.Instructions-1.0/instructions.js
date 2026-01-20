jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Tu gato Michi tiene sobrepeso y la veterinaria indica que vive en un ambiente poco estimulante, lo que reduce su actividad física. Además, debe mantenerse indoor, pero necesita juguetes o elementos que incentiven el movimiento. En tu familia casi nadie quiere a Michi y tu presupuesto es limitado.<br><br>Arrastra hacia la zona indicada sólo la información relevante que permite comprender y analizar el problema de salud de Michi. Son 5 los datos fundamentales.</div>
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
                                                <div class="instructions-text">Tu gato Michi tiene sobrepeso y la veterinaria indica que vive en un ambiente poco estimulante, lo que reduce su actividad física. Además, debe mantenerse indoor, pero necesita juguetes o elementos que incentiven el movimiento. En tu familia casi nadie quiere a Michi y tu presupuesto es limitado.<br><br>Arrastra hacia la zona indicada sólo la información relevante que permite comprender y analizar el problema de salud de Michi. Son 5 los datos fundamentales.</div>
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