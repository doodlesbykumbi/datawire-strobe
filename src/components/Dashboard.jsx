import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { mapStrobeState } from '../utils';

import { Error } from './Error';
import { UserInfo } from './UserInfo';
import { ListItem } from './ListItem.jsx';

const DashboardCore = React.createClass({
    mixins: [PureRenderMixin],
    componentDidMount: function () {
        // Elements to inject
        var mySVGsToInject = this.refs.root.querySelectorAll('img.inject-me');
        // Do the injection
        SVGInjector(mySVGsToInject);
    },
    render: function () {
        return (
                    <div className="ui one column row" ref="root">
                        <div className="ui column">
                            <div className="ui two column grid middle aligned">
                                <div className="column">
                                    <h2 className="header">Services
                                    </h2>
                                </div>
                                <div className="right aligned column">
                                    <div className="inline-button active lightable">
                                        <img className="vertical-center inject-me" src="assets/grid_view.svg" alt/>
                                    </div>
                                    <div className="inline-button lightable">
                                        <img className="vertical-center inject-me" src="assets/list-view.svg" alt/>
                                    </div>
                                    <div className="inline-button lightable">
                                        <img className="vertical-center inject-me" src="assets/add_icon.svg" alt/>
                                    </div>
                                </div>
                            </div>
                            <div className="ui clearing divider"/>
                        </div>
                        <div className="column">
                            <ListItem />
                            <ListItem />
                        </div>
                    </div>
        );
    }
});

export const Dashboard = mapStrobeState(DashboardCore);
