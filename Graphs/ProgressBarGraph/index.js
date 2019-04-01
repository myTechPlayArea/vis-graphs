import React from "react";
import * as d3 from "d3";

import XAxisGraph from './XAxisGraph';
import YAxisGraph from './YAxisGraph';
import GraphText from './GraphText';
import XYGraph from "../XYGraph";
import "./style.css";
import {properties} from "./default.config"

export default class ProgressBarGraph extends XYGraph {

    constructor(props) {
        super(props, properties);
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
          orientation,
          padding,
          xColumn,
          xLabel,
          xTickFormat,
          xTickGrid,
          xTicks,
          xTickSizeInner,
          xTickSizeOuter,
          yColumn,
          yTickFormat,
          yTickGrid,
          yTicks,
          yTickSizeInner,
          yTickSizeOuter,
        } = this.getConfiguredProperties();

        const vertical         = orientation        === "vertical";
        const xLabelFn         = (d) => d[xColumn];
        const yLabelFn         = (d) => d[yColumn];
        const scale            = this.scaleColor(data, vertical ? yColumn : xColumn);
        const getColor         = (d) => scale ? scale(d[colorColumn || (vertical ? yColumn : xColumn)]) : colors[0];

        let xAxisHeight       = xLabel ? chartHeightToPixel : 0;
        
        let yAxisLabelWidth   = this.longestLabelLength(data, yLabelFn, yTickFormat) * chartWidthToPixel;
        
        let overAllAvailableWidth = width - (margin.left + margin.right);
        let maxWidthPercentage = 0.20;
        let trucatedYAxisWidth = ((overAllAvailableWidth * maxWidthPercentage) < yAxisLabelWidth ? (overAllAvailableWidth * maxWidthPercentage) : yAxisLabelWidth);
        
        let leftMargin        = margin.left + trucatedYAxisWidth;
        let availableWidth    = overAllAvailableWidth - trucatedYAxisWidth;
        let availableHeight   = height - (margin.top + margin.bottom + chartHeightToPixel + xAxisHeight);

        let paddedYAxisWidth = trucatedYAxisWidth - 40;

        let xScale, yScale;
        if (vertical) {
            // Handle the case of a vertical bar chart.
            xScale = d3.scaleBand()
              .domain(data.map(xLabelFn))
              .padding(padding);
            yScale = d3.scaleLinear()
              .domain([0, d3.max(data, yLabelFn)]);

        } else {
            // Handle the case of a horizontal bar chart.
            xScale = d3.scaleLinear()
              .domain([0, d3.max(data, xLabelFn)]);
            yScale = d3.scaleBand()
              .domain(data.map(yLabelFn))
              .padding(padding);
        }

        xScale.range([0, availableWidth]);
        yScale.range([availableHeight, 0]);
        
        const xAxis = d3.axisBottom(xScale)
          .tickSizeInner(xTickGrid ? -availableHeight : xTickSizeInner)
          .tickSizeOuter(xTickSizeOuter);

        if(xTickFormat){
            xAxis.tickFormat(d3.format(xTickFormat));
        }

        if(xTicks){
            xAxis.ticks(xTicks);
        }

        const yAxis = d3.axisLeft(yScale)
          .tickSizeInner(yTickGrid ? -availableWidth : yTickSizeInner)
          .tickSizeOuter(yTickSizeOuter);

        if(yTickFormat){
            yAxis.tickFormat(d3.format(yTickFormat));
        }

        if(yTicks){
            yAxis.ticks(yTicks);
        }

        let barWidth;

        if(vertical){
            barWidth = xScale.bandwidth();
        }

        return (
            <div className="bar-graph">
                {this.tooltip}
                <svg
                    style={{
                        width: width,
                        height: height
                    }}
                    >
                    <g transform={ `translate(${leftMargin},${margin.top})` } >
                        <XAxisGraph 
                           width={barWidth}
                           data={xAxis}
                           vertical={vertical}
                           height={availableHeight} 
                        />
                        <YAxisGraph 
                           data={yAxis}
                           vertical={vertical}
                           width={paddedYAxisWidth} 
                        />
                        {data.map((d, i) => {
                            // Compute rectangle depending on orientation (vertical or horizontal).
                            const {
                                x,
                                y,
                                width,
                                height,
                                textHeight= 0
                            } = (
                                vertical ? {
                                    x: xScale(d[xColumn]),
                                    y: yScale(d[yColumn]),
                                    width: barWidth,
                                    height: availableHeight - yScale(d[yColumn])
                                } : {
                                    x: 0,
                                    y: yScale(d[yColumn]),
                                    width: xScale(d[xColumn]),
                                    height: yScale.bandwidth() * 0.75,
                                    textHeight: yScale.bandwidth() * 0.10
                                }
                            );

                            return (
                                <g>
                                    <rect
                                        x={ x }
                                        y={ y + textHeight }
                                        width={ availableWidth }
                                        height={ height }
                                        fill={'#d8cdcd'}
                                        key={ i + 100 }
                                    />
                                    <rect
                                        x={ x }
                                        y={ y + textHeight }
                                        width={ width }
                                        height={ height }
                                        fill={ getColor(d) }
                                        key={ i }
                                        { ...this.tooltipProps(d) }
                                    />
                                    <GraphText 
                                        key="label"
                                        x={ x }
                                        y={ y }
                                        data={ d[yColumn] }
                                    />
                                    <GraphText
                                        key="text"
                                        x={ availableWidth }
                                        y={ y }
                                        data={ d[xColumn] }
                                        height = {height}
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