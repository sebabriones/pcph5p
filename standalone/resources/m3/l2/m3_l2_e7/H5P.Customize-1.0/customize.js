jQuery(document).ready(()=>{
    const d = document;

    //****Course presentation customize****
    
    const slidesWithTask = $('.h5p-progressbar-part-has-task'),
          beforeSummarySlide = $('.h5p-progressbar .h5p-progressbar-part')[$('.h5p-progressbar .h5p-progressbar-part').length - 2],
          summarySlide = $('.progressbar-part-summary-slide'),
          finishBtnContainer = d.createElement('div'),
          finishBtn = d.createElement('div');

    $('.h5p-footer').css({'display':'none'});
    $('.h5p-cp-navigation').css({'display':'none'});

    //Genera el botón de Terminar
    $(finishBtnContainer).addClass('finish-btn-container');
    $(finishBtn).html('Terminar').addClass('finish-btn');

    finishBtnContainer.appendChild(finishBtn);
    d.querySelector('.h5p-wrapper').appendChild(finishBtnContainer);

    $(finishBtnContainer).css('display','none');


    //Observa en el progressbar que los tabs de diapos que tengan tareas estan respondidas o no
    const observerSlides = new MutationObserver((mutationList, observerInstance)=>{
        for(const mutation of mutationList){
            if(mutation.type === 'attributes' && mutation.attributeName === 'class'){
                const currentClasses = slidesWithTask[0].classList;
                if(currentClasses.contains('h5p-answered')){
                    setTimeout(() => {
                        //Simula clic a la diapo de retroalimentación (previa a diapo de summary)
                        beforeSummarySlide.children[0].click();

                        //Muestra botón Terminar
                        $(finishBtnContainer).css('display','block');
                    }, 1000);
                }
            }
        }
    });

    observerSlides.observe(slidesWithTask[0], {attributes: true});

    //Simula click a botón de slide de retroalimentación
    $(finishBtn).click(()=>{
        setTimeout(() => {
            summarySlide[0].children[0].click();

            //Oculta botón Terminar
            $(finishBtnContainer).css('display','none');
        }, 500);
    });
});