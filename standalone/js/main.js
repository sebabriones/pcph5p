jQuery(document).ready(()=>{
    //console.log(window);
    const element = document.getElementById('h5p-container'),
          id = new URLSearchParams(window.location.search).get('id'),
          path = new URLSearchParams(window.location.search).get('path');

    const options = {
        h5pJsonPath:  path,
        frameCss: 'assets/styles/h5p.css',
        frameJs: 'assets/frame.bundle.js',
        copyright: false,
        export: false,
        icon: false,
        customCss: [ 'css/demo.css' ],
        customJs: [ 'js/resources/demo.js' ],
    }

    let children = [];

    const xAPIHandler = function(event){
        const xAPI = event.data.statement,
              checkBtn = $('iframe').contents().find('.h5p-question-check-answer');

        if(xAPI.verb.display["en-US"] === 'answered'){
            if(xAPI.context.contextActivities.parent){
                if(typeof xAPI.context.extensions !== 'undefined'){
                    if(xAPI.result.response) children.push({"object":xAPI.object, "result":xAPI.result});
                }else{
                    console.log(xAPI); //se envia el json al LRS
                    return;
                }
            }else{
                console.log(xAPI); //se envia el json al LRS
                return;
            }
            //console.log(xAPI);
        }else if(xAPI.verb.display["en-US"] === 'completed'){
            xAPI.children = children;
            console.log(xAPI); //Se envia el json al LRS
            children = [];
        }

        //console.log(xAPI);
    }

    new H5PStandalone.H5P( element, options ).then(
        function(){
            H5P.externalDispatcher.on('xAPI', xAPIHandler);
        }
    );
});