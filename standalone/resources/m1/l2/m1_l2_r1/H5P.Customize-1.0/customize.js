jQuery(document).ready(()=>{
    const d = document;

    //Funcionalidad de que permita que al retornar un elemento draggable a su lugar de origen
    //este vuelva a su color original (quita la clase "dropped" al elemento), ya que de forma 
    //normal no lo hace o hay un error en aplicarlo
    const draggables = $('.h5p-draggable');
    const classToDetect = 'h5p-dropped';

    let leftCurrent = 0,
        topCurrent = 0,
        inits = [];

    //Se toman las posiciones iniciales de todos los elementos arrastrables
    $(draggables).each((i,draggable)=> inits.push(draggable.getBoundingClientRect()));

    //Cada elemento arrastrable tendra asociado un observador que 
    //estará revisando si el elemento tiene la clase "h5p-dropped"
    draggables.each((i, draggable) => {
        const draggableObserver = new MutationObserver(function(mutationList, observer) {
            for(const mutation of mutationList){
                if(mutation.type === 'attributes' && mutation.attributeName === 'class'){
                    const currentClasses = draggable.classList;

                    //Si el elemento tiene la clase observada va a estar revisando la
                    //posición del elemento para asegurarse si esta en alguna zona
                    //drop o de vuelta en su posición incial.
                    if(currentClasses.contains(classToDetect)){
                        leftCurrent = draggable.getBoundingClientRect().left;
                        topCurrent = draggable.getBoundingClientRect().top;
                        
                        $(inits).each((i,init)=>{
                            if(leftCurrent >= init.left-5 && leftCurrent <= init.right && topCurrent >= init.top-5 && topCurrent <= init.bottom){
                                //console.log('En posicion inicial');
                                draggable.classList.remove('h5p-dropped');
                                draggable.style.background = 'linear-gradient(rgb(255,248,65) 0%, rgb(251,211,71) 90%)';
                            }
                        });
                    }
                }
            }
        });

        draggableObserver.observe(draggable, { attributes: true });
    });
});