import React from 'react';
import * as d3 from "d3";

export default class XAxisGraph extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const { xAxis, barWidth, vertical, availableHeight } = this.props; 
        return (
            <div>
                <g
                    key="xAxis"
                    ref={ (el) => vertical ? d3.select(el).call(xAxis).selectAll(".tick text").call(this.wrapD3Text, barWidth) : d3.select(el).call(xAxis).selectAll(".tick text") }
                    transform={ `translate(0, ${availableHeight})` }
                />
            </div>
        );
    } 
}