jQuery(document).ready(()=>{
    const d = document;

    //Funcionalidad de que permita que al retornar un elemento draggable a su lugar de origen
    //este vuelva a su color original (quita la clase "dropped" al elemento), ya que de forma 
    //normal no lo hace o hay un error en aplicarlo
    const draggables = $('.h5p-draggable');
    const classToDetect = 'h5p-dropped';

    draggables.each((i, draggable) => {
        let leftInit = Math.trunc(parseInt(draggable.style.left)),
            topInit = Math.trunc(parseInt(draggable.style.top));

        const draggableObserver = new MutationObserver(function(mutationList, observer) {
            for(const mutation of mutationList){
                if(mutation.type === 'attributes' && mutation.attributeName === 'class'){
                    const currentClasses = draggable.classList;

                    if(currentClasses.contains(classToDetect)){
                        if((Math.trunc(parseInt(draggable.style.left)) == leftInit || Math.trunc(parseInt(draggable.style.left))+1 == leftInit || Math.trunc(parseInt(draggable.style.left))-1 == leftInit) && (Math.trunc(parseInt(draggable.style.top)) == topInit || Math.trunc(parseInt(draggable.style.top))+1 == topInit) || Math.trunc(parseInt(draggable.style.top))-1 == topInit){
                            console.log('En posicion inicial');
                            draggable.classList.remove('h5p-dropped');
                            draggable.style.background = 'linear-gradient(rgb(255,248,65) 0%, rgb(251,211,71) 90%)';
                        }
                    }
                }
            }
        });

        draggableObserver.observe(draggable, { attributes: true });
    });
});