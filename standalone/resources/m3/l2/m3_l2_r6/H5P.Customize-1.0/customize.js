jQuery(document).ready(()=>{
    //****Course presentation customize****
    
    const slidesWithTask = $('.h5p-progressbar-part-has-task'),
          summarySlide = $('.progressbar-part-summary-slide');

    $('.h5p-footer').css({'display':'none'});
    $('.h5p-cp-navigation').css({'display':'none'});

    //Observa en el progressbar que los tabs de diapos que tengan tareas estan respondidas o no
    const observerSlides = new MutationObserver((mutationList, observerInstance)=>{
        for(const mutation of mutationList){
            if(mutation.type === 'attributes' && mutation.attributeName === 'class'){
                const currentClasses = slidesWithTask[0].classList;
                if(currentClasses.contains('h5p-answered')){
                    setTimeout(() => {
                        //Simula clic a la diapo de summary
                        summarySlide[0].children[0].click();
                    }, 1000);
                }
            }
        }
    });

    observerSlides.observe(slidesWithTask[0], {attributes: true});
});