jQuery(document).ready(()=>{
    const d = document;

    //****Customize Course presentation****

    //$('.h5p-footer').css({'display':'none'});
    //$('.h5p-cp-navigation').css({'display':'none'});

    const checkBtn = d.createElement('div');

    $(checkBtn).html('hola').addClass('hola-btn').attr('style','display:inline-block;cursor:pointer;z-index:100;background:red;top:19em;right:-36em;position:relative;');

    d.querySelector('#slide-0 div').appendChild(checkBtn);

    $(checkBtn).click(()=>{
        //console.log($('.h5p-dragquestion .h5p-question-buttons .h5p-question-check-answer'));
        //console.log($('.h5p-mark-the-words .h5p-question-buttons .h5p-question-check-answer'));
        $('.h5p-dragquestion .h5p-question-buttons .h5p-question-check-answer').click();
        $('.h5p-mark-the-words .h5p-question-buttons .h5p-question-check-answer').click();
        setTimeout(() => {
            $('.progressbar-part-summary-slide a').click();
            console.log('hola');
        }, 1000);
    });

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


    ///////////////////////////////////////////////////////////////////////////////
    /*Posiciona las flechas del footer de navegación a los costados de la navegación (puntos)
    y cuando se hayan respondido todas las slides envía de forma automática al slide de resumen*/

    /*COMIENZO$('.h5p-footer').css({'display':'none'});
    $('.h5p-tooltip').css({'display':'none'});

    const h5pNavigation = $('.h5p-cp-navigation')[0],
          btnPrev = $('.h5p-footer-previous-slide')[0],
          btnNext = $('.h5p-footer-next-slide')[0],
          taskAnswered = $('.h5p-progressbar-part-has-task'),
          slides = $('.h5p-slides-wrapper')[0].children,
          summarySlide = $('.progressbar-part-summary-slide');

    summarySlide.css({'display':'none'});

    h5pNavigation.children[0].parentNode.insertBefore(btnPrev, h5pNavigation.children[0]);
    h5pNavigation.appendChild(btnNext);FIN*/

    //Si la diapo que se esta observando es la ultima antes del summary, bloquea el boton de avanzar
    /*COMIENZOconst observerSlides = new MutationObserver((mutationList, observerInstance)=>{
        if($('.h5p-current')[0].id == slides[slides.length-2].id){
            $('.h5p-footer-next-slide').css({'pointer-events':'none'});
        }else{
            $('.h5p-footer-next-slide').css({'pointer-events':'auto'});
        }FIN*/

        /*if($('.h5p-current')[0].id == 'slide-undefined'){
            $('.h5p-footer-button').css({'visibility':'hidden'});
            $('.h5p-progressbar').css({'visibility':'hidden'});
        }*/
    /*COMIENZO})

    $(slides).each((i,el)=>{
        observerSlides.observe(el, {
            attributes: true,
            attributeFilter: ['class'],
            attributeOldValue: true
        })
    });FIN*/
    
    //Si se responden todas las diapos aparece el boton de "terminar"
    //para ir al slide de resumen
    /*const observerAnswered = new MutationObserver((mutationList, observerInstance)=>{
        if($('.h5p-answered').length == taskAnswered.length){
            //Simula click a botón de summary
            summarySlide[0].children[0].click();

            //Oculta el menú de navegación
            $('.h5p-footer-button').css({'visibility':'hidden'});
            $('.h5p-progressbar').css({'visibility':'hidden'});

            //Si se hace clic en botón de "Intentar de nuevo" vuelve a mostrar el menú de navegación
            $('.h5p-cp-retry-button').on('click', ()=>{
                $('.h5p-footer-button').css({'visibility':'visible'});
                $('.h5p-progressbar').css({'visibility':'visible'});
            });
        }
    })

    $(taskAnswered).each((i,el)=>{
        observerAnswered.observe(el, {
            attributes: true,
            attributeFilter: ['class'],
            attributeOldValue: true
        })
    });*/
});