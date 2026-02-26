jQuery(document).ready(() => {
  const instructions = `En la lección anterior, el centro cultural Mundo Feliz organizaba funciones de cine clasificando las películas por género. El programa debía recorrer dos listas paralelas y mostrar las películas agrupadas correctamente.<br><br>
                        Ahora, hay un nuevo desafío. En Mundo Feliz quieren preparar la cartelera del mes. Ya tienen dos listas paralelas: peliculas y generos (misma posición = mismo ítem). Sin embargo, además de ver las películas por género, ahora necesitan permitir consultar por un género, contar cuántas hay por género seleccionado y buscar por palabra clave dentro de los títulos (sin distinguir mayúsculas/minúsculas).<br><br>
                        Considera las siguientes listas de películas y géneros:
                        <ul style="text-align:left;margin-top:0.5em;">
                          <li style="list-style-position: inside;">peliculas = ["Shrek", "Titanic", "Batman", "Intensamente 2", "Jumanji", "Matrix"]</li>
                          <li style="list-style-position: inside;">generos = ["Animación", "Drama", "Acción", "Animación", "Comedia", "Acción"]</li>
                        </ul>
                        Escribe un programa que:
                        <ol style="text-align:left;margin-top:0.5em;">
                          <li style="list-style-position: inside;">Muestre un menú simple con tres opciones:
                            <ul style="text-align:left;margin-top:0.5em;">
                              <li style="list-style-position: inside;">(a) Ver películas por uno o varios géneros (el usuario ingresa, por ejemplo: Acción, Comedia).</li>
                              <li style="list-style-position: inside;">(b) Buscar por palabra clave en los títulos (por ejemplo: bat encuentra “Batman”).</li>
                              <li style="list-style-position: inside;">(c) Salir.</li>
                            </ul>
                          </li>
                          <li style="list-style-position: inside;">Para la opción (a):
                            <ul style="text-align:left;margin-top:0.5em;">
                              <li style="list-style-position: inside;">Imprima las películas del género solicitado.</li>
                              <li style="list-style-position: inside;">Al final, muestre el conteo total de películas encontradas para el género pedido.</li>
                              <li style="list-style-position: inside;">Si un género no existe en la lista, indica el mensaje para evitar que el programa falle.</li>
                            </ul>
                          </li>
                          <li style="list-style-position: inside;">Para la opción (b):
                            <ul style="text-align:left;margin-top:0.5em;">
                              <li style="list-style-position: inside;">Pida una palabra clave y muestre todas las coincidencias en títulos (búsqueda insensible a mayúsculas).</li>
                              <li style="list-style-position: inside;">Si no hay coincidencias, muestre un mensaje claro.</li>
                            </ul>
                          </li>
                        </ol>
                        <strong>Consejo: </strong>No uses estructuras avanzadas; puedes resolver este ejercicio solo con listas, cadenas, bucles, condicionales y funciones.<br><br>
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