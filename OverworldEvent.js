class OverworldEvent{
    constructor({map, event}) {
        this.map = map;
        this.event = event;
        this.audioBeep = new Audio ("/assets/sounds/beep.mp3");
    }

    stand(resolve){
        const who = this.map.gameObjects[this.event.who];
        who.startBehaviour({
            map: this.map

        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time

        })

        //Checking if the walking is complete and firing the promise to the await function
        const completeHandler = e => {
            if(e.detail.whoId === this.event.who){
                document.removeEventListener("PersonStandComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonStandComplete", completeHandler)

    }

    walk(resolve){
        const who = this.map.gameObjects[this.event.who];
        who.startBehaviour({
            map: this.map

        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true

        })

        //Checking if the walking is complete and firing the promise to the await function
        const completeHandler = e => {
            if(e.detail.whoId === this.event.who){
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonWalkingComplete", completeHandler)

    }

    textMessage(resolve){

        if(this.event.facePlayer){
            const obj = this.map.gameObjects[this.event.facePlayer];
            obj.direction = utils.oppositeDirection(this.map.gameObjects["player"].direction);
        }

        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        })
        message.init( document.querySelector(".game-container") )
    }

    changeMap(resolve){

        const sceneTransition = new SceneTransition();
        this.map.dismountObjects();
        sceneTransition.init(document.querySelector(".game-container"), () => {
            this.map.overworld.startMap( window.Overworld_Maps[this.event.map] );
            resolve();

            sceneTransition.fadeOut();

        });
    }

    incrementProgress(resolve){
        if (this.event.progressReq === this.map.overworld.hud.getProgress()){
            this.audioBeep.play();
            this.map.overworld.hud.incrementProgress();
            resolve();
        }else{
            resolve();
        }

    }

    pause(resolve){
        this.map.isPaused = true;
        const menu = new PauseMenu({
            progress: this.map.overworld.progress,
            overworld: this.map.overworld,
            onComplete: () => {
                resolve();
                this.map.isPaused = false;
                this.map.overworld.startGameLoop();
            }
        });
        menu.init(document.querySelector(".game-container"));
    }

    playVid(resolve){

        if(this.event.required === this.map.overworld.hud.getProgress() || !this.event.required){
            const vid = new VideoMenu({
                overworld: this.map.overworld,
                src: this.event.src,
                onComplete: () => {
                    resolve();
                }
            })

            vid.init(document.querySelector(".game-container"));
        }else{
            resolve();
        }


    }


    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }


}