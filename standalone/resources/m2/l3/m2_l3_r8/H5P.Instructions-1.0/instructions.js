jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">Una familia quiere saber si el presupuesto que han destinado para sus vacaciones en la playa les alcanzará. Hacen una lluvia de ideas para planificar bien el presupuesto. Hasta el momento solo tienen claro que:<br><br>“Las vacaciones serán en febrero y se busca gastar lo menos posible.”<br><br>Selecciona todas las alternativas que representen información indispensable que falta para poder calcular si el presupuesto destinado realmente permitirá cumplir el objetivo.</div>
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
                                                <div class="instructions-text">Una familia quiere saber si el presupuesto que han destinado para sus vacaciones en la playa les alcanzará. Hacen una lluvia de ideas para planificar bien el presupuesto. Hasta el momento solo tienen claro que:<br><br>“Las vacaciones serán en febrero y se busca gastar lo menos posible.”<br><br>Selecciona todas las alternativas que representen información indispensable que falta para poder calcular si el presupuesto destinado realmente permitirá cumplir el objetivo.</div>
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