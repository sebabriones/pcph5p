jQuery(document).ready(()=>{
    //Permite posicionar los botones prev y next en el mismo div que el progressbar dentro de un cuestionario(quiz)
    const d = document;

    const qContainer = $('.question-container'),
          qsProgress = $('.qs-progress')[0],
          qCheck = $('.h5p-question-check-answer'),
          checkAnswerBtn = $('.h5p-question-check-answer'),
          progressDot = $('.progress-dot');

    //Esta variable maneja si el slide 1 ha sido respondido para habilitar el boton btnNext
    let isAnswered = false;

    /*Funcionalidad que bloquea pasar a la siguiente slide si no se ha respondido el la actividad de la primera slide*/
    checkAnswerBtn[0].addEventListener('click', ()=>{
        isAnswered = true;

        actionBtn();
    })

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

        if(questionContainer[0].style.display === 'none'){
            $('.qs-progress .h5p-question-prev')[0].style.pointerEvents = 'auto';
            $('.qs-progress .h5p-question-next')[0].style.pointerEvents = 'none';
            progressDot[1].style.pointerEvents = 'auto';
        }else if(questionContainer[1].style.display === 'none' && isAnswered){
            $('.qs-progress .h5p-question-prev')[0].style.pointerEvents = 'none';
            $('.qs-progress .h5p-question-next')[0].style.pointerEvents = 'auto';
            progressDot[1].style.pointerEvents = 'auto';
        }else if(questionContainer[1].style.display === 'none' && !isAnswered){
            $('.qs-progress .h5p-question-prev')[0].style.pointerEvents = 'none';
            $('.qs-progress .h5p-question-next')[0].style.pointerEvents = 'none';
            progressDot[1].style.pointerEvents = 'none';
        }
    }

    qsProgress.addEventListener('click', actionBtn);

    qCheck.each((i,el)=>{
        el.addEventListener('click', ()=>{
            setTimeout(() => {
                const qFinish = $('.h5p-question-finish')[0] || null;
                if(qFinish !== null){
                    qFinish.addEventListener('click', ()=>{
                        $('.questionset-results').find('.qs-retrybutton')[0].addEventListener('click', ()=>{
                            isAnswered = false;
                            actionBtn();
                        });
                    })
                }
            }, 500);
        })
    });

    //Funcionalidad de que permita que al retornar un elemento draggable a su lugar de origen
    //este vuelva a su color original (quita la clase "dropped" al elemento), ya que de forma 
    //normal no lo hace o hay un error en aplicarlo
    const draggables = $('.h5p-draggable');
    const classToDetect = 'h5p-dropped';

    let leftCurrent = 0,
        topCurrent = 0,
        inits = [];

    //Se toman las posiciones iniciales de todos los elementos arrastrables
    $(draggables).each((i,draggable)=> inits.push(draggable.getBoundingClientRect()));

    //Cada elemento arrastrable tendra asociado un observador que 
    //estará revisando si el elemento tiene la clase "h5p-dropped"
    draggables.each((i, draggable) => {
        const draggableObserver = new MutationObserver(function(mutationList, observer) {
            for(const mutation of mutationList){
                if(mutation.type === 'attributes' && mutation.attributeName === 'class'){
                    const currentClasses = draggable.classList;

                    //Si el elemento tiene la clase observada va a estar revisando la
                    //posición del elemento para asegurarse si esta en alguna zona
                    //drop o de vuelta en su posición incial.
                    if(currentClasses.contains(classToDetect)){
                        leftCurrent = draggable.getBoundingClientRect().left;
                        topCurrent = draggable.getBoundingClientRect().top;

                        let progressDot = $('.progress-dot');
                        
                        $(inits).each((i,init)=>{
                            /*if(leftCurrent >= init.left-5 && leftCurrent <= init.right || topCurrent >= init.top-5 && topCurrent <= init.bottom){
                                console.log('En posicion inicial');
                                draggable.classList.remove('h5p-dropped');
                                draggable.style.background = 'linear-gradient(rgb(255,248,65) 0%, rgb(251,211,71) 90%)';
                            }*/
                            if(progressDot[0].classList.contains('.current')){
                                console.log('slide 1')
                                if(leftCurrent >= init.left-5 && leftCurrent <= init.right){
                                    draggable.classList.remove('h5p-dropped');
                                    draggable.style.background = 'linear-gradient(rgb(255,248,65) 0%, rgb(251,211,71) 90%)';
                                }   
                            }else if(progressDot[1].classList.contains('.current')){
                                console.log('slide 2')
                                if(topCurrent >= init.top-5 && topCurrent <= init.bottom){
                                    draggable.classList.remove('h5p-dropped');
                                    draggable.style.background = 'linear-gradient(rgb(255,248,65) 0%, rgb(251,211,71) 90%)';
                                }   
                            }
                        });
                    }
                }
            }
        });

        draggableObserver.observe(draggable, { attributes: true });
    });

    actionBtn();
});