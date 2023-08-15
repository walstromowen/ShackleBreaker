import {Recover, Punch, Retreat} from "./abilities.js";

export default class Player{
    constructor(characterCreationArray, map){
        this.name = characterCreationArray[0];
        this.apperance = characterCreationArray[1]
        this.origin = characterCreationArray[2]
        this.equippedArray = ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"];
        this.inventory = characterCreationArray[3];
        this.abilityArray = [new Punch, new Recover, new Retreat];
        this.level = 0;
        this.currentXP = 0;
        this.maxHP = characterCreationArray[4];
        this.currentHP = this.maxHP;
        this.maxStamina = characterCreationArray[5]
        this.currentStamina = this.maxStamina;
        this.maxMagic = characterCreationArray[6];
        this.currentMagic = this.maxMagic;
        this.baseBluntAttack = 1;
        this.currentBluntAttack = this.baseBluntAttack;
        this.basePierceAttack = 1;
        this.currentPierceAttack = this.basePierceAttack;
        this.baseArcaneAttack = 1;
        this.currentArcaneAttack = this.baseArcaneAttack;
        this.baseElementalAttack = 1;
        this.currentElementalAttack = this.baseElementalAttack;
        this.baseBluntDefense = 1;
        this.currentBluntDefense = this.baseBluntDefense;
        this.basePierceDefense = 1;
        this.currentPierceDefense = this.basePierceDefense;
        this.baseArcaneDefense = 1;
        this.currentArcaneDefense = this.baseArcaneDefense;
        this.baseElementalDefense = 1;
        this.currentElementalDefense = this.baseElementalDefense;
        this.baseSpeed = 1;
        this.currentSpeed = this.baseSpeed;
        this.statusArray = [];//new Poisoned(this)
        this.isInBattle = false;
        this.canMoveRoom = true;
        this.currentRoom = map.roomArray[map.playerSpawnIndex];
        this.nextRoom = this.currentRoom;
    }  
}