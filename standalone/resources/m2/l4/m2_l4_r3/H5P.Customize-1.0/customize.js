jQuery(document).ready(() => {
    const classToDetect = 'h5p-dropped';
    const hiddenTooltipClass = 'custom-drag-tooltip-hidden';
    const tooltipOffset = 14;
    const viewportPadding = 8;
    const $tooltip = $('<div class="custom-drag-tooltip custom-drag-tooltip-hidden" aria-hidden="true"></div>').appendTo('body');

    const sanitizeTooltipHtml = (html) => {
        const root = document.createElement('div');
        root.innerHTML = html || '';
        const allowedTags = new Set(['UL', 'LI', 'BR', 'STRONG', 'EM', 'B', 'I', 'P', 'SPAN']);

        const sanitizeNode = (node) => {
            const children = Array.from(node.childNodes);
            children.forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    return;
                }

                if (child.nodeType !== Node.ELEMENT_NODE) {
                    child.remove();
                    return;
                }

                if (!allowedTags.has(child.tagName)) {
                    child.replaceWith(document.createTextNode(child.textContent || ''));
                    return;
                }

                Array.from(child.attributes).forEach((attr) => {
                    child.removeAttribute(attr.name);
                });

                sanitizeNode(child);
            });
        };

        sanitizeNode(root);
        return root.innerHTML;
    };

    const closeTooltip = () => {
        $tooltip.addClass(hiddenTooltipClass).attr('aria-hidden', 'true').empty();
    };

    const setTooltipPosition = (x, y) => {
        const width = $tooltip.outerWidth() || 260;
        const height = $tooltip.outerHeight() || 90;

        let left = x + tooltipOffset;
        let top = y + tooltipOffset;

        if (left + width > window.innerWidth - viewportPadding) {
            left = x - width - tooltipOffset;
        }

        if (top + height > window.innerHeight - viewportPadding) {
            top = y - height - tooltipOffset;
        }

        left = Math.max(viewportPadding, left);
        top = Math.max(viewportPadding, top);

        $tooltip.css({ left, top });
    };

    const showTooltip = ($draggable, event) => {
        const tooltipHtml = $draggable.attr('data-tooltip-html');
        if (!tooltipHtml) {
            return;
        }

        if (!$draggable.attr('data-tooltip-safe-html')) {
            $draggable.attr('data-tooltip-safe-html', sanitizeTooltipHtml(tooltipHtml));
        }

        const safeHtml = $draggable.attr('data-tooltip-safe-html');
        if (!safeHtml || !safeHtml.trim()) {
            return;
        }

        $tooltip.html(safeHtml).removeClass(hiddenTooltipClass).attr('aria-hidden', 'false');

        if (event && typeof event.clientX === 'number' && typeof event.clientY === 'number') {
            setTooltipPosition(event.clientX, event.clientY);
            return;
        }

        const rect = $draggable[0].getBoundingClientRect();
        setTooltipPosition(rect.left + (rect.width / 2), rect.top + rect.height);
    };

    const prepareDraggableForTooltip = (draggable) => {
        if (draggable.dataset.tooltipPrepared === 'true') {
            return;
        }

        const title = draggable.getAttribute('title');
        if (title && title.trim()) {
            draggable.setAttribute('data-tooltip-html', title);
            draggable.removeAttribute('title');
        }

        draggable.dataset.tooltipPrepared = 'true';
    };

    // Mantener estilo original al volver al origen.
    const attachDroppedClassObserver = (draggable) => {
        if (draggable.dataset.droppedObserverAttached === 'true') {
            return;
        }

        const initialPosition = draggable.getBoundingClientRect();
        const draggableObserver = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') {
                    return;
                }

                if (!draggable.classList.contains(classToDetect)) {
                    return;
                }

                const currentPosition = draggable.getBoundingClientRect();
                const isInInitialPosition =
                    currentPosition.left >= initialPosition.left - 5 &&
                    currentPosition.left <= initialPosition.right &&
                    currentPosition.top >= initialPosition.top - 5 &&
                    currentPosition.top <= initialPosition.bottom;

                if (isInInitialPosition) {
                    draggable.classList.remove(classToDetect);
                    draggable.style.background = 'linear-gradient(rgb(255,248,65) 0%, rgb(251,211,71) 90%)';
                }
            });
        });

        draggableObserver.observe(draggable, { attributes: true });
        draggable.dataset.droppedObserverAttached = 'true';
    };

    const wireDraggable = (draggable) => {
        prepareDraggableForTooltip(draggable);
        attachDroppedClassObserver(draggable);
    };

    $('.h5p-draggable').each((_, draggable) => {
        wireDraggable(draggable);
    });

    const draggableMutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof Element)) {
                    return;
                }

                if (node.matches('.h5p-draggable')) {
                    wireDraggable(node);
                }

                node.querySelectorAll('.h5p-draggable').forEach((draggable) => {
                    wireDraggable(draggable);
                });
            });
        });
    });

    draggableMutationObserver.observe(document.body, { childList: true, subtree: true });

    $(document)
        .on('mouseenter focusin', '.h5p-draggable', function (event) {
            showTooltip($(this), event);
        })
        .on('mousemove', '.h5p-draggable', function (event) {
            if ($tooltip.hasClass(hiddenTooltipClass)) {
                return;
            }

            setTooltipPosition(event.clientX, event.clientY);
        })
        .on('mouseleave focusout mousedown', '.h5p-draggable', () => {
            closeTooltip();
        });

    $(window).on('scroll resize', closeTooltip);
});