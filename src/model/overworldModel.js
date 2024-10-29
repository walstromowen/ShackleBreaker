import Map from './misc/map.js';
import Battle from './misc/battle.js';

export default class OverworldModel{
    constructor(props){
        this.props = props;
        this.currentPartyPosition = [0,0];//in Tiles
        this.previousPartyPosition = [0,0];//in Tiles
        this.generateNewMap();
    }
    generateNewMap(){//want this to execute after lobby start happens
        this.props.setMap(new Map());
        this.currentPartyPosition = this.props.getMap().getEntrancePosition();
    }
    movePartyUp(){
        let map = this.props.getMap();
        if(this.currentPartyPosition[1]-1 >= 0){
            if(map.tileLayout[this.currentPartyPosition[1]-1][this.currentPartyPosition[0]].type != 'wall'){
                this.movePartyTile(map.tileLayout[this.currentPartyPosition[1]-1][this.currentPartyPosition[0]]);
            }
        }   
    }
    movePartyDown(){
        let map = this.props.getMap();
        if(this.currentPartyPosition[1]+1 < map.tileLayout.length){
            if(map.tileLayout[this.currentPartyPosition[1]+1][this.currentPartyPosition[0]].type != 'wall'){
                this.movePartyTile(map.tileLayout[this.currentPartyPosition[1]+1][this.currentPartyPosition[0]]);
            }
        }
    }
    movePartyLeft(){
        let map = this.props.getMap();
        if(this.currentPartyPosition[0]-1 >= 0){
            if(map.tileLayout[this.currentPartyPosition[1]][this.currentPartyPosition[0]-1].type != 'wall'){
                this.movePartyTile(map.tileLayout[this.currentPartyPosition[1]][this.currentPartyPosition[0]-1])
            }
        }
    }
    movePartyRight(){
        let map = this.props.getMap();
        if(this.currentPartyPosition[0]+1 < map.tileLayout[this.currentPartyPosition[1]].length){
            if(map.tileLayout[this.currentPartyPosition[1]][this.currentPartyPosition[0]+1].type != 'wall'){
                this.movePartyTile(map.tileLayout[this.currentPartyPosition[1]][this.currentPartyPosition[0]+1])
            }
        }
    }
    movePartyTile(nextRoom){
        if(nextRoom.type == 'exit'){
            this.generateNewMap();
            this.currentPartyPosition = this.props.getMap().getEntrancePosition();
            return;
        }
        if(nextRoom.type != 'wall'){
            this.previousPartyPosition = this.currentPartyPosition;
            this.currentPartyPosition = nextRoom.position;
            if(nextRoom.battle != ''){
                this.toggleBattle(nextRoom.battle);
                return; 
            }
            if(nextRoom.encounter != ''){
                this.toggleEncounter(nextRoom.encounter);
                return;
            }
            let chance = Math.floor(Math.random()*20);
            if(chance == 30){
                let biome = this.props.getMap().biome;
                nextRoom.battle = new Battle(
                    {
                        hostiles: biome.generateEnemies(this.props.calcHighestPartyLevel(), Math.ceil(Math.random()*4)), 
                        battleMusicSrc: biome.battleMusicSrc,
                    }
                ); 
                this.toggleBattle(nextRoom.battle);
                return;
            }
            if(chance == 1){
                let biome = this.props.getMap().biome;
                nextRoom.encounter = biome.generateEncounter(this.props.recruitWanderingCompanion);
                this.toggleEncounter(nextRoom.encounter);
                return;
            }
        }
    }
    toggleBattle(battle){
        this.props.setBattle(battle);
        this.props.setScreen('battle-screen');
        
    }
    toggleEncounter(encounter){
        this.props.setEncounter(encounter);
        this.props.setScreen('encounter-screen');
    }
    //TODO
    determineCurrentCharater(){
        this.currentCharacter = getRandomArrayElement(this.props.getParty());
        if(this.currentCharacter.currentHP <= 0){
            this.determineCurrentCharater();
        }
    }
    
}