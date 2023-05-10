class Person extends GameObject {
    constructor(config) {
        super(config);

        //additional function to gameObject is movement
        this.movingProgressRemaining = 0;
        this.isStanding = false;

        // flag to distinguish npc from player
        this.isPlayerControlled = config.isPlayerControlled || false;

        // directions are constant
        this.directionUpdate = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1],
        }

    }

    update(state){
        if(this.movingProgressRemaining > 0) {
            this.updatePosition(); // method specific to Person updates pos
        }else{
            // if there is a keyboard direction given to player
            if(!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow){
                this.startBehaviour(state, {
                    type: "walk",
                    direction: state.arrow
                })
                // starts walk behaviour
            }
            this.updateSprite(); // this method creates an animation through the 'Sprite' Class
        }
    }

    startBehaviour(state, behaviour){
        // set character direction to what behaviour has
        this.direction = behaviour.direction;
        if (behaviour.type === "walk"){
            //stop here if space is not free
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)){

                behaviour.retry && setTimeout(() => {
                   this.startBehaviour(state, behaviour)
                }, 10)
                return;
            }
            //ready to walk
            state.map.moveWall(this.x, this.y, this.direction);
            this.movingProgressRemaining = 32;
            this.updateSprite(state);
        }

        if (behaviour.type === "stand"){
            this.isStanding = true;
            setTimeout(() => {
                utils.emitEvent("PersonStandComplete", {
                    whoId: this.id
                })
                this.isStanding = false;
            }, behaviour.time)
        }
    }

    updatePosition() {

            const [property, change] = this.directionUpdate[this.direction];
            //pulling the property from the array map of directions within the class
            this[property] += change;
            this.movingProgressRemaining -= 1;

            if (this.movingProgressRemaining === 0){
                //Finished walking

                utils.emitEvent("PersonWalkingComplete", {
                    whoId: this.id
                })

            }

    }

    updateSprite(){

        if(this.movingProgressRemaining > 0){
            this.sprite.setAnimation("walk-"+this.direction);
            return;
        }

        this.sprite.setAnimation("idle-" + this.direction);

    }

}