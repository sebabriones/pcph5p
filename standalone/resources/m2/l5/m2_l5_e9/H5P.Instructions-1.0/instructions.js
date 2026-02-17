jQuery(document).ready(()=>{
    const instructions = `Una facultad tiene solo 2 salas de computación y hay muchos cursos que las solicitan semanalmente. El problema es que:
                          <ul style='text-align:left;'><li>Algunos cursos reservan y no usan la sala.</li><li>Otros cursos la necesitan con urgencia (por evaluación).</li><li>Hay conflictos cuando dos solicitudes coinciden.</li></ul>
                          <strong>Objetivo del algoritmo: </strong>asignar salas de forma precisa y justa, evitando desperdicio de recursos (salas vacías) y funcionando aunque cambien el número de cursos, salas o criterios (generalidad).<br><br>
                          <strong>Datos de entrada (para cualquier semana): </strong>Cada solicitud tiene
                          <ol style='text-align:left;'><li>curso</li><li>bloque_horario (ej: Lunes 10:00–11:30)</li><li>n_estudiantes</li><li>prioridad (1=baja, 2=media, 3=alta)</li><li>historial_no_uso (cantidad de veces que reservó y no usó en el último mes)</li></ol>
                          <strong>Restricciones: </strong>
                          <ul style='text-align:left;'><li>Una sala no puede asignarse a más de un curso en el mismo bloque.</li><li>Si hay conflicto, se debe decidir con una regla explícita (sin ambigüedad).</li><li>Debe existir un mecanismo de verificación (comprobar si el resultado cumple reglas).</li><li>Debe existir un mecanismo de validación operativa: si un curso no confirma asistencia, se libera la sala para reasignación eficiente.</li></ul>
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