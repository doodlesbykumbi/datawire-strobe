import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { mapStrobeState } from '../utils';

import { Table, Thead, Th, Tr, Td } from 'reactable';
import { CaseInsensitive as sortAlpha } from 'reactable';
import { NumericInteger as sortInteger } from 'reactable';

import { Error } from './Error';
import { UserInfo } from './UserInfo';

import classNames from 'classnames/bind';

const MenuItemCore = React.createClass({
    mixins: [PureRenderMixin],
    componentDidMount: function () {
        // Elements to inject
        //var mySVGsToInject = this.refs.root.querySelectorAll('img.inject-me');

        // Do the injection
        //SVGInjector(mySVGsToInject);
    },
    render: function () {
        let menuItemClass = classNames({
            'item': true,
            'active': this.props.active
        });

        return (
            <a onClick={ this.props.onClick } className={ menuItemClass }>
                <img className="ui right spaced image" src={ this.props.svgSrc}/>
                <span>{ this.props.title }</span>
            </a>
        );
    }
});

export const MenuItem = mapStrobeState(MenuItemCore);
