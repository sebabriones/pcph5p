jQuery(document).ready(() => {
  const instructions = `Una plataforma de reparto de comida debe asignar repartidores a pedidos en tiempo real. El problema es que:
                        <ul style='text-align:left;'><li>Algunos repartidores aceptan pedidos y luego los cancelan por falta de cobertura.</li><li>Hay pedidos urgentes (por clientes VIP o comida caliente que no puede esperar).</li><li>Algunos repartidores tardan mucho en confirmar el pedido, retrasando la entrega.</li></ul>
                        <strong>Objetivo del algoritmo: </strong>asignar repartidores de manera rápida, justa y eficiente, evitando retrasos y funcionando aunque cambie el número de repartidores, pedidos o criterios (generalidad).<br><br>
                        <strong>Datos de entrada (para cada pedido): </strong>Cada solicitud tiene
                        <ol style='text-align:left;'><li>pedido_id</li><li>hora_estimada_entrega</li><li>distancia_cliente (en km)</li><li>prioridad (1=baja, 2=media, 3=alta)</li><li>historial_cancelaciones_repartidor (veces que canceló en el último mes)</li></ol>
                        <strong>Restricciones: </strong>
                        <ul style='text-align:left;'><li>Un pedido no puede ser asignado a más de un repartidor.</li><li>Un repartidor no puede tener dos pedidos simultáneos.</li><li>Si hay conflicto, se debe decidir con una regla clara y sin ambigüedad.</li><li>El sistema debe priorizar pedidos urgentes para minimizar retrasos.</li><li>Si el repartidor no confirma en el tiempo establecido, se libera el pedido para reasignación.</li></ul>
                        <strong>Parte 1 (ordenar secuencia): </strong>Ordena los siguientes bloques para construir un algoritmo completo.<br><br>
                        <strong>Parte 2 Completación de plantilla (arrastrar y soltar): </strong>Completa la plantilla de algoritmo usando el banco de fragmentos. Mueve a cada espacio en blanco el fragmento que corresponda.
                        `;

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