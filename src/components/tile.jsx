import React from 'react';

export default class Tile extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            alive: props.alive
        }
    }

    getAliveClass () {
        return (this.state.alive ? 'tile--alive' : 'tile--dead');
    }

    render () {
        return ( <div className={ this.getAliveClass() }></div> );
    }
}