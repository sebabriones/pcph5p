jQuery(document).ready(() => {
    /* Posiciona las flechas del footer de navegación a los costados de la navegación (puntos)
       y cuando estén realmente completadas las tareas (verbo xAPI "answered", no solo "interacted")
       permite ir al slide de resumen con "Terminar". */

    const d = document;
    const ENDING_POINT = 'http://id.tincanapi.com/extension/ending-point';
    const VERB_ANSWERED = 'http://adlnet.gov/expapi/verbs/answered';

    $('.h5p-footer').css({ display: 'none' });
    $('.h5p-tooltip').css({ display: 'none' });

    const h5pNavigation = $('.h5p-cp-navigation')[0],
        btnPrev = $('.h5p-footer-previous-slide')[0],
        btnNext = $('.h5p-footer-next-slide')[0],
        slides = $('.h5p-slides-wrapper')[0] && $('.h5p-slides-wrapper')[0].children,
        summarySlide = $('.progressbar-part-summary-slide'),
        divContainer = d.createElement('div'),
        finishBtnContainer = d.createElement('div'),
        finishBtn = d.createElement('div');

    if (!h5pNavigation || !btnPrev || !btnNext || !slides || !slides.length) {
        return;
    }

    summarySlide.css({ display: 'none' });

    h5pNavigation.children[0].parentNode.insertBefore(btnPrev, h5pNavigation.children[0]);
    h5pNavigation.appendChild(btnNext);

    $(divContainer).addClass('div-container');
    $(finishBtnContainer).addClass('finish-btn-container');
    $(finishBtn).html('Terminar').addClass('finish-btn');

    finishBtnContainer.appendChild(finishBtn);
    h5pNavigation.insertBefore(divContainer, h5pNavigation.children[0]);
    h5pNavigation.appendChild(finishBtnContainer);

    $(finishBtn).css('visibility', 'hidden');

    /** Slides (1-based) donde CP añade ending-point y que tienen tarea */
    const answeredStrictSlides = new Set();

    function getRequiredSlideNumbers() {
        const nums = [];
        $('.h5p-progressbar .h5p-progressbar-part').each(function (idx) {
            if ($(this).find('.h5p-progressbar-part-has-task').length) {
                nums.push(idx + 1);
            }
        });
        return nums;
    }

    function syncFinishButtonVisibility() {
        const required = getRequiredSlideNumbers();
        if (!required.length) {
            $(finishBtn).css('visibility', 'hidden');
            return;
        }
        const done = required.every(function (n) {
            return answeredStrictSlides.has(n);
        });
        $(finishBtn).css('visibility', done ? 'visible' : 'hidden');
    }

    function resetAnswerTracking() {
        answeredStrictSlides.clear();
        syncFinishButtonVisibility();
    }

    /**
     * CP marca la barra con "interacted"/"attempted" usando getAnswerGiven(), que en DragShuffle
     * es true tras el primer arrastre. Solo el verbo xAPI "answered" implica Comprobar enviado
     * (o cierre real en Single Choice, etc.).
     */
    if (typeof H5P !== 'undefined' && H5P.externalDispatcher) {
        H5P.externalDispatcher.on('xAPI', function (event) {
            const stmt = event.data && event.data.statement;
            if (!stmt || !stmt.verb) {
                return;
            }
            const verbId = stmt.verb.id || '';
            if (verbId !== VERB_ANSWERED) {
                return;
            }
            const ext =
                stmt.context &&
                stmt.context.extensions &&
                stmt.context.extensions[ENDING_POINT];
            if (ext === undefined || ext === null) {
                return;
            }
            const slideNum = parseInt(ext, 10);
            if (!slideNum || slideNum !== slideNum) {
                return;
            }
            answeredStrictSlides.add(slideNum);
            syncFinishButtonVisibility();
        });
    }

    const observerSlides = new MutationObserver(() => {
        if ($('.h5p-current')[0].id === slides[slides.length - 2].id) {
            $('.h5p-footer-next-slide').css({ 'pointer-events': 'none' });
        } else {
            $('.h5p-footer-next-slide').css({ 'pointer-events': 'auto' });
        }
    });

    $(slides).each((i, el) => {
        observerSlides.observe(el, {
            attributes: true,
            attributeFilter: ['class'],
            attributeOldValue: true
        });
    });

    $(document).on('click.h5pcustomize-retry', '.h5p-cp-retry-button', function () {
        $('.h5p-footer-button').css({ visibility: 'visible' });
        $('.h5p-progressbar').css({ visibility: 'visible' });
        resetAnswerTracking();
    });

    $(finishBtn).click(() => {
        setTimeout(() => {
            summarySlide[0].children[0].click();

            $('.h5p-footer-button').css({ visibility: 'hidden' });
            $('.h5p-progressbar').css({ visibility: 'hidden' });

            $(finishBtn).css('visibility', 'hidden');
        }, 500);
    });
});
