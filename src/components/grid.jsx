import React from 'react';
import Tile from './tile';

import CellularAutomata from './../classes/cellular-automata';

const alive = true;

export default class Grid extends React.Component {
    constructor (props) {
        super(props);
        

        this.init = false;
        this.state = {
            width: props.width || 24,
            height: props.height || 24,
            playing: false,
            field: []
        }

        setTimeout(this.update.bind(this), 1000/15 );

        window.cell = CellularAutomata;
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
        for(let y = 0; y < this.state.height; y += 1) {
            field.push([]);

            for(let x = 0; x < this.state.width; x += 1) {
                field[y].push({ alive: this.getRandomLife() });
            }
        }

        nextState.field = field;
        nextState.playing = true;
        this.setState(nextState);
    }

    getRandomLife() {
        let ran = Math.random() * 20 + 1;
        
        if(ran > 18) {
            return true;
        }

        return false;
    }

    inRange(x,y) {
        if(x > 0 && y > 0 && x < this.state.width && y < this.state.height) {
            return true;
        }

        return false;
    }

    getCell(x,y) {
        if(this.inRange(x,y)) {
            return this.state.field[y][x];
        }

        return { alive:false };
    }

    getAdjacentOrWrappedCellLife(x,y) {
        let nx = x;
        let ny = y;

        if(x < 0) {
            nx = this.state.width - 1;
        }

        if(y < 0) {
            ny = this.state.height - 1;
        }

        if (x >= this.state.width - 1) {
            nx = 0;
        }

        if (y >= this.state.height - 1) {
            ny = 0;
        }

        return this.getCell(nx, ny);
    }

    getLivingNeighbors (x,y) {
        let livingNeighbors = 0;
        let debug = [['o','o','o'],
                     ['o','o','o'],
                     ['o','o','o']]

        // Self
        if(this.getAdjacentOrWrappedCellLife(x, y).alive) { debug[1][1] = 'x'; }

        // North
        livingNeighbors += this.getAdjacentOrWrappedCellLife(x, y - 1).alive ? 1 : 0;
        if(this.getAdjacentOrWrappedCellLife(x, y - 1).alive) { debug[0][1] = 'x'; }
        
        // North East
        livingNeighbors += this.getAdjacentOrWrappedCellLife(x + 1, y - 1).alive ? 1 : 0;
        if(this.getAdjacentOrWrappedCellLife(x + 1, y - 1).alive) { debug[0][2] = 'x'; }

        // East
        livingNeighbors += this.getAdjacentOrWrappedCellLife(x + 1, y).alive ? 1 : 0;
        if(this.getAdjacentOrWrappedCellLife(x + 1, y).alive) { debug[1][2] = 'x' };
        
        // South East
        livingNeighbors += this.getAdjacentOrWrappedCellLife(x + 1, y + 1).alive ? 1 : 0;
        if(this.getAdjacentOrWrappedCellLife(x + 1, y + 1).alive) { debug[2][2] = 'x'; }

        // South 
        livingNeighbors += this.getAdjacentOrWrappedCellLife(x, y + 1).alive ? 1 : 0;
        if(this.getAdjacentOrWrappedCellLife(x, y + 1).alive) { debug[2][1] = 'x' };

        // South West
        livingNeighbors += this.getAdjacentOrWrappedCellLife(x - 1, y + 1).alive ? 1 : 0;
        if(this.getAdjacentOrWrappedCellLife(x - 1, y + 1).alive) { debug[2][0] = 'x'; }

        // West
        livingNeighbors += this.getAdjacentOrWrappedCellLife(x - 1, y).alive ? 1 : 0;
        if(this.getAdjacentOrWrappedCellLife(x - 1, y).alive) { debug[1][0] = 'x' };

        // North West
        livingNeighbors += this.getAdjacentOrWrappedCellLife(x - 1, y - 1).alive ? 1 : 0;
        if(this.getAdjacentOrWrappedCellLife(x - 1, y - 1).alive) { debug[0][0] = 'x'; }
        
        // console.log(debug[0]);
        // console.log(debug[1]);
        // console.log(debug[2]);
        // console.log('neighbors for (' + x + ',' + y + ')', livingNeighbors);
        // console.log('-----------------')


        return livingNeighbors;
    }


    update () {
        if(!this.state.playing) { 
            setTimeout(this.update.bind(this), 1000/15 );
            return; 
        }
        const nextState = this.state;
        const nextField = this.state.field;

        // Loop through each cell
        for(let y = 0; y < this.state.height; y += 1) {
            for(let x = 0; x < this.state.width; x += 1) {
                // Get neighbor states
                let livingNeighbors = this.getLivingNeighbors(x,y);
                
                // Compute cell life
                nextField[y][x].alive = CellularAutomata.computeCellLife(this.getCell(x,y).alive, livingNeighbors);
            }
        }

        // Run each cell through the cellular automata
        nextState.field = nextField;
        this.setState(nextState, () => {
            setTimeout(this.update.bind(this), 1000/5 );
        });

        // debugger;
        console.clear();

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
                            return (<Tile key={rowIndex + ',' + tileIndex + '_' + tile.alive} alive={ tile.alive }></Tile>)
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