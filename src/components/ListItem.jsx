import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { mapStrobeState } from '../utils';

import { Error } from './Error';
import { UserInfo } from './UserInfo';

const ListItemCore = React.createClass({
    mixins: [PureRenderMixin],
    componentDidMount: function () {
        console.log("meow");
        // Elements to inject
        var mySVGsToInject = this.refs.root.querySelectorAll('img.inject-me');
        // Do the injection
        SVGInjector(mySVGsToInject);
    },
    render: function () {
        return (
            <div className="ui segments" ref="root">
                <div className="ui segment listitem active">
                    <div className="ui grid middle aligned content">
                        <div className="twelve wide tablet five wide computer column title good">
                            <img className="ui right spaced image inject-me" src="assets/active_service_icon.svg"/>
                            <span>{ this.props.title }</span>
                        </div>
                        <div className="computer only four wide computer column version">
                            Version 1.0
                        </div>
                        <div className="three wide computer only column">
                        </div>
                        <div className="four wide tablet four wide computer right aligned column">
                            <div className="inline-button lightable">
                                <img className="vertical-center inject-me" src="assets/more.svg" alt/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui segment detailitem">
                    <div className="ui grid">
                        <div className="two wide column border-right">
                        </div>
                        <div className="fourteen wide column">
                            <div className="ui one column grid">
                                <div className="column">
                                    <div className="ui grid middle aligned content">
                                        <div className="sixteen wide column">
                                            <i className="circle tiny icon red"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui grid middle aligned content">
                                        <div className="sixteen wide column">
                                            <i className="circle icon red tiny"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
});

export const ListItem = mapStrobeState(ListItemCore);
