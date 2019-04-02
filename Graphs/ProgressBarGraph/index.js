import React from "react";
import * as d3 from "d3";

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
        } = this.getConfiguredProperties();

        const xLabelFn = (d) => d[xColumn];
        const yLabelFn = (d) => d[yColumn];
        const scale = this.scaleColor(data, xColumn);
        const getColor = (d) => scale ? scale(d[colorColumn || xColumn]) : colors[0];

        let xAxisHeight = xLabel ? chartHeightToPixel : 0;

        let yAxisLabelWidth = this.longestLabelLength(data, yLabelFn, yTickFormat) * chartWidthToPixel;

        let overAllAvailableWidth = width - (margin.left + margin.right);
        let maxWidthPercentage = 0.20;
        let trucatedYAxisWidth = ((overAllAvailableWidth * maxWidthPercentage) < yAxisLabelWidth ? (overAllAvailableWidth * maxWidthPercentage) : yAxisLabelWidth);

        let leftMargin = margin.left + trucatedYAxisWidth;
        let availableWidth = overAllAvailableWidth - trucatedYAxisWidth;
        let availableHeight = height - (margin.top + margin.bottom + chartHeightToPixel + xAxisHeight);

        let paddedYAxisWidth = trucatedYAxisWidth - 40;
        
        let xScale, yScale;

        xScale = d3.scaleLinear()
            .domain([0, d3.max(data, xLabelFn)]);
        yScale = d3.scaleBand()
            .domain(data.map(yLabelFn))
            .padding(padding);
        

        xScale.range([0, availableWidth]);
        yScale.range([availableHeight, 0]);

        const xAxis = d3.axisBottom(xScale)
            .tickSizeOuter(xTickSizeOuter);

        if (xTickFormat) {
            xAxis.tickFormat(d3.format(xTickFormat));
        }

        if (xTicks) {
            xAxis.ticks(xTicks);
        }

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
                <svg
                    style={{
                        width: width,
                        height: height
                    }}
                >
                    <g transform={`translate(${leftMargin},${margin.top})`} >
                        {isXAxis && <AxisGraph
                            type="xAxis"
                            data={xAxis}
                            height={availableHeight}
                        />}
                        {isYAxis && <AxisGraph
                            type="yAxis"
                            data={yAxis}
                            width={paddedYAxisWidth}
                        />}
                        {data.map((d, i) => {
                            // Compute rectangle depending on orientation (vertical or horizontal).
                            const {
                                x,
                                y,
                                width,
                                height,
                                textHeight = 0
                            } = {
                                    x: 0,
                                    y: yScale(d[yColumn]),
                                    width: xScale(d[xColumn]),
                                    height: yScale.bandwidth() * 0.75,
                                    textHeight: yScale.bandwidth() * 0.10
                                };
                                

                            return (
                                <g>
                                    <rect
                                        x={x}
                                        y={y + textHeight}
                                        width={availableWidth}
                                        height={height}
                                        fill={'#d8cdcd'}
                                        key={i + 100}
                                    />
                                    <rect
                                        x={x}
                                        y={y + textHeight}
                                        width={width}
                                        height={height}
                                        fill={getColor(d)}
                                        key={i}
                                    />
                                    <GraphText
                                        type="label"
                                        x={x}
                                        y={y}
                                        data={d[yColumn]}
                                    />
                                    <GraphText
                                        type="text"
                                        isPercentage={true}
                                        x={availableWidth}
                                        y={y}
                                        data={d[xColumn]}
                                        height={height}
                                    />
                                </g>
                            );
                        })}
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