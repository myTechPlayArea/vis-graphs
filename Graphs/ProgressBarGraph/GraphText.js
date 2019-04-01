import React from 'react';

export default class GraphText extends React.Component {
    constructor(props) {
        super(props);
    }

    getText = () => {
        const { y, height, isPercentage, type } = this.props;
        if (height && isPercentage && type === "text") {
            return y + height/2 + 6;
        } else if (height && !isPercentage && type === "text") {
            return y + height+10;
        } else {
            return y;
        }
    }

    render() {
        const { x, data, height, type } = this.props
        return (
            <text
                className={type}
                x={height ? x : 0}
                y={this.getText()}
            > {data}
            </text>
        );
    }
}