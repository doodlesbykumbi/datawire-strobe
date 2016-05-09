import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { mapStrobeState } from '../utils';

import { Table, Thead, Th, Tr, Td } from 'reactable';
import { CaseInsensitive as sortAlpha } from 'reactable';
import { NumericInteger as sortInteger } from 'reactable';

import { Error } from './Error';
import { UserInfo } from './UserInfo';
import { Dashboard } from './Dashboard.jsx';
import { MenuItem } from './MenuItem.jsx';

import classNames from 'classnames/bind';



const menuItems = [
    {
        title: "Dashboard",
        svgSrc:"assets/active_dashboard_icon.svg",
    },
    {
        title: "Services",
        svgSrc:"assets/active_services_icon.svg",
    },
    {
        title: "Monitor",
        svgSrc:"assets/active_monitor_icon.svg",
    }
];

const pages = [
    <Dashboard/>,
    'something',
    'another'
];


const DashboardWrapperCore = React.createClass({
    mixins: [PureRenderMixin],
    getInitialState: function() {
        return {
            currentMenuItem: 0
        };
    },
    componentDidMount: function () {
        // Elements to inject
        var mySVGsToInject = this.refs.root.querySelectorAll('img.inject-me');
        // Do the injection
        SVGInjector(mySVGsToInject);
    },
    handleMenuClick: function(index) {
        this.setState({
            currentMenuItem: index,
        });
    },
    render: function () {

        const menus = menuItems.map((menuItem, index) => {
            const boundClick = this.handleMenuClick.bind(this, index);
            return (
                <MenuItem onClick={ boundClick } key={ index } {...menuItem} active={ this.state.currentMenuItem == index }/>
            );
        });

        return (
            <div ref="root">
                {/* Responsive sidebar menu */}
                <div className="ui sidebar inverted vertical menu">
                    <div className="item" href="./login.html">
                        <h4 className="ui header">
                            <img className="ui image" src="assets/user_icon.svg"/>
                            <div className="content">
                                Hello, Richard
                            </div>
                        </h4>
                    </div>
                    { menus }
                </div>
                <div className="pusher">
                    <div className="ui grid container">
                        {/* Non-responsive main left menu */}
                        <div className="ui left fixed vertical inverted menu">
                            <div className="item"/>
                            <div className="item" href="./login.html">
                                <h4 className="ui header">
                                    <img className="ui image" src="assets/user_icon.svg"/>
                                    <div className="content">
                                        Hello, Richard
                                    </div>
                                </h4>
                            </div>
                            <div className="item"/>
                            <div className="item"/>
                            { menus }
                        </div>
                        <div className="ui main grid">
                            {/* Responsive top menu */}
                            <div className="ui fixed inverted main menu">
                                <div className="ui container">
                                    <a className="launch item sidebar-toggle">
                                        <img className="ui image" src="assets/list-view.svg" alt/>
                                    </a>
                                </div>
                            </div>

                            <div className="ui one column row header">
                                <div className="column">
                                    <h1>{ menuItems[this.state.currentMenuItem].title }</h1>
                                    <div className="ui clearing divider"/>
                                </div>
                            </div>
                            { pages[this.state.currentMenuItem] }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export const DashboardWrapper = mapStrobeState(DashboardWrapperCore);
