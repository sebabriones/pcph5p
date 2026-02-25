jQuery(document).ready(()=>{
    const instructions = `En la actividad anterior, trabajaste con un programa que calculaba la nota final de un/a estudiante en la asignatura de Programación, considerando tres evaluaciones con ponderaciones específicas: 25%, 35% y 40%.<br><br>
                          La profesora, ahora solicita a un/a estudiante que escriba un programa que permita determinar la nota final para toda la clase, mostrando quienes aprueban y quienes reprueban.<br><br>
                          La docente entrega los siguientes requisitos que debe cumplir el programa:
                          <ol style="text-align:left;margin-top:0.5em;">
                            <li style="list-style-position: inside;">Preguntar <strong>cuántos estudiantes</strong> hay en el curso.</li>
                            <li style="list-style-position: inside;">Para cada estudiante:
                              <ul>
                                <li style="list-style-position: inside;">Solicitar su <strong>nombre</strong>.</li>
                                <li style="list-style-position: inside;">Pedir las tres <strong>notas</strong> (validando que estén entre 0.0 y 7.0).</li>
                              </ul>
                            </li>
                            <li style="list-style-position: inside;">Calcular la <strong>nota final ponderada</strong> (25%, 35%, 40%).</li>
                            <li style="list-style-position: inside;">Mostrar la lista completa con:
                              <ul>
                                <li style="list-style-position: inside;">Nombre del estudiante.</li>
                                <li style="list-style-position: inside;">Nota final con <strong>2 decimales</strong>.</li>
                                <li style="list-style-position: inside;">Estado: <strong>Aprobado/a</strong> (≥ 4.0) o <strong>Reprobado/a</strong> (< 4.0).</li>
                              </ul>
                            </li>
                            <li style="list-style-position: inside;">Al final, mostrar:
                              <ul>
                                <li style="list-style-position: inside;"><strong>Promedio general</strong> del curso.</li>
                                <li style="list-style-position: inside;">Porcentaje de estudiantes que aprobaron.</li>
                              </ul>
                            </li>
                          </ol>
                          Sugerencias:
                          <ul style="text-align:left;margin-top:0.5em;">
                            <li style="list-style-position: inside;">Usar <strong>listas</strong> para guardar nombres y promedios, o una lista de listas.</li>
                            <li style="list-style-position: inside;">Usar un <strong>bucle</strong> para ingresar datos de cada estudiante.</li>
                            <li style="list-style-position: inside;">Validar notas antes de sumarlas.</li>
                            <li style="list-style-position: inside;">Calcular el promedio general con sum() y len().</li>
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