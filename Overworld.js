class Overworld {

    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");

    }

    startGameLoop(){
        const step = () => {

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //clear canvas before drawing

            //Establish Camera
            const cameraPerson = this.map.gameObjects.player || {x: utils.withGrid(6), y: utils.withGrid(13)};

            //Update objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map,
                })
            })
            //console.log(this.map.gameObjects.player.x / 32, this.map.gameObjects.player.y / 32);

            //Draw Layers
            this.map.drawLowerImage(this.ctx, cameraPerson);
            Object.values(this.map.gameObjects).sort((a, b) => {
                return a.y - b.y; // sorting objects in order of height to change draw order
            }).forEach(object => {
                object.sprite.draw(this.ctx, cameraPerson);
            })
            this.map.drawUpperImage(this.ctx, cameraPerson);


            if(!this.map.isPaused){
                requestAnimationFrame(() => {
                    step();
                })
            }

        }
        step() //recursion in order to create a game loop
    }

    bindActionInput(){
        new KeyPressListener("Enter", () => {
            // Check if there is a person to talk to here
            this.map.checkForActionCutScene();
        })
        new KeyPressListener("Escape", () => {
            if (!this.map.isCutscenePlaying){
                this.map.startCutscene([
                    { type: "pause" }
                ])
            }
        })
    }


    bindPlayerPositionCheck(){
        document.addEventListener("PersonWalkingComplete", e => {
            if(e.detail.whoId === "player"){
                //Player's position has changed
                this.map.checkForFootstepCutscene()
            }
        })
    }

    bindMouseCheck(){
        document.addEventListener("click", event => {
            this.map.checkForMousescene(event.clientX, event.clientY)
        })
    }

    startMap(mapConfig){
        this.map = new Overworld_Map(mapConfig); // Overworld instantiates map
        this.map.overworld = this; // Overworld back reference added
        this.map.mountObjects(); // Initialises game objects in the map

        this.progress.mapId = mapConfig.id;
    }


    async init(){
        // First method that is called in the game, creates the map and "initialises" the objects
        const container = document.querySelector(".game-container");

        // Save and load progress
        this.progress = new Progress(this);

        // Show the title screen
        this.titleScreen = new TitleScreen({
            progress: this.progress
        })

        // Creating a HUD that keeps record of the tasks
        this.hud = new Hud();
        this.hud.init(container);
        this.hud.update();

        // Starting Overworld_Map
        this.startMap(window.Overworld_Maps.stable);

        // Checking for continue game option
        // useSaveFile is populated if player wants to continue
        const useSaveFile = await this.titleScreen.init(container);
        if (useSaveFile){
            this.progress.load();
            this.startMap(window.Overworld_Maps[this.progress.mapId]);
        }

        // Binding the actions and inputs
        this.bindActionInput();
        this.bindPlayerPositionCheck();
        this.bindMouseCheck();


        // Player input
        this.directionInput = new DirectionInput();
        this.directionInput.init();

        // Game loop starts
        this.startGameLoop();


    }

}