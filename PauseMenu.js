class PauseMenu{
    constructor({progress, overworld, onComplete}) {
        this.progress = progress;
        this.overworld = overworld;
        this.onComplete = onComplete;
    }

    getOptions(pageKey){

        if (pageKey === "root"){
            return [
                {
                    label: "Resume",
                    description: "Close the pause menu",
                    handler: () => {
                        this.close();
                    }
                },
                {
                    label: "Save",
                    description: "Save your progress",
                    handler: () => {
                        this.progress.save();
                        this.close();
                    }
                },
                {
                    label: "Load",
                    description: "Load your progress",
                    handler: () => {
                        this.progress.load(this.progress.getSaveFile());
                        this.overworld.startMap(window.Overworld_Maps[this.progress.mapId]);
                        this.close();
                    }
                },
                {
                    label: "Main Menu",
                    description: "Return to Main Menu",
                    handler: () => {
                        window.location.reload();
                    }
                },
            ]
        }

        return[];
    }

    createElement(){
        this.element = document.createElement("div");
        this.element.classList.add("PauseMenu")
        this.element.innerHTML = (`
            <h2>PauseMenu</h2>
        `)
    }

    close(){
        this.esc?.unbind();
        this.keyboardMenu.end();
        this.element.remove();
        this.onComplete();
    }

    async init(container){
        this.createElement();
        this.keyboardMenu = new KeyboardMenu({
            descriptionContainer: container
        })
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions("root"));

        container.appendChild(this.element);

        await utils.wait(200);
        this.esc = new KeyPressListener("Escape", () => {
            this.close();
        })

    }

}