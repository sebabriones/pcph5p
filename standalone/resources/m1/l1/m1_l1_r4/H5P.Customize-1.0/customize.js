jQuery(document).ready(()=>{
    /*Esta funcionalidad es para actividades que esten en Course Presentation de una sola diapositiva.
      Cuando el usuario clickea el boton de check-answer espera 3 segundos y clickea el btn de summary.*/

    const d = document;

    $('.h5p-cp-navigation').css({'display':'none'});
    $('.h5p-box-wrapper').css({'height':'100%'});

    $('.h5p-question-check-answer').click(()=>{
        setTimeout(() => {
            $('.progressbar-part-summary-slide')[0].children[0].click();
        }, 3000);
    });
});