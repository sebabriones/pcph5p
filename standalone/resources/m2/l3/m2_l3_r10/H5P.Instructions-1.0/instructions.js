jQuery(document).ready(() => {
  const instructions = `Observa la distribución de colores en los tres primeros cohetes; todos siguen el patron de cuatro colores: rojo, azul, verde y amarillo.<br>Para el cuarto cohete, asegúrate de que ningún color se repita en la misma parte del cuerpo que en los anteriores.<br><br>Desplaza hacia la izquierda o derecha cada parte del cuerpo del cuarto cohete hasta obtener el patrón correcto.`;

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