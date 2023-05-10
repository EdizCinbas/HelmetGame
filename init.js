(function(){

    // This is the first code that runs whent he browser window opens, it is responsible for creating the overworld
    const overworld = new Overworld({
        element: document.querySelector(".game-container")
    })

    overworld.init()

})();