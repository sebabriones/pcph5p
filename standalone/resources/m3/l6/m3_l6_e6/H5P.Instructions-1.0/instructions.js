jQuery(document).ready(() => {
  const instructions = `El centro cultural Mundo Feliz organiza funciones de cine por género (Animación, Drama, Acción y Comedia). Reciben una lista de títulos y su género para organizar la cartelera.<br><br>
                        La empleada del mes, Marcela, creó el siguiente programa para clasificar las películas:<br>
                        <img src="resources/m3/l6/m3_l6_e6/content/images/m3l6e6.png" alt="image" width="80%" style="margin: 2% 10%;"><br>
                        <ol style="text-align:left;margin-top:0.5em;">
                          <li style="list-style-position: inside;">Ejecuta este código. (Disponible en consola python en 💡 Cargar ejemplo)</li>
                          <li style="list-style-position: inside;">Responde: ¿Qué ocurre?, ¿qué errores detectas?</li>
                          <li style="list-style-position: inside;">Corrige el código para que recorra correctamente las listas películas y géneros, y que muestre todas las películas agrupadas por género.</li>
                          <li style="list-style-position: inside;">Evita comparaciones erróneas (no compares una lista completa con una cadena).</li>
                        </ol>
                        <br>
                        <strong>Botones Terminal Python:</strong>
                        <ul style="text-align:left;">
                          <li style="list-style-position: inside;">▶️ Ejecutar: Ejecuta el código.</li>
                          <li style="list-style-position: inside;">💾 Enviar: Envía el código para ser revisado y calificado.</li>
                          <li style="list-style-position: inside;">🗑️ Limpiar: Limpia la consola.</li>
                          <li style="list-style-position: inside;">📁 Cargar archivo(s): Carga archivos almacenados en su equipo.</li>
                          <li style="list-style-position: inside;">💡 Cargar ejemplo: Carga uno o varios ejemplos de código.</li>
                        </ul>`;

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