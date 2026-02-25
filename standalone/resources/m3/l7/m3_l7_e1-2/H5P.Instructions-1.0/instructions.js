jQuery(document).ready(()=>{
    const instructions = `Crea un programa en Python que lea una lista de 1.000 productos desde el archivo mil_productos.csv. El archivo debe contener dos columnas:  “Producto” y ”Precio”.<br>El programa debe:
                          <ol type="a" style="text-align:left;margin-top:0.5em;">
                            <li style="list-style-position: inside;">Leer todos los productos desde el archivo.</li>
                            <li style="list-style-position: inside;">Calcular el total de la compra.</li>
                            <li style="list-style-position: inside;">Solicitar al usuario que ingrese el presupuesto máximo.</li>
                            <li style="list-style-position: inside;">Indicar si el total supera o no ese presupuesto.</li>
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