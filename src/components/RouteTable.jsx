import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { mapStrobeState } from '../utils';

import { Table } from 'reactable';

import { Error } from './Error';
import { UserInfo } from './UserInfo';

const RouteTableCore = React.createClass({
  mixins: [ PureRenderMixin ],

  render: function() {
    var routes = this.props.routes;
    var logger = this.props.logger;

    var table = <div>Waiting for service info...</div>

    if (routes != null) {
      table = <div>No services registered</div>;

      var foldedList = []

      routes.forEach((endpoints, service) => {
        logger.info("service " + service + " endpoints " + endpoints.length + ": " + JSON.stringify(endpoints));
        foldedList.push({ Service: service, Instances: endpoints.length });
      });


      if (foldedList.length > 0) {
        table = <Table className="routes" data={ foldedList } />;
      }
    }
    
    return <div>
      <Error />
      <UserInfo />
      { table }      
    </div>;
  }
});

export const RouteTable = mapStrobeState(RouteTableCore);
