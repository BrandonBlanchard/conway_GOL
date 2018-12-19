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
            step: 0,//1000/64,
            playing: false,
            field: []
        }

        setTimeout(this.update.bind(this), this.state.step );
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
                field[y].push(CellularAutomata.getInitialState(x,y, this.state.width, this.state.height));
            }
        }

        nextState.field = field;
        nextState.playing = true;
        this.setState(nextState);
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

    getWrappedCell(x,y) {
        let nx = x;
        let ny = y;

        if(x < 0) {
            nx = this.state.width - 1;
        }

        if(y < 0) {
            ny = this.state.height - 1;
        }

        if (x >= this.state.width) {
            nx = 0;
        }

        if (y >= this.state.height) {
            ny = 0;
        }

        return this.getCell(nx, ny);
    }

    update () {
        if(!this.state.playing) {
            // Keep trying for a new frame, until we get one
            setTimeout(this.update.bind(this), this.state.step );
            return; 
        }

        const nextState = this.state;
        const nextField = [];

        for(let y = 0; y < this.state.height; y += 1) {
            nextField.push([]);

            for(let x = 0; x < this.state.width; x += 1) {

                // Compute cell life
                nextField[y].push(CellularAutomata.computeCellLife(this, x, y));
            }
        }

        nextState.field = nextField;
        this.setState(nextState, () => {
            // Push to queue, then execute when the stack clears
            setTimeout(this.update.bind(this), this.state.step );
        });
    }

    play () {
        this.setState({play: true});
    }

    pause () {
        this.setState({play: false});
    }

    render () {
        return (
            <div className="grid" style={ {width: "" + 6 * this.state.width + "px"} }>
                
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