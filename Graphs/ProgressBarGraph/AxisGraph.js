import React from 'react';
import * as d3 from "d3";

export default class AxisGraph extends React.Component {
    constructor(props) {
        super(props);
    }

    getRef = () => {
        const { height, width, data} = this.props;
        if(height) {
            return  (el) =>  d3.select(el).call(data).selectAll(".tick text");
        } else {
            return (el) =>  d3.select(el).call(data).selectAll(".tick text").call(this.wrapD3Text, width);
        }
    }
    
    render() {
        const { height,type } = this.props; 
        return (
            <g
                key={type}
                ref={this.getRef()}
                transform={ height ? `translate(0, ${height})`: '' }
            />
        );
    } 
}