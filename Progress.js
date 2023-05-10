class Progress{
    constructor(overworld){
        this.overworld = overworld;
        this.mapId = "stable";
        this.saveFileKey = "HelmetGame_SaveFile1";
        this.progressCount = 0;
    }

    save(){
        window.localStorage.setItem(this.saveFileKey, JSON.stringify({
            mapId: this.mapId,
            progressCount: this.overworld.hud.getProgress(),
        }))
    }

    getSaveFile(){
        const file = window.localStorage.getItem(this.saveFileKey);
        return file ? JSON.parse(file) : null
    }

    load(){
        const file = this.getSaveFile();
        if(file){
            this.mapId = file.mapId;
            this.progressCount = file.progressCount;
            this.overworld.hud.setProgress(this.progressCount);
        }



    }


}