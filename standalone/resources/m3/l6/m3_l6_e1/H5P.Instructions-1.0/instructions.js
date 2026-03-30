jQuery(document).ready(() => {
  const instructions = `Se necesita crear una lista semanal de compras que no tenga productos duplicados y que permita determinar el valor del gasto total para los siguientes productos: pan, leche, queso y jugo, sabiendo que el precio de ellos es $1000, $800, $1500 y $1200, respectivamente.<br><br>
                        Observa el siguiente código:<br>
                        <img src="resources/m3/l6/m3_l6_e1/content/images/m3l6e1.png" alt="image" width="60%" style="margin: 2% 25%;"><br>
                        <ol style="text-align:left;margin-top:0.5em;">
                          <li style="list-style-position: inside;">Ejecuta este código. (Disponible en consola python en 💡 Cargar ejemplo)</li>
                          <li style="list-style-position: inside;">Responde las preguntas que vienen a continuación:
                            <ol type="a" style="text-align:left;margin-top:0.5em;">
                              <li style="list-style-position: inside;">¿Obtienes una lista de compras? ¿Qué errores hay en el código respecto a lo pedido?</li>
                              <li style="list-style-position: inside;">¿Cómo se puede escribir un código que ayude a solucionar estos errores? Imagina que son 1000 productos y eliminar valores repetidos uno a uno no es una opción viable. ¿Qué podríamos hacer?</li>
                            </ol>
                          </li>
                          <li style="list-style-position: inside;">Escribe un código que permita eliminar los datos duplicados, que no se repitan precios para el cálculo del precio total y que nos muestre en pantalla la lista de productos y el precio total.
                            <ol type="a" style="text-align:left;margin-top:0.5em;">
                              <li style="list-style-position: inside;">¿Cómo podrías adaptar tu código para que funcione con listas mucho más grandes sin perder claridad ni eficiencia? ¿Qué cambios harías si tuvieras que procesar datos de 10,000 productos?</li>
                              <li style="list-style-position: inside;">¿Qué parte del código te pareció más desafiante de escribir o entender? ¿Cómo lo resolviste y qué aprendiste en el proceso?</li>
                            </ol>
                          </li>
                        </ol>
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