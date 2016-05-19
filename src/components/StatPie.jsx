import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { mapStrobeState } from '../utils';

import { Error } from './Error';
import { UserInfo } from './UserInfo';

let colours = {
    'healthy': {
        color: '#7ED321',
        name: 'Healthy'
    },
    'unhealthy':{
        color: '#FF485E',
        name: 'Unhealthy'
    },
    'running':{
        color: '#5FCBE6',
        name: 'Running Services'
    },
};

const StatPieCore = React.createClass({
    mixins: [PureRenderMixin],
    componentDidMount: function () {
        // Elements to inject
        // Do the injection

        $(this.refs.chart).easyPieChart({
            barColor: colours[this.props.type].color,
            trackColor: 'rgba(255, 255, 255, 0.1)',
            scaleColor: false,
            lineCap: 'round',
            lineWidth: 3,
            size: 110,
            animate: 1000,
        });
    },
    componentDidUpdate: function () {
        let value = this.props.value;
        let total = this.props.total;
        $(this.refs.chart).data('easyPieChart').update(value/total * 100);
    },
    render: function () {
        let value = this.props.value;
        let total = this.props.total;
        let totalSpan;
        if (this.props.type == "running") {
            totalSpan = <span>/{ total }</span>;
        }
        return (
            <div className="dashboard-stat column">
                <div className="ui center aligned segment">
                    <div className="row animated fadeInUp">
                        <div>
                            <div className="easy-pie-chart running" ref="chart" data-percent={ value/total * 100 }>
                                { value }{ totalSpan }
                            </div>
                        </div>
                        <h3 className="stat-label text-center">{ colours[this.props.type].name }</h3>
                    </div>
                </div>
            </div>

        );
    }
});

export const StatPie = mapStrobeState(StatPieCore);
