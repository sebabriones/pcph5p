jQuery(document).ready(()=>{
    const d = document;

    //****Customize Course presentation****

    $('.h5p-footer').css({'display':'none'});
    $('.h5p-cp-navigation').css({'display':'none'});

    const checkBtnContainer = d.createElement('div'),
          checkBtn = d.createElement('div'),
          summarySlide = $('.progressbar-part-summary-slide'),
          slide = $('#slide-0');

    $(checkBtnContainer).addClass('check-btn-container');
    $(checkBtn).html('Comprobar').addClass('check-btn');

    checkBtnContainer.appendChild(checkBtn);
    d.querySelector('.h5p-container').appendChild(checkBtnContainer);

    $(checkBtn).click(()=>{
        $('.h5p-dragquestion .h5p-question-buttons .h5p-question-check-answer').click();
        $('.h5p-mark-the-words .h5p-question-buttons .h5p-question-check-answer').click();
        setTimeout(() => {
            summarySlide[0].children[0].click();
        }, 500);
    });

    const slideObserver = new MutationObserver(function(mutationList, observer) {
        for(const mutation of mutationList){
            if(mutation.type === 'attributes' && mutation.attributeName === 'class'){
                const currentClasses = slide[0].classList;
                if(currentClasses.contains('h5p-current')){
                    console.log('esta en diapo 1');
                    $(checkBtn).css('visibility','visible');
                }else{
                    console.log('esta en diapo resume');
                    $(checkBtn).css('visibility','hidden');
                }
            }
        }
    });

    slideObserver.observe(slide[0], { attributes: true });    

    //****Customize Drag And Drop****

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
                        
                        $(inits).each((i,init)=>{
                            if(leftCurrent >= init.left-5 && leftCurrent <= init.right && topCurrent >= init.top-5 && topCurrent <= init.bottom){
                                //console.log('En posicion inicial');
                                draggable.classList.remove('h5p-dropped');
                                draggable.style.background = 'linear-gradient(rgb(255,248,65) 0%, rgb(251,211,71) 90%)';
                            }
                        });
                    }
                }
            }
        });

        draggableObserver.observe(draggable, { attributes: true });
    });

    //****Customize Mark the words****

    //Funcionalidad que al momento de seleccionar (marcar) una palabra deselecciona las demás o las especificadas
    const selWords = $('.h5p-word-selectable-words [role=option]');

    selWords.each((i,word) => {
        $(word).click(()=>{
            if(i%2 == 0){
                selWords[i+1].attributes['aria-selected'].value = "false";
            }
            if(!(i%2 == 0)){
                selWords[i-1].attributes['aria-selected'].value = "false";
            }
        })
    });
});