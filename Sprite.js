class Sprite{
    constructor(config){

        //Character
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true; // js fails without this check lol
        }

        //Shadow
        this.shadow = new Image();
        this.useShadow = true;
        this.shadow.src = "/assets/own/shadow2.png";
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }


        // Setting up an object oriented structure key to maximum flexibility for client
        this.animations = config.animations || {
            "idle-down" : [ [0,0] ],
            "idle-right": [ [0,1] ],
            "idle-up"   : [ [0,2] ],
            "idle-left" : [ [0,3] ],
            "walk-down" : [ [1,0], [0,0], [3,0], [0,0] ],
            "walk-right": [ [1,1], [0,1], [3,1], [0,1] ],
            "walk-up"   : [ [1,2], [0,2], [3,2], [0,2] ],
            "walk-left" : [ [1,3], [0,3], [3,3], [0,3] ]

            //2D Array used to map the 2D sprite into chunks of animation

        }
        this.currentAnimation = config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 8; //controls animation speed
        this.animationFrameProgress = this.animationFrameLimit;

        this.gameObject = config.gameObject; //used to reference back to the object
    }

    get frame(){
        return this.animations[this.currentAnimation][this.currentAnimationFrame]
        //Encapsulates the frame within the object and only returns the appropriate data
    }

    setAnimation(key){
        if(this.currentAnimation !== key){
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        if(this.animationFrameProgress > 0){
            this.animationFrameProgress -= 1;
            return;
        }

        //if the animation progress is already 0
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if(this.frame === undefined) {
            this.currentAnimationFrame = 0;
        } //useful js shortcut to checking if array is complete
    }

    draw(ctx, cameraPerson) {
        const x = (this.gameObject.x ) - 16 + utils.withGrid(19.5) - cameraPerson.x;
        const y = (this.gameObject.y ) - 8 + utils.withGrid(10) - cameraPerson.y;

        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y)


        const [frameX, frameY] = this.frame; //destructuring getter method

        this.isLoaded && ctx.drawImage(
            this.image,
            frameX * 64 , frameY * 64,
            64,64,
            x,y,
            64,64
        )

        this.updateAnimationProgress();
    }

}