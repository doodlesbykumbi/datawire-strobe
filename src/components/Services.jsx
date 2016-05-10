import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { mapStrobeState } from '../utils';

import { Error } from './Error';
import { UserInfo } from './UserInfo';
import { ListItem } from './ListItem.jsx';

const ServicesCore = React.createClass({
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
                        <div className="column">
                            Services placeholder
                        </div>
                    </div>
        );
    }
});

export const Services = mapStrobeState(ServicesCore);
