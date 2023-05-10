class VideoMenu{
    constructor({ overworld, src, onComplete }){
        this.overworld = overworld;
        this.onComplete = onComplete;
        this.src = src;
    }

    createElement(){
        this.element = document.createElement('video');
        this.element.classList.add("VideoMenu");
        this.element.src = this.src;
        this.element.id = "StableVid";
        this.element.autoplay = true;

    }

    close(){
        this.element.remove();
        this.onComplete();
    }

    async init(container){
        this.createElement();
        container.appendChild(this.element);

        await utils.wait(200);
        document.getElementById("StableVid").addEventListener("ended", () => {
            this.close();
        })
    }

}