

/**
 * Rules:
 * Underpopulation
 * 1. Alive && livingNeighbors < 2 : cellDies
 * 
 * Stable local population
 * 2. Alive && livingNeighbors > 1 && livingNeighors < 4 : cellLives
 * 
 * Overpopulation
 * 3. Alive && livingNeighbors > 3 : cellDies
 * 
 * Reproduction
 * 4. !Alive && livingNeighbors == 3: cellLives 
 */

export default class CellularAutomata {
    static computeCellLife(alive, livingNeighbors) {
        if(alive) {
            if(livingNeighbors < 2) {
                return false;
            }

            if(livingNeighbors > 1 && livingNeighbors < 4) {
                return true;
            }

            if(livingNeighbors > 3) {
                return false;
            }
        } else {
            if(livingNeighbors === 3) {
                return true;
            }
        }
    }
}