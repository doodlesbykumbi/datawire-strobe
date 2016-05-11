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
    focus: function(service, endpoints) {
        var logger = this.props.logger;

        logger.info("FOCUS: " + service);

        this.props.dispatch({
            type: 'FOCUS',
            focusedService: {
                service: service,
                endpoints: endpoints
            }
        })
    },
    getInitialState: function () {
        return {
            service: ''
        }
    },
    handleSidebarClick: function(service) {
        this.setState({ service });
        $(this.refs.sidebar).sidebar('setting', 'transition', 'overlay').sidebar('toggle');
    },
    componentWillUnmount: function(){
        $(this.refs.sidebar).remove();
    },
    render: function () {

        var routes = this.props.routes;

        var table = <div>Waiting for service info...</div>

            var rows = [];
            var i = 0;
            routes.forEach((endpoints, service) => {
                rows.push(
                    <ListItem index={ i++ } title={service} onClick={ this.handleSidebarClick.bind(this, service) }/>
                );
            });

        var service = this.state.service;
        var endpoints = routes.get(service);
        console.log(service, endpoints)
        var sideBarRows = endpoints ? endpoints.map(endpoint =>
            <tr>
                <td>{ endpoint.host }</td>
                <td>{ endpoint.port }</td>
            </tr>) : null;

        return (
                    <div className="ui one column row" ref="root">
                        <div className="ui sidebar very wide right" ref="sidebar">
                            <div className style={{background: 'white', height: '100%', paddingTop: '4rem', color: 'black'}}>
                                <div className="ui grid container">
                                    <div className="ui one column row">
                                        <div className="column">
                                            <h2 className="heading">{ this.state.service }</h2>
                                            <div className="ui clearing divider">
                                            </div>
                                        </div>
                                        <div className="column">
                                            <table className="ui very basic table">
                                                <thead>
                                                <tr className="header">
                                                    <th>Running Instances</th>
                                                    <th>Port</th>
                                                </tr>
                                                </thead>
                                                <tbody className="content">

                                                { sideBarRows }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ui column">
                            <div className="ui two column grid middle aligned">
                                <div className="column">
                                    <h2 className="header">Services
                                    </h2>
                                </div>
                                <div className="right aligned column">
                                    <div className="inline-button lightable">
                                        <img className="vertical-center inject-me" src="assets/grid_view.svg" alt/>
                                    </div>
                                    <div className="inline-button active lightable">
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
                            { rows.length ? rows : <div>No services registered</div> }
                        </div>
                    </div>
        );
    }
});

export const Dashboard = mapStrobeState(DashboardCore);
