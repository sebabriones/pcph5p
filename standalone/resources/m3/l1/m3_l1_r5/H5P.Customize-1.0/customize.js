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
        }, 2000);
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