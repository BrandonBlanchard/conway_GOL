

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
    static startState = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    static computeCellLife(grid, x, y) {
        const cell = { alive: grid.getCell(x, y).alive };
        const livingNeighbors = CellularAutomata.getLivingNeighbors(grid, x, y);

        if( cell.alive && livingNeighbors > 1 && livingNeighbors < 4) {
            cell.alive = true;

            return cell;
        }

        if(!cell.alive && livingNeighbors === 3) {
            cell.alive = true;
            
            return cell;
        }

        cell.alive = false;
    
        return cell;
    }

    // Move to automata
    static getLivingNeighbors (grid, x, y) {
        let livingNeighbors = 0;
    
        // North
        livingNeighbors += grid.getWrappedCell(x, y - 1).alive ? 1 : 0;
        
        // North East
        livingNeighbors += grid.getWrappedCell(x + 1, y - 1).alive ? 1 : 0;

        // East
        livingNeighbors += grid.getWrappedCell(x + 1, y).alive ? 1 : 0;
        
        // South East
        livingNeighbors += grid.getWrappedCell(x + 1, y + 1).alive ? 1 : 0;

        // South 
        livingNeighbors += grid.getWrappedCell(x, y + 1).alive ? 1 : 0;

        // South West
        livingNeighbors += grid.getWrappedCell(x - 1, y + 1).alive ? 1 : 0;

        // West
        livingNeighbors += grid.getWrappedCell(x - 1, y).alive ? 1 : 0;

        // North West
        livingNeighbors += grid.getWrappedCell(x - 1, y - 1).alive ? 1 : 0;
        
        return livingNeighbors;
    }


    // Drop whatever is in the initial state grid into the view grid
    static getInitialState(x,y, width, height) {
        let ran = Math.random() * 20 + 1;
        
        let xOffset = Math.floor((width - CellularAutomata.startState[0].length)/2);
        let yOffset = Math.floor((height - CellularAutomata.startState.length)/2);

        if( y - yOffset < 0 ||
            x - xOffset < 0 ||
            x - xOffset >= CellularAutomata.startState[0].length ||
            y - yOffset >= CellularAutomata.startState.length) {

            return { alive: false };
        }
       
        if(CellularAutomata.startState[y - yOffset][x - xOffset] === 1) {
            return { alive: true }
        }

        return { alive: false }
    }
}