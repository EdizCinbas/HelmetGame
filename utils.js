const utils = {
    withGrid(n) {
        return n * 32;
    },
    asGridCoord(x,y){
        return `${x*32},${y*32}`
    },
    nextPosition(initialX, initialY, direction){
        let x = initialX;
        let y = initialY;
        const size = 32;
        if (direction === "left"){
            x -= size;
        }else if (direction === "right"){
            x += size;
        }else if (direction === "up"){
            y -= size;
        }else if (direction === "down"){
            y += size;
        }
        return {x,y};
    },

    oppositeDirection(direction){
        if (direction === "left") { return "right" }
        if (direction === "right") { return "left" }
        if (direction === "up") { return "down" }
        return "up"
    },

    wait(ms) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    },

    emitEvent(name, detail){
        const event = new CustomEvent(name, {
            detail
        }); //Native HTML feature employed here
        document.dispatchEvent(event);
    },
}
// these are methods that do not really belong anywhere but are used in the game