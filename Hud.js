class Hud{

    #progress = 0; // Private variable protecting the data field for progress within the game.

    constructor() {
        this.tasks = ["Say Hi to Instructor Akram",
            "Go into the office",
            "Say Hi to Yana",
            "Sign in on the desk",
            "Wash your hands",
            "Grab a helmet",
            "Go back to Akram",
            "Wait for Akram",
            "Go to the mounting block",
            "Watch the video",
            "Go back into the office",
            "Say Bye to Yana",
            "Go outside",
            "Thank you for playing!"];
        this.#progress = 0;
        this.currentTask = "Wash your hands";
        this.element = null;
    }

    update(){
        this.currentTask.textContent = this.tasks[this.#progress];
    }

    createElement(){
        this.element = document.createElement("div");
        this.element.classList.add("Hud");

        this.element.innerHTML = (`
            <p class="Hud_p">Current Task</p>
        `)

        this.currentTask = document.createElement("span");
        this.currentTask.textContent = this.tasks[this.#progress];
        this.element.appendChild(this.currentTask);
    }

    setProgress(int){
        this.#progress = int;
        this.update();
    }
    getProgress(){
        return this.#progress;
    }
    incrementProgress(){
        this.#progress += 1;
        this.update();
    }

    init(container){
        this.createElement();
        container.appendChild(this.element);
    }


}