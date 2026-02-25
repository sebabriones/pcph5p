jQuery(document).ready(()=>{
    const instructions = `En la lección anterior, aprendiste a categorizar la asistencia de los miembros de un grupo de lectura según el número de veces que han asistido.  Ahora, el escenario es más dinámico, pues tendrás que actualizar listas, validar la asistencia mínima y realizar nuevos cálculos.<br><br>
                          Escribe un programa que permita:
                          <ol type="a" style="text-align:left;margin-top:0.5em;">
                            <li style="list-style-position: inside;">Agregar un nuevo miembro al grupo de lectura.</li>
                            <li style="list-style-position: inside;">Registra el número de asistencias  del nuevo miembro.</li>
                            <li style="list-style-position: inside;">Mostrar el porcentaje de personas del grupo que cumple con el mínimo de asistencia (3 asistencias).</li>
                          </ol>
                          <strong>Pista: </strong>Si el nuevo integrante es Lucas y ha asistido 2 veces, el código debería mostrar esta salida:<br>
                          <img src="resources/m3/l7/m3_l7_e2/content/images/m3l7e2.png" alt="image" width="30%"><br>
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