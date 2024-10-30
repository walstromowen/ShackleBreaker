import {Rest, Struggle} from './abilities.js';

class StatusEffect{
    constructor(config){
        this.name = config.name;
        this.iconSrc = config.iconSrc || null;
        this.holder = config.holder;
        this.maxCharges = config.maxCharges;
        this.currentCharges = this.maxCharges;
        this.activate = this.activate.bind(this);
        this.soundEffectSrc = config.soundEffectSrc || "./assets/audio/soundEffects/power-down-45784.mp3",
        this.message = '';

        this.attackerAnimation = config.attackerAnimation || 'none';
        this.targetAnimation = config.targetAnimation || 'none';
        this.abilityAnimation = config.abilityAnimation || 'explode';
        this.abilityAnimationImage = config.abilityAnimationImage || this.iconSrc;
        this.abilityAnimationDuration = config.abilityAnimationDuration || 2000;



    }
    activate(turnPhase){
        if(this.holder.currentHP <= 0){
            return new Promise((resolve)=>{
                resolve({
                    text: false,
                    animation: false,
                    vitalsUpdate: false,
                });
            });
        }
        if(turnPhase == 'start'){
            return this.onStartTurn();
        }
        if(turnPhase == 'end'){
            return this.onEndTurn();
        }
    }
    checkDamage(target, rawDamage, stat){
        let damage = Math.floor(rawDamage)
        switch(stat){
            case 'health':
                if(target.currentHP - damage < 0){
                    damage = target.currentHP;
                }
            break;
            case 'stamina':
                if(target.currentStamina - damage < 0){
                    damage = target.currentStamina;
                }
            break;
            case 'magic':
                if(target.currentMagic - damage < 0){
                    damage = target.currentMagic;
                }
            break;
        }
        if(damage < 0){
            damage = 1;
        }
        return damage;
    }
    checkRestore(target, rawRestore, stat){
        let restore = Math.floor(rawRestore)
        switch(stat){
            case 'health':
                if(target.currentHP + restore > target.maxHP){
                    restore = target.maxHP - target.currentHP;
                }
            break;
            case 'stamina':
                if(target.currentStamina + restore > target.maxStamina){
                    restore = target.maxStamina - target.currentStamina;
                }
            break;
            case 'magic':
                if(target.currentMagic + restore > target.maxMagic){
                    restore = target.maxMagic - target.currentMagic;
                }
            break;
        }
        return restore;
    }
    activateHelpper(fn, resolveObject){
        if(this.currentCharges <= 0){
            this.onRemove();
        }
        return new Promise((resolve)=>{
            fn();
            resolve(resolveObject);
        });
    }
    //turn events
    onStartTurn(){
        return this.activateHelpper(()=>{}, 
        {
            text: false,
            animation: false,
            vitalsUpdate: false,
        }
    )}
    onEndTurn(){
        return this.activateHelpper(()=>{}, 
        {
            text: false,
            animation: false,
            vitalsUpdate: false,
        }
    )}
    //apply / remove events
    onApplied(){
        
    }
    onRemove(){
        for(let i = 0; i < this.holder.statusArray.length; i++){
            if(this.holder.statusArray[i].name == this.name){
                this.holder.statusArray.splice(i, 1);
                break;
            }
        }
    }
    //to target events
    onRecieveDamage(){
        
    }
    onOpponentAttemptAbility(){
        
    }
    //to attacker
    onDeliverDamage(){
        
    }
    onAttemptAbility(){
        
    }
   
}
export class Poison extends StatusEffect{
    constructor(config){
        super({
            name:'poison',
            holder: config.holder,
            maxCharges: 5,
            iconSrc: "./assets/media/icons/snake.png",
            soundEffectSrc: "./assets/audio/soundEffects/power-down-45784.mp3",
    
        });
        this.severityMofifier = 0.08;
    }
    onEndTurn(){
        return this.activateHelpper(
            ()=>{
                let damage = this.checkDamage(this.holder, this.holder.maxHP * this.severityMofifier, 'health');
                this.holder.currentHP = this.holder.currentHP - damage;
                this.severityMofifier += 0.02;
                this.message = (`${this.holder.name} takes damage from poison.`);
                this.currentCharges --;
            }, 
            {
                text: true,
                animation: true,
                vitalsUpdate: true,
            }
        );
    }
}

export class Burn extends StatusEffect{
    constructor(config){
        super({
            name:'burn',
            iconSrc: "./assets/media/icons/burn.png",
            holder: config.holder,
            maxCharges: 3,
            soundEffectSrc: "./assets/audio/soundEffects/short-fireball-woosh-6146.mp3",
        });
    }
    onEndTurn(){
        return this.activateHelpper(
            ()=>{
                let damage = this.checkDamage(this.holder, this.holder.maxHP * 0.1, 'health');
                this.holder.currentHP = this.holder.currentHP - damage;
                this.message = `${this.holder.name} suffers from burns.`;
                this.currentCharges --;
            }, 
            {
                text: true,
                animation: true,
                vitalsUpdate: true,
            }
        );
    }

}

export class Bleed extends StatusEffect{
    constructor(config){
        super({
            name:'bleed',
            iconSrc: "./assets/media/icons/bleeding-wound.png",
            holder: config.holder,
            maxCharges: 5,
            soundEffectSrc: "./assets/audio/soundEffects/platzender-kopf_nachschlag-91637.mp3",
        });
        this.severityMofifier = 0.08;
    }
    onEndTurn(){
        return this.activateHelpper(
            ()=>{
                let staminaDamage = Math.floor(this.holder.maxStamina * this.severityMofifier);
                let healthDamage = 0;
                if(this.holder.currentStamina - staminaDamage < 0){
                    healthDamage = staminaDamage - this.holder.currentStamina;
                    staminaDamage = this.holder.currentStamina;
                }
                if(healthDamage > 0){
                    this.message = `${this.holder.name} bleeds badly.`;
                }else{
                    this.message = `${this.holder.name} suffers from bleeding.`;
                }
                this.holder.currentStamina = this.holder.currentStamina - staminaDamage;
                this.holder.currentHP = this.holder.currentHP - healthDamage;
                this.severityMofifier += 0.02;
                this.currentCharges --;
                
            }, 
            {
                text: true,
                animation: true,
                vitalsUpdate: true,
            }
        );
    }
}

export class Bind extends StatusEffect{
    constructor(config){
        super({
            name:'bind',
            iconSrc: "./assets/media/icons/crossed-chains.png",
            holder: config.holder,
            maxCharges: 3,
            soundEffectSrc: "./assets/audio/soundEffects/power-down-45784.mp3",
            targetAnimation: 'shake',
            abilityAnimation: 'none',
        });
        this.escapethreshold = config.escapethreshold || 0.75;
    }
    onStartTurn(){
        return this.activateHelpper(
            ()=>{
                this.message = `${this.holder.name} attempts to break free.`;
                if(Math.random() > this.escapethreshold){
                    this.onRemove();
                }else{
                    this.holder.nextAbility = new Struggle({});
                    this.holder.abilityTargets = [this.holder];
                }
                this.currentCharges --;
            }, 
            {
                text: true,
                animation: true,
                vitalsUpdate: true,
            }
        );
    }
}
export class Paralyzed extends StatusEffect{
    constructor(config){
        super({
            name:'paralyzed',
            iconSrc: "./assets/media/icons/electric.png",
            holder: config.holder,
            maxCharges: 2,
            soundEffectSrc: "./assets/audio/soundEffects/075681_electric-shock-33018.wav",
            targetAnimation: 'shake',
            abilityAnimation: 'none',
        });
    }
    onStartTurn(){
        return this.activateHelpper(
            ()=>{
                this.message = `${this.holder.name} is paralyzed.`;
                this.holder.nextAbility = new Struggle({});
                this.holder.abilityTargets = [this.holder];
                this.currentCharges --;
            }, 
            {
                text: true,
                animation: true,
                vitalsUpdate: true,
            }
        );
    }
}
export class Frozen extends StatusEffect{
    constructor(config){
        super({
            name:'frozen',
            iconSrc: "./assets/media/icons/frozen-block.png",
            holder: config.holder,
            maxCharges: 5,
            soundEffectSrc: "./assets/audio/soundEffects/cold-wind-fade.wav",
            targetAnimation: 'shake',
            abilityAnimation: 'none',
        });
    }
    onApplied(){
        this.holder.currentSpeed -= this.holder.baseSpeed * 0.5;
        
    }
    onRemove(){
        for(let i = 0; i < this.holder.statusArray.length; i++){
            if(this.holder.statusArray[i].name == this.name){
                this.holder.statusArray.splice(i, 1);
                break;
            }
        }
        this.holder.currentSpeed += this.holder.baseSpeed * 0.5;
    }
    onStartTurn(){
        return this.activateHelpper(
            ()=>{
                let chance = Math.random()*2
                if(chance < 1){
                    this.message = `${this.holder.name} is frozen.`;
                    this.holder.nextAbility = new Struggle({});
                    this.holder.abilityTargets = [this.holder];
                }else{
                    this.message = `${this.holder.name} is cold.`;
                }
                this.currentCharges --;
            }, 
            {
                text: true,
                animation: true,
                vitalsUpdate: true,
            }
        );
    }
    onEndTurn(){
        return this.activateHelpper(
            ()=>{
                let damage = this.checkDamage(this.holder, this.holder.maxHP * 0.05, 'health');
                this.holder.currentHP = this.holder.currentHP - damage;
                this.message = `${this.holder.name} suffers from frostbite.`;
                this.currentCharges --;
            }, 
            {
                text: true,
                animation: true,
                vitalsUpdate: true,
            }
        );
    }
}
export class Shielded extends StatusEffect{
    constructor(config){
        super({
            name:'shielded',
            iconSrc: "./assets/media/icons/shield.png",
            holder: config.holder,
            maxCharges: 1,
            targetAnimation: 'none',
            abilityAnimation: 'none',
        });
    }
    onApplied(){
        this.holder.currentBluntResistance = (this.holder.currentBluntResistance + 0.5);
        this.holder.currentPierceResistance = (this.holder.currentPierceResistance + 0.5);
        this.holder.currentArcaneResistance = (this.holder.currentArcaneResistance + 0.5);
        this.holder.currentElementalResistance = (this.holder.currentElementalResistance + 0.5);
        
    }
    onRemove(){
        for(let i = 0; i < this.holder.statusArray.length; i++){
            if(this.holder.statusArray[i].name == this.name){
                this.holder.statusArray.splice(i, 1);
                break;
            }
        }
        this.holder.currentBluntResistance = (this.holder.currentBluntResistance - 0.5);
        this.holder.currentPierceResistance = (this.holder.currentPierceResistance - 0.5);
        this.holder.currentArcaneResistance = (this.holder.currentArcaneResistance - 0.5);
        this.holder.currentElementalResistance = (this.holder.currentElementalResistance - 0.5);
    }
    onDeliverDamage(){
        this.onRemove();
    }
    onRecieveDamage(){
        this.onRemove();
    }
    onEndTurn(){
        return this.activateHelpper(
            ()=>{
                
            }, 
            {
                text: false,
                animation: false,
                vitalsUpdate: false,
            }
        );
    }
}

export class KnockedDown extends StatusEffect{
    constructor(config){
        super({
            name:'knocked down',
            iconSrc: "./assets/media/icons/falling.png",
            holder: config.holder,
            maxCharges: 1,
            soundEffectSrc: "./assets/audio/soundEffects/vine-boom-sound-effect.mp3",
            targetAnimation: 'shake',
            abilityAnimation: 'none',
        });
    }
    onStartTurn(){
        return this.activateHelpper(
            ()=>{
                this.message = `${this.holder.name} is knocked down.`;
                this.holder.nextAbility = new Struggle({});
                this.holder.abilityTargets = [this.holder];
                this.currentCharges --;
            }, 
            {
                text: true,
                animation: true,
                vitalsUpdate: true,
            }
        );
    }
}
export class InstaDeath extends StatusEffect{
    constructor(config){
        super({
            name:'instaDeath',
            holder: config.holder,
            maxCharges: 99,
            soundEffectSrc: "./assets/audio/soundEffects/cold-wind-fade.wav",
            targetAnimation: 'shake',
            abilityAnimation: 'none',
        });
    }
    onRemove(){
        for(let i = 0; i < this.holder.statusArray.length; i++){
            if(this.holder.statusArray[i].name == this.name){
                this.holder.statusArray.splice(i, 1);
                break;
            }
        }
    }
    onRecieveDamage(){
        this.holder.currentHP = 0;
        this.onRemove();
    }
}

export class Blessed extends StatusEffect{
    constructor(config){
        super({
            name:'blessed',
            iconSrc: "./assets/media/icons/blessed.png",
            holder: config.holder,
            maxCharges: 5,
            soundEffectSrc: "./assets/audio/soundEffects/mixkit-light-spell-873.wav",
        });
    }
    onEndTurn(){
        return this.activateHelpper(
            ()=>{
                let healthRestore = this.checkRestore(this.holder, this.holder.maxHP * 0.1, 'health');
                this.holder.currentHP += healthRestore;
                this.message = `${this.holder.name} restores health from blessings.`;
                this.currentCharges --;
            }, 
            {
                text: true,
                animation: true,
                vitalsUpdate: true,
            }
        );
    }
}

export class Cursed extends StatusEffect{
    constructor(config){
        super({
            name:'cursed',
            iconSrc: "./assets/media/icons/cursed.png",
            holder: config.holder,
            maxCharges: 5,
            soundEffectSrc: "./assets/audio/soundEffects/totem-strike-96497.wav",
        });
        this.inflicter = config.inflicter;
    }
    onEndTurn(){
        return this.activateHelpper(
            ()=>{
                let damage = this.checkDamage(this.holder, this.holder.maxHP * 0.05, 'health');
                this.holder.currentHP = this.holder.currentHP - damage;

                let healthRestore = this.checkRestore(this.inflicter, damage, 'health');
                this.inflicter.currentHP += healthRestore;
                
                this.message = `${this.holder.name} suffers from curse.`;
                this.currentCharges --;
            }, 
            {
                text: true,
                animation: true,
                vitalsUpdate: true,
            }
        );
    }
}