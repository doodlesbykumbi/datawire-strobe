import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { mapStrobeState } from '../utils';

import { Table, Thead, Th, Tr, Td } from 'reactable';

import { Error } from './Error';
import { UserInfo } from './UserInfo';

const FocusedEntryCore = React.createClass({
  mixins: [ PureRenderMixin ],

  close: function() {
    this.props.dispatch({ type: 'DEFOCUS' });
  },

  render: function() {
    var routes = this.props.routes;
    var logger = this.props.logger;
    var focusedService = this.props.focusedService;

    if (!focusedService) {
      return <div />;
    }

    var service = focusedService.get('service');
    var endpoints = focusedService.get('endpoints');
    var instances = endpoints.size;
    var plural = (instances == 1) ? "" : "s";

    logger.info("focused entry: " + service + ": " + instances + " endpoint" + plural);

    var rows = endpoints.map(endpoint =>
      <Tr key={ endpoint.host + "-" + String(endpoint.port) }
          className="focused-entry-row">
        <Td column="Host" className="focused-entry-host">{ endpoint.host }</Td>
        <Td column="Port" className="focused-entry-port">{ endpoint.port }</Td>
      </Tr>);

    return <div className="focused-entry-div">
             <div className="focused-entry-header-div">
               <span className="focused-entry-header">{ service }</span> running { instances } instance{ plural }
               <button className="float-right" onClick={ this.close }>close</button>
             </div>
             <Table className="focused-entry-table">
               { rows }
             </Table>
           </div>;
  }
});

// We don't export this.
const FocusedEntry = mapStrobeState(FocusedEntryCore);

const RouteTableCore = React.createClass({
  mixins: [ PureRenderMixin ],

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

  render: function() {
    var routes = this.props.routes;
    var logger = this.props.logger;

    var table = <div>Waiting for service info...</div>

    if (routes != null) {
      var rows = [];

      routes.forEach((endpoints, service) => {
        rows.push(<Tr className="service-row"
                      key="svc-entry-{ service }"
                      {...this.props}
                      serviceHandle={ service }
                      endpoints={ endpoints }
                      onClick={ () => { this.focus(service, endpoints); } }>
                    <Td column="service-name">{ service }</Td>
                    <Td column="service-count">{ endpoints.length }</Td>
                  </Tr>);
      });

      if (rows.length < 1) {
        table = <div>No services registered</div>;
      }
      else {
        table = <Table>
                  <Thead key="svc-list-head" className="svc-list-header">
                    <Th column="service-name" className="svc-name-header">Service Name</Th>
                    <Th column="service-count" className="svc-count-header">Instances Running</Th>
                  </Thead>
                  { rows }
                </Table>;
      }
    }
    
    return <div>
      <Error />
      <UserInfo />
      { table }
      <FocusedEntry />
    </div>;
  }
});

export const RouteTable = mapStrobeState(RouteTableCore);
