class CharacterSheet
{
    constructor()
    {
        //metadata
        let owners = [];

        //charater info
        let charname = "";
        let xp = 0;
        let assets = [];

        //attributes
        let edge = 0;
        let heart = 0;
        let iron = 0;
        let shadow = 0;
        let wits = 0;

        // momentum
        let momentum = 0;
        let momentum_max = 10;
        let momentum_min = -6;
        

        //status tracks
        let health = 5;
        let spirit = 5;
        let supply = 5;

        //conditions
        let wounded = false;
        let shaken = false;
        let unprepared = false;
        let encumbered = false;

        //banes
        let harmed = false;
        let corrupted = false;

        //burdens
        let cursed = false;
        let tormented = false;

        //vows
        let bonds = 0;
        let vows = [];
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
        let text = "";
        let track = 0;
        let type = 0;
    }
};

module.exports = { CharacterSheet: CharacterSheet, VowType: VowType, Vow: Vow };