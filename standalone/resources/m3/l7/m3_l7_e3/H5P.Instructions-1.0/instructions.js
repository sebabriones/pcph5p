jQuery(document).ready(() => {
  const instructions = `En la lección anterior, Andrea organizó su tiempo de estudio semanal para tres asignaturas específicas: Álgebra, Física y Química. Utilizó porcentajes fijos para distribuir 12 horas, según la dificultad que cada asignatura representaba para ella.<br><br>
                        Sin embargo, Andrea se dio cuenta de que a veces <strong>cambia su horario total de estudio</strong> (puede ser 8, 10 o 15 horas según la semana) y <strong>modifica las prioridades</strong> de las asignaturas, por lo que necesita hacer un programa más completo.<br><br>
                        El programa debe:
                        <ol style="text-align:left;margin-top:0.5em;">
                          <li style="list-style-position: inside;">Pedir al usuario <strong>cuántas horas totales tiene disponibles</strong> para estudiar en la semana.</li>
                          <li style="list-style-position: inside;">Pedir al usuario el <strong>nombre y porcentaje de prioridad</strong> para cada asignatura (pueden ser 3, 4 o más asignaturas).</li>
                          <li style="list-style-position: inside;">Calcular y mostrar cuántas horas corresponden a cada asignatura, <strong>redondeadas a 1 decimal</strong>.</li>
                          <li style="list-style-position: inside;">Verificar que la suma total de horas calculadas sea igual a las horas disponibles (dentro de un margen de 0.1 por redondeo).</li>
                          <li style="list-style-position: inside;">Mostrar un mensaje de error y no calcular nada si la suma de los porcentajes ingresados <strong>no es 100</strong>.</li>
                        </ol>
                        Sugerencias:
                        <ul style="text-align:left;margin-top:0.5em;">
                          <li style="list-style-position: inside;">Usar listas para almacenar nombres y porcentajes.</li>
                          <li style="list-style-position: inside;">Recorrer las listas con un bucle para calcular las horas.</li>
                          <li style="list-style-position: inside;">Validar datos: horas totales > 0 y porcentajes > 0.</li>
                          <li style="list-style-position: inside;">Tener cuidado con el redondeo: sumar horas redondeadas puede dar una diferencia pequeña.</li>
                        </ul>
                        <strong>Botones Terminal Python:</strong>
                        <ul style="text-align:left;">
                          <li style="list-style-position: inside;">▶️ Ejecutar: Ejecuta el código.</li>
                          <li style="list-style-position: inside;">💾 Enviar: Envía el código para ser revisado y calificado.</li>
                          <li style="list-style-position: inside;">🗑️ Limpiar: Limpia la consola.</li>
                          <li style="list-style-position: inside;">📁 Cargar archivo(s): Carga archivos almacenados en su equipo.</li>
                          <li style="list-style-position: inside;">💡 Cargar ejemplo: Carga uno o varios ejemplos de código.</li>
                        </ul>
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