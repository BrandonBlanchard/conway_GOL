import React from 'react';
import Tile from './tile';

import CellularAutomata from './../classes/cellular-automata';

const alive = true;

export default class Grid extends React.Component {
    constructor (props) {
        super(props);
        

        this.init = false;
        this.state = {
            width: props.width || 64,
            height: props.height || 64,
            playing: false,
            field: []
        }

        this.updateLoop = setTimeout(this.update.bind(this), 1000/15 );
    }
    
    componentDidMount () {
        if(!this.init) {
            this.generateGrid();
            this.init = true;
        }
    }

    generateGrid() {
        const nextState = this.state;
        let field = [];

        // Generate the grid
        for(let h = 0; h < this.state.height; h += 1) {
            field.push([]);

            for(let w = 0; w < this.state.width; w += 1) {
                let isAlive = this.getRandomLife(h,w);
            
                field[h].push({ alive: isAlive });
            }
        }

        nextState.field = field;
        this.setState(nextState);
    }

    getRandomLife() {
        let ran = Math.random() * 20 + 1;
        
        if(ran > 18) {
            return alive;
        }

        return !alive;
    }

    inRange(x,y) {
        if(x > 0 && y > 0 && x < this.state.width && y < this.state.height) {
            return true;
        }

        return false;
    }

    getCell(x,y) {
        if(this.inRange(x,y)) {
            return this.state.field[x][y];
        }

        return false;
    }

    getLivingNeighbors (x,y) {
        let livingNeighbors = 0;
        
        // Javascript automatically casts true to a number when adding

        // North
        livingNeighbors += this.getCell(x, y + 1)
        
        // East
        livingNeighbors += this.getCell(x + 1, y);
        
        // South 
        livingNeighbors += this.getCell(x, y-1);

        // West
        livingNeighbors += this.getCell(x-1, y);

        return livingNeighbors;
    }


    update () {
        if(!this.state.playing) { return; }
        const nextState = this.state;
        const nextField = this.state.field;

        // Loop through each cell
        for(let y = 0; y < this.state.field.length; y += 1) {
            for(let x = 0; x < this.state.field[0]; x += 1) {
                // Get neighbor states
                let livingNeighbors = this.getLivingNeighbors(x,y);

                // Compute cell life
                nextField[y][x] = CellularAutomata.computeCellLife(this.getCell(x,y), livingNeighbors);
            }
        }

        console.log('updating');

        // Run each cell through the cellular automata
        nextState.field = nextField;
        this.setState(nextState);
    }

    play () {
        this.setState({play: true});
    }

    pause () {
        this.setState({play: false});
    }

    render () {
        return (
            <div className="grid" style={ {width: "" + 10 * this.state.width + "px"} }>
                
                { this.state.field.map( (row, rowIndex) => {
                    return(
                        row.map( (tile, tileIndex) => {
                            return (<Tile key={rowIndex + tileIndex + '_' + tile.alive} alive={ tile.alive }></Tile>)
                        })
                    );
                })}
                
                <div className="controls">
                    <button onClick={this.generateGrid.bind(this)}> Regen </button>
                    <button onClick={this.play.bind(this)}> Start </button>
                    <button onClick={this.pause.bind(this)}> Pause </button>
                </div>
            </div>
        );
    }
}