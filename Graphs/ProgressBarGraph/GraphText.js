import React from 'react';

export default class GraphText extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {x, y, data, height, key} = this.props
        return (
            <text 
                className = {key}
                x = {height ? x : 0}
                y = {height ? y+height/2 : y}
            > {data} 
            </text>
        ); 
    }
}