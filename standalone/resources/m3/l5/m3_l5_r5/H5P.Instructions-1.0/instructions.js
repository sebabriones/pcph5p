jQuery(document).ready(()=>{
    let id = new URLSearchParams(window.location.search).get('id'),
        instructions = {};

    ////////////////////////////////////////////////////////////////////////////

    async function doAjax(){
        return $.ajax({
            url: 'js/resources/instructions.json',
            method: 'GET',
            dataType: 'json',
        });
    }

    (async()=>{
        try{
            instructions = await doAjax();

            /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
            $('body').prepend(`<div class="intro">
                                    <div class="text-content">
                                        <div class="intro-text">${instructions[id]}</div>
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
                                                        <div class="instructions-text">${instructions[id]}</div>
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

        }catch(error){
            console.error(error);
        }
    })();

    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    /*$('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">${instructions[id]}</div>
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
    });*/

    /////////////////////////PESTAÑA CON INSTRUCCIONES PARA H5P/////////////////////////////

    /*$('.h5p-content').prepend(`<div class="custom-instructions">
                                    <div class="tab-container">
                                        <div id="tab" class="tab">
                                            <div class="tab-content">
                                                <div class="instructions-text">${instructions[id]}</div>
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
    }, 500);*/
});