jQuery(document).ready(()=>{
    /*Posiciona las flechas del footer de navegación a los costados de la navegación (puntos)
    y cuando se hayan respondido todas las slides envía de forma automática al slide de resumen*/

    const d = document;

    $('.h5p-footer').css({'display':'none'});
    $('.h5p-tooltip').css({'display':'none'});

    const h5pNavigation = $('.h5p-cp-navigation')[0],
          btnPrev = $('.h5p-footer-previous-slide')[0],
          btnNext = $('.h5p-footer-next-slide')[0],
          taskAnswered = $('.h5p-progressbar-part-has-task'),
          slides = $('.h5p-slides-wrapper')[0].children,
          summarySlide = $('.progressbar-part-summary-slide');

    summarySlide.css({'display':'none'});

    h5pNavigation.children[0].parentNode.insertBefore(btnPrev, h5pNavigation.children[0]);
    h5pNavigation.appendChild(btnNext);

    //Si la diapo que se esta observando es la ultima antes del summary, bloquea el boton de avanzar
    const observerSlides = new MutationObserver((mutationList, observerInstance)=>{
        if($('.h5p-current')[0].id == slides[slides.length-2].id){
            $('.h5p-footer-next-slide').css({'pointer-events':'none'});
        }else{
            $('.h5p-footer-next-slide').css({'pointer-events':'auto'});
        }

        /*if($('.h5p-current')[0].id == 'slide-undefined'){
            $('.h5p-footer-button').css({'visibility':'hidden'});
            $('.h5p-progressbar').css({'visibility':'hidden'});
        }*/
    })

    $(slides).each((i,el)=>{
        observerSlides.observe(el, {
            attributes: true,
            attributeFilter: ['class'],
            attributeOldValue: true
        })
    });
    
    //Si se responden todas las diapos aparece el boton de "terminar"
    //para ir al slide de resumen
    const observerAnswered = new MutationObserver((mutationList, observerInstance)=>{
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
    });
});