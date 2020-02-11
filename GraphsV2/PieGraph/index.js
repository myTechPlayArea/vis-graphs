import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import {
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { 
    LEGEND_PERCENTAGE
} from './../../constants';
import { config } from './default.config';
import WithConfigHOC from '../../HOC/WithConfigHOC';
import WithValidationHOC from '../../HOC/WithValidationHOC';
import customTooltip from '../Components/utils/RechartsTooltip';
import renderLegend from '../Components/utils/Legend';
import { filterEmptyData } from "../../utils/helpers";
import { limit } from '../../utils/helpers/limit';

const colors = scaleOrdinal(schemeCategory10).range();

const PieGraph = (props) => {
    const {
        data: originalData,
        width,
        height,
        properties,
        onMarkClick
    } = props;

    const {
        otherOptions,
        labelColumn,
        pieInnerRadius,
        pieOuterRadius,
        showZero,
        sliceColumn,
        legend,
        tooltip,
        percentages
    } = properties;

    const settings = {
        "metric": sliceColumn,
        "dimension": labelColumn,
        "limitOption": otherOptions
    };

    const data = limit({
        data: filterEmptyData({
            data: originalData,
            column: sliceColumn,
            showZero: showZero
        }),
        ...settings
    });

    const type = percentages ? LEGEND_PERCENTAGE : undefined;

    return (
        <PieChart
            width={width}
            height={height}
            cursor={onMarkClick ? "pointer" : ''}
        >
           
            {   
                renderLegend({ legend, height, labelColumn, type})        
            }
            {
                customTooltip({ tooltip })
            }
            <Pie
                labelLine={false}
                data={data}
                innerRadius={pieInnerRadius * 100}
                outerRadius={pieOuterRadius * 100}
                dataKey={sliceColumn}
                onClick={
                    (d) => (
                        onMarkClick && (!otherOptions || d[labelColumn] !== otherOptions.label)
                            ? onMarkClick(d)
                            : ''
                    )
                }
            >
                {
                    data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))
                }
            </Pie>
        </PieChart>
    );
}

PieGraph.propTypes = {
    configuration: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.object),
};

export default compose(
    WithValidationHOC(),
    (WithConfigHOC(config))
)(PieGraph);
