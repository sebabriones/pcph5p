jQuery(document).ready(()=>{
    //Permite posicionar los botones prev y next en el mismo div que el progressbar dentro de un cuestionario(quiz)
    const d = document;

    const qContainer = $('.question-container'),
          qsProgress = $('.qs-progress')[0],
          qCheck = $('.h5p-question-check-answer');

    if(qContainer.length >= 3){
        const btnPrev = qContainer[1].children[1].children[2],
              btnNext = qContainer[1].children[1].children[1];

        qsProgress.children[0].parentNode.insertBefore(btnPrev, qsProgress.children[0]);
        qsProgress.appendChild(btnNext);
    }

    $('.h5p-question-buttons').find('a').css({'display':'none'});

    function actionBtn(){
        const btnPrev = $('.question-container[style=""]').find('.h5p-question-prev')[0] || null,
              btnNext = $('.question-container[style=""]').find('.h5p-question-next')[0] || null;

        if(btnPrev === null && btnNext !== null){
            $('.qs-progress .h5p-question-prev')[0].style.pointerEvents = 'none';
            $('.qs-progress .h5p-question-next')[0].style.pointerEvents = 'auto';
        }else if(btnPrev !== null && btnNext === null){
            $('.qs-progress .h5p-question-prev')[0].style.pointerEvents = 'auto';
            $('.qs-progress .h5p-question-next')[0].style.pointerEvents = 'none';
        }else if((btnPrev !== null && btnNext !== null)||(btnPrev === null && btnNext === null)){
            $('.qs-progress .h5p-question-prev')[0].style.pointerEvents = 'auto';
            $('.qs-progress .h5p-question-next')[0].style.pointerEvents = 'auto';
        }
    }

    qsProgress.addEventListener('click', actionBtn);

    qCheck.each((i,el)=>{
        el.addEventListener('click', ()=>{
            setTimeout(() => {
                const qFinish = $('.h5p-question-finish')[0] || null;
                if(qFinish !== null){
                    qFinish.addEventListener('click', ()=>{
                        $('.questionset-results').find('.qs-retrybutton')[0].addEventListener('click', actionBtn);
                    })
                }
            }, 200);
        })
    });

    actionBtn();


    /*const draggables = $('.h5p-draggable');
    const classToDetect = 'h5p-dropped';

    draggables.each((i, draggable) => {
        const draggableObserver = new MutationObserver(function(mutationList, observer) {
            for(const mutation of mutationList){
                if(mutation.type === 'attributes' && mutation.attributeName === 'class'){
                    const currentClasses = draggable.classList;

                    if(currentClasses.contains(classToDetect)){
                        console.log(`La clase ${classToDetect} ha sido añadida`);
                    }else{
                        console.log(`La clase ${classToDetect} ya no está`);
                    }
                }
            }
        });

        draggableObserver.observe(draggable, { attributes: true });
    });*/

    const draggables = $('.h5p-draggable');

    draggables.each((i, draggable) => {
        const draggableObserver = new MutationObserver((mutationsList, draggableObserver) => {
            for(const mutation of mutationsList){
                if(mutation.type === 'attributes' && mutation.attributeName === 'style'){
                    const newStyle = draggable.getAttribute('style');
                    console.log('Detectado cambio en el atributo style:', mutation.oldValue, '->', newStyle);
                }
            }
        });

        draggableObserver.observe(draggable, {
            attributes: true,
            attributeFilter: ['style'],
            attributeOldValue:true
        });
    });

});