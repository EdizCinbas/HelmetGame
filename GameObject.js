class GameObject {
    constructor(config){
        this.id = null;
        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "/assets/own/player2.png",
        });

        this.behaviourLoop = config.behaviourLoop || [];
        this.behaviourLoopIndex = 0;

        this.talking = config.talking || [];


    }

    mount(map){
        this.isMounted = true;
        map.addWall(this.x, this.y);

        // Mounting the object onto the scene, queue behaviour if there is below
        setTimeout(() => {
            this.doBehaviourEvent(map);
        }, 10)
    }
    dismount(map){
        this.isMounted = false;
        map.removeWall(this.x, this.y);
    }

    update(state){
        this.sprite.updateAnimationProgress();
    }

    async doBehaviourEvent(map){

        //Do not play internal loop if there is a global cutscene
        if(map.isCutscenePlaying || this.behaviourLoop.length === 0 || this.isStanding || !this.isMounted){
            return;
        }

        let eventConfig = this.behaviourLoop[this.behaviourLoopIndex];
        eventConfig.who = this.id;

        const eventHandler = new OverworldEvent({ map, event: eventConfig });
        await eventHandler.init();
        //Asynchronous method waits until the above line finished in order to run below code

        this.behaviourLoopIndex += 1;
        if (this.behaviourLoopIndex === this.behaviourLoop.length){
            this.behaviourLoopIndex = 0;
        }

        //Recurse
        this.doBehaviourEvent(map);

    }

}