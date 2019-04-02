import React from 'react';

export default class GraphText extends React.Component {
    constructor(props) {
        super(props);
    }

    getX = () => {
        const { x, data, height, isPercentage, chartWidthToPixel = 5 } = this.props;
        if (isPercentage) {
            return x * 1.01;
        }
        return height ? x - data.toString().length * chartWidthToPixel : 0
    }

    getY = () => {
        const { y, height, isPercentage } = this.props;
        if (isPercentage) {
            return y - (height * 0.75);
        }
        return y
    }


    render() {
        const { data, type } = this.props;
        return (
            <text className={type} x={this.getX()} y={this.getY()}>
                {data}
            </text>
        );
    }
}