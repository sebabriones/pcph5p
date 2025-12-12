jQuery(document).ready(()=>{
    const d = document;

    //****Course presentation customize****
    
    const slidesWithTask = $('.h5p-progressbar-part-has-task'),
          beforeSummarySlide = $('.h5p-progressbar .h5p-progressbar-part')[$('.h5p-progressbar .h5p-progressbar-part').length - 2],
          summarySlide = $('.progressbar-part-summary-slide'),
          finishBtnContainer = d.createElement('div'),
          finishBtn = d.createElement('div'),
          checkBtn = $('.h5p-question-check-answer');

    $('.h5p-footer').css({'display':'none'});
    $('.h5p-cp-navigation').css({'display':'none'});

    //Genera el botón de Terminar
    $(finishBtnContainer).addClass('finish-btn-container');
    $(finishBtn).html('Terminar').addClass('finish-btn');

    finishBtnContainer.appendChild(finishBtn);
    d.querySelector('.h5p-wrapper').appendChild(finishBtnContainer);

    $(finishBtnContainer).css('display','none');

    //Al hacer click en el botón "Comprobar de la actividad"
    $(checkBtn).click(()=>{
        setTimeout(() => {
            //Simula clic a la diapo de retroalimentación (previa a diapo de summary)
            beforeSummarySlide.children[0].click();

            //Muestra botón Terminar
            $(finishBtnContainer).css('display','block');
        }, 1000);
    });

    //Simula click a botón de slide de retroalimentación
    $(finishBtn).click(()=>{
        setTimeout(() => {
            summarySlide[0].children[0].click();

            //Oculta botón Terminar
            $(finishBtnContainer).css('display','none');
        }, 500);
    });
});