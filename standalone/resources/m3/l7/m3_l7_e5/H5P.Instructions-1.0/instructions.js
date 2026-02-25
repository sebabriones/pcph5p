jQuery(document).ready(()=>{
    const instructions = `En la actividad anterior, Gabriela diseñó una alarma que sugería actividades según la hora del día. El programa debía interpretar correctamente los intervalos horarios y asignar una actividad específica, como estudiar, asistir a clases o descansar. <br><br>
                          Ahora, Gabriela quiere un programa que no sólo le indique la actividad, sino que también cumpla con los siguientes requerimientos:
                          <ol style="text-align:left;margin-top:0.5em;">
                            <li style="list-style-position: inside;">Preguntar día de la semana. (1=Lunes, 7= Domingo).</li>
                            <li style="list-style-position: inside;">Cambiar las actividades y horarios si es sábado o domingo.<img src="resources/m3/l7/m3_l7_e5/content/images/m3l7e5.png" alt="image" width="30%"><br></li>
                            <li style="list-style-position: inside;">Validar que la hora ingresada esté entre 0 y 23.</li>
                            <li style="list-style-position: inside;">Preguntar al usuario si es feriado, solicitando que responda con un <strong>“sí”</strong> o un <strong>“no”</strong>. En caso de que la respuesta sea “sí”, el programa asignará todas las actividades como “Descanso” ese día.</li>
                          </ol>
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

    $('.intro-btn').on('click',(e)=>{
        $('.intro').animate({
                marginTop:`-${$('.h5p-container').outerHeight()}px`,
        }, 1000);

        setTimeout(() => {
            $('.intro').css({'display':'none'});
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

    $('.instructions-btn').on('click',(e)=>{
        e.preventDefault();

        if(parseInt($('.custom-instructions').css('margin-top').split("px")[0]) == 0){
            $('.custom-instructions').animate({
                marginTop:`-${$('.tab-content').outerHeight()}px`,
            }, 1000);
        }else if(parseInt($('.custom-instructions').css('margin-top').split("px")[0]) < 0){
            $('.custom-instructions').animate({
                marginTop:'0',
            }, 1000);
        }
    });

    setTimeout(() => {
        $('.custom-instructions').animate({
            marginTop:`-${$('.tab-content').outerHeight()}px`,
        }, 1000);
    }, 500);
});