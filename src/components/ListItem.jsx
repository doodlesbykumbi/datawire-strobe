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

        $(this.refs.root)
            .accordion();
    },
    handleAccordionClick: function () {
        $(this.refs.root)
            .accordion('toggle', 1);
    },
    render: function () {
        return (
            <div className="ui segments fluid accordion" ref="root">
                <div className="ui segment listitem running">
                    <div className="ui grid middle aligned">
                        <div className="ui twelve wide tablet nine wide computer column title good" onClick={ this.props.onClick }>
                            <img className="ui right spaced image inject-me" src="assets/active_service_icon.svg"/>
                            <span>{ this.props.title }</span>
                        </div>
                        <div className="three wide computer only column">
                        </div>
                        <div className="four wide tablet four wide computer right aligned column">
                            <div onClick={ this.handleAccordionClick }  className="inline-button lightable" >
                                <img className="vertical-center inject-me" src="assets/more.svg" alt/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui title"></div>
                <div className="ui segment detailitem content">
                    <div className="ui fluid">
                    <div className="ui grid">
                        <div className="two wide column border-right">
                        </div>
                        <div className="fourteen wide column">
                            <div className="ui one column grid">
                                <div className="column">
                                    <div className="ui grid middle aligned">
                                        <div className="sixteen wide column">
                                           Version 1.0 <i className="circle tiny icon green"></i>
                                        </div>
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
