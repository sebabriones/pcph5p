jQuery(document).ready(()=>{
    const instructions = `Un grupo de estudiantes quiere organizar una feria científica en su colegio para mostrar proyectos innovadores. El desafío es que la feria sea atractiva, esté bien organizada y cumpla con las normas de seguridad. Para avanzar, el grupo decide descomponer el problema general en subproblemas.<br><br>
                          Esta actividad se realiza en dos pasos:<br><br>
                          <strong>Paso 1:</strong> Identifica cuáles son los subproblemas que componen el problema planteado.<br>
                          <strong>Paso 2:</strong> Arrastra cada acción al subproblema que le corresponde.<br><br>
                          <strong>Nota:</strong> No podrá avanzar a la siguiente slide si no completa la primera actividad.
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