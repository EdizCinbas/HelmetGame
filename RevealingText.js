class RevealingText{
    constructor(config){
        this.element = config.element;
        this.text = config.text;
        this.speed = config.speed || 40;

        this.timeout = null;
        this.isDone = false;
    }

    revealOneCharacter(list){
        const next = list.splice(0, 1)[0];
        next.span.classList.add("revealed");

        if (list.length > 0){
            // Recurse until all the characters have been revealed
            this.timeout = setTimeout(() => {
                this.revealOneCharacter(list)
            }, next.delayAfter)
        } else {
            this.isDone = true;
        }
    }

    warpToDone(){
        clearTimeout(this.timeout);
        this.isDone = true;
        this.element.querySelectorAll("span").forEach(s => {
            s.classList.add("revealed");
        })
    }

    init(){
        let characters = [];
        this.text.split("").forEach(character => {

            // Create each span in TextMessage.css and add element in DOM
            let span = document.createElement("span");
            span.textContent = character;
            this.element.appendChild(span);

            // Add span to array. JavaScript only application of push to make array of undetermined size
            characters.push({
                span,
                delayAfter: character === " " ? 0 : this.speed
            })

        })

        this.revealOneCharacter(characters);

    }

}