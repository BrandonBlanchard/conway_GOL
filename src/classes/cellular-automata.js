

/**
 * Rules:
 * Underpopulation
 * 1. Alive && livingNeighbors < 2 : cellDies
 * 
 * Stable local population
 * 2. Alive && livingNeighbors == 2 || livingNeighors == 3 : cellLives
 * 
 * Overpopulation
 * 3. Alive && livingNeighbors === 4 : cellDies
 * 
 * Reproduction
 * 4. !Alive && livingNeighbors == 3: cellLives 
 */

export default class CellularAutomata {
    static computeCellLife(alive, livingNeighbors) {

        if( alive && livingNeighbors > 1 && livingNeighbors < 4) {
            return true;
        }

        if(!alive && livingNeighbors === 3) {
            return true;
        }
    
        return false;
    }
}