jQuery(document).ready(()=>{
    /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
    $('body').prepend(`<div class="intro">
                            <div class="text-content">
                                <div class="intro-text">La empresa Energy está evaluando tres proyectos de generación de energía renovable.<br>Tienes los siguientes datos sobre estos proyectos:<ul class="unordered-list"><li><strong>Proyecto A</strong> – Energía Hidráulica – Costo: $9000 – Duración:  24 meses<br>Descripción: Requiere gran infraestructura, Se implementará cerca de ecosistemas acuáticos.</li><li><strong>Proyecto B</strong> –  Energía Solar – Costo: $5000 – Duración: 3 meses<br>Descripción: Paneles reciclables, instalación en techos urbanos.</li><li><strong>Proyecto C</strong> – Energía Eólica – Costo: $7000 – Duración: 12 meses<br>Descripción: Gran gasto operativo. Se implementará en una zona natural libre de intervención humana y animales.</li></ul>Clasifica los proyectos por su nivel de impacto ecológico. Toma y arrastra los datos hacia la tabla para completarla.</div>
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
                                                <div class="instructions-text">La empresa Energy está evaluando tres proyectos de generación de energía renovable.<br>Tienes los siguientes datos sobre estos proyectos:<ul class="unordered-list"><li><strong>Proyecto A</strong> – Energía Hidráulica – Costo: $9000 – Duración:  24 meses<br>Descripción: Requiere gran infraestructura, Se implementará cerca de ecosistemas acuáticos.</li><li><strong>Proyecto B</strong> –  Energía Solar – Costo: $5000 – Duración: 3 meses<br>Descripción: Paneles reciclables, instalación en techos urbanos.</li><li><strong>Proyecto C</strong> – Energía Eólica – Costo: $7000 – Duración: 12 meses<br>Descripción: Gran gasto operativo. Se implementará en una zona natural libre de intervención humana y animales.</li></ul>Clasifica los proyectos por su nivel de impacto ecológico. Toma y arrastra los datos hacia la tabla para completarla.</div>
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