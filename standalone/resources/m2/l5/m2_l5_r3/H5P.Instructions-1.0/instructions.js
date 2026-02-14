jQuery(document).ready(()=>{
    const instructions = `Has diseñado un robot llamado Tron, que tiene la función de limpiar las plazas del país.
                          <ul style="text-align:left;"><li>Esta plaza está dividida en una cuadrícula.</li><li>Tron comienza en una posición fija y solo puede moverse en cuatro direcciones: arriba, abajo, izquierda o derecha.</li><li>Moverse de un cuadro a otro, que cuenta como 1 movimiento.</li></ul>
                          <strong>Funcionamiento de Tron:</strong>
                          <ul style="text-align:left;"><li>Tron detecta automáticamente la basura más cercana a su posición actual.</li><li>Tron se mueve hacia esa basura.</li><li>Tron recoge la basura.</li><li>Desde esa posición, Tron vuelve a detectar la basura más cercana.</li><li>Tron repite esto hasta que todas la basura haya sido recogida.</li></ul>
                          ¿Cuál será la última basura que Tron recogerá al final? Toma y arrastra las flechas (→ ↑ ← ↓) hacia los recuadros correspondientes para marcar la ruta completa que seguirá el robot según su algoritmo de funcionamiento.
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