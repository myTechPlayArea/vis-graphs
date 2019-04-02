import React from "react";
import * as d3 from "d3";

import { theme } from '../../theme';
import AxisGraph from './AxisGraph';
import GraphText from './GraphText';
import AbstractGraph from "../AbstractGraph";
import "./style.css";

export default class ProgressBarGraph extends AbstractGraph {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            data,
            width,
            height
        } = this.props;

        if (!data || !data.length)
            return;

        const {
            chartHeightToPixel,
            chartWidthToPixel,
            colorColumn,
            colors,
            margin,
            padding,
            xColumn,
            xLabel,
            xTickFormat,
            xTicks,
            xTickSizeOuter,
            yColumn,
            yTickFormat,
            yTicks,
            yTickSizeOuter,
            isXAxis,
            isYAxis,
            isPercentage,
        } = this.getConfiguredProperties();

        const xLabelFn = (d) => d[xColumn];
        const yLabelFn = (d) => d[yColumn];
        const scale = this.scaleColor(data, xColumn);
        const getColor = (d) => scale ? scale(d[colorColumn || xColumn]) : colors[0];
        const xAxisHeight = xLabel ? chartHeightToPixel : 0;
        const yAxisLabelWidth = this.longestLabelLength(data, yLabelFn, yTickFormat) * chartWidthToPixel;
        const overAllAvailableWidth = width - (margin.left + margin.right);
        const maxWidthPercentage = 0.20;
        const trucatedYAxisWidth = ((overAllAvailableWidth * maxWidthPercentage) < yAxisLabelWidth ? (overAllAvailableWidth * maxWidthPercentage) : yAxisLabelWidth);
        const leftMargin = margin.left + trucatedYAxisWidth;
        const availableHeight = height - (margin.top + margin.bottom + chartHeightToPixel + xAxisHeight);
        const paddedYAxisWidth = trucatedYAxisWidth - 40;

        let availableWidth = overAllAvailableWidth - trucatedYAxisWidth;
        let xScale, yScale;

        if (isPercentage) {
            availableWidth -= this.longestLabelLength(data, xLabelFn, yTickFormat) * chartWidthToPixel;
        }

        xScale = d3.scaleLinear()
            .domain([0, d3.max(data, xLabelFn)])
            .range([0, availableWidth]);

        const xAxis = d3.axisBottom(xScale)
            .tickSizeOuter(xTickSizeOuter);

        if (xTickFormat) {
            xAxis.tickFormat(d3.format(xTickFormat));
        }

        if (xTicks) {
            xAxis.ticks(xTicks);
        }

        yScale = d3.scaleBand()
        .domain(data.map(yLabelFn))
        .padding(padding)
        .range([availableHeight, 0]);

        const yAxis = d3.axisLeft(yScale)
            .tickSizeOuter(yTickSizeOuter);

        if (yTickFormat) {
            yAxis.tickFormat(d3.format(yTickFormat));
        }

        if (yTicks) {
            yAxis.ticks(yTicks);
        }

        return (
            <div className="progress-graph">
                <svg style={{ width, height }} >
                    <g transform={`translate(${leftMargin},${margin.top})`} >
                        { isXAxis && <AxisGraph type="xAxis" data={xAxis} height={availableHeight}/> }
                        { isYAxis && <AxisGraph type="yAxis" data={yAxis} width={paddedYAxisWidth}/> }
                        { 
                            data.map((d, i) => {
                                // Compute rectangle depending on orientation (vertical or horizontal).
                                const x = 0;
                                const y = yScale(d[yColumn]);
                                const width = xScale(d[xColumn]);
                                const height = yScale.bandwidth() * 0.60;
                                const barHeight = y + yScale.bandwidth() * 0.05;

                                return (
                                    <g>
                                        <rect
                                            key={i+y}
                                            x={x}
                                            y={barHeight}
                                            width={availableWidth}
                                            height={height}
                                            fill={theme.palette.greyLightColor}
                                        />
                                        <rect
                                            key={i}
                                            x={x}
                                            y={barHeight}
                                            width={width}
                                            height={height}
                                            fill={getColor(d)}
                                        />
                                        <GraphText
                                            type="label"
                                            x={x}
                                            y={y}
                                            data={d[yColumn]}
                                        />
                                        <GraphText
                                            type="text"
                                            isPercentage={isPercentage}
                                            x={availableWidth}
                                            y={y + yScale.bandwidth() * 0.9}
                                            data={d[xColumn]}
                                            height={height}
                                        />
                                    </g>
                                );
                            })
                        }
                    </g>
                </svg>
            </div>
        );
    }
}

ProgressBarGraph.propTypes = {
    configuration: React.PropTypes.object,
    data: React.PropTypes.arrayOf(React.PropTypes.object),
};
