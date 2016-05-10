import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { mapStrobeState } from '../utils';

import { Error } from './Error';
import { UserInfo } from './UserInfo';

const ListItemCore = React.createClass({
    mixins: [PureRenderMixin],
    render: function () {
        return (
                <div className="ui segment listitem active">
                    <div className="ui grid middle aligned content">
                        <div className="twelve wide tablet five wide computer column title bad">
                            <img className="ui right spaced image inject-me" src="assets/active_service_icon.svg"/>
                            <span>Messenger System</span>
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
        );
    }
});

export const ListItem = mapStrobeState(ListItemCore);
