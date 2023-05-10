class Overworld_Map{

    constructor(config){

        // Linking overworld_map to overworld to backtrace if needed
        this.overworld = null;

        // Initialising objects within the map
        this.gameObjects = config.gameObjects;
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.mouseClicks = config.mouseClicks || [];
        this.enterCutscenes = config.enterCutscenes || [];

        // Collision
        this.walls = config.walls || {} ;

        // Two layers of image source
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        // Cutscene check
        this.isCutscenePlaying = false;
        this.isPaused = false;

    }



    drawLowerImage(ctx, cameraPerson){
        ctx.drawImage(this.lowerImage,
            utils.withGrid(19.5) - cameraPerson.x - 16,
            utils.withGrid(10) - cameraPerson.y)
    }
    drawUpperImage(ctx, cameraPerson){
        ctx.drawImage(this.upperImage,
            utils.withGrid(19.5) - cameraPerson.x - 16,
            utils.withGrid(10) - cameraPerson.y)
    }
    isSpaceTaken(currentX, currentY, direction){
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }
    mountObjects(){
        Object.keys(this.gameObjects).forEach(key => {

            let object = this.gameObjects[key];
            object.id = key;

            object.mount(this);
        })
    }
    dismountObjects(){
        Object.keys(this.gameObjects).forEach(key => {

            let object = this.gameObjects[key];
            object.id = key;

            object.dismount(this);
        })
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true; // Flag

        //Start cutscene loop
        //Await each event to make sure cutscene plays out in its entirety
        for(let i=0; i<events.length; i++){
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            }) // Instance of OverworldEvent
            await eventHandler.init(); // eventHandler is of OverworldEvent class
        }

        this.isCutscenePlaying = false;

        //Reset NPCs to their idle state
        Object.values(this.gameObjects).forEach(object => object.doBehaviourEvent(this))

    }

    checkForActionCutScene(){
        const player = this.gameObjects["player"];
        const nextCoords = utils.nextPosition(player.x, player.y, player.direction);
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        });


        if(!this.isCutscenePlaying && match && match.talking.length){
            const relevantScenario = match.talking.find(scenario => {
                return (scenario.required) === this.overworld.hud.getProgress();
            }) || null;
            if (relevantScenario){
                this.startCutscene(relevantScenario.events);
            }else{
                this.startCutscene(match.talking[0].events);
            }
        }

        let match2 = null;
        this.overworld.map.enterCutscenes.forEach(action => {
            if(nextCoords.x === action.x && nextCoords.y === action.y){
                match2 = action;
            }
        })

        // Triggers the cutscene in the defined zone
        if (!this.isCutscenePlaying && match2) {
            this.startCutscene(match2.events);
        }

    }

    checkForFootstepCutscene(){
        const player = this.gameObjects["player"];
        const match = this.cutsceneSpaces[ `${player.x},${player.y}` ];
        if (!this.isCutscenePlaying && match){
            this.startCutscene( match[0].events );
        }
    }


    checkForMousescene(x, y){
        // The mouse clicks in Overworld gets called here
        let match = null;

        // Loops through array of defined mouseClick zones to check if cursor is within
        this.mouseClicks.forEach(zone => {
            if (x > zone.x && x < zone.xMax && y > zone.y && y < zone.yMax){
                match = zone;
            }
        })

        // Triggers the cutscene in the defined zone
        if (!this.isCutscenePlaying && match){
            this.startCutscene(match.events);
        }
    }


    addWall(x, y){
        this.walls[`${x},${y}`] = true;
    }
    removeWall(x, y){
        delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction){
        this.removeWall(wasX, wasY);
        const {x,y} = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x, y);
    }
}


window.Overworld_Maps = {
    stable: {
        id: "stable",
        lowerSrc: "/assets/own/BG3.png",
        upperSrc: "/assets/own/BGUP.png",
        gameObjects: {
          player: new Person({
              isPlayerControlled: true,
              x: utils.withGrid(35),
              y: utils.withGrid(9),
              src: "/assets/own/GuyPlayer.png",
          }),
            npcA: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(6),
                src: "assets/RPG_Sprites/Male/akram1.png",
                /*behaviourLoop: [
                    { type: "stand", direction: "left", time: "800" },
                    { type: "stand", direction: "up", time: "1500" },
                    { type: "stand", direction: "right", time: "300" },
                    { type: "stand", direction: "down", time: "1200" },
                ]*/
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Hi. Welcome to Al Marmoom Initiative!", facePlayer: "npcA"},
                            { type: "textMessage", text: "I am Akram, your instructor"},
                            { type: "textMessage", text: "Go say Hi to Yana"},
                            { type: "incrementProgress", progressReq: 0 }
                        ]
                    },
                    {
                        required: 6,
                        events: [
                            { type: "textMessage", text: "Hi again!"},
                            { type: "textMessage", text: "Wait for me to prepare the horse"},
                            { type: "incrementProgress", progressReq: 6 },
                            { who: "npcA", type: "stand", direction: "right", time: "5000" },
                            { who: "npcA", type: "stand", direction: "down", time: "200" },
                        ]
                    },
                    {
                        required: 7,
                        events: [
                            { type: "textMessage", text: "Go up to the mounting block"},
                            { type: "incrementProgress", progressReq: 7 },

                        ]
                    }
                ]

            }),

        },
        walls: {
            [utils.asGridCoord(12,0)] : true, //dynamic key
            [utils.asGridCoord(12,1)] : true,
            [utils.asGridCoord(12,2)] : true,
            [utils.asGridCoord(12,3)] : true,
            [utils.asGridCoord(12,4)] : true,
            [utils.asGridCoord(12,5)] : true,
            [utils.asGridCoord(12,6)] : true,
            [utils.asGridCoord(13,6)] : true,
            [utils.asGridCoord(14,6)] : true,
            [utils.asGridCoord(15,6)] : true,

            [utils.asGridCoord(23,11)] : true,
            [utils.asGridCoord(24,11)] : true,
            [utils.asGridCoord(25,11)] : true,
            [utils.asGridCoord(26,11)] : true,

            [utils.asGridCoord(10,6)] : true,
            [utils.asGridCoord(9,6)] : true,
            [utils.asGridCoord(10,5)] : true,
            [utils.asGridCoord(9,5)] : true,
            [utils.asGridCoord(10,4)] : true,
            [utils.asGridCoord(9,4)] : true,


        },
        cutsceneSpaces: {
            [utils.asGridCoord(9, 3)]: [
                {
                    events: [
                        { who: "player", type: "walk", direction: "left"},
                        { who: "player", type: "stand", direction: "down", time: "200"},
                        { who: "npcA", type: "walk", direction: "up" },
                        { type: "textMessage", text: "Do NOT go behind the horse" },
                        { type: "textMessage", text: "It is very dangerous" },
                        { who: "npcA", type: "walk", direction: "down" },

                    ]
                }
            ],
            [utils.asGridCoord(10, 2)]: [
                {
                    events: [
                        { who: "player", type: "walk", direction: "left"},
                        { who: "player", type: "walk", direction: "left"},
                        { who: "player", type: "walk", direction: "down"},
                        { who: "player", type: "stand", direction: "down", time: "200"},
                        { who: "npcA", type: "walk", direction: "up" },
                        { type: "textMessage", text: "Do NOT go behind the horse" },
                        { type: "textMessage", text: "It is very dangerous" },
                        { who: "npcA", type: "walk", direction: "down" },

                    ]
                }
            ],
            [utils.asGridCoord(18, 6)]: [
                {
                    events: [
                        { type: "incrementProgress", progressReq: 1 },
                        { type: "incrementProgress", progressReq: 10 },
                        { type: "changeMap",  map: "Office"}
                    ]
                }
            ],
            [utils.asGridCoord(25, 12)]: [
                {
                    events: [
                        { type: "incrementProgress", progressReq: 8 },
                        { type: "playVid", src: "/assets/videos/StableVid.mp4", required: 9},
                        { type: "incrementProgress", progressReq: 9 },
                    ]
                }
            ]
        }
    },
    Office: {
        id: "Office",
        lowerSrc: "/assets/own/office2.png",
        upperSrc: "/assets/own/BGUP.png",
        gameObjects: {
            player: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(19),
                y: utils.withGrid(10),
                src: "/assets/own/GuyPlayer.png",
            }),
            npcB: new Person({
                x: utils.withGrid(25),
                y: utils.withGrid(8),
                src: "assets/RPG_Sprites/Female/FPlayer1.png",
                /*behaviourLoop: [
                    { type: "walk", direction: "left" },
                    { type: "stand", direction: "up", time: 800 },
                    { type: "walk", direction: "up" },
                    { type: "walk", direction: "right" },
                    { type: "walk", direction: "down" },
                ],*/
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Hi new student!", facePlayer: "npcB"},
                            { type: "textMessage", text: "I am the stable manager, Yana"},
                            { type: "textMessage", text: "Go get ready for you lesson!"},
                            { type: "incrementProgress", progressReq: 2 },
                        ]
                    },
                    {
                        required: 11,
                        events: [
                            { type: "textMessage", text: "Thanks for coming hope you had fun!"},
                            { type: "textMessage", text: "Have a nice day and see you next week!"},
                            { type: "incrementProgress", progressReq: 11 },

                        ]
                    }
                ]
            }),
        },
        walls: {
            [utils.asGridCoord(0,0)]: true,
            [utils.asGridCoord(1,0)]: true,
            [utils.asGridCoord(5,4)]: true,
            [utils.asGridCoord(5,3)]: true,
            [utils.asGridCoord(4,3)]: true,
            [utils.asGridCoord(3,3)]: true,
            [utils.asGridCoord(2,3)]: true,
            [utils.asGridCoord(1,3)]: true,
            [utils.asGridCoord(1,4)]: true,
            [utils.asGridCoord(1,5)]: true,

            [utils.asGridCoord(-1,-1)]: true,
            [utils.asGridCoord(-1,0)]: true,
            [utils.asGridCoord(-1,1)]: true,
            [utils.asGridCoord(-1,2)]: true,
            [utils.asGridCoord(-1,3)]: true,
            [utils.asGridCoord(-1,4)]: true,
            [utils.asGridCoord(-1,5)]: true,
            [utils.asGridCoord(-1,6)]: true,
            [utils.asGridCoord(-1,7)]: true,
            [utils.asGridCoord(-1,8)]: true,
            [utils.asGridCoord(-1,9)]: true,
            [utils.asGridCoord(-1,10)]: true,
            [utils.asGridCoord(-1,11)]: true,
            [utils.asGridCoord(-1,12)]: true,
            [utils.asGridCoord(-1,13)]: true,
            [utils.asGridCoord(0,13)]: true,
            [utils.asGridCoord(1,13)]: true,
            [utils.asGridCoord(2,13)]: true,
            [utils.asGridCoord(3,13)]: true,
            [utils.asGridCoord(4,13)]: true,
            [utils.asGridCoord(5,13)]: true,
            [utils.asGridCoord(6,13)]: true,
            [utils.asGridCoord(7,13)]: true,
            [utils.asGridCoord(8,13)]: true,

            [utils.asGridCoord(17,1)]: true,


        },
        cutsceneSpaces: {
            [utils.asGridCoord(19, 12)]: [
                {
                    events: [
                        { type: "incrementProgress", progressReq: 12 },
                        { type: "changeMap", map: "stable"},
                    ]
                }
            ],
            [utils.asGridCoord(10, 3)]: [
                {
                    events: [
                        { type: "changeMap", map: "ChangeHelmet" },
                    ]
                }
            ]
        },
        enterCutscenes: [
            { x: utils.withGrid(0), y: utils.withGrid(0), events: [
                    { type: "incrementProgress", progressReq: 4}
                ]},
            { x: utils.withGrid(17), y: utils.withGrid(1), events: [
                    { type: "incrementProgress", progressReq: 3}
                ]}
        ]


    },
    ChangeHelmet: {
        id: "ChangeHelmet",
        lowerSrc: "/assets/own/HelmetCupboard.png",
        upperSrc: "/assets/own/BGUP.png",
        gameObjects: {

        },
        mouseClicks: [
            {x: 540, xMax: 660, y: 300, yMax: 390, events: [
                    { type: "incrementProgress", progressReq: 5 },
                    { type: "changeMap", map: "Office" }
                ]

                },
            {x: 590, xMax: 780, y: 720, yMax: 780, events: [
                    { type: "changeMap", map: "Office" }
                ]}

        ]

    },
}
