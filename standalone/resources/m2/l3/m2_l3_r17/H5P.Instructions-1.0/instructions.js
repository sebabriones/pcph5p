jQuery(document).ready(() => {
  const instructions = `La facultad de Ciencias Físicas analiza el rendimiento de sus estudiantes en Física y Cálculo. Además, se considera la actitud frente al aprendizaje, que se infiere según el patrón de notas.<br><strong>Muestra de estudiantes de segundo año:</strong><ul class="unordered-list"><li><strong>Ana:</strong> Física 2.5, Cálculo 5.6</li><li><strong>Luis:</strong> Física 2.9, Cálculo 5.0</li><li><strong>Marta:</strong> Física 4.2, Cálculo 4.0</li><li><strong>Pedro:</strong> Física 3.0, Cálculo 3.8</li><li><strong>Carla:</strong> Física 5.4, Cálculo 3.7</li></ul><strong>Criterios para clasificar:</strong><ol type="i" class="unordered-list"><li>Categoría de rendimiento académico<ul><li>Aprobado en ambas (≥4.0 en ambas).></li><li>Aprobado sólo en Cálculo.</li><li>Aprobado sólo en Física.</li><li>Reprobado en ambas.</li></ul></li><li>Enfoque de estudio (inferida)<ul><li><strong>Motivado:</strong> Aprobada en ambas con ≥ 6.0.</li><li><strong>Proactivo:</strong> Notas equilibradas con ≥ 4.0 en ambas materias.</li><li><strong>Pasivo:</strong> Diferencia marcada entre materias con una < 4.0 y otra ≥ 5.0</li><li><strong>Crítico:</strong> Bajo rendimiento general (< 4.0 en ambas).</li></ul></li></ol>`;

  /////////////////////////INTRO CON INSTRUCCIONES////////////////////////////
  $('body').prepend(`<div class="intro">
                        <div class="text-content">
                          <div class="intro-text">${instructions}</div>
                          <a class="intro-btn">Comenzar</a>
                        </div>
                      </div>`);

  $('.intro-btn').on('click', () => {
    $('.intro').animate(
      {
        marginTop: `-${$('.h5p-container').outerHeight()}px`,
      },
      1000
    );

    setTimeout(() => {
      $('.intro').css({ display: 'none' });
    }, 1000);
  });

  /////////////////////////PESTAÑA CON INSTRUCCIONES PARA H5P/////////////////////////////
  $('.h5p-content').prepend(`<div class="custom-instructions">
                                <div class="tab-container">
                                  <div id="tab" class="tab">
                                    <div class="tab-content">
                                      <div class="instructions-text">${instructions}</div>
                                    </div>
                                    <a class="instructions-btn" href="">Instrucciones</a>
                                  </div>
                                </div>
                              </div>`);

  const $instructions = $('.custom-instructions').first();
  if (!$instructions.length) {
    return;
  }
  const BASE_WIDTH = 900;
  const MIN_SCALE = 0.45;
  const MAX_SCALE = 1;

  const getClosedOffset = () => {
    const $button = $instructions.find('.instructions-btn').first();
    const buttonPosition = $button.position();
    const top = (buttonPosition && buttonPosition.top) || 0;
    return -top;
  };

  const isClosed = () => parseFloat($instructions.css('margin-top')) < 0;

  const updateInstructionsScale = () => {
    const $container = $instructions
      .closest('.h5p-content')
      .find('.h5p-container')
      .first();
    const containerWidth = $container.outerWidth() || BASE_WIDTH;
    const scale = Math.max(
      MIN_SCALE,
      Math.min(MAX_SCALE, containerWidth / BASE_WIDTH)
    );
    $instructions.css('--ins-scale', scale.toFixed(4));

    if (isClosed()) {
      $instructions.css('margin-top', `${getClosedOffset()}px`);
    }
  };

  $('.instructions-btn').on('click', (e) => {
    e.preventDefault();

    if (parseFloat($instructions.css('margin-top')) === 0) {
      $instructions.animate(
        {
          marginTop: `${getClosedOffset()}px`,
        },
        1000
      );
    } else {
      $instructions.animate(
        {
          marginTop: '0',
        },
        1000
      );
    }
  });

  setTimeout(() => {
    updateInstructionsScale();
    $instructions.animate(
      {
        marginTop: `${getClosedOffset()}px`,
      },
      1000
    );
  }, 500);

  $(window).on('resize', updateInstructionsScale);

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(updateInstructionsScale);
    const containerNode = $instructions
      .closest('.h5p-content')
      .find('.h5p-container')
      .get(0);

    if (containerNode) {
      observer.observe(containerNode);
    }
  }
});