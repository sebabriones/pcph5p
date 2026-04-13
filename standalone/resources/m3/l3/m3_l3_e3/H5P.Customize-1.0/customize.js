jQuery(document).ready(() => {
    /* Posiciona las flechas del footer de navegación a los costados de la navegación (puntos)
       y cuando estén realmente completadas las tareas (verbo xAPI "answered", no solo "interacted")
       permite ir al slide de resumen con "Terminar". */

    const d = document;
    const ENDING_POINT = 'http://id.tincanapi.com/extension/ending-point';
    const H5P_SUBCONTENT_ID = 'http://h5p.org/x-api/h5p-subContentId';
    const VERB_ANSWERED = 'http://adlnet.gov/expapi/verbs/answered';
    const TRACKED_LIBRARIES = new Set([
        'H5P.Blanks',
        'H5P.SingleChoiceSet',
        'H5P.MultiChoice',
        'H5P.TrueFalse',
        'H5P.DragText',
        'H5P.DragQuestion',
        'H5P.MarkTheWords',
        'H5P.Essay',
        'H5P.SortParagraphs'
    ]);

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

    /** Fallback: slides (1-based) donde CP añade ending-point y hubo answered */
    const answeredStrictSlides = new Set();
    /** Mapa de tareas esperadas por slide (slide 1-based -> Set<subContentId>) */
    const expectedTasksBySlide = new Map();
    /** Mapa de tareas respondidas por slide (slide 1-based -> Set<subContentId>) */
    const answeredTasksBySlide = new Map();

    function getLibraryMachineName(library) {
        if (!library || typeof library !== 'string') {
            return '';
        }
        return library.split(' ')[0];
    }

    function shouldTrackAction(action) {
        if (!action || !action.subContentId || !action.library) {
            return false;
        }
        const machineName = getLibraryMachineName(action.library);
        return TRACKED_LIBRARIES.has(machineName);
    }

    function collectExpectedSubContentIdsForAction(action) {
        const ids = new Set();
        if (!action || !action.library) {
            return ids;
        }

        const machineName = getLibraryMachineName(action.library);
        if (machineName === 'H5P.SingleChoiceSet') {
            const choices =
                action &&
                action.params &&
                Array.isArray(action.params.choices) &&
                action.params.choices;

            if (choices && choices.length) {
                choices.forEach(function (choice) {
                    if (choice && choice.subContentId) {
                        ids.add(choice.subContentId);
                    }
                });
            }
        }

        if (!ids.size && action.subContentId) {
            ids.add(action.subContentId);
        }

        return ids;
    }

    function getSubContentIdFromStatement(stmt) {
        const definitionExtensions =
            stmt &&
            stmt.object &&
            stmt.object.definition &&
            stmt.object.definition.extensions;

        const extensionSubContentId =
            definitionExtensions && definitionExtensions[H5P_SUBCONTENT_ID];
        if (extensionSubContentId) {
            return extensionSubContentId;
        }

        const objectId = stmt && stmt.object && stmt.object.id;
        if (typeof objectId !== 'string') {
            return '';
        }

        const subContentMatch = objectId.match(/[?&]subContentId=([^&#]+)/);
        if (!subContentMatch || !subContentMatch[1]) {
            return '';
        }

        try {
            return decodeURIComponent(subContentMatch[1]);
        } catch (e) {
            return subContentMatch[1];
        }
    }

    function getCoursePresentationParamsFromIntegration() {
        if (
            typeof H5PIntegration === 'undefined' ||
            !H5PIntegration ||
            !H5PIntegration.contents
        ) {
            return null;
        }

        const contentKeys = Object.keys(H5PIntegration.contents);
        for (let i = 0; i < contentKeys.length; i += 1) {
            const content = H5PIntegration.contents[contentKeys[i]];
            if (!content || !content.jsonContent) {
                continue;
            }

            let parsed = content.jsonContent;
            if (typeof parsed === 'string') {
                try {
                    parsed = JSON.parse(parsed);
                } catch (e) {
                    continue;
                }
            }

            if (parsed && parsed.presentation && Array.isArray(parsed.presentation.slides)) {
                return parsed;
            }
        }

        return null;
    }

    function buildExpectedTasksBySlide() {
        expectedTasksBySlide.clear();

        const params = getCoursePresentationParamsFromIntegration();
        if (!params || !params.presentation || !Array.isArray(params.presentation.slides)) {
            return;
        }

        params.presentation.slides.forEach(function (slide, index) {
            const slideNum = index + 1;
            const taskIds = new Set();

            if (!slide || !Array.isArray(slide.elements)) {
                return;
            }

            slide.elements.forEach(function (element) {
                const action = element && element.action;
                if (!shouldTrackAction(action)) {
                    return;
                }
                const expectedIds = collectExpectedSubContentIdsForAction(action);
                expectedIds.forEach(function (id) {
                    taskIds.add(id);
                });
            });

            if (taskIds.size) {
                expectedTasksBySlide.set(slideNum, taskIds);
            }
        });
    }

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
            const expectedForSlide = expectedTasksBySlide.get(n);
            if (expectedForSlide && expectedForSlide.size) {
                const answeredForSlide = answeredTasksBySlide.get(n);
                return (
                    answeredForSlide instanceof Set &&
                    answeredForSlide.size >= expectedForSlide.size
                );
            }
            return answeredStrictSlides.has(n);
        });
        $(finishBtn).css('visibility', done ? 'visible' : 'hidden');
    }

    function resetAnswerTracking() {
        answeredStrictSlides.clear();
        answeredTasksBySlide.clear();
        syncFinishButtonVisibility();
    }

    /**
     * CP marca la barra con "interacted"/"attempted" usando getAnswerGiven(), que en DragShuffle
     * es true tras el primer arrastre. Solo el verbo xAPI "answered" implica Comprobar enviado
     * (o cierre real en Single Choice, etc.).
     */
    buildExpectedTasksBySlide();

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

            const answeredSubContentId = getSubContentIdFromStatement(stmt);
            if (answeredSubContentId) {
                const expectedForSlide = expectedTasksBySlide.get(slideNum);
                if (expectedForSlide && expectedForSlide.has(answeredSubContentId)) {
                    if (!answeredTasksBySlide.has(slideNum)) {
                        answeredTasksBySlide.set(slideNum, new Set());
                    }
                    answeredTasksBySlide.get(slideNum).add(answeredSubContentId);
                }
            }

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
