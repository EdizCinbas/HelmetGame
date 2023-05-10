class TitleScreen{
    constructor({ progress }){
        this.progress = progress;
    }

    getOptions(resolve){
        const safeFile = this.progress.getSaveFile();
        return [ // Returning an array of options to display in the menu
            {
                label: "New Game",
                description: "Start a new game",
                handler: () => {
                    this.close();
                    resolve();
                } // The option to start a new game, handler removes the title screen
            },
            safeFile ? {
                label: "Continue Game",
                description: "Resume previous game",
                handler: () => {
                    this.close();
                    resolve(safeFile);
                } /* This option resolves with safeFile which is sent to Overworld and
                     used in order to start Overworld with the saved progress and location */
            } : null

            /* safeFile ternary returns null instead of the Continue Game option
               if there is no safeFile present in the browser storage */

        ].filter(v => v);
        /*  filter function removes null values, therefore it will remove the
            Continue Game option from the menu if there is no saved game */
    }

    createElement(){
        this.element = document.createElement("div");
        this.element.classList.add("TitleScreen");
        this.element.innerHTML = (`
            <img class="TitleScreen_Logo" src="/assets/own/HelmetGameLogo.png" alt="Helmet Game" />
        `)
    }

    close(){
        this.keyboardMenu.end();
        this.element.remove();
    }

    init(container){
        return new Promise(resolve => {
            this.createElement();
            container.appendChild(this.element);
            this.keyboardMenu = new KeyboardMenu();
            this.keyboardMenu.init(this.element);
            this.keyboardMenu.setOptions(this.getOptions(resolve));
        })
    }


}