class KeyPressListener {
    // This code takes the key that is pressed once and calls it once, direction input on the other hand fires
    // the code even if key is held down. This is a workaround way to implement single presses.
    constructor(keyCode, callback) {
        let keySafe = true;
        this.keydownFunction = function (event) {
            if (event.code === keyCode) {
                if (keySafe) {
                    keySafe = false;
                    callback();
                }
            }
        };
        this.keyupFunction = function (event) {
            if (event.code === keyCode) {
                keySafe = true;
            }
        };
        document.addEventListener("keydown", this.keydownFunction);
        document.addEventListener("keyup", this.keyupFunction);
    }

    unbind(){
        document.removeEventListener("keydown", this.keydownFunction);
        document.removeEventListener("keyup", this.keyupFunction);
    }

}