import React from 'react';
import * as d3 from "d3";

export default class YAxisGraph extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const { yAxis, vertical, paddedYAxisWidth } = this.props; 
        return (
            <g
                key="yAxis"
                ref={ (el) => (!vertical) ? d3.select(el).call(yAxis).selectAll(".tick text").call(this.wrapD3Text, paddedYAxisWidth) : d3.select(el).call(yAxis) }
            />
        );
    } 
}