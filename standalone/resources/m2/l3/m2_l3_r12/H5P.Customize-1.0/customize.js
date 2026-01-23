jQuery(document).ready(()=>{
    //Permite posicionar los botones prev y next en el mismo div que el progressbar dentro de un cuestionario(quiz)
    const d = document;

    const qContainer = $('.question-container'),
          qsProgress = $('.qs-progress')[0],
          qCheck = $('.h5p-question-check-answer');

    //Busca los botones de prev y next, en caso de que tenga 3 o más slides se buscan los botones del segundo slide
    //En caso que tenga 2 slides se busca el boton next del primer slide y el botón prev del segundo slide
    //if(qContainer.length >= 3){
    if(qContainer.length === 2){
        const btnPrev = qContainer[1].children[1].children[1],
              btnNext = qContainer[0].children[1].children[1];

        qsProgress.children[0].parentNode.insertBefore(btnPrev, qsProgress.children[0]);
        qsProgress.appendChild(btnNext);
    }

    $('.h5p-question-buttons').find('a').css({'display':'none'});

    function actionBtn(){
        const questionContainer = $('.question-container');

        console.log(questionContainer)

        if(questionContainer[0].style.display === 'none'){
            $('.qs-progress .h5p-question-prev')[0].style.pointerEvents = 'auto';
            $('.qs-progress .h5p-question-next')[0].style.pointerEvents = 'none';
        }else if(questionContainer[1].style.display === 'none'){
            $('.qs-progress .h5p-question-prev')[0].style.pointerEvents = 'none';
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
            }, 500);
        })
    });

    actionBtn();
});