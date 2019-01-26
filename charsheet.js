class CharacterSheet
{
    constructor()
    {
        //metadata
        this.owners = [];

        //charater info
        this.charname = "";
        this.xp = 0;
        this.assets = [];

        //attributes
        this.edge = 0;
        this.heart = 0;
        this.iron = 0;
        this.shadow = 0;
        this.wits = 0;

        // momentum
        this.momentum = 0;
        this.momentum_max = 10;
        this.momentum_min = -6;
        

        //status tracks
        this.health = 5;
        this.spirit = 5;
        this.supply = 5;

        //conditions
        this.wounded = false;
        this.shaken = false;
        this.unprepared = false;
        this.encumbered = false;

        //banes
        this.harmed = false;
        this.corrupted = false;

        //burdens
        this.cursed = false;
        this.tormented = false;

        //vows
        this.bonds = 0;
        this.vows = [];
    }
    
    countDebilities()
    {
        let count = 0;
        if(this.wounded) count++;
        if(this.shaken) count++;
        if(this.unprepared) count++;
        if(this.encumbered) count++;

        if(this.harmed) count++;
        if(this.corrupted) count++;

        if(this.cursed) count++;
        if(this.tormented) count++;

        return count;
    }

    resetMomentum()
    {
        let debilities = this.countDebilities();

        this.momentum = max(0, 2 - conditions);
    }

    addMomentum(val)
    {
        this.momentum += val;
        if(this.momentum > momentum_max) momentum = momentum_max;
        if(this.momentum < momentum_min)
        {
            momentum = momentum_min;
            return -1; // TODO outer context should recognize this trigger for "Face a setback"
        }

        return 0;
    }
};

// this is an enum
const VowType = {
    NONE: 0,
    TROUBLESOME: 1,
    DANGEROUS: 2,
    FORMIDIBLE: 3,
    EXTREME: 4,
    EPIC: 5,
}

class Vow
{
    constructor()
    {
        this.text = "";
        this.track = 0;
        this.type = 0;
    }
};

module.exports = { CharacterSheet: CharacterSheet, VowType: VowType, Vow: Vow };